"use server";

import { revalidatePath } from "next/cache";
import { createConnectServerClient, requireConnectSession } from "@/lib/connect/server";

export interface SaveInterestsInput {
  target_industries: string[];
  target_titles: string[];
  target_geos: string[];
  topics: string[];
  target_accounts: string[];
  competitors: string[];
}

export type SaveInterestsResult =
  | { ok: true }
  | { ok: false; error: string };

export async function saveInterestsAction(
  input: SaveInterestsInput,
): Promise<SaveInterestsResult> {
  await requireConnectSession();
  const supabase = await createConnectServerClient();

  // Look up the org for the calling user.
  const { data: profile, error: profileErr } = await supabase
    .from("connect_user_profiles")
    .select("organization_id")
    .single();

  if (profileErr || !profile) {
    return { ok: false, error: "Could not load your profile." };
  }

  const { error: upsertErr } = await supabase
    .from("connect_sponsor_interests")
    .upsert(
      {
        organization_id: profile.organization_id,
        target_industries: input.target_industries,
        target_titles: input.target_titles,
        target_geos: input.target_geos,
        topics: input.topics,
        target_accounts: input.target_accounts,
        competitors: input.competitors,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "organization_id" },
    );

  if (upsertErr) {
    console.error("[onboarding] save failed:", upsertErr);
    return { ok: false, error: "Could not save your preferences. Please try again." };
  }

  revalidatePath("/connect", "layout");
  return { ok: true };
}
