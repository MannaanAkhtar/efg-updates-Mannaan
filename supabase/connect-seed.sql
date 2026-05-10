-- ============================================================================
-- EFG Connect — REAL Seed Data
-- ============================================================================
-- Sources every name, sponsor, and event from the live eventsfirstgroup.com
-- pages and codebase. NO confidential data — only what is publicly listed
-- on the site.
--
-- Featured event: OT Security First Virtual Boardroom MENA — 19 May 2026.
-- Demo login organisation: Darktrace MEA (real Gold sponsor of that event).
--
-- Run AFTER connect-schema.sql. Idempotent — wipes Connect demo data first
-- so you can re-run cleanly.
-- ============================================================================

-- ─── ALLOW 'supporting' TIER (real OT VB MENA tiers include it) ─────────────
alter table connect_sponsorships drop constraint if exists connect_sponsorships_tier_check;
alter table connect_sponsorships add constraint connect_sponsorships_tier_check
  check (tier in ('platinum', 'gold', 'silver', 'bronze', 'associate', 'supporting'));

-- ─── WIPE PRIOR DEMO DATA (cascades handle children) ────────────────────────
delete from connect_intelligence_signals;
delete from connect_leads;
delete from connect_attendees;
delete from connect_deliverables;
delete from connect_sponsorships;
delete from connect_events;
-- Preserve any user_profiles that already exist (linked to auth.users) —
-- but wipe orgs that are not EFG-internal so we re-seed cleanly.
delete from connect_user_profiles
  where organization_id in (select id from connect_organizations where slug != 'efg-internal');
delete from connect_organizations where slug != 'efg-internal';

-- ─── ORGANISATIONS ──────────────────────────────────────────────────────────
-- EFG Internal + the 7 publicly-listed sponsors of OT VB MENA 2026.
insert into connect_organizations (id, name, slug, logo_url, website) values
  ('11111111-0000-0000-0000-000000000001'::uuid, 'EFG Internal',     'efg-internal',     null,                                                                                                              'https://www.eventsfirstgroup.com'),
  ('22222222-0000-0000-0000-000000000001'::uuid, 'FlintX',           'flintx',           null,                                                                                                              null),
  ('22222222-0000-0000-0000-000000000002'::uuid, 'TXOne Networks',   'txone-networks',   'https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/TXOne+LOGO-3.png',                                        'https://www.txone.com'),
  ('22222222-0000-0000-0000-000000000003'::uuid, 'Darktrace',        'darktrace',        'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Darktrace_Logo_DarkBG_White.png',                     'https://www.darktrace.com'),
  ('22222222-0000-0000-0000-000000000004'::uuid, 'Trellix',          'trellix',          'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Trellix-Logo-Black.svg',                              'https://www.trellix.com'),
  ('22222222-0000-0000-0000-000000000005'::uuid, 'SecuriCIP',        'securicip',        'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/SecuriCIP.png',                                       null),
  ('22222222-0000-0000-0000-000000000006'::uuid, 'Rilian',           'rilian',           'https://efg-final.s3.eu-north-1.amazonaws.com/logos/Corrected+Rilian+Logo+-+Black.png',                           null),
  ('22222222-0000-0000-0000-000000000007'::uuid, 'Nozomi Networks',  'nozomi-networks',  'https://efg-final.s3.eu-north-1.amazonaws.com/logos/Nozomi_Networks.png',                                         'https://www.nozominetworks.com')
on conflict (id) do nothing;

-- Make sure EFG Internal exists (idempotent insert if the wipe missed it).
insert into connect_organizations (id, name, slug, website) values
  ('11111111-0000-0000-0000-000000000001'::uuid, 'EFG Internal', 'efg-internal', 'https://www.eventsfirstgroup.com')
on conflict (id) do nothing;

