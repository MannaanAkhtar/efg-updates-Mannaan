import { supabase } from "@/lib/supabase/client";
import type {
  SponsorWithSeries,
  SeriesSlug,
  SponsorTier,
} from "@/lib/supabase/types";

// =============================================================================
// PUBLIC DATA FETCHING (for website)
// =============================================================================

export interface GetSponsorsOptions {
  tier?: SponsorTier;
  editionCity?: string;
  editionYear?: number;
}

export async function getSponsorsBySeries(
  seriesSlug: SeriesSlug,
  options?: GetSponsorsOptions
): Promise<SponsorWithSeries[]> {
  let query = supabase
    .from("sponsors")
    .select(
      `
      *,
      sponsor_series!inner (
        id,
        series_slug,
        tier_override,
        edition_city,
        edition_year,
        created_at
      )
    `
    )
    .eq("sponsor_series.series_slug", seriesSlug)
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (options?.tier) {
    query = query.eq("tier", options.tier);
  }

  if (options?.editionCity) {
    query = query.eq("sponsor_series.edition_city", options.editionCity);
  }

  if (options?.editionYear) {
    query = query.eq("sponsor_series.edition_year", options.editionYear);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching sponsors:", error);
    throw error;
  }

  return (data as SponsorWithSeries[]) || [];
}

export async function getAllSponsors(): Promise<SponsorWithSeries[]> {
  const { data, error } = await supabase
    .from("sponsors")
    .select(
      `
      *,
      sponsor_series (
        id,
        series_slug,
        tier_override,
        edition_city,
        edition_year,
        created_at
      )
    `
    )
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching all sponsors:", error);
    throw error;
  }

  return (data as SponsorWithSeries[]) || [];
}

export async function getSponsorById(id: string): Promise<SponsorWithSeries | null> {
  const { data, error } = await supabase
    .from("sponsors")
    .select(
      `
      *,
      sponsor_series (
        id,
        series_slug,
        tier_override,
        edition_city,
        edition_year,
        created_at
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error("Error fetching sponsor:", error);
    throw error;
  }

  return data as SponsorWithSeries;
}

// Group sponsors by tier (utility function)
export function groupSponsorsByTier(
  sponsors: SponsorWithSeries[]
): Record<string, SponsorWithSeries[]> {
  return sponsors.reduce(
    (acc, sponsor) => {
      // Use tier_override if set, otherwise use default tier
      const effectiveTier =
        sponsor.sponsor_events?.[0]?.tier_at_event || sponsor.tier;
      if (!acc[effectiveTier]) {
        acc[effectiveTier] = [];
      }
      acc[effectiveTier].push(sponsor);
      return acc;
    },
    {} as Record<string, SponsorWithSeries[]>
  );
}

// Define tier display order
export const TIER_ORDER: SponsorTier[] = [
  "platinum",
  "patronage",
  "lead",
  "gold",
  "strategic",
  "associate",
  "consulting",
  "knowledge",
  "supporting",
  "community",
  "networking",
  "media",
];

export function sortTiers(tiers: string[]): string[] {
  return tiers.sort((a, b) => {
    const aIndex = TIER_ORDER.indexOf(a as SponsorTier);
    const bIndex = TIER_ORDER.indexOf(b as SponsorTier);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

