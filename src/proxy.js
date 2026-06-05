import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const user = req.auth?.user;
  const isLoggedIn = !!user;
  const isAdmin = user?.role === "ADMIN";

  const loginUrl = new URL("/login", nextUrl);
  loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);

  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) return Response.redirect(loginUrl);
    if (!isAdmin) return Response.redirect(new URL("/", nextUrl));
  }

  if (nextUrl.pathname.startsWith("/account")) {
    if (!isLoggedIn) return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
