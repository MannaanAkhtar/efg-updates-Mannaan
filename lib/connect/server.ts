// EFG Connect — server-side Supabase helpers
// Uses @supabase/ssr cookie-aware client so RLS sees the logged-in user.

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type {
  Organization,
  UserProfile,
  SponsorInterests,
  ConnectEvent,
  Sponsorship,
  Deliverable,
  Attendee,
  Lead,
  IntelligenceSignal,
  SponsorshipWithEvent,
  SponsorshipWithEventAndDeliverables,
} from "./types";

// ─── CLIENT FACTORIES ───────────────────────────────────────────────────────

export async function createConnectServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Components cannot set cookies; safe to ignore.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            /* same */
          }
        },
      },
    },
  );
}

// Service-role client for admin actions only (creating users, seeding profiles).
// NEVER expose this to the browser.
export function createConnectAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ─── AUTH GUARDS ────────────────────────────────────────────────────────────

export async function requireConnectSession() {
  const supabase = await createConnectServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    redirect("/connect/login");
  }
  return { supabase, user: data.user };
}

export async function getConnectSession() {
  const supabase = await createConnectServerClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}

// ─── CONTEXT FOR THE CURRENT SPONSOR USER ───────────────────────────────────

export interface ConnectContext {
  user: { id: string; email: string };
  profile: UserProfile;
  organization: Organization;
  interests: SponsorInterests | null;
}

export async function loadConnectContext(): Promise<ConnectContext> {
  const { supabase, user } = await requireConnectSession();

  const { data: profile, error: profileErr } = await supabase
    .from("connect_user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileErr || !profile) {
    // Profile missing — can happen if the auth user exists but seed didn't.
    // Send to login; the demo-login flow re-creates profiles.
    redirect("/connect/login?error=profile_missing");
  }

  const { data: organization, error: orgErr } = await supabase
    .from("connect_organizations")
    .select("*")
    .eq("id", profile.organization_id)
    .single();

  if (orgErr || !organization) {
    redirect("/connect/login?error=org_missing");
  }

  const { data: interests } = await supabase
    .from("connect_sponsor_interests")
    .select("*")
    .eq("organization_id", profile.organization_id)
    .maybeSingle();

  return {
    user: { id: user.id, email: user.email ?? "" },
    profile: profile as UserProfile,
    organization: organization as Organization,
    interests: (interests as SponsorInterests | null) ?? null,
  };
}

// ─── DATA FETCHERS ──────────────────────────────────────────────────────────

export async function listOrgSponsorships(orgId: string): Promise<SponsorshipWithEvent[]> {
  const supabase = await createConnectServerClient();
  const { data, error } = await supabase
    .from("connect_sponsorships")
    .select("*, event:connect_events(*)")
    .eq("organization_id", orgId)
    .order("signed_at", { ascending: false });
  if (error) {
    console.error("listOrgSponsorships error:", error);
    return [];
  }
  return (data ?? []) as unknown as SponsorshipWithEvent[];
}

export async function getSponsorshipDetail(
  sponsorshipId: string,
  orgId: string,
): Promise<SponsorshipWithEventAndDeliverables | null> {
  const supabase = await createConnectServerClient();
  const { data, error } = await supabase
    .from("connect_sponsorships")
    .select("*, event:connect_events(*), deliverables:connect_deliverables(*)")
    .eq("id", sponsorshipId)
    .eq("organization_id", orgId)
    .single();
  if (error || !data) {
    return null;
  }
  // Sort deliverables by sort_order for stable display.
  const sponsorship = data as unknown as SponsorshipWithEventAndDeliverables;
  sponsorship.deliverables = [...(sponsorship.deliverables ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  return sponsorship;
}

// Sponsor-facing: only returns attendees the admin has explicitly approved
// for sponsor visibility. Admin-side queries should use a separate helper.
export async function listEventAttendees(eventId: string): Promise<Attendee[]> {
  const supabase = await createConnectServerClient();
  const { data, error } = await supabase
    .from("connect_attendees")
    .select("*")
    .eq("event_id", eventId)
    .eq("consent_share_with_sponsors", true)
    .not("approved_at", "is", null)
    .order("registered_at", { ascending: false });
  if (error) {
    console.error("listEventAttendees error:", error);
    return [];
  }
  return (data ?? []) as Attendee[];
}

export async function listSponsorshipLeads(
  sponsorshipId: string,
): Promise<Array<Lead & { attendee: Attendee | null }>> {
  const supabase = await createConnectServerClient();
  const { data, error } = await supabase
    .from("connect_leads")
    .select("*, attendee:connect_attendees(*)")
    .eq("sponsorship_id", sponsorshipId)
    .order("captured_at", { ascending: false });
  if (error) {
    console.error("listSponsorshipLeads error:", error);
    return [];
  }
  return (data ?? []) as unknown as Array<Lead & { attendee: Attendee | null }>;
}

export async function listOrgSignals(orgId: string): Promise<IntelligenceSignal[]> {
  const supabase = await createConnectServerClient();
  const { data, error } = await supabase
    .from("connect_intelligence_signals")
    .select("*")
    .eq("organization_id", orgId)
    .order("surfaced_at", { ascending: false })
    .limit(5);
  if (error) {
    console.error("listOrgSignals error:", error);
    return [];
  }
  return (data ?? []) as IntelligenceSignal[];
}

// ─── DEMO LOGIN HELPER ──────────────────────────────────────────────────────
// Ensures the demo user (Sara Al-Qahtani / Palo Alto MENA) exists in auth.users
// and has a matching connect_user_profile row.

export const DEMO_USER_EMAIL = "demo.sara@efgconnect.local";
export const DEMO_USER_PASSWORD =
  process.env.CONNECT_DEMO_PASSWORD ?? "EFGConnect2026!";
// Darktrace MEA — real Gold sponsor of OT Security First Virtual Boardroom MENA.
const DEMO_ORG_ID = "22222222-0000-0000-0000-000000000003";

export async function ensureDemoUser(): Promise<{ email: string; password: string }> {
  const admin = createConnectAdminClient();

  // 1. Find or create the auth user.
  const { data: list } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  let userId =
    list?.users?.find((u) => u.email?.toLowerCase() === DEMO_USER_EMAIL)?.id ?? null;

  if (!userId) {
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: DEMO_USER_EMAIL,
      password: DEMO_USER_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: "Sara Al-Qahtani",
        demo: true,
      },
    });
    // Variable rebound so the rest of the function works against the new user.
    void created;
    if (createErr || !created.user) {
      throw new Error(`Failed to create demo user: ${createErr?.message ?? "unknown"}`);
    }
    userId = created.user.id;
  } else {
    // Reset the password each time so the demo button always works even if it
    // was rotated.
    await admin.auth.admin.updateUserById(userId, {
      password: DEMO_USER_PASSWORD,
    });
  }

  // 2. Always upsert the profile so it points to the current demo org —
  //    handles stale state from earlier demos (e.g., previous run pointed
  //    Sara at a different org).
  const { error: profileErr } = await admin
    .from("connect_user_profiles")
    .upsert(
      {
        user_id: userId,
        organization_id: DEMO_ORG_ID,
        full_name: "Sara Al-Qahtani",
        job_title: "Field Marketing Lead, MENA",
        role: "owner",
      },
      { onConflict: "user_id" },
    );

  if (profileErr) {
    throw new Error(
      `Could not write demo profile: ${profileErr.message}. Check that the Darktrace organisation row exists in connect_organizations.`,
    );
  }

  return { email: DEMO_USER_EMAIL, password: DEMO_USER_PASSWORD };
}
