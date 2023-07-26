import Stripe from "stripe";
import { NextResponse } from "next/server";
import { z } from "zod";
import { calcularPrecoPrazo } from "correios-brasil";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { resend } from "@/emails/sender";
import { OrderConfirmation } from "@/emails/order-confirmation";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

const shippingSchema = z.object({
  destination: z
    .string()
    .min(8)
    .max(9)
    .transform((value) => value.replace(/\D/g, "")),
  localidade: z.string().min(1),
  logradouro: z.string().min(1),
  bairro: z.string().min(1),
  complemento: z.string(),
  numero: z.string().min(1),
  uf: z.string().min(2).max(2),

  name: z.string().min(1),
  surname: z.string().min(1),
  cpf: z.string().min(11).max(11),
  email: z.string().email().nonempty(),
  phone: z
    .string()
    .min(10)
    .max(11)
    .transform((value) => value.replace(/\D/g, "")),
});

const productsSchema = z
  .array(
    z.object({
      id: z.string().nonempty().cuid2(),
      quantity: z.number().int().positive(),
    })
  )
  .min(1);

const shippingOptionSchema = z.object({
  Valor: z
    .string()
    .regex(/^\d+,\d{2}$/)
    .transform((value) => Number(value.replace(/\D/g, ""))),
  PrazoEntrega: z
    .string()
    .regex(/^\d+$/)
    .transform((value) => Number(value.replace(/\D/g, "")) + 2),
  Codigo: z.string().regex(/^\d+$/),
});

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { products: requestedProducts, shipping } = await req.json();

  if (!requestedProducts || requestedProducts.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const productsParsed = productsSchema.safeParse(requestedProducts);
  if (!productsParsed.success) {
    return new NextResponse(productsParsed.error.message, { status: 400 });
  }

  if (!shipping) {
    return new NextResponse("Shipping is required", { status: 400 });
  }

  const shippingParsed = shippingSchema.safeParse(shipping);
  if (!shippingParsed.success) {
    return new NextResponse(shippingParsed.error.message, { status: 400 });
  }

  const store = await db.store.findUnique({
    where: {
      id: params.storeId,
    },
    select: {
      zipCode: true,
      storeUrl: true,
      storeSuccessSaleUrl: true,
      storeCancelledSaleUrl: true,
      emailSettings: true,
      // TODO: order categories by some criteria
      categories: {
        take: 4,
      },
    },
  });

  if (!store) {
    return new NextResponse("Store not found", { status: 404 });
  }

  const [shippingOption] = await calcularPrecoPrazo({
    sCepOrigem: store.zipCode,
    sCepDestino: shipping.destination,
    nVlPeso: (0.3 * 5).toString(),
    nCdFormato: "1", //1 para caixa / pacote e 2 para rolo/prisma.
    nVlComprimento: (32).toString(),
    nVlAltura: (5 + 5 * 2).toString(),
    nVlLargura: (25).toString(),
    nCdServico: ["41106"],
    nVlDiametro: "0",
  });

  if (!shippingOption) {
    return new NextResponse("Shipping option not found", { status: 404 });
  }

  const shippingOptionParsed = shippingOptionSchema.safeParse(shippingOption);
  if (!shippingOptionParsed.success) {
    return new NextResponse(shippingOptionParsed.error.message, {
      status: 400,
    });
  }

  const productIds = productsParsed.data.map((product) => product.id);

  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: {
      images: {
        select: {
          url: true,
        },
      },
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    line_items.push({
      quantity:
        productsParsed.data.find((p) => p.id === product.id)?.quantity ?? 1,
      price_data: {
        currency: "BRL",
        product_data: {
          name: product.name,
          images: product.images.map((image) => image.url),
        },
        unit_amount: product.price,
      },
    });
  });

  const deliveryDeadline = new Date(Date.now());
  deliveryDeadline.setDate(
    deliveryDeadline.getDate() + shippingOptionParsed.data.PrazoEntrega
  );

  const latestOrderCode = await db.order.findFirst({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      code: true,
    },
  });

  const order = await db.order.create({
    data: {
      ...shippingParsed.data,
      code: (latestOrderCode?.code ?? 0) + 1,
      deliveryDeadline,
      shippingCost: shippingOptionParsed.data.Valor,
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
          price:
            products.find((product) => product.id === productId)?.price ?? 0,
          quantity:
            productsParsed.data.find((p) => p.id === productId)?.quantity ?? 1,
        })),
      },
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              size: true,
              images: {
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Entrega Padrão",
          fixed_amount: {
            currency: "BRL",
            amount: shippingOptionParsed.data.Valor,
          },
          delivery_estimate: {
            maximum: {
              unit: "business_day",
              value: shippingOptionParsed.data.PrazoEntrega,
            },
          },
          type: "fixed_amount",
        },
      },
    ],
    mode: "payment",
    success_url: `${store.storeSuccessSaleUrl}?order=${order.id}`,
    cancel_url: store.storeCancelledSaleUrl,
    customer_email: shippingParsed.data.email,
    metadata: {
      orderId: order.id,
    },
  });

  if (store.emailSettings) {
    await resend.sendEmail({
      to: order.email,
      from: store.emailSettings.from,
      subject: store.emailSettings.orderConfirmationSubject,
      react: OrderConfirmation({
        config: {
          preview: store.emailSettings.orderConfirmationSubject,
        },
        introduction: {
          title: store.emailSettings.orderConfirmationTitle,
          description: store.emailSettings.orderConfirmationDescription,
          subtitle: store.emailSettings.orderConfirmationSubtitle,
          logo: store.emailSettings.logoUrl,
          storeName: store.emailSettings.name,
        },
        footer: {
          address: store.emailSettings.address,
          links: store.categories.map((category) => ({
            label: category.name,
            url: `${store.storeUrl}/${category.id}`,
          })),
          name: store.emailSettings.name,
          officialName: store.emailSettings.officialName,
        },
        orderInformation: {
          orderCode: order.id,
          orderDate: order.createdAt,
          orderDetailsUrl: "#",
        },
        products: order.orderItems.map((orderItem) => ({
          name: orderItem.product.name,
          quantity: orderItem.quantity,
          size: `${orderItem.product.size.name} (${orderItem.product.size.value})`,
          thumbnail: orderItem.product.images[0].url,
        })),
      }),
    });
  } else {
    // TODO: Send warning email
  }

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
