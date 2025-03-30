import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: [
    "/",
    "/login",
    "/sign-up",
    "/verify-email",
    "/sign-up/sso-callback",
    "/api/webhook/clerk"
  ],
  ignoredRoutes: [
    "/api/webhook/clerk"
  ]
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

