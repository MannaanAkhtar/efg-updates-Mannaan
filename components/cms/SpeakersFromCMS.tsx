/**
 * Server Component: Fetches speakers from Supabase CMS
 *
 * Usage in a series page (server component):
 *
 * import { SpeakersFromCMS } from "@/components/cms/SpeakersFromCMS";
 *
 * export default function SeriesPage() {
 *   return (
 *     <SpeakersFromCMS
 *       seriesSlug="ot-security-first"
 *       accentColor="#D34B9A"
 *       title="Featured Speakers"
 *       subtitle="Industry experts leading the conversation"
 *     />
 *   );
 * }
 */

import { getSpeakersBySeries } from "@/lib/data/speakers";
import type { SeriesSlug } from "@/lib/supabase/types";

interface SpeakersFromCMSProps {
  seriesSlug: SeriesSlug;
  accentColor?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
  showViewAll?: boolean;
}

export async function SpeakersFromCMS({
  seriesSlug,
  accentColor = "#E8651A",
  title = "Featured Speakers",
  subtitle,
  limit = 8,
  showViewAll = true,
}: SpeakersFromCMSProps) {
  const speakers = await getSpeakersBySeries(seriesSlug, {
    featured: true,
    limit,
  });

  if (speakers.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        background: "#0A0A0A",
        padding: "clamp(80px, 10vw, 130px) 0",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div className="flex items-center gap-3">
            <span style={{ width: 30, height: 1, background: accentColor }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: accentColor,
              }}
            >
              Speakers & Advisors
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.5vw, 48px)",
              letterSpacing: "-1.5px",
              color: "#ffffff",
              lineHeight: 1.1,
              margin: "20px 0 0",
            }}
          >
            {title}
          </h2>

          {subtitle && (
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 16,
                fontWeight: 300,
                color: "#808080",
                marginTop: 14,
                maxWidth: 500,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Speakers Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 12,
          }}
        >
          {speakers.map((speaker) => (
            <SpeakerCard
              key={speaker.id}
              speaker={speaker}
              accentColor={accentColor}
            />
          ))}
        </div>

        {/* View All Link */}
        {showViewAll && (
          <div style={{ marginTop: 32 }}>
            <a
              href={`/events/${seriesSlug}/speakers`}
              className="inline-flex items-center gap-2"
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 500,
                color: accentColor,
              }}
            >
              <span>View All Speakers</span>
              <span>→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

interface SpeakerCardProps {
  speaker: Awaited<ReturnType<typeof getSpeakersBySeries>>[0];
  accentColor: string;
}

function SpeakerCard({ speaker, accentColor }: SpeakerCardProps) {
  return (
    <div
      className="group relative transition-all"
      style={{
        background: "#141414",
        border: "1px solid rgba(255, 255, 255, 0.04)",
        borderRadius: 10,
        padding: 20,
      }}
    >
      {/* Photo */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          overflow: "hidden",
          border: `2px solid ${accentColor}25`,
          marginBottom: 16,
        }}
      >
        {speaker.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={speaker.image_url}
            alt={speaker.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `${accentColor}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 600,
              color: accentColor,
            }}
          >
            {speaker.name.split(/\s+/).slice(0, 2).map(w => w[0]).join("")}
          </div>
        )}
      </div>

      {/* Name */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 15,
          fontWeight: 700,
          color: "#ffffff",
          margin: 0,
        }}
      >
        {speaker.name}
      </h3>

      {/* Title */}
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 12,
          fontWeight: 400,
          color: "#707070",
          margin: "6px 0 0",
          lineHeight: 1.4,
        }}
      >
        {speaker.title}
      </p>

      {/* Organization */}
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: 500,
          color: `${accentColor}B3`,
          margin: "4px 0 0",
        }}
      >
        {speaker.organization}
      </p>
    </div>
  );
}

export default SpeakersFromCMS;
