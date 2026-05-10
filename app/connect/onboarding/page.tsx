import { redirect } from "next/navigation";
import { loadConnectContext } from "@/lib/connect/server";
import { OnboardingFlow } from "./_OnboardingFlow";

export const metadata = { title: "Welcome — EFG Connect" };

export default async function OnboardingPage() {
  const ctx = await loadConnectContext();

  // If interests already captured, skip straight to the dashboard.
  if (ctx.interests?.completed_at) {
    redirect("/connect/dashboard");
  }

  return (
    <OnboardingFlow
      organizationName={ctx.organization.name}
      organizationLogoUrl={ctx.organization.logo_url}
      organizationWebsite={ctx.organization.website}
      userFullName={ctx.profile.full_name}
    />
  );
}