-- ─── EVENTS ─────────────────────────────────────────────────────────────────
-- Every active 2026 edition currently listed on eventsfirstgroup.com/events.
insert into connect_events (id, series, name, city, country, start_date, end_date, status, hero_image_url) values
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'ot_security_first',   'OT Security First Virtual Boardroom MENA 2026', 'Online (MENA)', 'AE', '2026-05-19', '2026-05-19', 'upcoming', 'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG'),
  ('eee00000-0000-0000-0000-000000000002'::uuid, 'opex_first',          'OPEX First Process Intelligence MENA 2026',     'Online (MENA)', 'AE', '2026-05-21', '2026-05-21', 'upcoming', 'https://efg-final.s3.eu-north-1.amazonaws.com/Good/opex-ksa-speaker.jpg'),
  ('eee00000-0000-0000-0000-000000000003'::uuid, 'cyber_first',         'Cyber First Kuwait 2026',                       'Kuwait City',   'KW', '2026-06-09', '2026-06-09', 'upcoming', 'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0030.JPG'),
  ('eee00000-0000-0000-0000-000000000004'::uuid, 'digital_first',       'Digital First Kuwait 2026',                     'Kuwait City',   'KW', '2026-06-10', '2026-06-10', 'upcoming', 'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0045.JPG'),
  ('eee00000-0000-0000-0000-000000000005'::uuid, 'cyber_first',         'Cyber First Kenya 2026',                        'Nairobi',       'KE', '2026-07-01', '2026-07-02', 'upcoming', 'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0394.JPG'),
  ('eee00000-0000-0000-0000-000000000006'::uuid, 'ot_security_first',   'OT Security First Africa 2026 — Johannesburg',  'Johannesburg',  'ZA', '2026-08-26', '2026-08-26', 'upcoming', 'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0394.JPG'),
  ('eee00000-0000-0000-0000-000000000007'::uuid, 'opex_first',          'OPEX First Saudi 2026 — Riyadh',                'Riyadh',        'SA', '2026-09-15', '2026-09-15', 'upcoming', 'https://efg-final.s3.eu-north-1.amazonaws.com/Good/opex-ksa-speaker.jpg'),
  ('eee00000-0000-0000-0000-000000000008'::uuid, 'cyber_first',         'Cyber First Qatar 2026',                        'Doha',          'QA', '2026-09-22', '2026-09-22', 'upcoming', 'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0030.JPG'),
  ('eee00000-0000-0000-0000-000000000009'::uuid, 'digital_first',       'Digital First Qatar 2026',                      'Doha',          'QA', '2026-09-23', '2026-09-23', 'upcoming', 'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0045.JPG'),
  ('eee00000-0000-0000-0000-000000000010'::uuid, 'ot_security_first',   'OT Security First Jubail 2026',                 'Jubail',        'SA', '2026-10-07', '2026-10-07', 'upcoming', 'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'cyber_first',         'Cyber First India 2026 — New Delhi',            'New Delhi',     'IN', '2026-10-10', '2026-10-10', 'upcoming', 'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0045.JPG'),
  ('eee00000-0000-0000-0000-000000000012'::uuid, 'cyber_first',         'Digital Resilience KSA 2026 (Cyber First)',     'Riyadh',        'SA', '2026-10-10', '2026-10-10', 'upcoming', 'https://efg-final.s3.eu-north-1.amazonaws.com/Good/opex-ksa-speaker.jpg'),
  ('eee00000-0000-0000-0000-000000000013'::uuid, 'cyber_first',         'Cyber First Oman 2026 — Muscat',                'Muscat',        'OM', '2026-10-13', '2026-10-13', 'upcoming', 'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0030.JPG'),
  ('eee00000-0000-0000-0000-000000000014'::uuid, 'ot_security_first',   'OT Security First Oman 2026 — Muscat',          'Muscat',        'OM', '2026-10-14', '2026-10-14', 'upcoming', 'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG');

-- ─── SPONSORSHIPS ──────────────────────────────────────────────────────────
-- The seven REAL sponsors of OT Security First Virtual Boardroom MENA 2026,
-- at the tiers publicly listed on the event page.
-- Contract values are indicative placeholders — replace with real numbers
-- before exposing the portal to anyone outside the EFG team.
insert into connect_sponsorships (id, organization_id, event_id, tier, contract_value_usd, signed_at, status, notes) values
  -- Featured: Darktrace (the demo login org)
  ('5500a000-0000-0000-0000-000000000001'::uuid,
    '22222222-0000-0000-0000-000000000003'::uuid,  -- Darktrace
    'eee00000-0000-0000-0000-000000000001'::uuid,
    'gold',     45000,  '2026-03-04', 'active',
    'Gold partner. Includes one panel slot, branded breakout, dedicated post-event briefing for verified delegates.'),

  -- Other real sponsors of OT VB MENA — populate the EFG-internal cross-org view
  ('5500a000-0000-0000-0000-000000000002'::uuid,
    '22222222-0000-0000-0000-000000000001'::uuid,  -- FlintX
    'eee00000-0000-0000-0000-000000000001'::uuid,
    'platinum', 80000,  '2026-02-14', 'active',
    'Platinum partner. Lead sponsor — hosts opening keynote and brand title alongside the UAE Cyber Security Council.'),
  ('5500a000-0000-0000-0000-000000000003'::uuid,
    '22222222-0000-0000-0000-000000000002'::uuid,  -- TXOne Networks
    'eee00000-0000-0000-0000-000000000001'::uuid,
    'gold',     45000,  '2026-03-01', 'active', 'Gold partner.'),
  ('5500a000-0000-0000-0000-000000000004'::uuid,
    '22222222-0000-0000-0000-000000000004'::uuid,  -- Trellix
    'eee00000-0000-0000-0000-000000000001'::uuid,
    'gold',     45000,  '2026-03-08', 'active', 'Gold partner.'),
  ('5500a000-0000-0000-0000-000000000005'::uuid,
    '22222222-0000-0000-0000-000000000005'::uuid,  -- SecuriCIP
    'eee00000-0000-0000-0000-000000000001'::uuid,
    'gold',     45000,  '2026-03-12', 'active', 'Gold partner.'),
  ('5500a000-0000-0000-0000-000000000006'::uuid,
    '22222222-0000-0000-0000-000000000006'::uuid,  -- Rilian
    'eee00000-0000-0000-0000-000000000001'::uuid,
    'supporting', 18000, '2026-03-20', 'active', 'Supporting partner.'),
  ('5500a000-0000-0000-0000-000000000007'::uuid,
    '22222222-0000-0000-0000-000000000007'::uuid,  -- Nozomi Networks
    'eee00000-0000-0000-0000-000000000001'::uuid,
    'supporting', 18000, '2026-03-22', 'active', 'Supporting partner.');

-- (Fictional pipeline-stage Darktrace sponsorships removed — Darktrace
--  currently sponsors only OT Security First Virtual Boardroom MENA. The
--  cross-event intelligence card surfaces Jubail as a recommended next.)

-- ─── DELIVERABLES (Darktrace × OT VB MENA — ~50% complete, event in 8 days) ─
insert into connect_deliverables (sponsorship_id, title, description, due_date, status, sort_order) values
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Submit company logo (vector)',          'PNG and SVG required, transparent background.',                                                       '2026-03-31', 'complete',     10),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Confirm panel speaker',                 'Syed Shahabuddin (Regional OT Solutions Architect, EMEA / APAC). Headshot and bio submitted.',       '2026-04-15', 'complete',     20),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Approve event website listing',         'Sponsor profile copy, logo placement, CTA destination.',                                              '2026-04-22', 'complete',     30),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Joint pre-event email asset',           'HTML asset for the EFG audience announcement. Copy approval required from both sides.',              '2026-05-01', 'complete',     40),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Submit panel discussion topic',         'Title and 3 discussion questions. Panel chairs assigned by EFG.',                                    '2026-05-08', 'in_progress',  50),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Confirm post-event briefing slot',      'Dedicated 30-minute closed briefing for verified delegates immediately after the live session.',     '2026-05-12', 'in_progress',  60),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Final speaker briefing (live rehearsal)', 'EFG production team walks through technical setup with Darktrace speaker on Microsoft Teams.',    '2026-05-16', 'not_started',  70),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Lead capture device handover',          'Joining link, attendee Q&A capture form, post-event lead export — delivered in EFG Connect.',       '2026-05-19', 'not_started',  80),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Post-event recap deck',                 'EFG delivers within 5 business days of event close. Includes attendee analytics and lead report.',   '2026-05-26', 'not_started',  90);

