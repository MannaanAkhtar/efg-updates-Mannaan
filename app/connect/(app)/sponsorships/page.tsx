import Link from "next/link";
import {
  loadConnectContext,
  listOrgSponsorships,
} from "@/lib/connect/server";
import {
  formatDateRange,
  formatUSD,
  daysUntil,
} from "@/lib/connect/format";
import { TIER_LABEL, type SponsorshipWithEvent } from "@/lib/connect/types";
import { PageHeader } from "../_PageHeader";
import { TierPill } from "../_TierPill";
import { SeriesPill } from "../_SeriesPill";

export const metadata = { title: "My Sponsorships — EFG Connect" };

const STATUS_LABEL: Record<string, string> = {
  upcoming: "Upcoming",
  active: "Active",
  completed: "Past",
  cancelled: "Cancelled",
};

export default async function SponsorshipsPage() {
  const ctx = await loadConnectContext();
  const sponsorships = await listOrgSponsorships(ctx.organization.id);

  const groups: Record<string, SponsorshipWithEvent[]> = {
    active: sponsorships.filter((s) => s.event.status === "active"),
    upcoming: sponsorships.filter((s) => s.event.status === "upcoming"),
    completed: sponsorships.filter((s) => s.event.status === "completed"),
  };

  const totalActive = groups.active.length + groups.upcoming.length;
  const totalValue = sponsorships.reduce(
    (sum, s) => sum + (s.contract_value_usd ?? 0),
    0,
  );

  return (
    <div>
      <PageHeader
        eyebrow="My Sponsorships"
        title="Every event, one view"
        description="Active, upcoming, and past — with deliverables, attendees, and leads in one click."
      />

      <div
        className="space-y-10 px-6 py-10 lg:px-10"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {/* Summary strip */}
        <div className="flex flex-wrap items-baseline gap-x-10 gap-y-2 rounded-2xl border border-gray-border bg-black-card px-6 py-5">
          <Stat label="Active + upcoming" value={String(totalActive)} />
          <Stat label="Past editions" value={String(groups.completed.length)} />
          <Stat label="Total commitment" value={formatUSD(totalValue)} tabular />
        </div>

        {/* Sections */}
        {(["active", "upcoming", "completed"] as const).map((status) => {
          const items = groups[status];
          if (items.length === 0) return null;
          return (
            <section key={status}>
              <h2
                className="mb-4 flex items-baseline gap-3 text-[14px] font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {STATUS_LABEL[status]}
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white-muted">
                  {items.length}
                </span>
              </h2>
              <ul className="space-y-3">
                {items.map((s) => (
                  <SponsorshipRow key={s.id} sponsorship={s} />
                ))}
              </ul>
            </section>
          );
        })}

        {sponsorships.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-border p-10 text-center text-[13px] text-white-muted">
            No sponsorships yet. Speak with your EFG account manager.
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, tabular }: { label: string; value: string; tabular?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-white-muted">
        {label}
      </div>
      <div
        className={`mt-1 text-[22px] font-bold tracking-tight text-white ${tabular ? "tabular-nums" : ""}`}
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
      >
        {value}
      </div>
    </div>
  );
}

function SponsorshipRow({ sponsorship: s }: { sponsorship: SponsorshipWithEvent }) {
  const days = daysUntil(s.event.start_date);
  return (
    <li>
      <Link
        href={`/connect/sponsorships/${s.id}`}
        className="group block rounded-2xl border border-gray-border bg-black-card p-5 transition-all hover:border-gray-border-hover hover:bg-black-card-hover"
      >
        <div className="flex items-start gap-5">
          {/* Image */}
          <div
            className="hidden h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-white/5 sm:block"
            style={{
              backgroundImage: s.event.hero_image_url
                ? `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.05)), url(${s.event.hero_image_url})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Body */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <SeriesPill series={s.event.series} />
              <TierPill tier={s.tier} />
            </div>
            <div
              className="mt-1.5 text-[17px] font-semibold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {s.event.name}
            </div>
            <div className="mt-1 text-[12.5px] text-white-dim">
              {s.event.city ? `${s.event.city} · ` : ""}
              {formatDateRange(s.event.start_date, s.event.end_date)}
              {s.notes && (
                <span className="ml-2 text-white-muted"> · {s.notes}</span>
              )}
            </div>
          </div>
          {/* Right */}
          <div className="hidden flex-col items-end gap-1 md:flex">
            <span className="text-[11px] uppercase tracking-[0.14em] text-white-muted">
              {TIER_LABEL[s.tier]}
            </span>
            <span
              className="text-[14px] font-semibold tabular-nums text-white"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {formatUSD(s.contract_value_usd)}
            </span>
            {days != null && days > 0 && (
              <span className="text-[11px] text-white-muted">In {days} days</span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}
