import { ComingSoon } from "../_ComingSoon";

export default function MarketplacePage() {
  return (
    <ComingSoon
      eyebrow="Phase 3"
      title="Cross-Event Marketplace"
      description="Curated bundles across the four series — your next sponsorship, suggested by your ICP."
      shipDate="Q1 2027"
      features={[
        "Bundle recommendations — Cyber + OT + Digital First combinations matched to your buyer",
        "Discounted multi-event pricing only visible to existing sponsors",
        "Pre-approved tier upgrades — express interest, EFG sales follows up within 48 hours",
        "Annual commitment view — lock pricing across 4–6 events per year",
      ]}
    />
  );
}
