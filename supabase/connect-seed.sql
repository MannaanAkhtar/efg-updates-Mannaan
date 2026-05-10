-- ============================================================================
-- EFG Connect — Demo Seed Data
-- ============================================================================
-- Seeds organisations, events, sponsorships, deliverables, attendees, leads.
--
-- Auth users + profiles are created automatically by the "Demo Login" server
-- action on first click. Run this AFTER connect-schema.sql.
-- ============================================================================

-- ─── ORGANISATIONS ──────────────────────────────────────────────────────────
insert into connect_organizations (id, name, slug, logo_url, website) values
  ('11111111-0000-0000-0000-000000000001'::uuid, 'EFG Internal',                   'efg-internal',           null, 'https://www.eventsfirstgroup.com'),
  ('22222222-0000-0000-0000-000000000001'::uuid, 'Palo Alto Networks — MENA',      'palo-alto-networks',     'https://logo.clearbit.com/paloaltonetworks.com', 'https://www.paloaltonetworks.com'),
  ('22222222-0000-0000-0000-000000000002'::uuid, 'Microsoft Middle East',          'microsoft-mea',          'https://logo.clearbit.com/microsoft.com',        'https://www.microsoft.com/en-xm'),
  ('22222222-0000-0000-0000-000000000003'::uuid, 'Fortinet MENA',                  'fortinet-mena',          'https://logo.clearbit.com/fortinet.com',         'https://www.fortinet.com'),
  ('22222222-0000-0000-0000-000000000004'::uuid, 'Tenable',                        'tenable',                'https://logo.clearbit.com/tenable.com',          'https://www.tenable.com'),
  ('22222222-0000-0000-0000-000000000005'::uuid, 'Celonis',                        'celonis',                'https://logo.clearbit.com/celonis.com',          'https://www.celonis.com')
on conflict (id) do nothing;

-- ─── EVENTS ─────────────────────────────────────────────────────────────────
insert into connect_events (id, series, name, city, country, start_date, end_date, status, hero_image_url) values
  -- Past
  ('eee00000-0000-0000-0000-000000000001'::uuid, 'cyber_first',         'Cyber First Dubai 2025',                        'Dubai',        'UAE',   '2025-10-22', '2025-10-23', 'completed',
    'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0045.JPG'),
  ('eee00000-0000-0000-0000-000000000002'::uuid, 'ot_security_first',   'OT Security First UAE 2025',                    'Abu Dhabi',    'UAE',   '2025-11-04', '2025-11-04', 'completed',
    'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG'),
  -- Active / upcoming
  ('eee00000-0000-0000-0000-000000000010'::uuid, 'cyber_first',         'Cyber First Kuwait 2026',                       'Kuwait City',  'KW',    '2026-06-09', '2026-06-09', 'upcoming',
    'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0030.JPG'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'cyber_first',         'Cyber First Riyadh 2026',                       'Riyadh',       'SA',    '2026-10-14', '2026-10-15', 'active',
    'https://efg-final.s3.eu-north-1.amazonaws.com/Good/opex-ksa-speaker.jpg'),
  ('eee00000-0000-0000-0000-000000000012'::uuid, 'cyber_first',         'Cyber First Kenya 2026',                        'Nairobi',      'KE',    '2026-07-08', '2026-07-09', 'upcoming',
    'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0394.JPG'),
  ('eee00000-0000-0000-0000-000000000013'::uuid, 'ot_security_first',   'OT Security First Doha 2026',                   'Doha',         'QA',    '2026-09-03', '2026-09-03', 'upcoming',
    'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG'),
  ('eee00000-0000-0000-0000-000000000014'::uuid, 'ot_security_first',   'OT Security First Jubail 2026',                 'Jubail',       'SA',    '2026-10-07', '2026-10-07', 'upcoming',
    'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG'),
  ('eee00000-0000-0000-0000-000000000015'::uuid, 'ot_security_first',   'OT Security First Johannesburg 2026',           'Johannesburg', 'ZA',    '2026-08-26', '2026-08-26', 'upcoming',
    'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0394.JPG'),
  ('eee00000-0000-0000-0000-000000000016'::uuid, 'digital_first',       'Digital First Mumbai 2026',                     'Mumbai',       'IN',    '2026-11-22', '2026-11-22', 'upcoming',
    'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0045.JPG'),
  ('eee00000-0000-0000-0000-000000000017'::uuid, 'digital_first',       'Digital First Kuwait 2026',                     'Kuwait City',  'KW',    '2026-06-10', '2026-06-10', 'upcoming',
    'https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0045.JPG'),
  ('eee00000-0000-0000-0000-000000000018'::uuid, 'opex_first',          'OPEX First Saudi 2026',                         'Riyadh',       'SA',    '2026-09-15', '2026-09-15', 'upcoming',
    'https://efg-final.s3.eu-north-1.amazonaws.com/Good/opex-ksa-speaker.jpg')
