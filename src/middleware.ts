import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

async function verifyJWT(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as { role?: string; email?: string };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;
  const token = req.cookies.get("token")?.value;

  const isProtectedCategory =
    pathname.startsWith("/api/category") && method !== "GET";
  const isProtectedColor =
    pathname.startsWith("/api/color") && method !== "GET";
  const isProtectedSize = pathname.startsWith("/api/size") && method !== "GET";
  const isProtectedAddProduct =
    pathname === "/api/products" && method === "POST";
  const isProtectedProductById =
    pathname.startsWith("/api/products/") &&
    !pathname.includes("/variants/") &&
    (method === "PUT" || method === "DELETE");
  const isProtectedVariant =
    pathname.includes("/api/products/") &&
    pathname.includes("/variants/") &&
    (method === "PUT" || method === "DELETE");
  const isProtectedAdminAPI = pathname.startsWith("/api/admin");

  const isProtectedAdminPage = pathname.startsWith("/dashboard/admins");
  const isProtectedDashboardPage = pathname.startsWith("/dashboard");

  const isProtectedAPI =
    isProtectedCategory ||
    isProtectedColor ||
    isProtectedSize ||
    isProtectedAddProduct ||
    isProtectedProductById ||
    isProtectedVariant ||
    isProtectedAdminAPI;

  const isProtectedPage = isProtectedAdminPage || isProtectedDashboardPage;

  if (!isProtectedAPI && !isProtectedPage) {
    return NextResponse.next();
  }

  if (!token) {
    if (isProtectedAPI) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = await verifyJWT(token);

  if (!payload || payload.role !== "ADMIN") {
    if (isProtectedAPI) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/category/:path*",
    "/api/color/:path*",
    "/api/size/:path*",
    "/api/products/:path*",
    "/api/admin/:path*",
  ],
};
