-- EFG Speakers & Sponsors Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TABLE: series
-- =============================================================================
CREATE TABLE IF NOT EXISTS series (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  color TEXT,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- TABLE: speakers
-- =============================================================================
CREATE TABLE IF NOT EXISTS speakers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  organization TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  email TEXT,
  country TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- TABLE: speaker_series (many-to-many)
-- =============================================================================
CREATE TABLE IF NOT EXISTS speaker_series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  speaker_id UUID NOT NULL REFERENCES speakers(id) ON DELETE CASCADE,
  series_slug TEXT NOT NULL CHECK (series_slug IN ('cyber-first', 'ot-security-first', 'data-ai-first', 'opex-first')),
  role TEXT DEFAULT 'speaker' CHECK (role IN ('speaker', 'advisor', 'panelist', 'workshop_lead', 'keynote', 'moderator', 'chair')),
  edition_city TEXT,
  edition_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(speaker_id, series_slug, edition_city, edition_year)
);

-- =============================================================================
-- TABLE: sponsors
-- =============================================================================
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('platinum', 'gold', 'lead', 'associate', 'strategic', 'consulting', 'knowledge', 'community', 'media', 'supporting', 'networking', 'patronage')),
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- TABLE: sponsor_series (many-to-many)
-- =============================================================================
CREATE TABLE IF NOT EXISTS sponsor_series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sponsor_id UUID NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  series_slug TEXT NOT NULL CHECK (series_slug IN ('cyber-first', 'ot-security-first', 'data-ai-first', 'opex-first')),
  tier_override TEXT,
  edition_city TEXT,
  edition_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sponsor_id, series_slug, edition_city, edition_year)
);

-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_speaker_series_slug ON speaker_series(series_slug, edition_year);
CREATE INDEX IF NOT EXISTS idx_sponsor_series_slug ON sponsor_series(series_slug, edition_year);
CREATE INDEX IF NOT EXISTS idx_speakers_status ON speakers(status, is_featured);
CREATE INDEX IF NOT EXISTS idx_sponsors_status ON sponsors(status, tier);

-- =============================================================================
-- TRIGGERS: Auto-update updated_at
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER speakers_updated_at
  BEFORE UPDATE ON speakers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER sponsors_updated_at
  BEFORE UPDATE ON sponsors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER series_updated_at
  BEFORE UPDATE ON series
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaker_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;

-- Public read policies (for website)
CREATE POLICY "Public can read active speakers" ON speakers
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can read active sponsors" ON sponsors
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can read speaker_series" ON speaker_series
  FOR SELECT USING (true);

CREATE POLICY "Public can read sponsor_series" ON sponsor_series
  FOR SELECT USING (true);

CREATE POLICY "Public can read series" ON series
  FOR SELECT USING (status = 'active');

-- Admin policies (using service role key bypasses RLS)
-- These are for authenticated admin users
CREATE POLICY "Admins can manage speakers" ON speakers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage sponsors" ON sponsors
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage speaker_series" ON speaker_series
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage sponsor_series" ON sponsor_series
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage series" ON series
  FOR ALL USING (auth.role() = 'authenticated');

-- =============================================================================
-- SEED: Series data
-- =============================================================================
INSERT INTO series (slug, name, tagline, color, description, status) VALUES
  ('cyber-first', 'Cyber First', 'Defending the Digital Frontier', '#01BBF5', 'Where the region''s CISOs, security architects, and cyber leaders gather to shape the future of enterprise defense.', 'active'),
  ('ot-security-first', 'OT Security First', 'Protecting What Runs the World', '#D34B9A', 'The MENA region''s only dedicated summit for operational technology security in energy and utilities.', 'active'),
  ('data-ai-first', 'Data & AI First', 'Intelligence Amplified', '#7C3AED', 'A summit series for the leaders building AI-driven organizations across the Gulf.', 'active'),
  ('opex-first', 'Opex First', 'Where Efficiency Meets Excellence', '#0F735E', 'The GCC''s dedicated summit series for operational excellence, business transformation, and process innovation.', 'active')
ON CONFLICT (slug) DO NOTHING;
