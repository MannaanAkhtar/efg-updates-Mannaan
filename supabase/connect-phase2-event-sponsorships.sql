-- ────────────────────────────────────────────────────────────────────────────
-- Connect Phase 2 — real sponsor data for every event
--
-- Sources: each event TSX file under app/events/*/page.tsx encodes its public
-- sponsor list as a typed const (OTVB_SPONSORS_2026, CFK_SPONSORS_2026,
-- SPONSORS, SPONSORS_PLATINUM, etc.). Extracted via repo scan and normalised
-- here into connect_organizations + connect_sponsorships.
--
-- Policy (per Ateeq): only ingest sponsors that are EXPLICITLY listed with a
-- sponsor title on the event page (e.g. OT VB MENA's OTVB_SPONSORS_2026,
-- Process Intelligence's SPONSORS_PLATINUM). MARQUEE / "Our Partners" rows
-- are historical or series-wide — they're NOT edition sponsorships and are
-- skipped. "Past Series Sponsors" blocks (e.g. OPEX Saudi 2026) are also
-- skipped.
--
-- Tier normalisation (across the three different vocabularies):
--   platinum            → platinum
--   gold / strategic    → gold
--   supporting / panel  → supporting
--   media / associate   → supporting
--   specialized         → supporting
--   (no tier)           → supporting
--
-- Idempotent. Uses ON CONFLICT DO NOTHING. Safe to re-run.
-- ────────────────────────────────────────────────────────────────────────────

-- ─── 1. ORGANISATIONS ─────────────────────────────────────────────────────
-- 73 new sponsoring organisations (the 7 OT VB MENA partners and EFG Internal
-- are already seeded, so they're not in this list). Uses uuid_generate_v4()
-- because manually-numbered UUIDs at this volume add no value.

insert into connect_organizations (name, slug, logo_url, website) values
  ('Palo Alto Networks',                     'palo-alto-networks',               'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/paloalto.png',                    null),
  ('SentinelOne',                            'sentinelone',                      'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/sentinelone.png',                 null),
  ('Google Cloud Security',                  'google-cloud-security',            'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Google-Cloud-Security.png',      null),
  ('Kaspersky',                              'kaspersky',                        'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/kaspersky.png',                   null),
  ('Akamai',                                 'akamai',                           'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Akamai.png',                      null),
  ('Secureworks',                            'secureworks',                      'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/secureworks.png',                 null),
  ('Hackmanac',                              'hackmanac',                        null,                                                                                          null),
  ('ThreatLocker',                           'threatlocker',                     'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/threatlocker.png',                null),
  ('Sechard',                                'sechard',                          'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/sechard.png',                     null),
  ('Cyber Shield',                           'cyber-shield',                     'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/cyber-shield.png',                null),
  ('Wallix',                                 'wallix',                           'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/wallix.png',                      null),
  ('GBM',                                    'gbm',                              'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/gbm.png',                         null),
  ('Acronis',                                'acronis',                          'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/acronis.png',                     null),
  ('Bitdefender',                            'bitdefender',                      'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/bitdefender.png',                 null),
  ('Sahara Net',                             'sahara-net',                       'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/sahara-net.png',                  null),
  ('Deepinfo',                               'deepinfo',                         'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Deepinfo.png',                    null),
  ('Gorilla Technology',                     'gorilla-technology',               'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Gorilla.png',                     null),
  ('Cyber Talents',                          'cyber-talents',                    'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/cyber-talents.png',               null),
  ('GTB Technologies',                       'gtb-technologies',                 'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/gtb-technologies.png',            null),
  ('Kuwait College of Science & Technology', 'kuwait-college-science-technology',null,                                                                                          null),
  ('Arab Open University',                   'arab-open-university',             null,                                                                                          null),
  ('German Business Council Kuwait',         'german-business-council-kuwait',   null,                                                                                          null),
  ('ISACA UAE Chapter',                      'isaca-uae-chapter',                null,                                                                                          null),
  ('NC4',                                    'nc4',                              'https://efg-final.s3.eu-north-1.amazonaws.com/cyber-first-kenya/NC4+Logo.jpeg',               null),
  ('CA',                                     'ca',                               'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/CA+Logo.png',                     null),
  ('ManageEngine',                           'manageengine',                     'https://efg-final.s3.eu-north-1.amazonaws.com/logos/ManageEngine.png',                        'https://www.manageengine.com/'),
  ('INUA AI',                                'inua-ai',                          'https://efg-final.s3.eu-north-1.amazonaws.com/logos/INUA+AI+LOGO+3+white.png',                'https://inuaai.com/'),
  ('QuantumSynapse',                         'quantumsynapse',                   'https://efg-final.s3.eu-north-1.amazonaws.com/logos/QuantumSynapse-1.png',                    'https://quantumsynapse.ai/'),
  ('Cryptoken Media',                        'cryptoken-media',                  'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/cryptoken_media.png',             'https://cryptoken.media/'),
  ('TEX Afrika Media',                       'tex-afrika-media',                 'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/tex_afrika_media.png',            'https://www.texafrica.com/'),
  ('CCA',                                    'cca',                              'https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/support+partner+/CCA.png', null),
  ('Coder Flow AI',                          'coder-flow-ai',                    'https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/support+partner+/coder_flowAI.png', null),
  ('Crime Free Bharat',                      'crime-free-bharat',                'https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/support+partner+/Crime_free_bharat-removebg-preview.png', null),
  ('Cyber World',                            'cyber-world',                      'https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/support+partner+/Cyber_world.png', null),
  ('Cyber Security Council',                 'cyber-security-council',           'https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/support+partner+/cybersecuritycouncil.png', null),
  ('RICS',                                   'rics',                             'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/RICS.png',                        null),
  ('IQS',                                    'iqs',                              'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/AIQS.png',                        null),
  ('Celonis',                                'celonis',                          'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Celonis.png',                     null),
  ('Profit.co',                              'profit-co',                        'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/profit.co.png',                   null),
  ('BotTeq',                                 'botteq',                           'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/BOT-teq.png',                     null),
  ('RE/SAND',                                're-sand',                          'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/redsand.png',                     null),
  ('ARIS',                                   'aris',                             'https://efg-final.s3.eu-north-1.amazonaws.com/logos/ARIS-logo-crppd.svg',                     'https://www.ariscommunity.com/'),
  ('SAP Signavio',                           'sap-signavio',                     'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/sap-signavio.png',                null),
  ('Kafaa',                                  'kafaa',                            'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/KAfaa.png',                       null),
  ('Minds Advisory',                         'minds-advisory',                   'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/minds-advisory.png',              null),
  ('Agile Consulting',                       'agile-consulting',                 'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/agile.png',                       null),
  ('ISRAR',                                  'israr',                            'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/ISRAR.png',                       null),
  ('Moxo',                                   'moxo',                             'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/moxo.png',                        null),
  ('SS&C Blue Prism',                        'ss-c-blue-prism',                  'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/SS%26C.png',                      null),
  ('Abu Dhabi University',                   'abu-dhabi-university',             'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/abu-dhabi-university.png',        null),
  ('EY',                                     'ey',                               'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/EY.png',                          null),
  ('ADGM Academy',                           'adgm-academy',                     'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/adgm-academy.png',                null),
  ('AmiViz',                                 'amiviz',                           'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/AmiViz.png',                      null),
  ('Claroty',                                'claroty',                          'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Claroty.png',                     null),
  ('CPX',                                    'cpx',                              'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/CPX.png',                         null),
  ('Dragos',                                 'dragos',                           'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Dragos.png',                      null),
  ('Fortinet',                               'fortinet',                         'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/fortinet.png',                    null),
  ('Group-IB',                               'group-ib',                         'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Group-IB.png',                    null),
  ('SonicWall',                              'sonicwall',                        'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Sonicwall.png',                   null),
  ('Anomali',                                'anomali',                          'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Anomali.png',                     null),
  ('Beacon Red',                             'beacon-red',                       'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/beacon-red.png',                  null),
  ('Cerebra',                                'cerebra',                          'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/CEREBRA.png',                     null),
  ('Corelight',                              'corelight',                        'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/corelight.png',                   null),
  ('CyberKnight',                            'cyberknight',                      'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/cyberknight.png',                 null),
  ('DTS Solutions',                          'dts-solutions',                    'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/DTS-solutions.png',               null),
  ('EC-Council',                             'ec-council',                       'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/EC-Council.png',                  null),
  ('GAFAI',                                  'gafai',                            'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/GAFAI.png',                       null),
  ('Keysight Technologies',                  'keysight-technologies',            'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/keysight-technologies.png',       null),
  ('OPSWAT',                                 'opswat',                           'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/OPSWAT-logo.png',                 null),
  ('Pentera',                                'pentera',                          'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/PENTERA.png',                     null),
  ('Securonix',                              'securonix',                        'https://efg-final.s3.eu-north-1.amazonaws.com/logos/securonix.jpg',                           null),
  ('Tenable',                                'tenable',                          'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Tenable-logo.png',                null),
  ('Xage',                                   'xage',                             'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Xage.png',                        null),
  ('Yokogawa',                               'yokogawa',                         'https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/YOKOGAWA.png',                    null)
on conflict (slug) do nothing;

-- ─── 2. SPONSORSHIPS ──────────────────────────────────────────────────────
-- Maps each (org, event) pair to a tier. Uses a CTE so we can reference orgs
-- by slug instead of pasting their UUIDs. ON CONFLICT relies on the existing
-- unique index idx_connect_sponsorships_org_event(organization_id, event_id).
--
-- contract_value_usd is null for now — admin will fill these in via the
-- Phase 3 UI as part of vetting each sponsor. status='active' because every
-- entry below comes from a public event page (i.e. the sponsorship is signed).

with sponsorship_data (org_slug, event_id, tier) as (values
  -- ── cyber-first/kuwait-2026 ────────────────────────────────────────────
  ('palo-alto-networks',              'eee00000-0000-0000-0000-000000000003'::uuid, 'gold'),
  ('sentinelone',                     'eee00000-0000-0000-0000-000000000003'::uuid, 'gold'),
  ('google-cloud-security',           'eee00000-0000-0000-0000-000000000003'::uuid, 'gold'),
  ('kaspersky',                       'eee00000-0000-0000-0000-000000000003'::uuid, 'gold'),
  ('akamai',                          'eee00000-0000-0000-0000-000000000003'::uuid, 'supporting'),
  ('secureworks',                     'eee00000-0000-0000-0000-000000000003'::uuid, 'supporting'),
  ('hackmanac',                       'eee00000-0000-0000-0000-000000000003'::uuid, 'supporting'),
  ('threatlocker',                    'eee00000-0000-0000-0000-000000000003'::uuid, 'supporting'),
  ('sechard',                         'eee00000-0000-0000-0000-000000000003'::uuid, 'gold'),
  ('cyber-shield',                    'eee00000-0000-0000-0000-000000000003'::uuid, 'gold'),
  ('wallix',                          'eee00000-0000-0000-0000-000000000003'::uuid, 'gold'),
  ('gbm',                             'eee00000-0000-0000-0000-000000000003'::uuid, 'gold'),
  ('acronis',                         'eee00000-0000-0000-0000-000000000003'::uuid, 'gold'),
  ('bitdefender',                     'eee00000-0000-0000-0000-000000000003'::uuid, 'gold'),
  ('sahara-net',                      'eee00000-0000-0000-0000-000000000003'::uuid, 'gold'),
  ('deepinfo',                        'eee00000-0000-0000-0000-000000000003'::uuid, 'gold'),
  ('gorilla-technology',              'eee00000-0000-0000-0000-000000000003'::uuid, 'supporting'),
  ('cyber-talents',                   'eee00000-0000-0000-0000-000000000003'::uuid, 'supporting'),
  ('gtb-technologies',                'eee00000-0000-0000-0000-000000000003'::uuid, 'supporting'),
  ('kuwait-college-science-technology','eee00000-0000-0000-0000-000000000003'::uuid,'supporting'),
  ('arab-open-university',            'eee00000-0000-0000-0000-000000000003'::uuid, 'supporting'),
  ('german-business-council-kuwait',  'eee00000-0000-0000-0000-000000000003'::uuid, 'supporting'),
  ('isaca-uae-chapter',               'eee00000-0000-0000-0000-000000000003'::uuid, 'supporting'),

  -- ── cyber-first/kenya-2026 ─────────────────────────────────────────────
  ('nc4',                             'eee00000-0000-0000-0000-000000000005'::uuid, 'supporting'),
  ('ca',                              'eee00000-0000-0000-0000-000000000005'::uuid, 'supporting'),
  ('manageengine',                    'eee00000-0000-0000-0000-000000000005'::uuid, 'gold'),
  ('inua-ai',                         'eee00000-0000-0000-0000-000000000005'::uuid, 'supporting'),
  ('quantumsynapse',                  'eee00000-0000-0000-0000-000000000005'::uuid, 'supporting'),
  ('cryptoken-media',                 'eee00000-0000-0000-0000-000000000005'::uuid, 'supporting'),
  ('tex-afrika-media',                'eee00000-0000-0000-0000-000000000005'::uuid, 'supporting'),

  -- ── cyber-first/india-2026 ─────────────────────────────────────────────
  ('cca',                             'eee00000-0000-0000-0000-000000000011'::uuid, 'supporting'),
  ('coder-flow-ai',                   'eee00000-0000-0000-0000-000000000011'::uuid, 'supporting'),
  ('crime-free-bharat',               'eee00000-0000-0000-0000-000000000011'::uuid, 'supporting'),
  ('cyber-world',                     'eee00000-0000-0000-0000-000000000011'::uuid, 'supporting'),
  ('cyber-security-council',          'eee00000-0000-0000-0000-000000000011'::uuid, 'supporting'),

  -- ── opex-first/process-intelligence (PILOT EVENT for ARIS) ────────────
  -- SPONSORS_PLATINUM array — explicit Platinum sponsor block.
  ('aris',                            'eee00000-0000-0000-0000-000000000002'::uuid, 'platinum')

  -- NOTE: OPEX Saudi 2026 and Digital First Kuwait 2026 are intentionally
  -- omitted. OPEX Saudi's array is labelled "Past Series Sponsors" — not
  -- current edition sponsorships. Digital First Kuwait's "Our Partners"
  -- marquee rows are series-wide affiliates, not edition sponsors.
  -- Per Ateeq: only ingest sponsors that the page explicitly titles as
  -- sponsors with a tier (like OT VB MENA and Process Intelligence do).
)
insert into connect_sponsorships (organization_id, event_id, tier, status)
select o.id, sd.event_id, sd.tier, 'active'
from sponsorship_data sd
join connect_organizations o on o.slug = sd.org_slug
on conflict (organization_id, event_id) do nothing;
