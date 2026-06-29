import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth guard middleware.
 * Redirects unauthenticated visitors to /signup.
 * Allows public routes (signup, signin, API auth) without a session.
 */

const PUBLIC_PATHS = ["/signup", "/signin", "/api/auth"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (pub) => pathname === pub || pathname.startsWith(pub + "/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow Next.js internals, static assets, and favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Allow public auth routes
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check for session cookie
  const session = request.cookies.get("fractio_session")?.value;
  if (!session) {
    const signupUrl = new URL("/signup", request.url);
    return NextResponse.redirect(signupUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
