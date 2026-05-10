import { Metadata } from "next";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { PersonSchema, BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://www.eventsfirstgroup.com";
const DEFAULT_OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0045.JPG";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const fetchSpeaker = cache(async (slug: string) => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  try {
    const { data } = await supabase
      .from("speakers")
      .select("name, title, organization, bio, image_url, linkedin_url, role_type")
      .eq("slug", slug)
      .single();
    return data;
  } catch (error) {
    console.error("Error fetching speaker:", error);
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const speaker = await fetchSpeaker(slug);

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
      canonical: `${BASE_URL}/speakers/${slug}`,
    },
    openGraph: {
      title: `${speaker.name} | Events First Group`,
      description,
      url: `${BASE_URL}/speakers/${slug}`,
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
}

export default async function SpeakerDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const speaker = await fetchSpeaker(slug);

  return (
    <>
      {speaker && (
        <>
          <PersonSchema
            name={speaker.name}
            title={speaker.title || undefined}
            organization={speaker.organization || undefined}
            bio={speaker.bio || undefined}
            image={speaker.image_url || undefined}
            linkedIn={speaker.linkedin_url || undefined}
            slug={slug}
          />
          <BreadcrumbSchema
            items={[
              { name: "Home", url: BASE_URL },
              { name: "Speakers", url: `${BASE_URL}/speakers` },
              { name: speaker.name, url: `${BASE_URL}/speakers/${slug}` },
            ]}
          />
        </>
      )}
      {children}
    </>
  );
}
