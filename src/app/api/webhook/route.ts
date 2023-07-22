import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { env } from "@/env.mjs";
import { resend } from "@/emails/sender";
import { PaymentConfirmation } from "@/emails/payment-confirmation";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env["STRIPE_WEBHOOK_SECRET"]
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    await db.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
      },
    });

    const order = await db.order.findUnique({
      where: {
        id: session?.metadata?.orderId,
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

    if (!order) {
      // TODO: Send warning email
      return new NextResponse(null, { status: 200 });
    }

    const store = await db.store.findUnique({
      where: {
        id: order.storeId,
      },
      select: {
        storeUrl: true,
        emailSettings: true,
        // TODO: order categories by some criteria
        categories: {
          take: 4,
        },
      },
    });

    if (!store) {
      // TODO: Send warning email
      return new NextResponse(null, { status: 200 });
    }

    if (!store.emailSettings) {
      // TODO: Send warning email
      return new NextResponse(null, { status: 200 });
    }

    await resend.sendEmail({
      to: order.email,
      from: store.emailSettings.from,
      subject: store.emailSettings.paymentConfirmationSubject,
      react: PaymentConfirmation({
        config: {
          preview: store.emailSettings.paymentConfirmationSubject,
        },
        introduction: {
          title: store.emailSettings.paymentConfirmationTitle,
          description: store.emailSettings.paymentConfirmationDescription,
          subtitle: store.emailSettings.paymentConfirmationSubtitle,
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
  }

  return new NextResponse(null, { status: 200 });
}
