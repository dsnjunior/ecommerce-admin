import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { srcSet, optimizeImage, webp } from "@/lib/image";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await db.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    return NextResponse.json(product);
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
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

    const product = await db.product.delete({
      where: {
        id: params.productId,
      },
    });

    if (storeByUserId.contentUpdateWebhook) {
      await fetch(storeByUserId.contentUpdateWebhook, { method: "POST" });
    }

    return NextResponse.json(product);
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const {
      name,
      slug,
      description,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!slug) {
      return new NextResponse("Slug is required", { status: 400 });
    }

    if (!images?.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
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

    await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        slug,
        description,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const imagesGenerated = images.map((image: { url: string }) => ({
      originalUrl: image.url,
      url: optimizeImage(image.url),
      srcSet: srcSet(optimizeImage(image.url)),
      webpUrl: webp(image.url),
      webpSrcSet: srcSet(webp(image.url)),
    }));

    const product = await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: imagesGenerated,
          },
        },
      },
    });

    if (storeByUserId.contentUpdateWebhook) {
      await fetch(storeByUserId.contentUpdateWebhook, { method: "POST" });
    }

    return NextResponse.json(product);
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}
