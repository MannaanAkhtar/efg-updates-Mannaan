import { Metadata } from "next";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArticleSchema, BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://www.eventsfirstgroup.com";
const DEFAULT_OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const fetchPost = cache(async (slug: string) => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  try {
    const { data } = await supabase
      .from("posts")
      .select("title, excerpt, subtitle, cover_image_url, published_at, updated_at, category, authors(name)")
      .eq("slug", slug)
      .single();
    return data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
});

function getAuthorName(authors: unknown): string | null {
  if (authors && typeof authors === "object" && "name" in authors) {
    return (authors as { name: string }).name;
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    return {
      title: "Article Not Found | Events First Group",
      description: "The requested article could not be found.",
    };
  }

  const title = `${post.title} | Events First Group`;
  const description = post.excerpt || post.subtitle || "Expert analysis from Events First Group.";
  const ogImage = post.cover_image_url || DEFAULT_OG_IMAGE;
  const authorName = getAuthorName(post.authors);

  return {
    title,
    description,
    authors: authorName ? [{ name: authorName }] : undefined,
    alternates: {
      canonical: `${BASE_URL}/insights/${slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      url: `${BASE_URL}/insights/${slug}`,
      siteName: "Events First Group",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: post.published_at,
      authors: authorName ? [authorName] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImage],
    },
  };
}

export default async function InsightDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  const authorName = post ? getAuthorName(post.authors) : null;

  return (
    <>
      {post && (
        <>
          <ArticleSchema
            title={post.title}
            description={post.excerpt || post.subtitle || undefined}
            image={post.cover_image_url || undefined}
            publishedAt={post.published_at}
            updatedAt={post.updated_at || undefined}
            authorName={authorName || undefined}
            slug={slug}
            category={post.category || undefined}
          />
          <BreadcrumbSchema
            items={[
              { name: "Home", url: BASE_URL },
              { name: "Insights", url: `${BASE_URL}/insights` },
              { name: post.title, url: `${BASE_URL}/insights/${slug}` },
            ]}
          />
        </>
      )}
      {children}
    </>
  );
}
