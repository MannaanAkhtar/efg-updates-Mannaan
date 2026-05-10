-- ────────────────────────────────────────────────────────────────────────────
-- Connect Phase 2.5 — email-verified sponsor deals (private contract data)
--
-- The Phase 2 file seeded public sponsor-by-event data from event TSX pages.
-- This file adds CONTRACT-LEVEL details that only existed in email/booking
-- forms: deal values, plus a few sponsors that hadn't yet appeared on the
-- public event pages at the time of TSX scrape.
--
-- All evidence is from Outlook (Microsoft 365 mailbox of ateeq@eventsfirstgroup.com)
-- searched on 2026-05-11. Each row carries a `notes` field tagging the email
-- source so the audit trail is clear.
--
-- Idempotent. Safe to run after Phase 2 or before — both orderings work.
-- ────────────────────────────────────────────────────────────────────────────

-- ─── 1. New orgs not already in Phase 2 ───────────────────────────────────
-- SAP (parent brand, distinct from SAP Signavio which is already in Phase 2)
insert into connect_organizations (name, slug, logo_url, website) values
  ('SAP', 'sap', null, 'https://www.sap.com')
on conflict (slug) do nothing;

-- Celonis already added by Phase 2 — skipping. ARIS already added by Phase 2.

-- ─── 2. New sponsorships for Process Intelligence MENA 2026 ───────────────
-- ARIS (Platinum) is added by Phase 2 with contract_value_usd null.
-- Below adds Celonis Gold + SAP Supporting, plus updates ARIS contract value.

with sponsorship_inserts (org_slug, event_id, tier, contract_value_usd, signed_at, notes) as (values
  ('celonis',
    'eee00000-0000-0000-0000-000000000002'::uuid,
    'gold',
    4000,
    '2026-05-07'::date,
    'Confirmed via "New Deal! Process intelligence Virtual Boardroom" email, 7 May 2026. Contact: Sohaib Alam (s.alam@celonis.de). Payment 100% by 20 May.'),
  ('sap',
    'eee00000-0000-0000-0000-000000000002'::uuid,
    'supporting',
    2000,
    '2026-05-01'::date,
    'Confirmed via NEW DEAL email from Kausar Noor, 1 May 2026 — "Panel Sponsor" tier in source, normalised to supporting. Payment 100% after the event.')
)
insert into connect_sponsorships (organization_id, event_id, tier, contract_value_usd, signed_at, status, notes)
select o.id, si.event_id, si.tier, si.contract_value_usd, si.signed_at, 'active', si.notes
from sponsorship_inserts si
join connect_organizations o on o.slug = si.org_slug
on conflict (organization_id, event_id) do nothing;

-- ─── 3. Update existing rows with email-verified contract values ──────────

-- ARIS × Process Intelligence MENA: confirmed $5,000 Platinum, signed contract attached 2026-05-06
update connect_sponsorships s
set contract_value_usd = 5000,
    signed_at          = '2026-05-06'::date,
    notes              = 'Confirmed via "New Deal! Process intelligence Virtual Boardroom" + "Welcome on board" emails, 6 May 2026. Signed contract attached. Contact: Susan Wyer (Susan.Wyer@aris.com). Payment 100% by 15 May.'
from connect_organizations o
where s.organization_id = o.id
  and o.slug = 'aris'
  and s.event_id = 'eee00000-0000-0000-0000-000000000002'::uuid;

-- Rilian × OT VB MENA: placeholder $18K → actual $1.5K + 5% VAT
update connect_sponsorships
set contract_value_usd = 1500,
    notes              = 'Email-verified deal value: $1,500 + 5% VAT. Confirmed via "OTSEC MENA Virtual" New Deal email + signed booking form (Taylor Tompkins, taylor@rilian.com), 8 May 2026. Payment by 15 May.'
where id = '5500a000-0000-0000-0000-000000000006'::uuid;

-- Nozomi × OT VB MENA: placeholder $18K → actual $1.5K + 5% VAT
update connect_sponsorships
set contract_value_usd = 1500,
    notes              = 'Email-verified deal value: $1,500 + 5% VAT. Confirmed via "2 NEW DEALS Mayur & Danish - OTSEC MENA Virtual" email, 6 May 2026. Contact: Sofia. Payment by 28 May.'
where id = '5500a000-0000-0000-0000-000000000007'::uuid;
