import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      zipCode,
      currency,
      storeUrl,
      storeSuccessSaleUrl,
      storeCancelledSaleUrl,
      contentUpdateWebhook,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!zipCode) {
      return new NextResponse("Zip code is required", { status: 400 });
    }

    if (!storeUrl) {
      return new NextResponse("Url is required", { status: 400 });
    }

    if (!storeSuccessSaleUrl) {
      return new NextResponse("Success sale url is required", { status: 400 });
    }

    if (!storeCancelledSaleUrl) {
      return new NextResponse("Cancelled sale url is required", {
        status: 400,
      });
    }

    if (!contentUpdateWebhook) {
      return new NextResponse("Content update webhook is required", {
        status: 400,
      });
    }

    if (!currency) {
      return new NextResponse("Currency is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await db.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
        zipCode,
        currency,
        storeUrl,
        storeSuccessSaleUrl,
        storeCancelledSaleUrl,
        contentUpdateWebhook,
      },
    });

    return NextResponse.json(store);
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await db.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}
