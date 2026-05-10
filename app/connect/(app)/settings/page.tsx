import { loadConnectContext } from "@/lib/connect/server";
import { PageHeader } from "../_PageHeader";

export default async function SettingsPage() {
  const ctx = await loadConnectContext();

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Account"
        description="Profile, organisation, and preferences. More controls land alongside Phase 2."
      />
      <div
        className="space-y-6 px-6 py-10 lg:px-10"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        <SettingsCard label="Your profile">
          <SettingsRow k="Name" v={ctx.profile.full_name} />
          <SettingsRow k="Email" v={ctx.user.email} />
          {ctx.profile.job_title && <SettingsRow k="Job title" v={ctx.profile.job_title} />}
          <SettingsRow k="Role" v={ctx.profile.role} capitalize />
        </SettingsCard>

        <SettingsCard label="Organisation">
          <SettingsRow k="Name" v={ctx.organization.name} />
          {ctx.organization.website && (
            <SettingsRow k="Website" v={ctx.organization.website} />
          )}
        </SettingsCard>

        <SettingsCard label="Notifications" muted>
          <p className="text-[13px] text-white-dim">
            Weekly digest preferences, deliverable nudges, and target-account alerts
            land with the Phase 2 Intelligence release.
          </p>
        </SettingsCard>
      </div>
    </div>
  );
}

function SettingsCard({
  label,
  children,
  muted = false,
}: {
  label: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-border ${
        muted ? "bg-black-card/40" : "bg-black-card"
      } p-6`}
    >
      <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white-muted">
        {label}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SettingsRow({
  k,
  v,
  capitalize,
}: {
  k: string;
  v: string;
  capitalize?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 border-b border-gray-border pb-3 last:border-b-0 last:pb-0">
      <div className="text-[12.5px] text-white-muted">{k}</div>
      <div
        className={`col-span-2 text-[13.5px] text-white ${capitalize ? "capitalize" : ""}`}
      >
        {v}
      </div>
    </div>
  );
}
