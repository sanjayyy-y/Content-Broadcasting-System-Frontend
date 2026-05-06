import { NextResponse } from "next/server";

function readSession(request) {
  const raw = request.cookies.get("cbs_auth")?.value;
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

function dashboardFor(role) {
  return role === "principal" ? "/principal/dashboard" : "/dashboard";
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/live")) {
    return NextResponse.next();
  }

  const session = readSession(request);
  const role = session?.user?.role;

  if (pathname === "/login") {
    if (role) {
      return NextResponse.redirect(new URL(dashboardFor(role), request.url));
    }
    return NextResponse.next();
  }

  const teacherOnly = ["/dashboard", "/upload", "/my-content"];
  const isTeacherRoute = teacherOnly.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isPrincipalRoute = pathname.startsWith("/principal");

  if ((isTeacherRoute || isPrincipalRoute) && !role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isTeacherRoute && role !== "teacher") {
    return NextResponse.redirect(new URL(dashboardFor(role), request.url));
  }

  if (isPrincipalRoute && role !== "principal") {
    return NextResponse.redirect(new URL(dashboardFor(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/upload/:path*", "/my-content/:path*", "/principal/:path*", "/live/:path*"]
};
