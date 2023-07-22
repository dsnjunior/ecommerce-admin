import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const {
      from,
      replyTo,

      name,
      officialName,
      address,
      logoUrl,

      orderConfirmationSubject,
      orderConfirmationTitle,
      orderConfirmationSubtitle,
      orderConfirmationDescription,

      paymentConfirmationSubject,
      paymentConfirmationTitle,
      paymentConfirmationSubtitle,
      paymentConfirmationDescription,

      shippingConfirmationSubject,
      shippingConfirmationTitle,
      shippingConfirmationSubtitle,
      shippingConfirmationDescription,

      deliveryConfirmationSubject,
      deliveryConfirmationTitle,
      deliveryConfirmationSubtitle,
      deliveryConfirmationDescription,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!from) {
      return new NextResponse("From is required", { status: 400 });
    }

    if (!replyTo) {
      return new NextResponse("Reply to is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!officialName) {
      return new NextResponse("Official name is required", { status: 400 });
    }

    if (!address) {
      return new NextResponse("Address is required", { status: 400 });
    }

    if (!logoUrl) {
      return new NextResponse("Logo url is required", { status: 400 });
    }

    if (
      !orderConfirmationSubject ||
      !orderConfirmationTitle ||
      !orderConfirmationSubtitle
    ) {
      return new NextResponse("Order confirmation is required", {
        status: 400,
      });
    }

    if (
      !paymentConfirmationSubject ||
      !paymentConfirmationTitle ||
      !paymentConfirmationSubtitle
    ) {
      return new NextResponse("Payment confirmation is required", {
        status: 400,
      });
    }

    if (
      !shippingConfirmationSubject ||
      !shippingConfirmationTitle ||
      !shippingConfirmationSubtitle
    ) {
      return new NextResponse("Shipping confirmation is required", {
        status: 400,
      });
    }

    if (
      !deliveryConfirmationSubject ||
      !deliveryConfirmationTitle ||
      !deliveryConfirmationSubtitle
    ) {
      return new NextResponse("Delivery confirmation is required", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const emailSettings = await db.emailSettings.update({
      where: {
        storeId: params.storeId,
      },
      data: {
        from,
        replyTo,

        name,
        officialName,
        address,
        logoUrl,

        orderConfirmationSubject,
        orderConfirmationTitle,
        orderConfirmationSubtitle,
        orderConfirmationDescription,

        paymentConfirmationSubject,
        paymentConfirmationTitle,
        paymentConfirmationSubtitle,
        paymentConfirmationDescription,

        shippingConfirmationSubject,
        shippingConfirmationTitle,
        shippingConfirmationSubtitle,
        shippingConfirmationDescription,

        deliveryConfirmationSubject,
        deliveryConfirmationTitle,
        deliveryConfirmationSubtitle,
        deliveryConfirmationDescription,
      },
    });

    return NextResponse.json(emailSettings);
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}
