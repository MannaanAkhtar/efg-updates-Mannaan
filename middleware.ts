import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Handle braze-webinar subdomain → serve /braze page
  if (hostname.startsWith("braze-webinar.") || hostname.startsWith("blaze-webinar.")) {
    const url = request.nextUrl.clone();
    const path = url.pathname;

    // If already on /braze path, let it through
    if (path.startsWith("/braze")) {
      return NextResponse.next();
    }

    // Rewrite root and all paths to /braze
    if (path === "/" || path === "") {
      url.pathname = "/braze";
      return NextResponse.rewrite(url);
    }

    // Allow API routes, static files, and Next.js internals
    if (
      path.startsWith("/api/") ||
      path.startsWith("/_next/") ||
      path.startsWith("/fonts/") ||
      path.startsWith("/braze/") ||
      path.includes(".")
    ) {
      return NextResponse.next();
    }

    // Any other path on the subdomain → redirect to root
    url.pathname = "/braze";
    return NextResponse.rewrite(url);
  }

  // Handle sonicwall-webinar subdomain → serve /sonicwall page
  if (hostname.startsWith("sonicwall-webinar.")) {
    const url = request.nextUrl.clone();
    const path = url.pathname;

    if (path.startsWith("/sonicwall")) {
      return NextResponse.next();
    }

    if (path === "/" || path === "") {
      url.pathname = "/sonicwall";
      return NextResponse.rewrite(url);
    }

    if (
      path.startsWith("/api/") ||
      path.startsWith("/_next/") ||
      path.startsWith("/fonts/") ||
      path.startsWith("/sonicwall/") ||
      path.includes(".")
    ) {
      return NextResponse.next();
    }

    url.pathname = "/sonicwall";
    return NextResponse.rewrite(url);
  }

  // Handle big-leap-riyadh subdomain → serve /bigleap page
  if (hostname.startsWith("big-leap-riyadh.")) {
    const url = request.nextUrl.clone();
    const path = url.pathname;

    if (path.startsWith("/bigleap")) {
      return NextResponse.next();
    }

    if (path === "/" || path === "") {
      url.pathname = "/bigleap";
      return NextResponse.rewrite(url);
    }

    if (
      path.startsWith("/api/") ||
      path.startsWith("/_next/") ||
      path.startsWith("/fonts/") ||
      path.startsWith("/bigleap/") ||
      path.includes(".")
    ) {
      return NextResponse.next();
    }

    url.pathname = "/bigleap";
    return NextResponse.rewrite(url);
  }

  // Handle braze-webinar-2 / vroundtable-braze subdomain → serve /braze2 page
  if (hostname.startsWith("braze-webinar-2.") || hostname.startsWith("vroundtable-braze.")) {
    const url = request.nextUrl.clone();
    const path = url.pathname;

    if (path.startsWith("/braze2")) {
      return NextResponse.next();
    }

    if (path === "/" || path === "") {
      url.pathname = "/braze2";
      return NextResponse.rewrite(url);
    }

    if (
      path.startsWith("/api/") ||
      path.startsWith("/_next/") ||
      path.startsWith("/fonts/") ||
      path.startsWith("/braze/") ||
      path.startsWith("/braze2/") ||
      path.includes(".")
    ) {
      return NextResponse.next();
    }

    url.pathname = "/braze2";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
