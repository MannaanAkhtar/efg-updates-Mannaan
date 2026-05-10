import { ComingSoon } from "../_ComingSoon";

export default function IntelligencePage() {
  return (
    <ComingSoon
      eyebrow="Phase 2"
      title="Intelligence"
      description="Personalised signals on your target accounts and the events most aligned to your ICP."
      shipDate="Q4 2026"
      features={[
        "Daily target-account watchlist — registrations, role changes, sponsorship moves",
        "Event-fit score — what's coming next that matches your audience",
        "Vertical pulse — quarterly intelligence brief on your industry across the EFG network",
        "Competitor activity — when the people you sell against sponsor an event",
      ]}
    />
  );
}
