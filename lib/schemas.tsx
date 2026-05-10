/**
 * JSON-LD Schema Components for SEO
 * These can be used in both server and client components
 */

const BASE_URL = "https://www.eventsfirstgroup.com";

// ─────────────────────────────────────────────────────────────────────────────
// PERSON SCHEMA (for speakers)
// ─────────────────────────────────────────────────────────────────────────────

interface PersonSchemaProps {
  name: string;
  title?: string;
  organization?: string;
  bio?: string;
  image?: string;
  linkedIn?: string;
  slug: string;
}

export function PersonSchema({
  name,
  title,
  organization,
  bio,
  image,
  linkedIn,
  slug,
}: PersonSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: `${BASE_URL}/speakers/${slug}`,
    ...(title && { jobTitle: title }),
    ...(organization && {
      worksFor: {
        "@type": "Organization",
        name: organization,
      },
    }),
    ...(bio && { description: bio }),
    ...(image && { image }),
    ...(linkedIn && { sameAs: [linkedIn] }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLE SCHEMA (for insights/blog posts)
// ─────────────────────────────────────────────────────────────────────────────

interface ArticleSchemaProps {
  title: string;
  description?: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
  slug: string;
  category?: string;
}

export function ArticleSchema({
  title,
  description,
  image,
  publishedAt,
  updatedAt,
  authorName,
  slug,
  category,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    url: `${BASE_URL}/insights/${slug}`,
    ...(description && { description }),
    ...(image && { image: [image] }),
    datePublished: publishedAt,
    ...(updatedAt && { dateModified: updatedAt }),
    ...(authorName && {
      author: {
        "@type": "Person",
        name: authorName,
      },
    }),
    publisher: {
      "@type": "Organization",
      name: "Events First Group",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    ...(category && { articleSection: category }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/insights/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BREADCRUMB SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO SCHEMA (for YouTube embeds)
// ─────────────────────────────────────────────────────────────────────────────

interface VideoSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  embedUrl: string;
  duration?: string; // ISO 8601 format, e.g., "PT1M33S"
}

export function VideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  embedUrl,
  duration,
}: VideoSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl,
    uploadDate,
    embedUrl,
    ...(duration && { duration }),
    publisher: {
      "@type": "Organization",
      name: "Events First Group",
      url: BASE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT SCHEMA (for individual events)
// ─────────────────────────────────────────────────────────────────────────────

interface EventSchemaProps {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
  image: string;
  url: string;
  organizer?: string;
  offers?: {
    price?: number;
    currency?: string;
    availability?: "InStock" | "SoldOut" | "PreOrder";
    validFrom?: string;
  };
}

export function EventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  image,
  url,
  organizer = "Events First Group",
  offers,
}: EventSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    startDate,
    endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: location.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: location.address,
        addressLocality: location.city,
        addressCountry: location.country,
      },
    },
    image: [image],
    url,
    organizer: {
      "@type": "Organization",
      name: organizer,
      url: BASE_URL,
    },
    ...(offers && {
      offers: {
        "@type": "Offer",
        url,
        ...(offers.price !== undefined && { price: offers.price }),
        ...(offers.currency && { priceCurrency: offers.currency }),
        availability: `https://schema.org/${offers.availability || "InStock"}`,
        ...(offers.validFrom && { validFrom: offers.validFrom }),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ORGANIZATION SCHEMA (for sponsor/partner pages)
// ─────────────────────────────────────────────────────────────────────────────

interface OrganizationSchemaProps {
  name: string;
  description?: string;
  logo?: string;
  url?: string;
  slug: string;
}

export function OrganizationSchema({
  name,
  description,
  logo,
  url,
  slug,
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: url || `${BASE_URL}/sponsors-and-partners/${slug}`,
    ...(description && { description }),
    ...(logo && { logo }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