on conflict (id) do nothing;

-- ─── SPONSORSHIPS (Palo Alto MENA — primary demo org) ──────────────────────
insert into connect_sponsorships (id, organization_id, event_id, tier, contract_value_usd, signed_at, status, notes) values
  ('5500a000-0000-0000-0000-000000000001'::uuid,
    '22222222-0000-0000-0000-000000000001'::uuid,
    'eee00000-0000-0000-0000-000000000011'::uuid,
    'platinum', 145000, '2026-02-14', 'active',
    'Lead sponsor. Includes keynote slot, branded NetworkFirst dinner, exclusive booth.'),
  ('5500a000-0000-0000-0000-000000000002'::uuid,
    '22222222-0000-0000-0000-000000000001'::uuid,
    'eee00000-0000-0000-0000-000000000013'::uuid,
    'gold',     80000,  '2026-03-20', 'confirmed',
    'Gold sponsor. Includes panel slot and standard booth.'),
  ('5500a000-0000-0000-0000-000000000003'::uuid,
    '22222222-0000-0000-0000-000000000001'::uuid,
    'eee00000-0000-0000-0000-000000000001'::uuid,
    'platinum', 130000, '2025-08-01', 'completed',
    'Past edition. Leads available.'),
  ('5500a000-0000-0000-0000-000000000004'::uuid,
    '22222222-0000-0000-0000-000000000001'::uuid,
    'eee00000-0000-0000-0000-000000000016'::uuid,
    'silver',   45000,  '2026-04-02', 'confirmed',
    'India debut for Palo Alto MENA cross-coverage. Confirmed.')
on conflict (id) do nothing;

-- A few cross-sponsor sponsorships so the EFG admin view feels populated
insert into connect_sponsorships (id, organization_id, event_id, tier, contract_value_usd, signed_at, status) values
  ('5500b000-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000002'::uuid, 'eee00000-0000-0000-0000-000000000011'::uuid, 'gold',    80000,  '2026-03-04', 'active'),
  ('5500b000-0000-0000-0000-000000000002'::uuid, '22222222-0000-0000-0000-000000000003'::uuid, 'eee00000-0000-0000-0000-000000000011'::uuid, 'gold',    75000,  '2026-03-12', 'active'),
  ('5500b000-0000-0000-0000-000000000003'::uuid, '22222222-0000-0000-0000-000000000004'::uuid, 'eee00000-0000-0000-0000-000000000013'::uuid, 'silver',  40000,  '2026-04-01', 'confirmed'),
  ('5500b000-0000-0000-0000-000000000004'::uuid, '22222222-0000-0000-0000-000000000005'::uuid, 'eee00000-0000-0000-0000-000000000018'::uuid, 'platinum',135000, '2026-03-25', 'active')
on conflict (id) do nothing;

-- ─── DELIVERABLES (Cyber First Riyadh — Palo Alto, ~60% complete) ──────────
insert into connect_deliverables (sponsorship_id, title, description, due_date, status, sort_order) values
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Submit company logo (vector)',          'PNG and SVG required, transparent background.', '2026-04-30', 'complete',     10),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Confirm primary keynote speaker',       'Name, title, headshot, 150-word bio.',         '2026-05-15', 'complete',     20),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Submit booth design brief',             'Floor plan + visual reference. EFG ops to review.', '2026-06-30', 'complete', 30),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Approve event website listing',         'Sponsor profile copy, logo placement, CTAs.',  '2026-06-15', 'complete',     40),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Confirm NetworkFirst dinner guest list', 'Up to 12 guests, C-suite + EVP. EFG verifies seniority.', '2026-08-01', 'in_progress', 50),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Submit panel discussion topic',         'Title and 3 discussion questions. Panel chairs assigned by EFG.', '2026-08-15', 'in_progress', 60),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Pre-event email asset',                 'HTML asset for joint announcement to EFG audience.', '2026-09-01', 'in_progress', 70),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Booth staff registration',              'Names and emails for badge generation.',       '2026-09-30', 'not_started',  80),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Lead capture device handover',          'Pick up scanners at registration desk.',       '2026-10-14', 'not_started',  90),
  ('5500a000-0000-0000-0000-000000000001'::uuid, 'Post-event recap deck',                 'EFG delivers within 10 business days of event close.', '2026-10-29', 'not_started', 100)
