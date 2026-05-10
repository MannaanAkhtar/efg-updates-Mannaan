import { redirect } from "next/navigation";
import { loadConnectContext } from "@/lib/connect/server";
import { ConnectShell } from "./_ConnectShell";

export default async function ConnectAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await loadConnectContext();

  // First-run: if interests not captured, push the user through onboarding.
  if (!ctx.interests?.completed_at) {
    redirect("/connect/onboarding");
  }

  return (
    <ConnectShell
      orgName={ctx.organization.name}
      orgLogoUrl={ctx.organization.logo_url}
      userName={ctx.profile.full_name}
      userTitle={ctx.profile.job_title}
    >
      {children}
    </ConnectShell>
  );
}
