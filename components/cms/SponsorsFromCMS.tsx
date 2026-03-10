/**
 * Server Component: Fetches sponsors from Supabase CMS
 *
 * Usage in a series page (server component):
 *
 * import { SponsorsFromCMS } from "@/components/cms/SponsorsFromCMS";
 *
 * export default function SeriesPage() {
 *   return (
 *     <SponsorsFromCMS
 *       seriesSlug="ot-security-first"
 *       accentColor="#D34B9A"
 *     />
 *   );
 * }
 */

import { getSponsorsBySeries, groupSponsorsByTier, TIER_ORDER } from "@/lib/data/sponsors";
import type { SeriesSlug, SponsorTier } from "@/lib/supabase/types";

interface SponsorsFromCMSProps {
  seriesSlug: SeriesSlug;
  accentColor?: string;
  title?: string;
}

// Display names for tiers
const TIER_LABELS: Partial<Record<SponsorTier, string>> = {
  title: "Title Sponsor",
  platinum: "Platinum Partners",
  gold: "Gold Partners",
  silver: "Silver Partners",
  bronze: "Bronze Partners",
  partner: "Partners",
  media: "Media Partners",
  patronage: "Patronage Partners",
  lead: "Lead Partners",
  strategic: "Strategic Partners",
  associate: "Associate Partners",
  consulting: "Consulting Partners",
  knowledge: "Knowledge Partners",
  supporting: "Supporting Partners",
  community: "Community Partners",
  networking: "Networking Partners",
};

export async function SponsorsFromCMS({
  seriesSlug,
  accentColor = "#E8651A",
  title = "Our Partners",
}: SponsorsFromCMSProps) {
  const sponsors = await getSponsorsBySeries(seriesSlug);

  if (sponsors.length === 0) {
    return null;
  }

  const groupedSponsors = groupSponsorsByTier(sponsors);
  const tiers = TIER_ORDER.filter((tier) => groupedSponsors[tier]?.length > 0);

  return (
    <section
      style={{
        background: "#000000",
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
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 2, background: accentColor }} />
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
              {title}
            </span>
            <span style={{ width: 30, height: 2, background: accentColor }} />
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
            Trusted by{" "}
            <span style={{ color: accentColor }}>Industry Leaders</span>
          </h2>
        </div>

        {/* Sponsor Tiers */}
        {tiers.map((tier, tierIndex) => (
          <TierSection
            key={tier}
            tier={tier}
            sponsors={groupedSponsors[tier]}
            accentColor={accentColor}
            isPrimary={tierIndex === 0}
            isLast={tierIndex === tiers.length - 1}
          />
        ))}

        {/* CTA */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <a
            href="/sponsors-and-partners"
            className="inline-flex items-center gap-2"
            style={{
              padding: "14px 28px",
              borderRadius: 6,
              border: `1px solid ${accentColor}40`,
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 500,
              color: accentColor,
            }}
          >
            <span>Become a Sponsor</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

interface TierSectionProps {
  tier: SponsorTier;
  sponsors: Awaited<ReturnType<typeof getSponsorsBySeries>>;
  accentColor: string;
  isPrimary: boolean;
  isLast: boolean;
}

function TierSection({ tier, sponsors, accentColor, isPrimary, isLast }: TierSectionProps) {
  const isSmallTier = sponsors.length <= 2;
  const isTitleTier = tier === "title" || tier === "platinum";
  const isMediaTier = tier === "media";

  return (
    <div style={{ marginBottom: isLast ? 0 : 32 }}>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: isPrimary ? accentColor : "#404040",
          marginBottom: 16,
        }}
      >
        {TIER_LABELS[tier]}
      </p>

      <div
        style={{
          display: isSmallTier ? "flex" : "grid",
          justifyContent: isSmallTier ? "center" : undefined,
          gridTemplateColumns: isSmallTier
            ? undefined
            : `repeat(${Math.min(sponsors.length, isMediaTier ? 4 : 6)}, 1fr)`,
          gap: isMediaTier ? 10 : 12,
        }}
      >
        {sponsors.map((sponsor) => (
          <SponsorCard
            key={sponsor.id}
            sponsor={sponsor}
            accentColor={accentColor}
            isPrimary={isPrimary}
            isLarge={isTitleTier && isSmallTier}
            isMedia={isMediaTier}
          />
        ))}
      </div>
    </div>
  );
}

interface SponsorCardProps {
  sponsor: Awaited<ReturnType<typeof getSponsorsBySeries>>[0];
  accentColor: string;
  isPrimary: boolean;
  isLarge: boolean;
  isMedia: boolean;
}

function SponsorCard({ sponsor, accentColor, isPrimary, isLarge, isMedia }: SponsorCardProps) {
  return (
    <div
      className="flex items-center justify-center transition-all"
      style={{
        background: isPrimary ? `${accentColor}08` : "#141414",
        border: isPrimary
          ? `1px solid ${accentColor}20`
          : "1px solid rgba(255, 255, 255, 0.04)",
        borderRadius: isMedia ? 8 : 10,
        padding: isLarge ? "32px 40px" : isMedia ? "16px 20px" : "24px 20px",
        minHeight: isLarge ? 100 : isMedia ? 56 : 80,
        minWidth: isLarge ? 200 : undefined,
      }}
    >
      {sponsor.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sponsor.logo_url}
          alt={sponsor.name}
          style={{
            maxHeight: isLarge ? 48 : isMedia ? 24 : 36,
            maxWidth: "100%",
            objectFit: "contain",
            filter: "brightness(0.7)",
            opacity: 0.7,
          }}
        />
      ) : (
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: isLarge ? 18 : 14,
            fontWeight: 600,
            color: "#606060",
          }}
        >
          {sponsor.name}
        </span>
      )}
    </div>
  );
}

export default SponsorsFromCMS;
