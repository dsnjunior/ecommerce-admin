import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET() {
  await db.order.updateMany({
    where: {
      AND: [
        { archived: false },
        { isPaid: true },
        { updatedAt: { lte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) } },
      ],
    },
    data: {
      archived: true,
    },
  });

  return new NextResponse(null, { status: 200 });
}
