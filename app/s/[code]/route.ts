import { NextRequest, NextResponse } from "next/server";

// ─── Sales-rep short links ───────────────────────────────────────────────────
// Branded short links that 307-redirect to the full UTM destination, so reps
// share something clean (e.g. /s/fil-duaa) while the landing page still captures
// utm_source / utm_medium / utm_campaign exactly as a hand-built link would.
//
// To add a rep or event, add ONE line below: <short-code>: { path, source, campaign }.
// Convention: code = "<event-prefix>-<rep>", source = rep's lowercase first name,
// medium is always "sales". Optional `hash` drops the visitor on a section
// (e.g. "register" → lands on the registration form). Optional `tab` pre-selects
// the InquiryForm tab on arrival (e.g. "attend").
const REP_LINKS: Record<string, { path: string; source: string; campaign: string; hash?: string; tab?: string }> = {
  // Filigran Executive Roundtable
  "fil-duaa": { path: "/filigran", source: "duaa", campaign: "filigran-2026" },
  "fil-jacqueline": { path: "/filigran", source: "jacqueline", campaign: "filigran-2026" },
  "fil-mary": { path: "/filigran", source: "mary", campaign: "filigran-2026" },

  // Autodesk
  "ad-mary": { path: "/autodesk", source: "mary", campaign: "autodesk-2026", hash: "reserve" },

  // Inner Circle
  "ic-jacqueline": { path: "/inner_circle", source: "jacqueline", campaign: "inner-circle-2026", hash: "register" },
  "ic-afra": { path: "/inner_circle", source: "afra", campaign: "inner-circle-2026", hash: "register" },
  "ic-duaa": { path: "/inner_circle", source: "duaa", campaign: "inner-circle-2026", hash: "register" },

  // Cyber First East Africa 2026
  "cfea-nadim": { path: "/events/cyber-first/kenya-2026", source: "nadim", campaign: "cfea-2026", hash: "register", tab: "attend" },
  "cfea-nadeem": { path: "/events/cyber-first/kenya-2026", source: "nadim", campaign: "cfea-2026", hash: "register", tab: "attend" }, // legacy alias → nadim
  "cfea-afra": { path: "/events/cyber-first/kenya-2026", source: "afra", campaign: "cfea-2026", hash: "register", tab: "attend" },
  "cfea-stephen": { path: "/events/cyber-first/kenya-2026", source: "stephen", campaign: "cfea-2026", hash: "register", tab: "attend" },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const link = REP_LINKS[code.toLowerCase()];

  // Unknown code → fall back to the homepage rather than a 404.
  if (!link) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const dest = new URL(link.path, request.url);
  dest.searchParams.set("utm_source", link.source);
  dest.searchParams.set("utm_medium", "sales");
  dest.searchParams.set("utm_campaign", link.campaign);
  if (link.tab) dest.searchParams.set("tab", link.tab);
  if (link.hash) dest.hash = link.hash;

  // 307 (temporary) so the mapping can be re-pointed later without browsers
  // pinning a stale destination from cache.
  return NextResponse.redirect(dest, 307);
}
