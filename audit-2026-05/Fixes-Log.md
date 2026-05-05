---
pdf_options:
  format: A4
  margin: 22mm
  printBackground: true
  displayHeaderFooter: true
  headerTemplate: |-
    <div style="font-size:9px;width:100%;padding:0 22mm;color:#7a7a7a;display:flex;justify-content:space-between;align-items:center;">
      <span>SEO Audit Fixes Log</span>
      <span>Events First Group · May 2026</span>
    </div>
  footerTemplate: |-
    <div style="font-size:9px;width:100%;padding:0 22mm;color:#7a7a7a;text-align:center;">
      Page <span class="pageNumber"></span> of <span class="totalPages"></span>
    </div>
stylesheet:
  - https://cdn.jsdelivr.net/npm/github-markdown-css@5/github-markdown-light.min.css
css: |-
  .markdown-body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif; font-size: 11.5px; line-height: 1.6; color: #1a1a1a; max-width: 100%; padding: 0; }
  .markdown-body h1 { margin-top: 0; padding-bottom: 8px; border-bottom: 2px solid #1a1a1a; font-size: 22px; }
  .markdown-body h2 { font-size: 15px; margin-top: 22px; padding-bottom: 5px; border-bottom: 1px solid #ddd; }
  .markdown-body h3 { font-size: 12.5px; margin-top: 18px; }
  .markdown-body h4 { font-size: 11.5px; margin-top: 16px; }
  .markdown-body table { font-size: 10px; page-break-inside: avoid; border-collapse: collapse; margin: 10px 0; width: 100%; }
  .markdown-body th { background: #f0f0f0; font-weight: 700; text-align: left; padding: 6px 8px; border: 1px solid #ccc; }
  .markdown-body td { padding: 5px 8px; border: 1px solid #ddd; vertical-align: top; }
  .markdown-body code { background: #f3f3f3; padding: 1px 5px; border-radius: 3px; font-size: 10px; }
  .markdown-body pre { background: #f6f6f6; border: 1px solid #e3e3e3; padding: 10px 12px; font-size: 10px; line-height: 1.45; page-break-inside: avoid; border-radius: 4px; }
  .markdown-body p, .markdown-body li { font-size: 11.5px; }
  .markdown-body blockquote { border-left: 3px solid #c9935a; padding: 4px 12px; color: #555; margin: 10px 0; }
  .markdown-body hr { border: 0; border-top: 1px solid #ddd; margin: 24px 0; }
---

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
- **Commit:** `f8a918b`

### ✅ process-intelligence BreadcrumbList label

- **Audit ref:** F.7 / Top finding #10 / Quick win #4
- **Date:** 2026-05-05
- **Files:** `app/events/opex-first/process-intelligence/layout.tsx`
- **Change:** Last breadcrumb item label changed from "Virtual Boardroom MENA" → "Process Intelligence" so it matches the URL slug `/events/opex-first/process-intelligence`.
- **Why:** Crawler clarity + internal consistency. Mismatch between URL slug and breadcrumb label confused both Googlebot and AI crawlers.
- **Verify:** View-source on `/events/opex-first/process-intelligence` → BreadcrumbList JSON-LD shows "Process Intelligence" as final crumb.
- **Commit:** `f8a918b`

### ✅ Trim 2 long descriptions to under SERP truncation limit

- **Audit ref:** F.6 / Quick win #2 + #3
- **Date:** 2026-05-05
- **Files:**
  - `app/events/opex-first/saudi-2026/layout.tsx` (227 → 143 chars)
  - `app/events/ot-security-first/johannesburg-2026/layout.tsx` (190 → 155 chars)
- **Change:** Rewrote both descriptions to fit under Google's ~160-char SERP snippet limit while keeping primary keywords (event name, edition, date, city, audience size, sponsor pillars).
- **Why:** Prevents Google from truncating the description mid-sentence in search results. Both target descriptions stay under 160 chars.
- **Verify:** `node -e "console.log(desc.length)"` against each new description string.
- **Commit:** `8aab4ce`

### ✅ OG image + Twitter card on /sonicwall and /clevertap2

- **Audit ref:** F.5 / Top finding #8 / Quick win #6 (excluding /bigleap per user)
- **Date:** 2026-05-05
- **Files:**
  - `app/sonicwall/layout.tsx`
  - `app/clevertap2/layout.tsx`
- **Change:** Added `openGraph.images` array (1200×630, with descriptive alt text) and a full `twitter` block with `card: summary_large_image`. Used existing event-specific S3 imagery as best-available placeholder pending designed share cards.
  - sonicwall → `boardroom/sonicwall_hero.png`
  - clevertap2 → `boardroom/CleverTap_Logotype.png` (CleverTap logo, since no clevertap2 hero exists yet)
- **Why:** Without OG images, social shares (LinkedIn, Slack, X, WhatsApp) fell back to the EFG root logo rather than event-specific imagery. TODO comments left in both files flagging the need for designed 1200×630 share cards.
- **Verify:** OpenGraph.xyz / LinkedIn Post Inspector / Twitter Card Validator on each URL post-deploy → preview shows the event-branded image, not the bare EFG logo.
- **Commit:** `75224d1`

### ✅ Explicit AI bot allow blocks in robots.txt

- **Audit ref:** F.13 / Quick win #7
- **Date:** 2026-05-05
- **Files:** `public/robots.txt`
- **Change:** Added explicit `User-agent` blocks for **GPTBot, ChatGPT-User, PerplexityBot, Google-Extended, Applebot-Extended, CCBot** mirroring the existing ClaudeBot pattern (allow `/`, disallow private paths). 6 new blocks total (audit asked for 5; added ChatGPT-User as the OpenAI live-fetch counterpart to GPTBot for parity with Claude-User).
- **Why:** Locks in current allow-state for AI training/citation bots. Without explicit listing, any future global Disallow change in the wildcard `*` block would silently lock out these crawlers. Better to opt them in by name now.
- **Verify:** `grep -E '(GPTBot|PerplexityBot|Google-Extended|Applebot-Extended|CCBot|ChatGPT-User)' public/robots.txt` → 6 matches.
- **Commit:** `7ea5a6e`

### ✅ Last updated date in llms.txt

- **Audit ref:** Quick win #9
- **Date:** 2026-05-05
- **Files:** `public/llms.txt`
- **Change:** Added `> Last updated: 2026-05-05` blockquote line directly below the H1.
- **Why:** Helps AI assistants (Claude, ChatGPT, Perplexity) prioritise fresher content when ranking citation candidates. The `>` blockquote syntax is a recognised llms.txt convention for metadata.
- **Verify:** `head -5 public/llms.txt` → "Last updated" line appears on line 3.
- **Commit:** `7ea5a6e`

---

## 🔧 In progress

_(none — Phase 1 Commit A landed)_

---

## 📋 To do

### Phase 1 — Quick wins (this session)

> User exclusion: `/braze`, `/braze2`, `/bigleap` deferred per user request (audit findings against these files are parked, not abandoned).

_(Phase 1 complete — all 8 quick-win items either landed or deferred per user. See Done section above.)_

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
