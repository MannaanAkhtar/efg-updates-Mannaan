# SEO Audit Fixes Log

> Live changelog tracking implementation of recommendations from `Summary.md`, `SEO-AI-Audit.md`, and `Strategy-Report.md` (May 2026 audit baseline).
>
> The audit reports themselves are **not** modified — they're the historical record. This file is the implementation log.

**Status legend:** ✅ Done · 🔧 In progress · 📋 To do

---

## ✅ Done

### ✅ saudi-2026 Event JSON-LD offers schema

- **Audit ref:** F.1 / Top finding #2 / Quick win #5 (saudi-2026 instance)
- **Date:** 2026-05-04
- **Files:** `app/events/opex-first/saudi-2026/layout.tsx`
- **Change:** Replaced `availability: PreOrder` with `availability: InStock` + `price: "0"` + `priceCurrency: "USD"` + `validFrom: "2026-01-01"`
- **Why:** Removes Google Search Console structured-data warning. `PreOrder` without `price`/`priceCurrency` is invalid for invite-only free events.
- **Verify:** Run validator.schema.org against `/events/opex-first/saudi-2026` after deploy → no errors on Event/Offer.
- **Commit:** `61fa51a`

### ✅ saudi-2026 FAQPage JSON-LD added

- **Audit ref:** F.4 / Top finding #4 (saudi-2026 instance)
- **Date:** 2026-05-04
- **Files:** `app/events/opex-first/saudi-2026/layout.tsx`
- **Change:** Added 5-question FAQPage `<script type="application/ld+json">` block (when, where, who attends, fee, awards nominations).
- **Why:** Drives FAQ rich snippets in Google SERP and direct AI citation matches for prompt-style queries.
- **Verify:** Google Rich Results Test → FAQ section parses cleanly.
- **Commit:** `61fa51a`

### ✅ Root layout `metadataBase`

- **Audit ref:** Strategy report A2 / Quick win
- **Date:** 2026-05-04
- **Files:** `app/layout.tsx`
- **Change:** Added `metadataBase: new URL("https://eventsfirstgroup.com")` to root metadata object.
- **Why:** Resolves Next.js dev warning + ensures absolute OG image URLs across all routes when relative paths are used.
- **Verify:** `npm run dev` → no `metadataBase` warning in console; view-source on any route → all `og:image` URLs are absolute.
- **Commit:** `2914577`

### ✅ Offers schema fix on 6 coming-soon event pages

- **Audit ref:** F.1 / Top finding #2 / Quick win #5
- **Date:** 2026-05-05
- **Files:**
  - `app/events/cyber-first/ksa-2026/layout.tsx`
  - `app/events/cyber-first/oman-2026/layout.tsx`
  - `app/events/cyber-first/qatar-2026/layout.tsx`
  - `app/events/data-ai-first/qatar-2026/layout.tsx`
  - `app/events/ot-security-first/jubail-2026/layout.tsx`
  - `app/events/ot-security-first/oman-2026/layout.tsx`
- **Change:** Replaced `offers: { ... availability: "https://schema.org/PreOrder" }` with `availability: "InStock" + price: "0" + priceCurrency: "USD" + validFrom: "2026-01-01"` across all 6 layouts.
- **Why:** Removes Google Search Console "PreOrder without price/priceCurrency" structured-data warnings on 6 event URLs at once. Matches the saudi-2026 fix pattern.
- **Note:** Audit said the Cyber First Saudi page used slug `saudi-2026` and didn't exist — actual slug is `ksa-2026`, so it's 6 pages (not 5) once located.
- **Verify:** Schema validator (validator.schema.org) on each URL post-deploy → no errors on Event/Offer.
- **Commit:** _(see Phase 1 Commit A)_

### ✅ process-intelligence BreadcrumbList label

- **Audit ref:** F.7 / Top finding #10 / Quick win #4
- **Date:** 2026-05-05
- **Files:** `app/events/opex-first/process-intelligence/layout.tsx`
- **Change:** Last breadcrumb item label changed from "Virtual Boardroom MENA" → "Process Intelligence" so it matches the URL slug `/events/opex-first/process-intelligence`.
- **Why:** Crawler clarity + internal consistency. Mismatch between URL slug and breadcrumb label confused both Googlebot and AI crawlers.
- **Verify:** View-source on `/events/opex-first/process-intelligence` → BreadcrumbList JSON-LD shows "Process Intelligence" as final crumb.
- **Commit:** _(see Phase 1 Commit A)_

---

## 🔧 In progress

_(none — Phase 1 Commit A landed)_

---

## 📋 To do

### Phase 1 — Quick wins (this session)

#### 📋 Trim opex-first/saudi-2026 description

- **Audit ref:** F.6 / Quick win #2
- **Files:** `app/events/opex-first/saudi-2026/layout.tsx`
- **Change:** Description is currently 227 characters → trim to ~155 to avoid Google SERP truncation.
- **Why:** Google truncates description meta at ~160 chars; current copy gets clipped mid-sentence in search results.
- **Verify:** Count chars in `description` field after edit (target: 145-160).

#### 📋 Trim ot-security-first/johannesburg-2026 description

