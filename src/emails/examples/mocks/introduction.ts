import { IntroductionProps } from "@/emails/components/introduction";

export const introduction: Omit<
  IntroductionProps,
  "title" | "subtitle" | "description"
> = {
  logo: "http://localhost:3001/images/logo-email.png",
  storeName: "Look Here Store",
};
