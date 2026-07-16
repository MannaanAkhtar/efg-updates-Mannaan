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
  OpexPostEventReports,
  OpexRequestResourcesModal,
} from "@/components/opex-first";
import OpexYouTubeShorts from "@/components/opex-first/OpexYouTubeShorts";
import OpexImageBreak from "@/components/opex-first/OpexImageBreak";
import OpexReportFab from "@/components/opex-first/OpexReportFab";
import { Footer } from "@/components/sections";
import SectionTransition from "@/components/effects/SectionTransition";

const VIOLET = "#7C3AED";

export default function OpexFirstPage() {
  return (
    <div style={{ position: "relative", background: "#07051A", isolation: "isolate" }}>
      {/* ── Unified ambient background — one continuous violet-ink field shared by every section ── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 80% 45% at 50% 0%, rgba(124,58,237,0.10) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 85% 108%, rgba(124,58,237,0.06) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 12% 92%, rgba(124,58,237,0.05) 0%, transparent 60%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(circle, rgba(124,58,237,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.4,
        }}
      />

      {/* ── Page content (floats above the shared field) ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* 1. Hero, Full-bleed with badges, stats, ticker */}
        <OpexHero />

        <SectionTransition variant="sweep" color={VIOLET} />

        {/* 2. About, Mission & Vision */}
        <OpexAboutSeries />

        {/* Image break — the room in session (acts as the section divider) */}
        <OpexImageBreak
          image="https://efg-final.s3.eu-north-1.amazonaws.com/events/opex+KSA+few/DSC08208.jpg"
          alt="OPEX First KSA — leaders in session"
          folio="II"
          caption="The room in session — OPEX First KSA, Riyadh."
        />

        {/* 3. Series Journey, Timeline + Editions merged */}
        <OpexSeriesJourney />

        <SectionTransition variant="pulse" color={VIOLET} />

        {/* 3B. Post-Event Reports, Downloadable PDFs */}
        <OpexPostEventReports />

        <SectionTransition variant="sweep" color={VIOLET} />

        {/* 4. Key Themes, 10 topics + market stats */}
        <OpexKeyThemes />

        <SectionTransition variant="sweep" color={VIOLET} />

        {/* 5. Speakers, Portrait card grid */}
        <OpexFeaturedSpeakers />

        <SectionTransition variant="expand" color={VIOLET} />

        {/* 6. Experience, Conference format cards */}
        <OpexExperience />

        <SectionTransition variant="pulse" color={VIOLET} />

        {/* 7. Who Should Attend, Roles & industries */}
        <OpexWhoShouldAttend />

        <SectionTransition variant="sweep" color={VIOLET} />

        {/* 8. Sponsors, Tiered partner wall */}
        <OpexSponsors />

        <SectionTransition variant="expand" color={VIOLET} />

        {/* 9. Gallery, Masonry grid with spotlight */}
        <OpexGallery />

        <SectionTransition variant="pulse" color={VIOLET} />

        {/* 10. Awards, Showpiece glassmorphic cards */}
        <OpexAwards />

        <SectionTransition variant="sweep" color={VIOLET} />

        {/* 11. YouTube Shorts, Video highlights */}
        <OpexYouTubeShorts />

        <SectionTransition variant="pulse" color={VIOLET} />

        {/* 12. Register, CTA + Form with AnimatePresence */}
        <OpexUpcomingEditionCTA />

        <SectionTransition variant="expand" color={VIOLET} />

        {/* 12. Explore, Cross-series cards */}
        <OpexExploreOtherSeries />

        <SectionTransition variant="sweep" color={VIOLET} />

        {/* Footer */}
        <Footer />
      </div>

      {/* Floating "Download our Post Event Reports" prompt (desktop note → mobile FAB) */}
      <OpexReportFab />

      {/* Request Resources modal (portalled to body, triggered by the report FAB + cards) */}
      <OpexRequestResourcesModal />
    </div>
  );
}
