-- ============================================================================
-- EFG Connect — Sponsor Portal — Phase 1 Schema
-- ============================================================================
-- All tables prefixed with `connect_` to keep them isolated from the existing
-- marketing-site tables (speakers, posts, sponsors, etc.).
--
-- Run this in Supabase SQL Editor. Idempotent — safe to re-run.
-- ============================================================================

-- ─── EXTENSIONS ─────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── ORGANISATIONS (sponsor companies) ──────────────────────────────────────
create table if not exists connect_organizations (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  slug            text unique not null,
  logo_url        text,
  website         text,
  hubspot_id      text,
  created_at      timestamptz default now()
);

-- ─── USER PROFILES (link auth.users to organisations) ───────────────────────
create table if not exists connect_user_profiles (
  user_id         uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references connect_organizations(id) on delete cascade,
  full_name       text not null,
  job_title       text,
  role            text not null default 'member' check (role in ('owner', 'admin', 'member')),
  last_login_at   timestamptz,
  created_at      timestamptz default now()
);

create index if not exists idx_connect_user_profiles_org on connect_user_profiles(organization_id);

-- ─── SPONSOR INTERESTS (1 per org) ──────────────────────────────────────────
create table if not exists connect_sponsor_interests (
  organization_id uuid primary key references connect_organizations(id) on delete cascade,
  target_industries text[] default '{}',
  target_titles     text[] default '{}',
  target_geos       text[] default '{}',
  topics            text[] default '{}',
  target_accounts   text[] default '{}',
  competitors       text[] default '{}',
  completed_at      timestamptz,
  updated_at        timestamptz default now()
);

-- ─── EVENTS (EFG events the portal exposes) ─────────────────────────────────
create table if not exists connect_events (
  id           uuid primary key default uuid_generate_v4(),
  series       text not null check (series in ('cyber_first', 'ot_security_first', 'digital_first', 'opex_first', 'network_first')),
  name         text not null,
  city         text,
  country      text,
  start_date   date not null,
  end_date     date,
  status       text not null default 'upcoming' check (status in ('upcoming', 'active', 'completed', 'cancelled')),
  hero_image_url text,
  created_at   timestamptz default now()
);

create index if not exists idx_connect_events_status on connect_events(status, start_date);

