import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, value, slug } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!slug) {
      return new NextResponse("Slug is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        OR: [
          {
            userId,
          },
          {
            collaborators: {
              some: {
                userId,
              },
            },
          },
        ],
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const color = await db.color.create({
      data: {
        name,
        slug,
        value,
        storeId: params.storeId,
      },
    });

    if (storeByUserId.contentUpdateWebhook) {
      await fetch(storeByUserId.contentUpdateWebhook, { method: "POST" });
    }

    return NextResponse.json(color);
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const colors = await db.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}
