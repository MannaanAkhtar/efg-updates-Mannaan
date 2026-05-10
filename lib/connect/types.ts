// EFG Connect — TypeScript types matching connect-schema.sql

export type Series =
  | "cyber_first"
  | "ot_security_first"
  | "digital_first"
  | "opex_first"
  | "network_first";

export type SponsorshipStatus = "draft" | "confirmed" | "active" | "completed" | "cancelled";
export type EventStatus = "upcoming" | "active" | "completed" | "cancelled";
export type Tier = "platinum" | "gold" | "silver" | "bronze" | "associate";
export type DeliverableStatus = "not_started" | "in_progress" | "complete" | "overdue";
export type Seniority = "c_suite" | "svp_evp" | "vp" | "director" | "head" | "manager" | "other";
export type IntentLevel = "hot" | "warm" | "cold";
export type FollowUpStatus = "pending" | "contacted" | "meeting_booked" | "closed_won" | "closed_lost";
export type Role = "owner" | "admin" | "member";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website: string | null;
  hubspot_id: string | null;
  created_at: string;
}

export interface UserProfile {
  user_id: string;
  organization_id: string;
  full_name: string;
  job_title: string | null;
  role: Role;
  last_login_at: string | null;
  created_at: string;
}

export interface SponsorInterests {
  organization_id: string;
  target_industries: string[];
  target_titles: string[];
  target_geos: string[];
  topics: string[];
  target_accounts: string[];
  competitors: string[];
  completed_at: string | null;
  updated_at: string;
}

export interface ConnectEvent {
  id: string;
  series: Series;
  name: string;
  city: string | null;
  country: string | null;
  start_date: string;
  end_date: string | null;
  status: EventStatus;
  hero_image_url: string | null;
  created_at: string;
}

export interface Sponsorship {
  id: string;
  organization_id: string;
  event_id: string;
  tier: Tier;
  contract_value_usd: number | null;
  signed_at: string | null;
  status: SponsorshipStatus;
  primary_contact_user_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface Deliverable {
  id: string;
  sponsorship_id: string;
  title: string;
  description: string | null;
  owner_user_id: string | null;
  due_date: string | null;
  status: DeliverableStatus;
  sort_order: number;
  created_at: string;
}

export interface Attendee {
  id: string;
  event_id: string;
  full_name: string;
  job_title: string | null;
  company: string | null;
  industry: string | null;
  country: string | null;
  seniority: Seniority | null;
  registered_at: string;
  checked_in_at: string | null;
  consent_share_with_sponsors: boolean;
}

export interface Lead {
  id: string;
  sponsorship_id: string;
  attendee_id: string | null;
  captured_by_user_id: string | null;
  notes: string | null;
  intent_level: IntentLevel | null;
  follow_up_status: FollowUpStatus;
  captured_at: string;
  enrichment_data: Record<string, unknown>;
}

export interface IntelligenceSignal {
  id: string;
  organization_id: string;
  type: string;
  headline: string;
  body: string | null;
  payload: Record<string, unknown>;
  surfaced_at: string;
  seen_at: string | null;
}

// Composite types used by the UI
export interface SponsorshipWithEvent extends Sponsorship {
  event: ConnectEvent;
}

export interface SponsorshipWithEventAndDeliverables extends SponsorshipWithEvent {
  deliverables: Deliverable[];
}

export interface LeadWithAttendee extends Lead {
  attendee: Attendee | null;
}

// Display helpers
export const SERIES_LABEL: Record<Series, string> = {
  cyber_first: "Cyber First",
  ot_security_first: "OT Security First",
  digital_first: "Digital First",
  opex_first: "OPEX First",
  network_first: "NetworkFirst",
};

export const SERIES_COLOR: Record<Series, string> = {
  cyber_first: "var(--cyber-first)",
  ot_security_first: "var(--ot-first)",
  digital_first: "var(--digital-ai)",
  opex_first: "var(--cloud-first)",
  network_first: "var(--orange)",
};

export const TIER_LABEL: Record<Tier, string> = {
  platinum: "Platinum",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
  associate: "Associate",
};

export const SENIORITY_LABEL: Record<Seniority, string> = {
  c_suite: "C-suite",
  svp_evp: "SVP / EVP",
  vp: "VP",
  director: "Director",
  head: "Head",
  manager: "Manager",
  other: "Other",
};