-- ─── SPONSORSHIPS (an org's deal at one event) ──────────────────────────────
create table if not exists connect_sponsorships (
  id                    uuid primary key default uuid_generate_v4(),
  organization_id       uuid not null references connect_organizations(id) on delete cascade,
  event_id              uuid not null references connect_events(id) on delete cascade,
  tier                  text not null check (tier in ('platinum', 'gold', 'silver', 'bronze', 'associate')),
  contract_value_usd    integer,
  signed_at             date,
  status                text not null default 'confirmed' check (status in ('draft', 'confirmed', 'active', 'completed', 'cancelled')),
  primary_contact_user_id uuid references connect_user_profiles(user_id) on delete set null,
  notes                 text,
  created_at            timestamptz default now()
);

create unique index if not exists idx_connect_sponsorships_org_event on connect_sponsorships(organization_id, event_id);
create index if not exists idx_connect_sponsorships_org on connect_sponsorships(organization_id);

-- ─── DELIVERABLES (per sponsorship checklist) ───────────────────────────────
create table if not exists connect_deliverables (
  id              uuid primary key default uuid_generate_v4(),
  sponsorship_id  uuid not null references connect_sponsorships(id) on delete cascade,
  title           text not null,
  description     text,
  owner_user_id   uuid references connect_user_profiles(user_id) on delete set null,
  due_date        date,
  status          text not null default 'not_started' check (status in ('not_started', 'in_progress', 'complete', 'overdue')),
  sort_order      integer default 0,
  created_at      timestamptz default now()
);

create index if not exists idx_connect_deliverables_sponsorship on connect_deliverables(sponsorship_id, sort_order);

-- ─── ATTENDEES (event registrants) ──────────────────────────────────────────
create table if not exists connect_attendees (
  id                    uuid primary key default uuid_generate_v4(),
  event_id              uuid not null references connect_events(id) on delete cascade,
  full_name             text not null,
  job_title             text,
  company               text,
  industry              text,
  country               text,
  seniority             text check (seniority in ('c_suite', 'svp_evp', 'vp', 'director', 'head', 'manager', 'other')),
  registered_at         timestamptz default now(),
  checked_in_at         timestamptz,
  consent_share_with_sponsors boolean default true,
  approved_at           timestamptz,
  approved_by           uuid
);

create index if not exists idx_connect_attendees_event on connect_attendees(event_id);
create index if not exists idx_connect_attendees_country on connect_attendees(event_id, country);
create index if not exists idx_connect_attendees_industry on connect_attendees(event_id, industry);
create index if not exists idx_connect_attendees_approved on connect_attendees(event_id, approved_at);

-- ─── LEADS (captured at sponsor booth post-event) ───────────────────────────
create table if not exists connect_leads (
  id                  uuid primary key default uuid_generate_v4(),
  sponsorship_id      uuid not null references connect_sponsorships(id) on delete cascade,
  attendee_id         uuid references connect_attendees(id) on delete set null,
  captured_by_user_id uuid references connect_user_profiles(user_id) on delete set null,
  notes               text,
  intent_level        text check (intent_level in ('hot', 'warm', 'cold')),
  follow_up_status    text default 'pending' check (follow_up_status in ('pending', 'contacted', 'meeting_booked', 'closed_won', 'closed_lost')),
  captured_at         timestamptz default now(),
  enrichment_data     jsonb default '{}'::jsonb
);

create index if not exists idx_connect_leads_sponsorship on connect_leads(sponsorship_id);

-- ─── INTELLIGENCE SIGNALS (Phase 2 stub) ────────────────────────────────────
create table if not exists connect_intelligence_signals (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references connect_organizations(id) on delete cascade,
  type            text not null,
  headline        text not null,
  body            text,
  payload         jsonb default '{}'::jsonb,
  surfaced_at     timestamptz default now(),
  seen_at         timestamptz
);

create index if not exists idx_connect_signals_org_unseen on connect_intelligence_signals(organization_id, surfaced_at desc) where seen_at is null;

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────────────────────
alter table connect_organizations           enable row level security;
alter table connect_user_profiles           enable row level security;
alter table connect_sponsor_interests       enable row level security;
alter table connect_events                  enable row level security;
alter table connect_sponsorships            enable row level security;
alter table connect_deliverables            enable row level security;
alter table connect_attendees               enable row level security;
alter table connect_leads                   enable row level security;
alter table connect_intelligence_signals    enable row level security;

-- Helper: get the calling user's organization_id
create or replace function connect_current_org_id() returns uuid as $$
  select organization_id from connect_user_profiles where user_id = auth.uid()
$$ language sql stable security definer;

-- Helper: is the calling user an EFG admin?
-- For now, EFG admins are members of an organization with slug = 'efg-internal'.
create or replace function connect_is_efg_admin() returns boolean as $$
  select exists (
    select 1
    from connect_user_profiles p
    join connect_organizations o on o.id = p.organization_id
    where p.user_id = auth.uid() and o.slug = 'efg-internal'
  )
$$ language sql stable security definer;

-- Policies: sponsor users see only their own org's data; EFG admins see all.

drop policy if exists "org members read own org" on connect_organizations;
create policy "org members read own org" on connect_organizations for select
  using (id = connect_current_org_id() or connect_is_efg_admin());

drop policy if exists "user reads own profile + org members" on connect_user_profiles;
create policy "user reads own profile + org members" on connect_user_profiles for select
  using (organization_id = connect_current_org_id() or connect_is_efg_admin());

drop policy if exists "org reads own interests" on connect_sponsor_interests;
create policy "org reads own interests" on connect_sponsor_interests for select
  using (organization_id = connect_current_org_id() or connect_is_efg_admin());

drop policy if exists "org writes own interests" on connect_sponsor_interests;
create policy "org writes own interests" on connect_sponsor_interests for all
  using (organization_id = connect_current_org_id() or connect_is_efg_admin())
  with check (organization_id = connect_current_org_id() or connect_is_efg_admin());

drop policy if exists "anyone authenticated reads events" on connect_events;
create policy "anyone authenticated reads events" on connect_events for select
  using (auth.uid() is not null);

drop policy if exists "org reads own sponsorships" on connect_sponsorships;
create policy "org reads own sponsorships" on connect_sponsorships for select
  using (organization_id = connect_current_org_id() or connect_is_efg_admin());

drop policy if exists "org reads own deliverables" on connect_deliverables;
create policy "org reads own deliverables" on connect_deliverables for select
  using (
    sponsorship_id in (select id from connect_sponsorships where organization_id = connect_current_org_id())
    or connect_is_efg_admin()
  );

drop policy if exists "org reads own event attendees" on connect_attendees;
create policy "org reads own event attendees" on connect_attendees for select
  using (
    event_id in (
      select event_id from connect_sponsorships where organization_id = connect_current_org_id()
    )
    or connect_is_efg_admin()
  );

drop policy if exists "org reads own leads" on connect_leads;
create policy "org reads own leads" on connect_leads for select
  using (
    sponsorship_id in (select id from connect_sponsorships where organization_id = connect_current_org_id())
    or connect_is_efg_admin()
  );

drop policy if exists "org reads own signals" on connect_intelligence_signals;
create policy "org reads own signals" on connect_intelligence_signals for select
  using (organization_id = connect_current_org_id() or connect_is_efg_admin());

-- ─── DONE ───────────────────────────────────────────────────────────────────
-- Next: run connect-seed.sql
