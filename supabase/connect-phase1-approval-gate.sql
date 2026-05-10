-- ────────────────────────────────────────────────────────────────────────────
-- Connect Phase 1 — approval gate for attendee visibility
--
-- Adds approved_at / approved_by to connect_attendees so admin (EFG ops) can
-- vet form-submission registrations before they are exposed to sponsors.
--
-- Sponsor-facing queries (lib/connect/server.ts::listEventAttendees) gate on
-- approved_at IS NOT NULL. Run this BEFORE the next code deploy or sponsors
-- will see empty lists.
-- ────────────────────────────────────────────────────────────────────────────

alter table connect_attendees
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid;

create index if not exists idx_connect_attendees_approved
  on connect_attendees(event_id, approved_at);

-- Backfill: the 57 OT VB MENA attendees were already vetted by Ateeq
-- (16 seeded speakers + 41 real form_submissions with consent). Marking
-- them approved keeps the pilot demo intact while the gate is enforced
-- on every future ingestion.
update connect_attendees
set approved_at = now()
where event_id = 'eee00000-0000-0000-0000-000000000001'::uuid
  and approved_at is null;
