import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://eventsfirstgroup.com";
const DEFAULT_OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG";

// Create Supabase client for server-side metadata generation
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    return {
      title: "Partner | Events First Group",
      description: "Technology partner at Events First Group summits.",
    };
  }

  try {
    const { data: sponsor } = await supabase
      .from("sponsors")
      .select("name, description, logo_url, website_url")
      .eq("slug", params.slug)
      .single();

    if (!sponsor) {
      return {
        title: "Partner Not Found | Events First Group",
        description: "The requested partner profile could not be found.",
      };
    }

    const title = `${sponsor.name}, Partner | Events First Group`;
    const description = sponsor.description 
      ? sponsor.description.substring(0, 160) + (sponsor.description.length > 160 ? "..." : "")
      : `${sponsor.name} is a valued partner at Events First Group technology summits.`;
    const ogImage = sponsor.logo_url || DEFAULT_OG_IMAGE;

    return {
      title,
      description,
      alternates: {
        canonical: `${BASE_URL}/sponsors-and-partners/${params.slug}`,
      },
      openGraph: {
        title: `${sponsor.name} | Events First Group Partner`,
        description,
        url: `${BASE_URL}/sponsors-and-partners/${params.slug}`,
        siteName: "Events First Group",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: sponsor.name,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: sponsor.name,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for sponsor:", error);
    return {
      title: "Partner | Events First Group",
      description: "Technology partner at Events First Group summits.",
    };
  }
}

export default function SponsorDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
