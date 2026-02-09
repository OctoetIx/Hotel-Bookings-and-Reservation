import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify<JWTPayload & { role?: string }>(
      token,
      secret
    );

    if (
      pathname.startsWith("/admin") &&
      payload.role !== "ADMIN" &&
      payload.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
 