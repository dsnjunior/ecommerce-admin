import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    if (!params.orderId) {
      return new NextResponse("Order id is required", { status: 400 });
    }

    const order = await db.order.findUnique({
      where: {
        id: params.orderId,
      },
      select: {
        isPaid: true,
        deliveryDeadline: true,
        name: true,
        archived: true,
        orderItems: {
          select: {
            quantity: true,
            product: {
              select: {
                name: true,
                images: {
                  select: {
                    url: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    if (order.archived) {
      return new NextResponse("Order not available", { status: 401 });
    }

    return NextResponse.json({
      customerName: order.name,
      deliveryDeadline: order.deliveryDeadline,
      isPaid: order.isPaid,
      products: order.orderItems.map((orderItem) => ({
        name: orderItem.product.name,
        quantity: orderItem.quantity,
        image: orderItem.product.images?.length
          ? orderItem.product.images[0].url
          : "",
      })),
    });
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}