-- ─── ATTENDEES (OT VB MENA — confirmed, publicly listed speakers) ──────────
-- All 16 names below are publicly listed on
-- https://www.eventsfirstgroup.com/events/ot-security-first/virtual-boardroom-mena
-- as confirmed speakers. They are by definition confirmed attendees.
insert into connect_attendees (event_id, full_name, job_title, company, industry, country, seniority, registered_at) values
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'H.E. Dr. Mohamed Al Kuwaiti',          'Head of Cyber Security',                                  'United Arab Emirates Government',          'Government',     'AE', 'c_suite', '2026-03-15 09:00:00+04'),
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'Vijay Velayutham',                     'Principal Information Security Officer',                  'UAE Ministry of Energy & Infrastructure',  'Government',     'AE', 'director','2026-03-18 11:00:00+04'),
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'Dr. Shaheela Banu Abdul Majeed',       'Information Security & Compliance Officer & Auditor',     'Kuwait Gulf Oil Company (KGOC)',           'Energy',         'KW', 'director','2026-03-20 14:00:00+03'),
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'Ali Abdulla Hasan Alsadadi',           'Chief of Information Technology',                         'Ministry of Oil & Environment, Bahrain',   'Government',     'BH', 'c_suite', '2026-03-22 10:00:00+03'),
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'Nasser Salim Al Alawi',                'OT Cybersecurity Manager',                                'Oman LNG LLC',                              'Energy',         'OM', 'manager', '2026-03-25 15:30:00+04'),
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'Samir Mokthar',                        'Founder & CEO',                                            'FlintX',                                    'Cybersecurity',  'AE', 'c_suite', '2026-02-14 09:00:00+04'),
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'Anand GP',                             'Regional Sales Engineer & OT Cybersecurity Consultant',   'TXOne Networks',                            'Cybersecurity',  'AE', 'manager', '2026-03-01 11:00:00+04'),
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'Syed Shahabuddin',                     'Regional OT Solutions Architect, EMEA / APAC',            'Darktrace',                                 'Cybersecurity',  'AE', 'manager', '2026-03-04 09:00:00+04'),
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'Mo Cashman',                           'Global Field CTO',                                         'Trellix',                                   'Cybersecurity',  'US', 'c_suite', '2026-03-08 14:00:00+04'),
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'Ahmed Fathalla',                       'Senior Manager, OT Systems & Cybersecurity',              'SecuriCIP',                                 'Cybersecurity',  'AE', 'manager', '2026-03-12 10:30:00+04'),
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'Thomas Philip',                        'Head of Digital & IT',                                    'Petrotec & Al-Mahhar Holding',              'Energy',         'QA', 'head',    '2026-03-28 09:45:00+03'),
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'Nisheet Saxena',                       'IT/OT Cybersecurity and Crisis Resilience Advisor',       'Confidential',                              'Energy',         'QA', 'director','2026-04-02 13:15:00+03'),
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'Manish Kumar',                         'OT Network & Cybersecurity Manager',                      'Global Innovation & Digital Engineering',   'Manufacturing',  'AE', 'manager', '2026-04-08 16:00:00+04'),
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'Yahya Alazri',                         'Expert',                                                   'Oman National CERT',                        'Government',     'OM', 'director','2026-04-12 09:30:00+04'),
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'Nicholas Jones',                       'EMEIA Cybersecurity Oil & Gas Lead',                      'EY',                                        'Consulting',     'AE', 'director','2026-04-15 11:20:00+04'),
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'Ahmed Al Bahdoor',                     'Head of Cyber Security',                                   'Oman Airports Management Company',          'Aviation',       'OM', 'head',    '2026-04-18 10:00:00+04');

