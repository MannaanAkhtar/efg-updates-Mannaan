-- ═══════════════════════════════════════════════════════════════
-- EFG NETWORKING MATCHMAKER - DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════
-- PROFILES TABLE
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  industry TEXT,
  role_type TEXT,
  company_size TEXT,
  phone TEXT,
  linkedin_url TEXT,
  photo_url TEXT,
  bio TEXT,
  interests TEXT[] DEFAULT '{}',
  looking_for TEXT[] DEFAULT '{}',
  open_to_sponsors BOOLEAN DEFAULT true,
  is_sponsor BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  profile_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_industry ON profiles(industry);
CREATE INDEX idx_profiles_is_sponsor ON profiles(is_sponsor);

-- ═══════════════════════════════════════════════════════════════
-- EVENTS TABLE
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  series TEXT, -- 'Cyber First', 'Data & AI First', etc.
  date DATE NOT NULL,
  end_date DATE,
  location TEXT NOT NULL,
  venue TEXT,
  description TEXT,
  banner_url TEXT,
  is_active BOOLEAN DEFAULT true,
  registration_open BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- EVENT REGISTRATIONS TABLE
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE event_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'attended', 'cancelled')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, profile_id)
);

CREATE INDEX idx_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_registrations_profile ON event_registrations(profile_id);

-- ═══════════════════════════════════════════════════════════════
-- SPONSORS TABLE
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE sponsors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  tier TEXT DEFAULT 'standard' CHECK (tier IN ('standard', 'silver', 'gold', 'platinum')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- SPONSOR USERS (link profiles to sponsors)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE sponsor_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sponsor_id, profile_id)
);

-- ═══════════════════════════════════════════════════════════════
-- EVENT SPONSORS (which sponsors are at which events)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE event_sponsors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE NOT NULL,
  tier TEXT DEFAULT 'standard',
  booth_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, sponsor_id)
);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_sponsors ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles (for matching), but only edit their own
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Events: Everyone can view active events
CREATE POLICY "Active events are viewable by everyone" ON events
  FOR SELECT USING (is_active = true);

-- Registrations: Users can view their own, sponsors can view for their events
CREATE POLICY "Users can view own registrations" ON event_registrations
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create own registrations" ON event_registrations
  FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Sponsors: Viewable by all authenticated users
CREATE POLICY "Sponsors are viewable by authenticated users" ON sponsors
  FOR SELECT USING (auth.role() = 'authenticated');

-- Sponsor users: Can view if member
CREATE POLICY "Sponsor users can view own sponsor" ON sponsor_users
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Event sponsors: Viewable by all
CREATE POLICY "Event sponsors are viewable by all" ON event_sponsors
  FOR SELECT USING (true);

-- ═══════════════════════════════════════════════════════════════
-- FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA - First Event
-- ═══════════════════════════════════════════════════════════════

INSERT INTO events (name, slug, series, date, location, venue, description, is_active, registration_open)
VALUES (
  'Cyber First Kuwait 2026',
  'cyber-first-kuwait-2026',
  'Cyber First',
  '2026-04-21',
  'Kuwait City, Kuwait',
  'Jumeirah Messilah Beach Hotel',
  'The premier cybersecurity summit for Kuwait''s technology leaders.',
  true,
  true
);

-- ═══════════════════════════════════════════════════════════════
-- DONE!
-- ═══════════════════════════════════════════════════════════════
