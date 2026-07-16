import { supabase } from "@/lib/supabase/client";
import type { SpeakerWithSeries } from "@/lib/supabase/types";
import OpexSpeakersGrid from "./OpexSpeakersGrid";

// Panellists from the series' Process Intelligence Webinar (virtual edition),
// appended to the faculty grid and tagged "Virtual".
const webinarSpeakers = [
  { name: "Dr. Mohammad Khalaf Alghamdi", role: "Deputy Mayor for Strategy & Transformation", org: "Madinah Municipality", image: "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Mohamad+Khalaf.png", tag: "Virtual" },
  { name: "Abdulrahman Alonaizan", role: "Chief Business Continuity Officer", org: "Arab National Bank", image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Abdulrahman_Alonaizan.png", tag: "Virtual" },
  { name: "Butti Al Mazrouei", role: "Head of Supply Chain Management", org: "Mubadala Energy", image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Butti.png", tag: "Virtual" },
  { name: "Ismail Ibrahim Al Janahi", role: "Procurement Section Head", org: "Abu Dhabi Investment Office", image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/ismail.png", tag: "Virtual" },
  { name: "Eng. Meshal Aldeaijy", role: "Strategic Planning & Execution Advisor", org: "Confidential", image: "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Eng.+Meshal+Aldeaijy.png", tag: "Virtual" },
  { name: "Abdelkader Nessib", role: "IT Operations & Infrastructure Manager", org: "Saipem Qatar", image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Abdelkader.png", tag: "Virtual" },
  { name: "Mohamed Hamed", role: "Head of Strategy", org: "National Bank of Umm Al Qaiwain", image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Mohamed+Hamed.png", tag: "Virtual" },
  { name: "Danyal Nasser Anwar", role: "Process Improvement Unit Head", org: "Department of Culture & Tourism", image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Danyal.png", tag: "Virtual" },
  { name: "Ayham Alzaaim", role: "Senior Vice President, Middle East & Turkey", org: "ARIS", image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/AyhamAlzaaim.png", tag: "Virtual" },
  { name: "Cezmi Eroglu", role: "Director – Solution Architecture, ME & Turkey", org: "ARIS", image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/CezmiEroglu.png", tag: "Virtual" },
  { name: "Zamir Chaudhry", role: "CEO Advisor – Strategic & GRC Transformation", org: "Walaa Insurance", image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Zamir_Chaudhry.png", tag: "Virtual" },
  { name: "Miodrag Vidakovic", role: "Applied AI Director", org: "Celonis", image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Miodrag_Celonis.png", tag: "Virtual" },
  { name: "Neil Evans", role: "Head of Energy", org: "Q5 Arabia", image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Neil_Evans.png", tag: "Virtual" },
  { name: "Sridhar Rajakumar", role: "Business Transformation Advisor, SAP EMEA", org: "SAP MENA", image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Sridhar_Rajakumar.png", tag: "Virtual" },
];

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
    // Fall through, will use fallback
  }

  // Use Supabase data if available, otherwise fall back to hardcoded speakers.
  // Webinar panellists are appended in both cases.
  if (speakers.length > 0) {
    return <OpexSpeakersGrid speakers={speakers} extraSpeakers={webinarSpeakers} />;
  }

  return (
    <OpexSpeakersGrid
      fallbackSpeakers={fallbackSpeakers}
      extraSpeakers={webinarSpeakers}
    />
  );
}
