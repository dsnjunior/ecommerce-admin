import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { optimizeImage, srcSet, webp } from "@/lib/image";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const billboard = await db.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
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

    const billboard = await db.billboard.delete({
      where: {
        id: params.billboardId,
      },
    });

    if (storeByUserId.contentUpdateWebhook) {
      await fetch(storeByUserId.contentUpdateWebhook, { method: "POST" });
    }

    return NextResponse.json(billboard);
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { label, imageUrl, isFeatured } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
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

    if (isFeatured) {
      await db.billboard.updateMany({
        where: {
          storeId: params.storeId,
          isFeatured: true,
        },
        data: {
          isFeatured: false,
        },
      });
    }

    const billboard = await db.billboard.update({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        originalUrl: imageUrl,
        imageUrl: optimizeImage(imageUrl),
        srcSet: srcSet(optimizeImage(imageUrl)),
        webpUrl: webp(imageUrl),
        webpSrcSet: srcSet(webp(imageUrl)),
        isFeatured,
      },
    });

    if (storeByUserId.contentUpdateWebhook) {
      await fetch(storeByUserId.contentUpdateWebhook, { method: "POST" });
    }

    return NextResponse.json(billboard);
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}