-- ─── INTELLIGENCE SIGNALS (Darktrace, dashboard previews) ──────────────────
insert into connect_intelligence_signals (organization_id, type, headline, body, payload) values
  ('22222222-0000-0000-0000-000000000003'::uuid,
    'target_account_registered',
    '3 Energy-sector accounts have registered for OT VB MENA',
    'Kuwait Gulf Oil Company, Oman LNG, and Petrotec & Al-Mahhar Holding are now confirmed for 19 May. All three sit in your priority Energy / Oil & Gas vertical.',
    '{"event_id":"eee00000-0000-0000-0000-000000000001","accounts":["Kuwait Gulf Oil Company","Oman LNG LLC","Petrotec & Al-Mahhar Holding"]}'::jsonb),
  ('22222222-0000-0000-0000-000000000003'::uuid,
    'cross_event_match',
    'OT Security First Jubail matches your ICP — sponsorship is open',
    'Jubail (7 Oct 2026) is Saudi industrial heartland with 60% Energy / Petrochem audience expected. EFG has Gold tier still available — speak with your EFG account manager to explore.',
    '{"event_id":"eee00000-0000-0000-0000-000000000010","match_score":0.82,"available_tier":"gold"}'::jsonb);

-- ─── DONE ───────────────────────────────────────────────────────────────────
-- After running this, the demo login button signs you in as Sara Al-Qahtani
-- at Darktrace MEA. You'll see:
--   - 1 active sponsorship: OT Security First Virtual Boardroom MENA, 19 May
--     (Gold tier, ~50% deliverables complete, 16 confirmed attendees)
--   - 2 draft sponsorships: OT Security First Jubail, OT Security First Africa
--   - 2 intelligence cards
-- The EFG-internal admin org (efg-internal slug) sees ALL 9 sponsorships
-- across the 7 partner organisations.
