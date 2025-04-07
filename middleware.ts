import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/login",
    "/sign-up",
    "/api/webhooks/clerk",
    "/:locale",
    "/:locale/login",
    "/:locale/sign-up"
  ],
  afterAuth(auth, req) {
    // Redirect authenticated users to dashboard if they access public routes
    if (auth.userId && req.nextUrl.pathname === '/it') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
