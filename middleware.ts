import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Handle blaze-webinar subdomain → serve /braze page
  if (hostname.startsWith("blaze-webinar.")) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
