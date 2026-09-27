import { NextRequest, NextResponse } from "next/server";
import { csrfCheck } from "@/lib/csrf";

// Routes that don't require authentication
const PUBLIC_ADMIN_ROUTES = [
  "/api/admin/login",
  "/api/admin/check",
  "/api/admin/logout",
];

// Admin routes pattern
const ADMIN_API_PATTERN = /^\/api\/admin\//;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /api/admin/* routes
  if (!ADMIN_API_PATTERN.test(pathname)) {
    return NextResponse.next();
  }

  // CSRF check for state-changing requests
  const csrfError = csrfCheck(request);
  if (csrfError) {
    return csrfError;
  }

  // Allow public admin routes (login, check, logout)
  if (PUBLIC_ADMIN_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // For all other /api/admin/* routes, check for session cookie existence
  // The actual session validation happens in the route handler (defense in depth)
  const sessionCookie = request.cookies.get("ozaib_admin_session");

  if (!sessionCookie) {
    return NextResponse.json(
      { error: "غير مصرح - يجب تسجيل الدخول" },
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "WWW-Authenticate": "Cookie",
        },
      }
    );
  }

  // Cookie exists - let the route handler do the actual session validation
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
