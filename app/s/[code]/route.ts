import { NextRequest, NextResponse } from "next/server";

// ─── Branded short links (sales reps + marketing channels) ───────────────────
// Branded short links that 307-redirect to the full UTM destination, so a clean
// link (e.g. /s/fil-duaa) is shared while the landing page still captures
// utm_source / utm_medium / utm_campaign exactly as a hand-built link would.
//
// To add one, add ONE line below: <short-code>: { path, source, campaign }.
// Convention: code = "<event-prefix>-<rep>", source = rep's lowercase first name.
// `medium` defaults to "sales" (rep links); set it for other channels
// (e.g. "social" for a LinkedIn promo). Optional `hash` drops the visitor on a
// section (e.g. "register" → lands on the registration form). Optional `tab`
// pre-selects the InquiryForm tab on arrival (e.g. "attend").
const REP_LINKS: Record<string, { path: string; source: string; campaign: string; medium?: string; hash?: string; tab?: string }> = {
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
  "ic-ctf": { path: "/inner_circle", source: "ctf", campaign: "inner-circle-2026", hash: "register" },
  "ic-cth": { path: "/inner_circle", source: "cth", campaign: "inner-circle-2026", hash: "register" },
  "ic-ctp": { path: "/inner_circle", source: "ctp", campaign: "inner-circle-2026", hash: "register" },

  // OT Security First Africa 2026 — Johannesburg (LinkedIn promotion)
  "otsf-jhb-linkedin": { path: "/events/ot-security-first/johannesburg-2026", source: "linkedin", medium: "social", campaign: "otsf-jhb-2026", hash: "register" },
  // OT Security First Africa 2026 — Johannesburg (email marketing)
  "otsf-jhb-email": { path: "/events/ot-security-first/johannesburg-2026", source: "email", medium: "email", campaign: "otsf-jhb-2026", hash: "register" },

  // OT Security First Jubail 2026
  "otsf-jub-anna": { path: "/events/ot-security-first/jubail", source: "anna", campaign: "otsf-jubail-2026", hash: "register", tab: "attend" },
  "otsf-jub-linkedin": { path: "/events/ot-security-first/jubail", source: "linkedin", medium: "social", campaign: "otsf-jubail-2026", hash: "register" },

  // Cyber First East Africa 2026
  "cfea-nadim": { path: "/events/cyber-first/kenya-2026", source: "nadim", campaign: "cfea-2026", hash: "register", tab: "attend" },
  "cfea-nadeem": { path: "/events/cyber-first/kenya-2026", source: "nadim", campaign: "cfea-2026", hash: "register", tab: "attend" }, // legacy alias → nadim
  "cfea-afra": { path: "/events/cyber-first/kenya-2026", source: "afra", campaign: "cfea-2026", hash: "register", tab: "attend" },
  "cfea-stephen": { path: "/events/cyber-first/kenya-2026", source: "stephen", campaign: "cfea-2026", hash: "register", tab: "attend" },

  // Blue Yonder Executive Roundtable
  "by-afra": { path: "/blueyonder", source: "afra", campaign: "blueyonder", medium: "invite", hash: "reserve" },

  // SonicWall Executive Roundtable — Riyadh (7 Sep 2026)
  "sw7-nadim": { path: "/sonicwall-7sept", source: "nadim", campaign: "sonicwall-7sept", medium: "invite", hash: "register" },
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
  dest.searchParams.set("utm_medium", link.medium ?? "sales");
  dest.searchParams.set("utm_campaign", link.campaign);
  if (link.tab) dest.searchParams.set("tab", link.tab);
  if (link.hash) dest.hash = link.hash;

  // 307 (temporary) so the mapping can be re-pointed later without browsers
  // pinning a stale destination from cache.
  return NextResponse.redirect(dest, 307);
}
