import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Better Auth default session cookie names (the secure variant is used over HTTPS).
const sessionCookies = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

/**
 * Optimistic check only: sends visitors without a session cookie straight to sign-in
 * instead of rendering a protected page first. AppShell still validates the session.
 */
export function proxy(request: NextRequest) {
  if (sessionCookies.some((name) => request.cookies.has(name)))
    return NextResponse.next();
  return NextResponse.redirect(new URL("/auth", request.url));
}

export const config = {
  matcher: [
    "/catalog/:path*",
    "/planner/:path*",
    "/inventory/:path*",
    "/help/:path*",
    "/profile/:path*",
    "/dish/:path*",
  ],
};
