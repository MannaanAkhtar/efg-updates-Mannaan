// ═══════════════════════════════════════════════════════════════════════════
// Download proxy — fetches a whitelisted S3 object and re-streams it to the
// browser with Content-Disposition: attachment, forcing a download dialog
// instead of an in-tab PDF preview.
//
// Usage:
//   /api/download?url=<encoded S3 URL>&filename=<encoded suggested filename>
// ═══════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set(["efg-final.s3.eu-north-1.amazonaws.com"]);

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");
  const filenameParam = req.nextUrl.searchParams.get("filename");

  if (!urlParam) {
    return NextResponse.json({ error: "Missing 'url' parameter" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(urlParam);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Whitelist check — only proxy from our S3 bucket
  if (!ALLOWED_HOSTS.has(target.hostname)) {
    return NextResponse.json({ error: "Forbidden host" }, { status: 403 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(target.toString());
  } catch {
    return NextResponse.json({ error: "Upstream fetch failed" }, { status: 502 });
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: `Upstream returned ${upstream.status}` },
      { status: upstream.status },
    );
  }

  // Sanitize filename — limit to safe characters, prevent header injection
  const rawFilename = filenameParam || "download.pdf";
  const safeFilename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);

  const contentType = upstream.headers.get("content-type") || "application/pdf";
  const contentLength = upstream.headers.get("content-length");

  const headers = new Headers({
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename="${safeFilename}"`,
    "Cache-Control": "public, max-age=86400, s-maxage=86400",
  });
  if (contentLength) headers.set("Content-Length", contentLength);

  return new NextResponse(upstream.body, { status: 200, headers });
}
