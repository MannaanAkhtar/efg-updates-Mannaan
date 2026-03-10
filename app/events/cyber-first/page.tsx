import { Metadata } from "next";
import {
  SeriesHero,
  EditionsMap,
  SeriesTimeline,
  PastEditionsTimeline,
  AboutSeries,
  MarketInsights,
  FeaturedSpeakers,
  ConferenceElements,
  SponsorsWall,
  CyberFirstGallery,
  VideoHighlight,
  YouTubeShorts,
  UpcomingEditionCTA,
  ExploreOtherSeries,
  WhoShouldAttend,
} from "@/components/cyber-first";
import MidPageCTA from "@/components/cyber-first/MidPageCTA";
import { Footer } from "@/components/sections";
import SectionTransition from "@/components/effects/SectionTransition";

// Page Metadata
export const metadata: Metadata = {
  title: "Cyber First Series | The Definitive Cybersecurity Summit",
  description:
    "Cyber First brings together CISOs, government cyber leaders, and security innovators across Abu Dhabi, Kuwait, Riyadh, Doha, and Nairobi. Register for the next edition.",
};

// Cyber First accent color for transitions
const CYBER_BLUE = "#01BBF5";

export default function CyberFirstPage() {
  return (
    <div>
      {/* 1. Hero — Value prop, stats, anchored CTA */}
      <SeriesHero />

      <SectionTransition variant="sweep" color={CYBER_BLUE} />

      {/* 2. Editions Map — Where and when */}
      <EditionsMap />

      <SectionTransition variant="expand" color={CYBER_BLUE} />

      {/* 3. Series Timeline — Past, present, future credibility */}
      <SeriesTimeline />

      <SectionTransition variant="pulse" color={CYBER_BLUE} />

      {/* 4. Market Insights — Urgency engine (moved up) */}
      <MarketInsights />

      <SectionTransition variant="sweep" color={CYBER_BLUE} />

      {/* 5. The Room — Peer group proof & role breakdown */}
      <PastEditionsTimeline />

      <SectionTransition variant="expand" color={CYBER_BLUE} />

      {/* 6. Who Should Attend — Self-qualification */}
      <WhoShouldAttend />

      <SectionTransition variant="pulse" color={CYBER_BLUE} />

      {/* 7. Outcomes — What you walk away with */}
      <AboutSeries />

      {/* Mid-page CTA strip — Break the CTA desert */}
      <MidPageCTA />

      <SectionTransition variant="sweep" color={CYBER_BLUE} />

      {/* 8. Speakers — Proof of caliber */}
      <FeaturedSpeakers />

      <SectionTransition variant="expand" color={CYBER_BLUE} />

      {/* 9. The Experience — Conference formats */}
      <ConferenceElements />

      <SectionTransition variant="pulse" color={CYBER_BLUE} />

      {/* 10. Sponsors — Trust wall */}
      <SponsorsWall />

      <SectionTransition variant="sweep" color={CYBER_BLUE} />

      {/* 11. Gallery — Visual proof */}
      <CyberFirstGallery />

      <SectionTransition variant="expand" color={CYBER_BLUE} />

      {/* 12. Video — Series highlights */}
      <VideoHighlight />

      <SectionTransition variant="pulse" color={CYBER_BLUE} />

      {/* 13. Video Testimonials — Social proof before the ask */}
      <YouTubeShorts />

      <SectionTransition variant="sweep" color={CYBER_BLUE} />

      {/* 14. Register — The close */}
      <UpcomingEditionCTA />

      <SectionTransition variant="expand" color={CYBER_BLUE} />

      {/* 15. Explore Other Series — Cross-sell */}
      <ExploreOtherSeries />

      <SectionTransition variant="sweep" color={CYBER_BLUE} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
