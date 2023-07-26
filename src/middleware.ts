import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next|v1).*)", "/", "/(api|trpc)(.*)"],
};
