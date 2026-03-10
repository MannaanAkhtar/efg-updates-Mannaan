/**
 * Seed Script for Supabase Database
 *
 * Run with: npx tsx scripts/seed-data.ts
 *
 * Make sure you have your .env.local file with:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY (not the anon key!)
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables!");
  console.error("Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ========================================
// SPEAKERS DATA
// ========================================

const speakers = [
  // OT Security First Speakers
  {
    first_name: "Ali",
    last_name: "Al Kaf Alhashmi",
    job_title: "VP Cyber Security & Technology",
    organization: "Mubadala",
    photo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/Ali-Al-Kaf-Alhashmi.jpg",
    country: "UAE",
    is_featured: true,
    status: "active",
    sort_order: 1,
    series: ["ot-security-first"],
  },
  {
    first_name: "Shaytel",
    last_name: "Patel",
    job_title: "Group SVP Technology Audit",
    organization: "DP World",
    photo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/Shaytel-Patel.jpg",
    country: "UAE",
    is_featured: true,
    status: "active",
    sort_order: 2,
    series: ["ot-security-first"],
  },
  {
    first_name: "Ali",
    last_name: "AlQallaf",
    job_title: "Head of Cybersecurity Operations",
    organization: "KNPC",
    photo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/Ali-AlQallaf.jpg",
    country: "Kuwait",
    is_featured: true,
    status: "active",
    sort_order: 3,
    series: ["ot-security-first"],
  },
  {
    first_name: "Abdulhakeem",
    last_name: "Al Alawi",
    job_title: "Information Security Officer",
    organization: "Oman LNG",
    photo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/PHOTO-2026-01-25-11-24-22.jpg",
    country: "Oman",
    is_featured: true,
    status: "active",
    sort_order: 4,
    series: ["ot-security-first"],
  },
  {
    first_name: "Khaled",
    last_name: "Al Teneiji",
    job_title: "Cyber Security Head",
    organization: "ENOC",
    photo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/Khaled-Al-Teneiji-Image.jpg",
    country: "UAE",
    is_featured: true,
    status: "active",
    sort_order: 5,
    series: ["ot-security-first"],
  },
  {
    first_name: "Wissam",
    last_name: "Al-Nasairi",
    job_title: "OT Security EMEA Lead",
    organization: "IBM Consulting",
    photo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/Wissam-Al-Nasairi.jpg",
    country: "UAE",
    is_featured: true,
    status: "active",
    sort_order: 6,
    series: ["ot-security-first"],
  },
  {
    first_name: "Payal",
    last_name: "Sampat",
    job_title: "Cyber Security Officer",
    organization: "Petrofac",
    photo_url: "https://otsecurityfirst.com/wp-content/uploads/2025/12/Payal-Sampat.jpg",
    country: "UAE",
    is_featured: true,
    status: "active",
    sort_order: 7,
    series: ["ot-security-first"],
  },
  {
    first_name: "Mohammed",
    last_name: "Shoukat Ali",
    job_title: "GM & Head Global Cybersecurity CoE",
    organization: "Yokogawa",
    photo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/Mohammed-Shoukat-Ali.jpg",
    country: "UAE",
    is_featured: true,
    status: "active",
    sort_order: 8,
    series: ["ot-security-first"],
  },

  // Opex First Speakers
  {
    first_name: "AbdulRazzag",
    last_name: "AlAujan",
    job_title: "H.E. Advisor",
    organization: "Ministry of Finance, Saudi Arabia",
    photo_url: "https://opexfirst.com/wp-content/uploads/2025/08/ENG-ABDULRAZZAG-ALAUJAN-2.png",
    country: "Saudi Arabia",
    is_featured: true,
    status: "active",
    sort_order: 1,
    series: ["opex-first"],
  },
  {
    first_name: "Suvo",
    last_name: "Chatterjee",
    job_title: "Director Business Excellence & Transformation",
    organization: "RAK Economic Zone",
    photo_url: "https://opexfirst.com/wp-content/uploads/2025/08/Untitled-1-04-1.png",
    country: "UAE",
    is_featured: true,
    status: "active",
    sort_order: 2,
    series: ["opex-first"],
  },
  {
    first_name: "Alia",
    last_name: "Alkaabi",
    job_title: "Director Supply Chain / EVP",
    organization: "TAQA Transmission",
    photo_url: "https://opexfirst.com/wp-content/uploads/2025/08/Untitled-1-06-1.png",
    country: "UAE",
    is_featured: true,
    status: "active",
    sort_order: 3,
    series: ["opex-first"],
  },
  {
    first_name: "Mohammed",
    last_name: "Alamri",
    job_title: "GM Organizational Excellence",
    organization: "Roads General Authority",
    photo_url: null,
    country: "Saudi Arabia",
    is_featured: false,
    status: "active",
    sort_order: 4,
    series: ["opex-first"],
  },
  {
    first_name: "Oday",
    last_name: "Almajed",
    job_title: "AI & Data Analytics GM",
    organization: "EXPRO",
    photo_url: "https://opexfirst.com/wp-content/uploads/2025/08/Mr_Oday_Amajid.png",
    country: "Saudi Arabia",
    is_featured: true,
    status: "active",
    sort_order: 5,
    series: ["opex-first"],
  },
  {
    first_name: "Naresh",
    last_name: "Ranganathan",
    job_title: "VP of Cargo",
    organization: "Velora",
    photo_url: null,
    country: "UAE",
    is_featured: false,
    status: "active",
    sort_order: 6,
    series: ["opex-first"],
  },
];

// ========================================
// SPONSORS DATA
// ========================================

const sponsors = [
  // OT Security First Sponsors
  {
    name: "ENOC",
    logo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/enoc-logo.png",
    tier: "patronage",
    status: "active",
    sort_order: 1,
    series: ["ot-security-first"],
  },
  {
    name: "IBM",
    logo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/ibm-logo.png",
    tier: "knowledge",
    status: "active",
    sort_order: 2,
    series: ["ot-security-first"],
  },
  {
    name: "Claroty",
    logo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/claroty-logo.png",
    tier: "supporting",
    status: "active",
    sort_order: 3,
    series: ["ot-security-first"],
  },
  {
    name: "Dragos",
    logo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/dragos-logo.png",
    tier: "supporting",
    status: "active",
    sort_order: 4,
    series: ["ot-security-first"],
  },
  {
    name: "Nozomi Networks",
    logo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/nozomi-logo.png",
    tier: "supporting",
    status: "active",
    sort_order: 5,
    series: ["ot-security-first"],
  },
  {
    name: "Fortinet",
    logo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/fortinet-logo.png",
    tier: "supporting",
    status: "active",
    sort_order: 6,
    series: ["ot-security-first"],
  },
  {
    name: "Tenable",
    logo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/tenable-logo.png",
    tier: "supporting",
    status: "active",
    sort_order: 7,
    series: ["ot-security-first"],
  },
  {
    name: "OPSWAT",
    logo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/opswat-logo.png",
    tier: "supporting",
    status: "active",
    sort_order: 8,
    series: ["ot-security-first"],
  },
  {
    name: "ICS-CERT UAE",
    logo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/ics-cert-logo.png",
    tier: "community",
    status: "active",
    sort_order: 9,
    series: ["ot-security-first"],
  },
  {
    name: "Industrial Cyber",
    logo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/industrial-cyber-logo.png",
    tier: "media",
    status: "active",
    sort_order: 10,
    series: ["ot-security-first"],
  },
  {
    name: "Control Engineering",
    logo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/control-eng-logo.png",
    tier: "media",
    status: "active",
    sort_order: 11,
    series: ["ot-security-first"],
  },
  {
    name: "SC Media",
    logo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/sc-media-logo.png",
    tier: "media",
    status: "active",
    sort_order: 12,
    series: ["ot-security-first"],
  },
  {
    name: "Dark Reading",
    logo_url: "https://otsecurityfirst.com/wp-content/uploads/2026/01/dark-reading-logo.png",
    tier: "media",
    status: "active",
    sort_order: 13,
    series: ["ot-security-first"],
  },
];

// ========================================
// SEED FUNCTIONS
// ========================================

async function seedSpeakers() {
  console.log("Seeding speakers...");

  for (const speaker of speakers) {
    const { series, ...speakerData } = speaker;

    // Insert speaker
    const { data: newSpeaker, error: speakerError } = await supabase
      .from("speakers")
      .insert(speakerData)
      .select()
      .single();

    if (speakerError) {
      console.error(`Error inserting speaker ${speaker.first_name} ${speaker.last_name}:`, speakerError.message);
      continue;
    }

    console.log(`  Added speaker: ${speaker.first_name} ${speaker.last_name}`);

    // Insert speaker-series relationships
    if (newSpeaker && series.length > 0) {
      const { error: seriesError } = await supabase
        .from("speaker_series")
        .insert(
          series.map((s) => ({
            speaker_id: newSpeaker.id,
            series_slug: s,
          }))
        );

      if (seriesError) {
        console.error(`  Error adding series for ${speaker.first_name}:`, seriesError.message);
      }
    }
  }

  console.log(`Seeded ${speakers.length} speakers\n`);
}

async function seedSponsors() {
  console.log("Seeding sponsors...");

  for (const sponsor of sponsors) {
    const { series, ...sponsorData } = sponsor;

    // Insert sponsor
    const { data: newSponsor, error: sponsorError } = await supabase
      .from("sponsors")
      .insert(sponsorData)
      .select()
      .single();

    if (sponsorError) {
      console.error(`Error inserting sponsor ${sponsor.name}:`, sponsorError.message);
      continue;
    }

    console.log(`  Added sponsor: ${sponsor.name}`);

    // Insert sponsor-series relationships
    if (newSponsor && series.length > 0) {
      const { error: seriesError } = await supabase
        .from("sponsor_series")
        .insert(
          series.map((s) => ({
            sponsor_id: newSponsor.id,
            series_slug: s,
          }))
        );

      if (seriesError) {
        console.error(`  Error adding series for ${sponsor.name}:`, seriesError.message);
      }
    }
  }

  console.log(`Seeded ${sponsors.length} sponsors\n`);
}

async function clearExistingData() {
  console.log("Clearing existing data...\n");

  // Delete in correct order due to foreign key constraints
  await supabase.from("speaker_series").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("sponsor_series").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("speakers").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("sponsors").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  console.log("Cleared existing data\n");
}

async function main() {
  console.log("\n========================================");
  console.log("EFG Database Seed Script");
  console.log("========================================\n");

  // Check if --clear flag is passed
  const shouldClear = process.argv.includes("--clear");

  if (shouldClear) {
    await clearExistingData();
  }

  await seedSpeakers();
  await seedSponsors();

  console.log("========================================");
  console.log("Seeding complete!");
  console.log("========================================\n");
}

main().catch(console.error);
