import { NextRequest, NextResponse } from "next/server";

/**
 * CSRF protection: verify that state-changing requests come from the same origin
 * Works by checking the Origin header against the Host
 */

const STATE_CHANGING_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

export function csrfCheck(request: NextRequest): NextResponse | null {
  // Only check state-changing methods
  if (!STATE_CHANGING_METHODS.includes(request.method)) {
    return null;
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  // If no Origin header, allow it (same-origin requests sometimes don't send Origin)
  // But for admin APIs, be strict
  if (!origin) {
    // Check Referer as fallback
    const referer = request.headers.get("referer");
    if (!referer) {
      // No Origin and no Referer - could be a direct API call (suspicious for admin APIs)
      // Allow it but the route handler will check auth
      return null;
    }

    try {
      const refererUrl = new URL(referer);
      if (host && refererUrl.host !== host) {
        return NextResponse.json(
          { error: "CSRF check failed: referer mismatch" },
          { status: 403 }
        );
      }
      return null;
    } catch {
      return NextResponse.json(
        { error: "CSRF check failed: invalid referer" },
        { status: 403 }
      );
    }
  }

  // Origin header exists - verify it matches the host
  try {
    const originUrl = new URL(origin);
    if (host && originUrl.host !== host) {
      return NextResponse.json(
        { error: "CSRF check failed: origin mismatch" },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "CSRF check failed: invalid origin" },
      { status: 403 }
    );
  }

  return null;
}
