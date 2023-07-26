import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const color = await db.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}
