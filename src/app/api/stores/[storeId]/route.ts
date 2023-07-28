import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { Collaborator } from "@prisma/client";

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
      collaborators,
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

    if (!currency) {
      return new NextResponse("Currency is required", { status: 400 });
    }

    if (
      collaborators &&
      (!Array.isArray(collaborators) ||
        (collaborators.length &&
          collaborators.some((value) => typeof value !== "string")))
    ) {
      return new NextResponse("Collaborators must be an array of strings", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const userCanEditStore = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!userCanEditStore) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const store = await db.store.update({
      where: {
        id: params.storeId,
      },
      data: {
        name,
        zipCode,
        currency,
        storeUrl,
        storeSuccessSaleUrl,
        storeCancelledSaleUrl,
        contentUpdateWebhook,
        collaborators: {
          deleteMany: {},
        },
      },
    });

    if (collaborators) {
      const collaboratorsEmails: string[] = collaborators;

      const collaboratorsData = await db.user.findMany({
        where: {
          emailAddresses: {
            some: {
              email: {
                in: collaboratorsEmails,
              },
            },
          },
        },
        select: {
          id: true,
        },
      });

      await db.store.update({
        where: {
          id: params.storeId,
        },
        data: {
          collaborators: {
            createMany: {
              data: collaboratorsData.map((collaborator) => ({
                userId: collaborator.id,
              })),
            },
          },
        },
      });
    }

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
