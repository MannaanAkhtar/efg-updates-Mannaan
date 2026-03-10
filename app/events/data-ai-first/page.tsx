"use client";

import {
  DAHero,
  DAEditionsMap,
  DAThesis,
  DADataWall,
  DAVideoHighlights,
  DATopics,
  DAOutcomesStrip,
  DAFormat,
  DAAudience,
  DASpeakers,
  DASponsorsMarquee,
  DAFAQ,
  DAUpcomingEditionCTA,
  DAExploreOtherSeries,
} from "@/components/data-ai-first";
import { SectionTransition, FilmGrain } from "@/components/effects";
import { Footer } from "@/components/sections";

const EMERALD = "#0F735E";

export default function DataAIFirstPage() {
  return (
    <div style={{ background: "#0A0A0A" }}>
      {/* Film grain — full page overlay */}
      <FilmGrain opacity={0.025} />

      {/* 1. Hook */}
      <DAHero />
      <SectionTransition variant="dataflow" color={EMERALD} />

      {/* 2. Where & when — now they're sold */}
      <DAEditionsMap />
      <SectionTransition variant="expand" color={EMERALD} />

      {/* 3. What is this & why it matters */}
      <DAThesis />
      <SectionTransition variant="expand" color={EMERALD} />

      {/* 4. Prove it with numbers */}
      <DADataWall />
      <SectionTransition variant="dataflow" color={EMERALD} />

      {/* 5. Highlights */}
      <DAVideoHighlights />
      <SectionTransition variant="pulse" color={EMERALD} />

      {/* 6. What we cover */}
      <DATopics />
      <DAOutcomesStrip />

      {/* 7. How it works */}
      <DAFormat />
      <SectionTransition variant="dataflow" color={EMERALD} />

      {/* 8. Who it's for */}
      <DAAudience />
      <SectionTransition variant="sweep" color={EMERALD} />

      {/* 9. Who's speaking */}
      <DASpeakers />
      <SectionTransition variant="dataflow" color={EMERALD} />

      {/* 10. Partners */}
      <DASponsorsMarquee />
      <SectionTransition variant="expand" color={EMERALD} />

      {/* 11. Answer objections */}
      <DAFAQ />
      <SectionTransition variant="dataflow" color={EMERALD} />

      {/* 10. Action */}
      <DAUpcomingEditionCTA />
      <SectionTransition variant="sweep" color={EMERALD} />

      {/* 11. Cross-sell */}
      <DAExploreOtherSeries />
      <SectionTransition variant="pulse" color={EMERALD} />

      <Footer />
    </div>
  );
}
