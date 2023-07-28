import { env } from "@/env.mjs";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const userCreatedOrUpdatedData = z.object({
  email_addresses: z
    .object({
      id: z.string(),
      email_address: z.string(),
    })
    .array(),
  id: z.string(),
  first_name: z.string(),
  last_name: z.string().nullable(),
  image_url: z.string().url(),
  profile_image_url: z.string().url(),
});

const userCreatedSchema = z.object({
  data: userCreatedOrUpdatedData,
  type: z.literal("user.created"),
});

const userUpdatedSchema = z.object({
  data: userCreatedOrUpdatedData,
  type: z.literal("user.updated"),
});

const userDeletedSchema = z.object({
  data: z.object({
    id: z.string(),
  }),
  type: z.literal("user.deleted"),
});

const webhookSchema = z.union([
  userCreatedSchema,
  userUpdatedSchema,
  userDeletedSchema,
]);

export async function POST(req: Request) {
  try {
    const signature = headers().get("clerk-signature") as string;

    if (signature !== env["CLERK_WEBHOOK_SECRET"]) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body: {
      data: string;
      type: "user.created" | "user.updated" | "user.deleted";
    } = await req.json();

    const webhook = webhookSchema.safeParse(body);

    if (!webhook.success) {
      return new NextResponse(webhook.error.message, { status: 400 });
    }

    if (webhook.data.type === "user.created") {
      await db.user.create({
        data: {
          firstName: webhook.data.data.first_name,
          lastName: webhook.data.data.last_name ?? undefined,
          id: webhook.data.data.id,
          imageUrl: webhook.data.data.image_url,
          profileImageUrl: webhook.data.data.profile_image_url,
          emailAddresses: {
            createMany: {
              data: webhook.data.data.email_addresses.map((emailAddress) => ({
                id: emailAddress.id,
                email: emailAddress.email_address,
              })),
            },
          },
        },
      });
    }

    if (webhook.data.type === "user.updated") {
      await db.user.update({
        where: {
          id: webhook.data.data.id,
        },
        data: {
          firstName: webhook.data.data.first_name,
          lastName: webhook.data.data.last_name ?? undefined,
          imageUrl: webhook.data.data.image_url,
          profileImageUrl: webhook.data.data.profile_image_url,
          emailAddresses: {
            deleteMany: {},
          },
        },
      });

      await db.user.update({
        where: {
          id: webhook.data.data.id,
        },
        data: {
          emailAddresses: {
            createMany: {
              data: webhook.data.data.email_addresses.map((emailAddress) => ({
                id: emailAddress.id,
                email: emailAddress.email_address,
              })),
            },
          },
        },
      });
    }

    if (webhook.data.type === "user.deleted") {
      await db.user.delete({
        where: {
          id: webhook.data.data.id,
        },
      });
    }

    return new NextResponse(
      `Successfully processed ${webhook.data.type} webhook`,
      { status: 200 }
    );
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}
