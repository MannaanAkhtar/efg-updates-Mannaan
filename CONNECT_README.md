# EFG Connect — Phase 1 Demo Build

Sponsor portal living at `/connect/*` on the same Next.js app as the marketing
site. Built on the existing Supabase project.

## What's in this build

- Magic-link login at **`/connect/login`** (Supabase Auth)
- One-click **Demo sign-in** as Sara Al-Qahtani — Field Marketing, Palo Alto
  Networks MENA — for tomorrow's walkthrough
- 3-step **first-run interest capture** at **`/connect/onboarding`**
- **Dashboard** — upcoming sponsorships, open deliverables, intelligence cards
- **My Sponsorships** — index + detail with the full deliverables tracker
- **Attendees** — pre-event lists with industry/country/seniority filters and
  saved views (per event, persisted in `localStorage`)
- **Lead CSV export** — endpoint at
  `/api/connect/sponsorships/[id]/leads.csv`
- Phase 2/3 zones (Intelligence, Community, Marketplace) appear in the sidebar
  with "Coming" badges and informative placeholder pages

## One-time setup (do this once before the demo)

### 1 — Run the SQL migrations

In the Supabase SQL Editor for the existing EFG project, run **in order**:

```
supabase/connect-schema.sql
supabase/connect-seed.sql
```

The first creates all `connect_*` tables and RLS policies. The second seeds:

- 6 organisations (Palo Alto MENA, Microsoft, Fortinet, Tenable, Celonis,
  EFG Internal)
- 12 events spanning 2025 (past) and 2026 (active/upcoming)
- 8 sponsorships (4 for Palo Alto + 4 cross-sponsor)
- 15 deliverables across 2 of Palo Alto's sponsorships
- 24 pre-event attendees for Cyber First Riyadh 2026
- 6 pre-event attendees for OT Security First Doha 2026
- 12 past attendees + 12 leads for the past Cyber First Dubai 2025 sponsorship
- 2 sample intelligence signals

Both scripts are idempotent — safe to re-run.

### 2 — Verify env vars in Vercel project settings

The portal uses the same env vars as the marketing site. Required:

| Var | Used by |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Both client + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Both client + server |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only — needed for the Demo sign-in flow |
| `CONNECT_DEMO_PASSWORD` *(optional)* | Override for the demo user's password. Defaults to `EFGConnect2026!` |

If `SUPABASE_SERVICE_ROLE_KEY` is missing on the deploy you're demoing from,
the Demo button will return a 500. The other auth flow (real magic link to a
real email) works without it.

### 3 — Verify Supabase Auth providers

In the Supabase dashboard → Authentication → Providers:

- **Email** must be enabled (it is by default).
- For magic link to work, **Confirm email** can stay on; we use
  `auth.admin.createUser({ email_confirm: true })` for the demo user so it
  bypasses confirmation.

For the demo flow to also function on the Vercel preview URL, no Supabase
Redirect URL changes are required (we use password sign-in, not OAuth).

For real magic-link sign-in, add the preview URL pattern to
**Authentication → URL Configuration → Redirect URLs**, e.g.:

```
https://connect-platform-*.vercel.app/api/connect/auth-callback
```

## Demo script for tomorrow

1. Open `https://<preview-url>/connect/login`
2. Click **"Sign in as Sara → Palo Alto MENA"** (the demo button)
3. → lands on the 3-step onboarding flow with sensible defaults pre-filled.
   Click through each step and submit.
4. → dashboard with 4 sponsorships, open deliverables, and 2 intelligence
   cards.
5. Click **Cyber First Riyadh 2026** (active, Platinum, $145K) → see the full
   detail page: deliverables tracker showing 4/10 complete (60% progress bar),
   24 pre-event attendees in a preview table.
6. Click **Open list & filters** → filter by Industry (BFSI), Country (SA),
   Seniority (C-suite, VP). Click **Save view**, name it "Saudi BFSI execs."
7. Back to **My Sponsorships** → click **Cyber First Dubai 2025** (past,
   Platinum, completed). Detail page shows leads captured (12) instead of
   pre-event attendees. Click **Download CSV**.
8. Sidebar → click **Intelligence**. Show the Phase 2 placeholder. Same for
   **Community** and **Marketplace** (Phase 3).

Total walkthrough: ~5 minutes.

## What's intentionally NOT built (Phase 2/3)

| Zone | Phase | Why not in Phase 1 |
|---|---|---|
| Live Event Console | 2 | Needs WebSocket / SSE infra. Build during a real event window. |
| Intelligence Feed (real signals, not stubs) | 2 | Needs the matching engine + monitoring jobs. |
| Community / Sponsor directory | 3 | Needs sponsor consent + opt-in flows. |
| Cross-Event Marketplace | 3 | Needs commercial logic + entitlements. |

## Tech notes (so you can keep building)

- **Routes:** all under `app/connect/*`. Safe to deploy alongside the
  marketing site — there's no overlap with existing routes.
- **DB:** all tables prefixed `connect_*`. RLS policies scope reads/writes to
  the calling user's organisation. EFG admins (any user in the
  `efg-internal` org) see everything.
- **Auth helpers:** `lib/connect/server.ts` exposes
  `requireConnectSession()`, `loadConnectContext()`, and data fetchers.
- **Types:** `lib/connect/types.ts` mirrors the SQL schema.
- **Display helpers:** `lib/connect/format.ts` for dates, currency, relative
  time.
- **Demo user provisioning:** `lib/connect/server.ts` → `ensureDemoUser()`
  creates `demo.sara@efgconnect.local` once and re-syncs the password on every
  click of the Demo button.
- **Paths to know:**
  - `app/connect/(auth)/login/` — login page + magic link form + demo button
  - `app/connect/(app)/` — sidebar layout + protected pages
  - `app/connect/onboarding/` — sits OUTSIDE `(app)` so the layout's
    "interests-must-be-completed" redirect doesn't loop
  - `app/api/connect/` — demo-login, auth-callback, leads CSV export

## Known limitations / "v1.1 polish" ideas

- Saved views currently live in `localStorage` — fine for one user per
  browser, but not shared across the org. Server-persisted views are a 1-day
  follow-up.
- No EFG-internal admin UI yet — admin currently means "use Supabase
  dashboard." Build the admin surface as the first item after design-partner
  feedback.
- No CRM webhook yet. Lead export is CSV only. HubSpot push integration is
  the most-requested follow-up — webhook scaffolding is straightforward in
  `app/api/connect/`.
- No real-time anything. Dashboard is server-rendered with `revalidatePath`
  invalidation — fast enough for the demo and Phase 1 use.