on conflict do nothing;

-- ─── DELIVERABLES (OT Security First Doha — Palo Alto, all not_started) ────
insert into connect_deliverables (sponsorship_id, title, description, due_date, status, sort_order) values
  ('5500a000-0000-0000-0000-000000000002'::uuid, 'Submit company logo (vector)',          'PNG and SVG required, transparent background.', '2026-06-30', 'not_started', 10),
  ('5500a000-0000-0000-0000-000000000002'::uuid, 'Confirm panel speaker',                 'Name, title, headshot, 150-word bio.',         '2026-07-15', 'not_started', 20),
  ('5500a000-0000-0000-0000-000000000002'::uuid, 'Booth design brief',                    'Floor plan + visual reference.',               '2026-08-01', 'not_started', 30),
  ('5500a000-0000-0000-0000-000000000002'::uuid, 'Approve event website listing',         'Sponsor profile copy, logo placement.',        '2026-08-10', 'not_started', 40),
  ('5500a000-0000-0000-0000-000000000002'::uuid, 'Lead capture device handover',          'Pick up scanners at registration desk.',       '2026-09-03', 'not_started', 50)
on conflict do nothing;

-- ─── ATTENDEES (Cyber First Riyadh 2026 — pre-event list, real-feeling) ────
insert into connect_attendees (event_id, full_name, job_title, company, industry, country, seniority, registered_at) values
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Khalid Al-Rashed',     'CISO',                                    'Saudi National Bank',         'BFSI',         'SA', 'c_suite', '2026-04-12 09:14:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Layla Mansour',        'VP Cybersecurity',                        'stc',                         'Telecom',      'SA', 'vp',      '2026-04-12 11:02:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Mohammed Al-Otaibi',   'Director of Information Security',        'Aramco',                      'Energy',       'SA', 'director','2026-04-13 08:40:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Reem Al-Sudairi',      'Head of Cyber Defence',                   'PIF',                         'Investment',   'SA', 'head',    '2026-04-13 16:20:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Faisal Al-Harbi',      'Group CISO',                              'SABIC',                       'Petrochem',    'SA', 'c_suite', '2026-04-14 10:05:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Hala Bouchakra',       'Head of Security Operations',             'Riyad Bank',                  'BFSI',         'SA', 'head',    '2026-04-15 12:30:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Yousef Al-Dossary',    'Director, Cyber Risk',                    'Saudi Telecom Solutions',     'Telecom',      'SA', 'director','2026-04-16 14:00:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Nora Al-Qahtani',      'VP Information Security',                 'Tadawul',                     'BFSI',         'SA', 'vp',      '2026-04-18 09:50:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Tariq Al-Mansoori',    'CIO',                                     'Riyadh Air',                  'Aviation',     'SA', 'c_suite', '2026-04-19 11:15:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Hessa Al-Otaibi',      'Head of Cloud Security',                  'NEOM',                        'Conglomerate', 'SA', 'head',    '2026-04-21 15:45:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Saud Al-Falih',        'Director of Cybersecurity Operations',    'Saudi Aramco Total Refining', 'Energy',       'SA', 'director','2026-04-22 08:30:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Manal Al-Subaie',      'VP Risk and Compliance',                  'Bank Aljazira',               'BFSI',         'SA', 'vp',      '2026-04-22 16:10:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Omar Al-Saif',         'Head of Threat Intelligence',             'Saudi Electricity Co.',       'Utilities',    'SA', 'head',    '2026-04-23 10:00:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Maha Al-Dawood',       'Director, Information Security Strategy', 'Saudi Health Ministry',       'Government',   'SA', 'director','2026-04-25 11:20:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Bandar Al-Ghamdi',     'CISO',                                    'Almarai',                     'FMCG',         'SA', 'c_suite', '2026-04-26 09:35:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Lina Al-Otaibi',       'Head of GRC',                             'Tabuk Catering',              'Hospitality',  'SA', 'head',    '2026-04-27 13:00:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Faris Al-Anzi',        'VP Information Security',                 'Banque Saudi Fransi',         'BFSI',         'SA', 'vp',      '2026-04-28 09:45:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Sara Al-Mutairi',      'Director, Cybersecurity Architecture',    'Saudi Stock Exchange',        'BFSI',         'SA', 'director','2026-04-30 11:30:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Nawaf Al-Subhi',       'Head of OT Security',                     'Maaden',                      'Mining',       'SA', 'head',    '2026-05-02 14:20:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Aisha Al-Hashimi',     'CIO',                                     'Mobily',                      'Telecom',      'SA', 'c_suite', '2026-05-04 10:15:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Khaled Al-Faisal',     'VP Cyber Operations',                     'Solutions by stc',            'Telecom',      'SA', 'vp',      '2026-05-06 16:00:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Priya Kapoor',         'Head of OT Security',                     'Reliance Industries',         'Manufacturing','IN', 'head',    '2026-05-08 09:00:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Omar Khalifa',         'CIO',                                     'Dubai Holding',               'Conglomerate', 'AE', 'c_suite', '2026-05-09 11:40:00+03'),
  ('eee00000-0000-0000-0000-000000000011'::uuid, 'Ahmed Al-Bahdoor',     'Director, Industrial Cybersecurity',      'Sembcorp Industries',         'Energy',       'OM', 'director','2026-05-09 14:30:00+03')
