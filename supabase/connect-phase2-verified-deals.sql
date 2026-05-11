-- ────────────────────────────────────────────────────────────────────────────
-- Connect Phase 2 — verified sponsor deals only
--
-- Policy (per Ateeq, 2026-05-11): only ingest sponsorships that have been
-- VERIFIED via signed contract / booking form / "New Deal!" team email.
-- Public event-page sponsor lists are NOT enough on their own — many entries
-- on those pages are past-edition or aspirational, not deals you're currently
-- running. Sponsor data must reflect what's actually closed.
--
-- This file supersedes earlier Phase 2 / Phase 2.5 drafts which had been
-- generated from scraping app/events/*/page.tsx. Those over-included.
--
-- All 4 new sponsorships below are verified by email (Outlook mailbox of
-- ateeq@eventsfirstgroup.com), with the source email cited in each `notes`.
--
-- Idempotent. Safe to re-run.
-- ────────────────────────────────────────────────────────────────────────────

-- ─── Cleanup: drop any unwanted sponsorships from prior runs ─────────────
-- Keeps the 7 seeded OT VB MENA sponsorships; purges any extras.
-- No-op if no earlier phase 2 SQL was run.
delete from connect_sponsorships
where id not in (
  '5500a000-0000-0000-0000-000000000001'::uuid,
  '5500a000-0000-0000-0000-000000000002'::uuid,
  '5500a000-0000-0000-0000-000000000003'::uuid,
  '5500a000-0000-0000-0000-000000000004'::uuid,
  '5500a000-0000-0000-0000-000000000005'::uuid,
  '5500a000-0000-0000-0000-000000000006'::uuid,
  '5500a000-0000-0000-0000-000000000007'::uuid
);

-- ─── 4 new orgs (only ones we have verified deals for) ──────────────────
insert into connect_organizations (name, slug, logo_url, website) values
  ('ARIS',      'aris',      'https://efg-final.s3.eu-north-1.amazonaws.com/logos/ARIS-logo-crppd.svg', 'https://www.ariscommunity.com/'),
  ('Celonis',   'celonis',   'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Celonis.png', null),
  ('SAP',       'sap',       null,                                                                     'https://www.sap.com'),
  ('Kaspersky', 'kaspersky', 'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/kaspersky.png', null)
on conflict (slug) do nothing;

-- ─── 4 new verified-by-email sponsorships ────────────────────────────────
with verified_deals (id, org_slug, event_id, tier, contract_value_usd, signed_at, notes) as (values
  ('5500a000-0000-0000-0000-000000000008'::uuid, 'aris',      'eee00000-0000-0000-0000-000000000002'::uuid, 'platinum',   5000, '2026-05-06'::date,
    'Confirmed via "New Deal!" email + signed contract, 6 May 2026. Contact: Susan Wyer (Susan.Wyer@aris.com). Payment 100% by 15 May.'),
  ('5500a000-0000-0000-0000-000000000009'::uuid, 'celonis',   'eee00000-0000-0000-0000-000000000002'::uuid, 'gold',       4000, '2026-05-07'::date,
    'Confirmed via "New Deal!" email, 7 May 2026. Contact: Sohaib Alam (s.alam@celonis.de). Payment 100% by 20 May.'),
  ('5500a000-0000-0000-0000-00000000000a'::uuid, 'sap',       'eee00000-0000-0000-0000-000000000002'::uuid, 'supporting', 2000, '2026-05-01'::date,
    'Confirmed via NEW DEAL email from Kausar Noor, 1 May 2026 — Panel Sponsor normalised to supporting. Payment 100% after the event.'),
  ('5500a000-0000-0000-0000-00000000000b'::uuid, 'kaspersky', 'eee00000-0000-0000-0000-000000000003'::uuid, 'gold',       null, null,
    'Signed; booth specs being coordinated 8 May 2026. Contact: Kristin McDonald (Kristin.McDonald@kaspersky.com). Contract value pending confirmation.')
)
insert into connect_sponsorships (id, organization_id, event_id, tier, contract_value_usd, signed_at, status, notes)
select vd.id, o.id, vd.event_id, vd.tier, vd.contract_value_usd, vd.signed_at, 'active', vd.notes
from verified_deals vd
join connect_organizations o on o.slug = vd.org_slug
on conflict (organization_id, event_id) do nothing;

-- ─── Update Rilian + Nozomi OT VB MENA contract values to email actuals ──
update connect_sponsorships
set contract_value_usd = 1500,
    notes = 'Email-verified: $1,500 + 5% VAT. Confirmed via OTSEC MENA Virtual New Deal email + signed booking form (Taylor, taylor@rilian.com), 8 May 2026.'
where id = '5500a000-0000-0000-0000-000000000006'::uuid;

update connect_sponsorships
set contract_value_usd = 1500,
    notes = 'Email-verified: $1,500 + 5% VAT. Confirmed via "2 NEW DEALS Mayur & Danish - OTSEC MENA Virtual" email, 6 May 2026. Contact: Sofia.'
where id = '5500a000-0000-0000-0000-000000000007'::uuid;
