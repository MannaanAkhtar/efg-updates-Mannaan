import { supabase } from "@/lib/supabase/client";
import type {
  SpeakerWithSeries,
  SeriesSlug,
} from "@/lib/supabase/types";

// =============================================================================
// PUBLIC DATA FETCHING (for website)
// =============================================================================

export interface GetSpeakersOptions {
  featured?: boolean;
  limit?: number;
  editionCity?: string;
  editionYear?: number;
}

export async function getSpeakersBySeries(
  seriesSlug: SeriesSlug,
  options?: GetSpeakersOptions
): Promise<SpeakerWithSeries[]> {
  let query = supabase
    .from("speakers")
    .select(
      `
      *,
      speaker_series!inner (
        id,
        series_slug,
        role,
        edition_city,
        edition_year,
        created_at
      )
    `
    )
    .eq("speaker_series.series_slug", seriesSlug)
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (options?.featured) {
    query = query.eq("is_featured", true);
  }

  if (options?.editionCity) {
    query = query.eq("speaker_series.edition_city", options.editionCity);
  }

  if (options?.editionYear) {
    query = query.eq("speaker_series.edition_year", options.editionYear);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching speakers:", error);
    throw error;
  }

  return (data as SpeakerWithSeries[]) || [];
}

export async function getAllSpeakers(): Promise<SpeakerWithSeries[]> {
  const { data, error } = await supabase
    .from("speakers")
    .select(
      `
      *,
      speaker_series (
        id,
        series_slug,
        role,
        edition_city,
        edition_year,
        created_at
      )
    `
    )
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching all speakers:", error);
    throw error;
  }

  return (data as SpeakerWithSeries[]) || [];
}

export async function getSpeakerById(id: string): Promise<SpeakerWithSeries | null> {
  const { data, error } = await supabase
    .from("speakers")
    .select(
      `
      *,
      speaker_series (
        id,
        series_slug,
        role,
        edition_city,
        edition_year,
        created_at
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    console.error("Error fetching speaker:", error);
    throw error;
  }

  return data as SpeakerWithSeries;
}

