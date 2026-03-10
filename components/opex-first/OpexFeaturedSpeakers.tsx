import { supabase } from "@/lib/supabase/client";
import type { SpeakerWithSeries } from "@/lib/supabase/types";
import OpexSpeakersGrid from "./OpexSpeakersGrid";

const fallbackSpeakers = [
  {
    name: "Eng. AbdulRazzag AlAujan",
    role: "H.E. Advisor",
    org: "Ministry of Finance, Saudi Arabia",
    image:
      "https://opexfirst.com/wp-content/uploads/2025/08/ENG-ABDULRAZZAG-ALAUJAN-2.png",
  },
  {
    name: "Suvo Chatterjee",
    role: "Director Business Excellence & Transformation",
    org: "RAK Economic Zone",
    image:
      "https://opexfirst.com/wp-content/uploads/2025/08/Untitled-1-04-1.png",
  },
  {
    name: "Dr. Alia Alkaabi",
    role: "Director Supply Chain / EVP",
    org: "TAQA Transmission",
    image:
      "https://opexfirst.com/wp-content/uploads/2025/08/Untitled-1-06-1.png",
  },
  {
    name: "Oday Almajed",
    role: "AI & Data Analytics GM",
    org: "EXPRO",
    image:
      "https://opexfirst.com/wp-content/uploads/2025/08/Mr_Oday_Amajid.png",
  },
  {
    name: "Mohammed Alamri",
    role: "GM Organizational Excellence",
    org: "Roads General Authority",
    image: null,
  },
  {
    name: "Naresh Ranganathan",
    role: "VP of Cargo",
    org: "Velora",
    image: null,
  },
];

export default async function OpexFeaturedSpeakers() {
  let speakers: SpeakerWithSeries[] = [];

  try {
    const { data, error } = await supabase
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
      .eq("speaker_series.series_slug", "opex-first")
      .eq("status", "active")
      .eq("is_featured", true)
      .order("sort_order", { ascending: true });

    if (!error && data) {
      speakers = data as SpeakerWithSeries[];
    }
  } catch {
    // Fall through — will use fallback
  }

  // Use Supabase data if available, otherwise fall back to hardcoded speakers
  if (speakers.length > 0) {
    return <OpexSpeakersGrid speakers={speakers} />;
  }

  return <OpexSpeakersGrid fallbackSpeakers={fallbackSpeakers} />;
}
