import {
  HeroSection,
  EventSeriesShowcase,
  ImpactBar,
  AnnualTimeline,
  NetworkFirst,
  PhotoGallery,
  WhyEFG,
  Testimonials,
  SponsorsPartners,
  InquiryForm,
  Footer,
} from "@/components/sections";
import SectionTransition from "@/components/effects/SectionTransition";

export default function Home() {
  return (
    <div>
      {/* The Hero — The Promise */}
      <HeroSection />

      {/* The Event Series — Four Worlds */}
      <EventSeriesShowcase />

      {/* NetworkFirst Boardrooms — Most exclusive product, high up */}
      <NetworkFirst />

      {/* Section Transition - Sweep */}
      <SectionTransition variant="sweep" />

      {/* The Impact Bar — Numbers That Matter (flows from Event Series via gradient) */}
      <ImpactBar />

      {/* Annual Timeline — The Year Ahead (flows directly from ImpactBar) */}
      <AnnualTimeline />

      {/* Section Transition - Expand */}
      <SectionTransition variant="expand" />

      {/* Photo Gallery — Moments That Matter */}
      <PhotoGallery />

      {/* Section Transition - Pulse */}
      <SectionTransition variant="pulse" />

      {/* Why Events First Group — The Trust */}
      <WhyEFG />

      {/* Section Transition - Sweep */}
      <SectionTransition variant="sweep" />

      {/* Testimonials — The Human Voice */}
      <Testimonials />

      {/* Sponsors & Partners — The Credibility */}
      <SponsorsPartners />

      {/* Section Transition - Pulse */}
      <SectionTransition variant="pulse" />

      {/* Get Involved — Inquiry Form */}
      <InquiryForm />

      {/* Section Transition - Sweep */}
      <SectionTransition variant="sweep" />

      {/* Footer — The Credits */}
      <Footer />
    </div>
  );
}
