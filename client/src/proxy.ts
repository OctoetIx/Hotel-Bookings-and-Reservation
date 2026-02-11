import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // Only protect /admin and /super-admin routes
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/super-admin")) {
    return NextResponse.next();
  }

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify JWT
    const { payload } = await jwtVerify<JWTPayload & { role?: string }>(
      token,
      secret
    );

    // ADMIN routes
    if (
      pathname.startsWith("/admin") &&
      payload.role !== "ADMIN" &&
      payload.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // SUPER_ADMIN routes
    if (
      pathname.startsWith("/super-admin") &&
      payload.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Token is valid and role authorized
    return NextResponse.next();
  } catch {
    // Invalid token → redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Routes to protect
export const config = {
  matcher: ["/admin/:path*", "/super-admin/:path*"],
};
