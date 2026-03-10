import { Metadata } from "next";
import {
  OTSeriesHero,
  OTEditionsMap,
  OTChairQuote,
  OTAboutSeries,
  OTOutcomesStrip,
  OTMarketInsights,
  OTFeaturedSpeakers,
  OTExperience,
  OTWhoShouldAttend,
  OTSponsors,
  OTGallery,
  OTFAQ,
  OTUpcomingEditionCTA,
  OTExploreOtherSeries,
} from "@/components/ot-security-first";
import { Footer } from "@/components/sections";
import SectionTransition from "@/components/effects/SectionTransition";

// Page Metadata
export const metadata: Metadata = {
  title: "OT Security First | The Region's Only Critical Infrastructure Security Summit",
  description:
    "OT Security First brings together OT security leaders, industrial cybersecurity experts, and critical infrastructure defenders. Protecting what runs the world.",
};

// OT Security First accent color for transitions
const OT_CRIMSON = "#D34B9A";

export default function OTSecurityFirstPage() {
  return (
    <div>
      {/* 1. Series Hero — Industrial introduction */}
      <OTSeriesHero />

      {/* Section Transition - Sweep */}
      <SectionTransition variant="sweep" color={OT_CRIMSON} />

      {/* 2. Editions Map — Timeline pipeline + Asymmetric layout + Reports strip */}
      <OTEditionsMap />

      {/* Section Transition - Expand */}
      <SectionTransition variant="expand" color={OT_CRIMSON} />

      {/* 3. Conference Chair Quote + Testimonial Shorts */}
      <OTChairQuote />

      {/* Section Transition - Pulse */}
      <SectionTransition variant="pulse" color={OT_CRIMSON} />

      {/* 4. About the Series + 10 Themes */}
      <OTAboutSeries />

      {/* 5. Outcomes Strip — Slim metrics divider */}
      <OTOutcomesStrip />

      {/* 6. Market Insights — OT threat statistics */}
      <OTMarketInsights />

      {/* Section Transition - Sweep */}
      <SectionTransition variant="sweep" color={OT_CRIMSON} />

      {/* 7. Featured Speakers — Portrait cards + Attendee logo wall */}
      <OTFeaturedSpeakers />

      {/* Section Transition - Expand */}
      <SectionTransition variant="expand" color={OT_CRIMSON} />

      {/* 8. The Experience — The Full Arsenal */}
      <OTExperience />

      {/* Section Transition - Pulse */}
      <SectionTransition variant="pulse" color={OT_CRIMSON} />

      {/* 9. Who Should Attend — Self-qualification */}
      <OTWhoShouldAttend />

      {/* Section Transition - Sweep */}
      <SectionTransition variant="sweep" color={OT_CRIMSON} />

      {/* 10. Sponsors + Media Partners (As Featured In) */}
      <OTSponsors />

      {/* Section Transition - Expand */}
      <SectionTransition variant="expand" color={OT_CRIMSON} />

      {/* 11. Gallery + Video Highlights + Agenda */}
      <OTGallery />

      {/* Section Transition - Pulse */}
      <SectionTransition variant="pulse" color={OT_CRIMSON} />

      {/* 12. FAQ — Command Console */}
      <OTFAQ />

      {/* Section Transition - Sweep */}
      <SectionTransition variant="sweep" color={OT_CRIMSON} />

      {/* 13. Upcoming Edition CTA + Registration Form */}
      <OTUpcomingEditionCTA />

      {/* Section Transition - Expand */}
      <SectionTransition variant="expand" color={OT_CRIMSON} />

      {/* 14. Explore Other Series — Cross-sell */}
      <OTExploreOtherSeries />

      {/* Section Transition - Sweep */}
      <SectionTransition variant="sweep" color={OT_CRIMSON} />

      {/* 15. Footer */}
      <Footer />
    </div>
  );
}
