import { requireConnectSession } from "@/lib/connect/server";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth required, but we deliberately don't enforce the
  // "interests completed" check here — onboarding IS that check.
  await requireConnectSession();

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 30% at 50% 0%, rgba(232,101,26,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 30% 25% at 90% 90%, rgba(232,101,26,0.04) 0%, transparent 60%)
          `,
        }}
      />
      <div className="relative z-10 px-6 py-12">{children}</div>
    </div>
  );
}
