-- ═══════════════════════════════════════════════════════════════
-- FORM SUBMISSIONS TABLE
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  type TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  job_title TEXT NOT NULL DEFAULT '',
  phone TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  source_url TEXT,
  source_category TEXT,
  event_name TEXT
);

-- Index for filtering by type (Excel Power Query, dashboard queries)
CREATE INDEX idx_form_type ON form_submissions(type);
CREATE INDEX idx_form_created ON form_submissions(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT (public form submissions from the website)
CREATE POLICY "Allow anonymous inserts" ON form_submissions
  FOR INSERT TO anon WITH CHECK (true);

-- Only service role can SELECT/UPDATE/DELETE (admin access via API route)
-- No policy needed — service role bypasses RLS by default

-- ═══════════════════════════════════════════════════════════════
-- VIEWS (for Excel Power Query — one per form type)
-- ═══════════════════════════════════════════════════════════════

-- NOTE: If views already exist, run DROP VIEW first:
-- DROP VIEW IF EXISTS v_sponsors, v_attendees, v_speakers, v_contacts, v_awards, v_networkfirst;

CREATE OR REPLACE VIEW v_sponsors AS
  SELECT id, created_at, full_name, email, company, job_title, phone,
         metadata->>'event_interest' AS event_interest,
         metadata->>'partnership_tier' AS partnership_tier,
         metadata->>'message' AS message,
         source_url, source_category, event_name
  FROM form_submissions WHERE type = 'sponsor'
  ORDER BY created_at DESC;

CREATE OR REPLACE VIEW v_attendees AS
  SELECT id, created_at, full_name, email, company, job_title, phone,
         metadata->>'preferred_event' AS preferred_event,
         metadata->>'industry' AS industry,
         source_url, source_category, event_name
  FROM form_submissions WHERE type = 'attend'
  ORDER BY created_at DESC;

CREATE OR REPLACE VIEW v_speakers AS
  SELECT id, created_at, full_name, email, company, job_title, phone,
         metadata->>'proposed_topic' AS proposed_topic,
         metadata->>'bio' AS bio,
         source_url, source_category, event_name
  FROM form_submissions WHERE type = 'speak'
  ORDER BY created_at DESC;

CREATE OR REPLACE VIEW v_contacts AS
  SELECT id, created_at, full_name, email, company, job_title,
         metadata->>'inquiry_type' AS inquiry_type,
         metadata->>'message' AS message,
         source_url, source_category
  FROM form_submissions WHERE type = 'contact'
  ORDER BY created_at DESC;

CREATE OR REPLACE VIEW v_awards AS
  SELECT id, created_at, full_name, email, company, job_title, phone,
         metadata->>'award_category' AS award_category,
         metadata->>'message' AS message,
         source_url, source_category, event_name
  FROM form_submissions WHERE type = 'awards'
  ORDER BY created_at DESC;

CREATE OR REPLACE VIEW v_networkfirst AS
  SELECT id, created_at, full_name, email, company, job_title, phone,
         metadata->>'boardroom_type' AS boardroom_type,
         metadata->>'country' AS country,
         metadata->>'message' AS message,
         source_url, source_category
  FROM form_submissions WHERE type = 'networkfirst'
  ORDER BY created_at DESC;

-- ═══════════════════════════════════════════════════════════════
-- DONE! Now go to Authentication → Policies to verify RLS is on.
-- ═══════════════════════════════════════════════════════════════
