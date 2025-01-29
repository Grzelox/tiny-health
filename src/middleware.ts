import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Set security headers
  res.headers.set("Referrer-Policy", "no-referrer-when-downgrade");

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Get the current path
  const path = req.nextUrl.pathname;

  // List of public paths that don't require authentication
  const publicPaths = ["/", "/login"];

  // Check if the current path is public
  const isPublicPath = publicPaths.includes(path);

  // If the path is not public and user is not logged in, redirect to login
  if (!isPublicPath && !session) {
    const redirectUrl = new URL("/login", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is logged in and trying to access login page, redirect to home
  if (session && path === "/login") {
    const redirectUrl = new URL("/", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
