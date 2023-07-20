import { Resend } from "resend";

import { env } from "@/env.mjs";

export const resend = new Resend(env["RESEND_API_KEY"]);

export const defaultParams = {
  from: env["RESEND_DEFAULT_FROM"],
  reply_to: env["RESEND_DEFAULT_REPLY_TO"],
};
