import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name } = await req.json();

    if (!name) {
      return new NextResponse("Missing name", { status: 400 });
    }

    const store = await db.store.create({
      data: {
        name,
        userId,
        emailSettings: {
          create: {},
        },
      },
    });

    return NextResponse.json(store);
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}
