import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://eventsfirstgroup.com";
const DEFAULT_OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0045.JPG";

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
      title: "Speaker | Events First Group",
      description: "Industry expert and thought leader at Events First Group summits.",
    };
  }

  try {
    const { data: speaker } = await supabase
      .from("speakers")
      .select("name, title, organization, bio, image_url, role_type")
      .eq("slug", params.slug)
      .single();

    if (!speaker) {
      return {
        title: "Speaker Not Found | Events First Group",
        description: "The requested speaker profile could not be found.",
      };
    }

    const roleLabel = speaker.role_type === "chair" ? "Conference Chair" : 
                      speaker.role_type === "advisor" ? "Advisor" : "Speaker";
    
    const title = `${speaker.name}, ${roleLabel} | Events First Group`;
    const description = speaker.bio 
      ? speaker.bio.substring(0, 160) + (speaker.bio.length > 160 ? "..." : "")
      : `${speaker.name}${speaker.title ? `, ${speaker.title}` : ""}${speaker.organization ? ` at ${speaker.organization}` : ""}. Speaker at Events First Group summits.`;
    const ogImage = speaker.image_url || DEFAULT_OG_IMAGE;

    return {
      title,
      description,
      alternates: {
        canonical: `${BASE_URL}/speakers/${params.slug}`,
      },
      openGraph: {
        title: `${speaker.name} | Events First Group`,
        description,
        url: `${BASE_URL}/speakers/${params.slug}`,
        siteName: "Events First Group",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: speaker.name,
          },
        ],
        locale: "en_US",
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title: speaker.name,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for speaker:", error);
    return {
      title: "Speaker | Events First Group",
      description: "Industry expert and thought leader at Events First Group summits.",
    };
  }
}

// JSON-LD for Person schema will be added in the page component
export default function SpeakerDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
