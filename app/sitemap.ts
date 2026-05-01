import { MetadataRoute } from "next";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const BASE_URL = "https://eventsfirstgroup.com";

// Create Supabase client only if credentials are available
function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.warn("Sitemap: Supabase credentials not available, skipping dynamic content");
    return null;
  }
  
  return createClient(url, key);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ─────────────────────────────────────────────────────────────────────────
  // Static Pages
  // ─────────────────────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date("2026-03-12"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: new Date("2026-03-12"),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/speakers`,
      lastModified: new Date("2026-03-12"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/sponsors-and-partners`,
      lastModified: new Date("2026-03-12"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/insights`,
      lastModified: new Date("2026-03-12"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/network-first`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date("2026-01-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date("2026-01-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // Event Pages (static routes)
  // ─────────────────────────────────────────────────────────────────────────
  const eventPages: MetadataRoute.Sitemap = [
    // Cyber First
    {
      url: `${BASE_URL}/events/cyber-first`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/events/cyber-first/india-2026`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/events/cyber-first/kenya-2026`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/events/cyber-first/kuwait-2026`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Digital First
    {
      url: `${BASE_URL}/events/data-ai-first`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/events/data-ai-first/kuwait-2026`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Digital First, Coming Soon
    {
      url: `${BASE_URL}/events/data-ai-first/qatar-2026`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // OPEX First
    {
      url: `${BASE_URL}/events/opex-first`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/events/opex-first/saudi-2026`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/events/opex-first/process-intelligence`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    // Cyber First, Coming Soon
    {
      url: `${BASE_URL}/events/cyber-first/qatar-2026`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/events/cyber-first/oman-2026`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/events/cyber-first/ksa-2026`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // OT Security First
    {
      url: `${BASE_URL}/events/ot-security-first`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/events/ot-security-first/johannesburg-2026`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/events/ot-security-first/jubail-2026`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/events/ot-security-first/oman-2026`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/events/ot-security-first/virtual-boardroom-mena`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    // Network First (standalone page)
    {
      url: `${BASE_URL}/network-first`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // SonicWall Webinar
    {
      url: `${BASE_URL}/sonicwall`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: "https://sonicwall-webinar.eventsfirstgroup.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    // Big Leap (CleverTap × EFG, Riyadh)
    {
      url: `${BASE_URL}/bigleap`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: "https://big-leap-riyadh.eventsfirstgroup.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    // Braze virtual roundtables
    {
      url: `${BASE_URL}/braze`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/braze2`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://vroundtable-braze.eventsfirstgroup.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // CleverTap landing page
    {
      url: `${BASE_URL}/clevertap2`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Case studies
    {
      url: `${BASE_URL}/case-studies/simpplr-executive-boardroom`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // Dynamic Content (requires Supabase)
  // ─────────────────────────────────────────────────────────────────────────
  let insightPages: MetadataRoute.Sitemap = [];
  let speakerPages: MetadataRoute.Sitemap = [];
  let sponsorPages: MetadataRoute.Sitemap = [];

  const supabase = getSupabaseClient();

  if (supabase) {
    // Insights/Posts
    try {
      const { data: posts } = await supabase
        .from("posts")
        .select("slug, updated_at, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (posts) {
        insightPages = posts.map((post) => ({
          url: `${BASE_URL}/insights/${post.slug}`,
          lastModified: new Date(post.updated_at || post.published_at),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }));
      }
    } catch (error) {
      console.error("Sitemap: Error fetching posts", error);
    }

    // Speakers
    try {
      const { data: speakers } = await supabase
        .from("speakers")
        .select("slug, updated_at")
        .order("name", { ascending: true });

      if (speakers) {
        speakerPages = speakers.map((speaker) => ({
          url: `${BASE_URL}/speakers/${speaker.slug}`,
          lastModified: new Date(speaker.updated_at),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }));
      }
    } catch (error) {
      console.error("Sitemap: Error fetching speakers", error);
    }

    // Sponsors
    try {
      const { data: sponsors } = await supabase
        .from("sponsors")
        .select("slug, updated_at")
        .eq("status", "active")
        .order("name", { ascending: true });

      if (sponsors) {
        sponsorPages = sponsors.map((sponsor) => ({
          url: `${BASE_URL}/sponsors-and-partners/${sponsor.slug}`,
          lastModified: new Date(sponsor.updated_at),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }));
      }
    } catch (error) {
      console.error("Sitemap: Error fetching sponsors", error);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Combine All
  // ─────────────────────────────────────────────────────────────────────────
  return [
    ...staticPages,
    ...eventPages,
    ...insightPages,
    ...speakerPages,
    ...sponsorPages,
  ];
}