on conflict do nothing;

-- ─── ATTENDEES (OT Security First Doha 2026 — smaller pre-event list) ──────
insert into connect_attendees (event_id, full_name, job_title, company, industry, country, seniority, registered_at) values
  ('eee00000-0000-0000-0000-000000000013'::uuid, 'Yahya Al-Azri',        'Head of OT Security',                     'Petroleum Development Oman',  'Energy',       'OM', 'head',    '2026-04-20 09:30:00+04'),
  ('eee00000-0000-0000-0000-000000000013'::uuid, 'Nicholas Jones',       'Director, Industrial Cyber Defence',      'QatarEnergy',                 'Energy',       'QA', 'director','2026-04-22 10:15:00+04'),
  ('eee00000-0000-0000-0000-000000000013'::uuid, 'Fatima Al-Kuwari',     'VP Cybersecurity',                        'Ooredoo',                     'Telecom',      'QA', 'vp',      '2026-04-25 14:00:00+04'),
  ('eee00000-0000-0000-0000-000000000013'::uuid, 'Hamad Al-Thani',       'CIO',                                     'Qatar Airways',               'Aviation',     'QA', 'c_suite', '2026-04-28 11:20:00+04'),
  ('eee00000-0000-0000-0000-000000000013'::uuid, 'Saeed Al-Marri',       'Head of ICS Security',                    'Qafco',                       'Petrochem',    'QA', 'head',    '2026-05-02 09:45:00+04'),
  ('eee00000-0000-0000-0000-000000000013'::uuid, 'Aliya Al-Suwaidi',     'Director of Cybersecurity',               'Qatar National Bank',         'BFSI',         'QA', 'director','2026-05-05 13:10:00+04')
on conflict do nothing;

-- ─── PAST LEADS (Cyber First Dubai 2025 — Palo Alto sponsorship) ───────────
-- Insert attendees for the past event then link as leads.
do $$
declare
  past_event_id uuid := 'eee00000-0000-0000-0000-000000000001';
  past_sponsorship_id uuid := '5500a000-0000-0000-0000-000000000003';
  attendee_ids uuid[];
  inserted uuid;
