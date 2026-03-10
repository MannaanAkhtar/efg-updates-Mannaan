import {
  OpexHero,
  OpexAboutSeries,
  OpexSeriesJourney,
  OpexKeyThemes,
  OpexFeaturedSpeakers,
  OpexExperience,
  OpexWhoShouldAttend,
  OpexSponsors,
  OpexGallery,
  OpexAwards,
  OpexUpcomingEditionCTA,
  OpexExploreOtherSeries,
} from "@/components/opex-first";
import { Footer } from "@/components/sections";
import SectionTransition from "@/components/effects/SectionTransition";

const VIOLET = "#7C3AED";

export default function OpexFirstPage() {
  return (
    <div>
      {/* 1. Hero — Full-bleed with badges, stats, ticker */}
      <OpexHero />

      <SectionTransition variant="sweep" color={VIOLET} />

      {/* 2. About — Mission & Vision */}
      <OpexAboutSeries />

      <SectionTransition variant="expand" color={VIOLET} />

      {/* 3. Series Journey — Timeline + Editions merged */}
      <OpexSeriesJourney />

      <SectionTransition variant="pulse" color={VIOLET} />

      {/* 4. Key Themes — 10 topics + market stats */}
      <OpexKeyThemes />

      <SectionTransition variant="sweep" color={VIOLET} />

      {/* 5. Speakers — Portrait card grid */}
      <OpexFeaturedSpeakers />

      <SectionTransition variant="expand" color={VIOLET} />

      {/* 6. Experience — Conference format cards */}
      <OpexExperience />

      <SectionTransition variant="pulse" color={VIOLET} />

      {/* 7. Who Should Attend — Roles & industries */}
      <OpexWhoShouldAttend />

      <SectionTransition variant="sweep" color={VIOLET} />

      {/* 8. Sponsors — Tiered partner wall */}
      <OpexSponsors />

      <SectionTransition variant="expand" color={VIOLET} />

      {/* 9. Gallery — Masonry grid with spotlight */}
      <OpexGallery />

      <SectionTransition variant="pulse" color={VIOLET} />

      {/* 10. Awards — Showpiece glassmorphic cards */}
      <OpexAwards />

      <SectionTransition variant="sweep" color={VIOLET} />

      {/* 11. Register — CTA + Form with AnimatePresence */}
      <OpexUpcomingEditionCTA />

      <SectionTransition variant="expand" color={VIOLET} />

      {/* 12. Explore — Cross-series cards */}
      <OpexExploreOtherSeries />

      <SectionTransition variant="sweep" color={VIOLET} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
