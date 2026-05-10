import { ComingSoon } from "../_ComingSoon";

export default function CommunityPage() {
  return (
    <ComingSoon
      eyebrow="Phase 3"
      title="Community"
      description="The fellow-sponsor directory and the NetworkFirst boardroom hub."
      shipDate="Q1 2027"
      features={[
        "Sponsor directory across all four series with seniority tiers",
        "Verified attendee networking ahead of events",
        "NetworkFirst boardroom waitlist + slot-confirmation flow",
        "Direct messaging with the EFG curation team",
      ]}
    />
  );
}