begin
  -- skip if leads already seeded
  if exists (select 1 from connect_leads where sponsorship_id = past_sponsorship_id) then
    return;
  end if;

  for inserted in
    insert into connect_attendees (event_id, full_name, job_title, company, industry, country, seniority, registered_at, checked_in_at)
    values
      (past_event_id, 'Tariq Al-Mansoori',    'CIO',                                  'Emaar',                       'Real Estate',  'AE', 'c_suite',  '2025-09-15 10:00:00+04', '2025-10-22 08:45:00+04'),
      (past_event_id, 'Hessa Al-Otaibi',      'VP Cybersecurity',                     'Mashreq Bank',                'BFSI',         'AE', 'vp',       '2025-09-18 11:30:00+04', '2025-10-22 09:10:00+04'),
      (past_event_id, 'Adnan Al-Rashid',      'Head of Cyber Defence',                'Etisalat',                    'Telecom',      'AE', 'head',     '2025-09-22 09:15:00+04', '2025-10-22 09:20:00+04'),
      (past_event_id, 'Dana Shatila',         'Director of Information Security',     'Dubai Customs',               'Government',   'AE', 'director', '2025-09-25 14:00:00+04', '2025-10-22 09:30:00+04'),
      (past_event_id, 'Samer Khoury',         'CISO',                                 'Aldar Properties',            'Real Estate',  'AE', 'c_suite',  '2025-09-30 16:20:00+04', '2025-10-22 09:42:00+04'),
      (past_event_id, 'Lina Naidu',           'Head of Cloud Security',               'DEWA',                        'Utilities',    'AE', 'head',     '2025-10-02 10:30:00+04', '2025-10-22 10:05:00+04'),
      (past_event_id, 'Rana Al-Awadhi',       'VP Information Security',              'Emirates NBD',                'BFSI',         'AE', 'vp',       '2025-10-05 11:00:00+04', '2025-10-22 10:14:00+04'),
      (past_event_id, 'Ahmed Saleh',          'Director of Cybersecurity Strategy',   'ADNOC',                       'Energy',       'AE', 'director', '2025-10-08 08:50:00+04', '2025-10-22 10:30:00+04'),
      (past_event_id, 'Maya Al-Hashemi',      'CIO',                                  'Du',                          'Telecom',      'AE', 'c_suite',  '2025-10-10 13:45:00+04', '2025-10-22 10:48:00+04'),
      (past_event_id, 'Khalil Karam',         'Head of GRC',                          'Dubai Islamic Bank',          'BFSI',         'AE', 'head',     '2025-10-12 09:30:00+04', '2025-10-22 11:00:00+04'),
      (past_event_id, 'Amal Saeed',           'Director, OT Security',                'Dubai Aluminium',             'Manufacturing','AE', 'director', '2025-10-14 14:20:00+04', '2025-10-22 11:18:00+04'),
      (past_event_id, 'Bashir Al-Saadi',      'VP Cyber Operations',                  'Mubadala',                    'Investment',   'AE', 'vp',       '2025-10-15 10:00:00+04', '2025-10-22 11:35:00+04')
    returning id
  loop
    attendee_ids := array_append(attendee_ids, inserted);
  end loop;

  insert into connect_leads (sponsorship_id, attendee_id, notes, intent_level, follow_up_status, captured_at)
  select past_sponsorship_id, a, n, lvl, st, ts
  from unnest(attendee_ids,
              array['Live demo of Cortex XDR. Wants pilot in Q1.',
                    'Discussed XSIAM. Send case studies on banking sector.',
                    'Existing Prisma Access customer. Looking at Prisma SASE renewal.',
                    'Asked for Zero Trust workshop. Schedule with SE team.',
                    'Long booth conversation. Decision-maker. Hot prospect.',
                    'Brief intro. Sent collateral. Follow up post-event.',
                    'Already a customer. Discussed expansion to OT security.',
                    'Wants reference call with SABIC. Will set up next week.',
                    'Curious about AI-driven SOC. Send Cortex AI deck.',
                    'Mentioned RFP closing in 6 weeks. Need to engage urgently.',
                    'OT/IT convergence is the focus. Connected with their consultant.',
                    'Wants strategic briefing for VP. Will book Q4 call.'],
              array['hot','warm','warm','warm','hot','cold','warm','hot','warm','hot','warm','warm']::text[],
              array['contacted','pending','meeting_booked','pending','contacted','pending','meeting_booked','contacted','pending','meeting_booked','pending','pending']::text[],
              array['2025-10-22 14:30:00+04','2025-10-22 15:10:00+04','2025-10-22 15:45:00+04','2025-10-22 16:20:00+04','2025-10-23 09:30:00+04','2025-10-23 10:15:00+04','2025-10-23 11:00:00+04','2025-10-23 11:45:00+04','2025-10-23 13:30:00+04','2025-10-23 14:15:00+04','2025-10-23 15:00:00+04','2025-10-23 15:45:00+04']::timestamptz[])
  as t(a, n, lvl, st, ts);
end $$;

-- ─── INTELLIGENCE SIGNALS (Phase 2 stub — show 2 sample cards on dashboard) ─
insert into connect_intelligence_signals (organization_id, type, headline, body, payload) values
  ('22222222-0000-0000-0000-000000000001'::uuid,
    'target_account_registered',
    '3 target accounts have registered for Cyber First Riyadh',
    'Saudi National Bank, Aramco, and SABIC are confirmed attendees. All three are on your target-account watchlist.',
    '{"event_id":"eee00000-0000-0000-0000-000000000011","accounts":["Saudi National Bank","Aramco","SABIC"]}'::jsonb),
  ('22222222-0000-0000-0000-000000000001'::uuid,
    'cross_event_match',
    'OT Security First Jubail matches your ICP',
    '78% of confirmed attendees are in Energy / Petrochem — your top vertical. Sponsorship is open at Gold tier.',
    '{"event_id":"eee00000-0000-0000-0000-000000000014","match_score":0.78,"available_tier":"gold"}'::jsonb)
on conflict do nothing;

-- ─── DONE ───────────────────────────────────────────────────────────────────