- **Audit ref:** F.6 / Quick win #3
- **Files:** `app/events/ot-security-first/johannesburg-2026/layout.tsx`
- **Change:** 190 → ~155 chars.
- **Why:** Same as above.
- **Verify:** Count chars after edit.

#### 📋 Add OG image + Twitter card to /sonicwall, /clevertap2

- **Audit ref:** F.5 / Top finding #8 / Quick win #6
- **Files:** `app/sonicwall/layout.tsx`, `app/clevertap2/layout.tsx`
- **Change:** Add `openGraph.images` array and `twitter.images` field. Use existing event-specific imagery already on S3.
- **Why:** Without OG image, social shares (LinkedIn, Slack, X/Twitter, WhatsApp) fall back to the site's root logo, not event-specific imagery.
- **Verify:** OpenGraph.xyz / LinkedIn Post Inspector → preview shows event imagery, not bare logo.

> User exclusion: `/braze`, `/braze2`, `/bigleap` deferred per user request (audit findings against these files are parked, not abandoned).

#### 📋 Add explicit AI bot blocks to robots.txt

- **Audit ref:** F.13 / Quick win #7
- **Files:** `public/robots.txt`
- **Change:** Add explicit `User-agent` blocks for **GPTBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot** mirroring the existing ClaudeBot / Claude-User / anthropic-ai pattern (allow `/`, disallow `/api/`, `/admin/`, etc.).
- **Why:** Locks in current allow-state. Without explicit listing, future bot policy changes (e.g., a global Disallow) would silently lock out these crawlers.
- **Verify:** `grep -E '(GPTBot|PerplexityBot|Google-Extended|Applebot-Extended|CCBot)' public/robots.txt` → 5 hits.

#### 📋 Add `Last updated` to llms.txt

- **Audit ref:** Quick win #9
- **Files:** `public/llms.txt`
- **Change:** Add `> Last updated: 2026-05-05` line near top of the file.
- **Why:** Helps AI assistants prioritise fresher content when ranking citations.
- **Verify:** First 5 lines of llms.txt include the Last updated line.

---

### Phase 2 — FAQPage JSON-LD rollout (deferred)

12 layouts need a FAQPage block (saudi-2026, india-2026, kenya-2026 already have one):

- `app/events/cyber-first/kuwait-2026/layout.tsx`
- `app/events/cyber-first/oman-2026/layout.tsx`
- `app/events/cyber-first/qatar-2026/layout.tsx`
- `app/events/data-ai-first/qatar-2026/layout.tsx`
- `app/events/ot-security-first/{johannesburg,jubail,oman}-2026/layout.tsx`
- `app/events/ot-security-first/virtual-boardroom-mena/layout.tsx`
- `app/events/opex-first/process-intelligence/layout.tsx`
- 4 series hub layouts (verify they exist as separate routes)

**Pattern:** 5 location-specific Q&A per page (when, where, who attends, fee, register/nominate). Reuse saudi-2026 schema shape.

**Effort:** ~10 min per page. Audit ref: F.4 / Top finding #4.

---

### Phase 3 — Static fact block in event-page layouts (deferred — needs design call)

Server-rendered `<aside>` inside every event-page `layout.tsx` exposing event name, date, venue, city, country, audience size, top 5 speakers, top 3 sponsors. Lives in static HTML so non-JS crawlers see it on first response.

**Open decision:** visible in design vs `sr-only` (visually hidden, crawler-only).

**Files:** 14 event location layouts + 4 series hub layouts.

**Audit ref:** F.3 / Strategic priority #1.

---

### Phase 4 — Lower-priority structural fixes (deferred)

- 📋 Add semantic `<h1>` to event pages that lack one (F.8 / Top finding #3)
- 📋 VideoObject JSON-LD per YouTube embed (F.10 / Top finding #9)
- 📋 Person JSON-LD for top 5 speakers per event (F.11)
- 📋 Internal links from event pages to `/speakers/{slug}` and `/sponsors-and-partners/{slug}` (F.19)
- 📋 `dateModified` ISO on every Insights article (F.14)
- 📋 `llms-full.txt` with full event briefs (F.12)
- 📋 `content-visibility: auto` rollout to other event pages (F.20, mirrors saudi-2026 pattern)

---

### Phase 5 — Deferred per user (excluded from current scope)

- 📋 Add canonical URLs to `/braze` and `/braze2` (F.2 / Top finding #7 / Quick win #1)
- 📋 Add OG image + Twitter card to `/bigleap` (F.5 / Top finding #8 / Quick win #6)

---

### Blockers — needs user input/decision

- 📋 **Search Console verification meta tag** (F.15) — needs verification code from GSC
- 📋 **Bing Webmaster Tools verification meta tag** (F.15) — needs verification code from BWT
- 📋 **Analytics platform install** (F.16) — user decision needed: GA4 / Vercel Analytics / Plausible / PostHog
- 📋 **Designed 1200×630 OG share cards** — design dependency (saudi-2026, process-intelligence, virtual-boardroom-mena, etc.)
- 📋 **`next/image` migration** (F.9) — perf-driven big refactor, separate workstream
- 📋 **Server response header audit** (X-Robots-Tag, Vary) — needs `curl -I` against production
