import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const billboard = await db.billboard.findFirst({
      where: {
        isFeatured: true,
        storeId: params.storeId,
      },
    });

    if (!billboard) {
      const newestBillboard = await db.billboard.findFirst({
        where: {
          storeId: params.storeId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(newestBillboard);
    }

    return NextResponse.json(billboard);
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}
