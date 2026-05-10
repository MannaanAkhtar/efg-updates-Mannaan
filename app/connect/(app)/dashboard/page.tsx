import Link from "next/link";
import {
  loadConnectContext,
  listOrgSponsorships,
  listOrgSignals,
} from "@/lib/connect/server";
import {
  formatDateRange,
  formatUSD,
  daysUntil,
  relativeDate,
} from "@/lib/connect/format";
import {
  type Deliverable,
  type SponsorshipWithEvent,
  TIER_LABEL,
} from "@/lib/connect/types";
import { createConnectServerClient } from "@/lib/connect/server";
import { PageHeader } from "../_PageHeader";
import { TierPill } from "../_TierPill";
import { SeriesPill } from "../_SeriesPill";

export const metadata = { title: "Home — EFG Connect" };

export default async function DashboardPage() {
  const ctx = await loadConnectContext();
  const sponsorships = await listOrgSponsorships(ctx.organization.id);
  const signals = await listOrgSignals(ctx.organization.id);

  // Pull all open deliverables across the org's sponsorships in one query.
  const supabase = await createConnectServerClient();
  const sponsorshipIds = sponsorships.map((s) => s.id);
  const { data: openDeliverablesData } =
    sponsorshipIds.length > 0
      ? await supabase
          .from("connect_deliverables")
          .select("*, sponsorship:connect_sponsorships(id,event:connect_events(name))")
          .in("sponsorship_id", sponsorshipIds)
          .in("status", ["not_started", "in_progress", "overdue"])
          .order("due_date", { ascending: true, nullsFirst: false })
          .limit(6)
      : { data: [] as Array<Deliverable & {
          sponsorship: { id: string; event: { name: string } };
        }> };

  const openDeliverables =
    (openDeliverablesData ?? []) as Array<Deliverable & {
      sponsorship: { id: string; event: { name: string } };
    }>;

  const upcoming = sponsorships.filter(
    (s) => s.event.status === "upcoming" || s.event.status === "active",
  );
  const past = sponsorships.filter((s) => s.event.status === "completed");

  const totalContractValue = sponsorships.reduce(
    (sum, s) => sum + (s.contract_value_usd ?? 0),
    0,
  );

  return (
    <div>
      <PageHeader
        eyebrow="Home"
        title={greeting(ctx.profile.full_name)}
        description="Everything you sponsor with EFG, in one place. Updated in real time."
      />

      <div className="space-y-10 px-6 py-10 lg:px-10" style={{ fontFamily: "var(--font-outfit)" }}>
        {/* ─── METRICS STRIP ─────────────────────────────────────────── */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Metric label="Active sponsorships" value={String(upcoming.length)} />
          <Metric label="Past editions" value={String(past.length)} />
          <Metric
            label="Open deliverables"
            value={String(openDeliverables.length)}
          />
          <Metric
            label="Annual commitment"
            value={formatUSD(totalContractValue)}
            tabular
          />
        </section>

        {/* ─── TWO-COLUMN ────────────────────────────────────────────── */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Upcoming */}
          <div className="lg:col-span-2">
            <SectionHeader
              title="Upcoming sponsorships"
              hint={`${upcoming.length} active`}
              link={{ href: "/connect/sponsorships", label: "View all" }}
            />
            {upcoming.length === 0 ? (
              <EmptyState text="No upcoming sponsorships." />
            ) : (
              <ul className="space-y-3">
                {upcoming.slice(0, 4).map((s) => (
                  <UpcomingRow key={s.id} sponsorship={s} />
                ))}
              </ul>
            )}
          </div>

          {/* Signals + open deliverables */}
          <div className="space-y-6">
            <div>
              <SectionHeader
                title="Intelligence"
                hint="Live"
                link={{ href: "/connect/intelligence", label: "Open feed" }}
              />
              {signals.length === 0 ? (
                <EmptyState text="No signals yet — check back after onboarding completes." />
              ) : (
                <ul className="space-y-3">
                  {signals.slice(0, 3).map((sig) => (
                    <li
                      key={sig.id}
                      className="rounded-2xl border border-gray-border bg-black-card p-4"
                    >
                      <div className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-orange">
                        {sig.type.replace(/_/g, " ")}
                      </div>
                      <div className="mt-1 text-[13.5px] font-semibold text-white">
                        {sig.headline}
                      </div>
                      {sig.body && (
                        <div className="mt-1 text-[12.5px] leading-relaxed text-white-dim">
                          {sig.body}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <SectionHeader
                title="Open deliverables"
                hint={`${openDeliverables.length} due`}
              />
              {openDeliverables.length === 0 ? (
                <EmptyState text="You're all caught up." />
              ) : (
                <ul className="space-y-2">
                  {openDeliverables.map((d) => (
                    <li
                      key={d.id}
                      className="rounded-xl border border-gray-border bg-black-card p-3.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="text-[12.5px] font-medium text-white">
                            {d.title}
                          </div>
                          <Link
                            href={`/connect/sponsorships/${d.sponsorship.id}`}
                            className="mt-0.5 block truncate text-[11px] text-white-muted hover:text-white-dim"
                          >
                            {d.sponsorship.event.name}
                          </Link>
                        </div>
                        <DeliverableDuePill due={d.due_date} status={d.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* ─── PAST ───────────────────────────────────────────────────── */}
        {past.length > 0 && (
          <section>
            <SectionHeader
              title="Past editions"
              hint={`${past.length} completed`}
              link={{ href: "/connect/sponsorships", label: "View all" }}
            />
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {past.slice(0, 3).map((s) => (
                <PastCard key={s.id} sponsorship={s} />
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

// ─── PARTS ──────────────────────────────────────────────────────────────────

function greeting(name: string): string {
  const hour = new Date().getHours();
  const part = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return `${part}, ${name.split(" ")[0]}`;
}

function Metric({ label, value, tabular }: { label: string; value: string; tabular?: boolean }) {
  return (
    <div className="rounded-2xl border border-gray-border bg-black-card p-5">
      <div className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-white-muted">
        {label}
      </div>
      <div
        className={`mt-2 text-[28px] font-bold tracking-tight text-white ${tabular ? "tabular-nums" : ""}`}
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
      >
        {value}
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  hint,
  link,
}: {
  title: string;
  hint?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <div className="flex items-baseline gap-3">
        <h2
          className="text-[15px] font-bold tracking-tight text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
        {hint && (
          <span className="text-[11px] uppercase tracking-[0.14em] text-white-muted">
            {hint}
          </span>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="text-[12px] text-white-dim transition hover:text-orange-bright"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-border bg-transparent p-6 text-center text-[12.5px] text-white-muted">
      {text}
    </div>
  );
}

function UpcomingRow({ sponsorship: s }: { sponsorship: SponsorshipWithEvent }) {
  const days = daysUntil(s.event.start_date);
  return (
    <li>
      <Link
        href={`/connect/sponsorships/${s.id}`}
        className="group flex items-center gap-4 rounded-2xl border border-gray-border bg-black-card p-4 transition-all hover:border-gray-border-hover hover:bg-black-card-hover"
      >
        {/* Image */}
        <div
          className="hidden h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white/5 sm:block"
          style={{
            backgroundImage: s.event.hero_image_url
              ? `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.1)), url(${s.event.hero_image_url})`
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
            className="mt-1.5 text-[15px] font-semibold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {s.event.name}
          </div>
          <div className="mt-0.5 text-[12px] text-white-dim">
            {s.event.city ? `${s.event.city} · ` : ""}
            {formatDateRange(s.event.start_date, s.event.end_date)}
          </div>
        </div>
        {/* Right */}
        <div className="hidden text-right md:block">
          <div className="text-[12px] uppercase tracking-[0.14em] text-white-muted">
            {days != null && days > 0 ? "Starts" : "Status"}
          </div>
          <div className="mt-1 text-[13px] font-semibold text-white">
            {days != null && days > 0
              ? `In ${days} days`
              : s.event.status === "active"
              ? "Active"
              : "—"}
          </div>
        </div>
      </Link>
    </li>
  );
}

function PastCard({ sponsorship: s }: { sponsorship: SponsorshipWithEvent }) {
  return (
    <li>
      <Link
        href={`/connect/sponsorships/${s.id}`}
        className="block rounded-2xl border border-gray-border bg-black-card p-4 transition hover:border-gray-border-hover hover:bg-black-card-hover"
      >
        <div className="flex items-center gap-3">
          <SeriesPill series={s.event.series} />
          <TierPill tier={s.tier} />
        </div>
        <div
          className="mt-2 text-[14px] font-semibold tracking-tight text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {s.event.name}
        </div>
        <div className="mt-0.5 text-[11.5px] text-white-muted">
          {formatDateRange(s.event.start_date, s.event.end_date)} · {TIER_LABEL[s.tier]}
        </div>
      </Link>
    </li>
  );
}

function DeliverableDuePill({
  due,
  status,
}: {
  due: string | null;
  status: Deliverable["status"];
}) {
  const days = daysUntil(due);
  let bg = "rgba(255,255,255,0.05)";
  let text = "var(--white-dim)";
  let label = relativeDate(due);

  if (status === "overdue" || (days != null && days < 0)) {
    bg = "rgba(255,80,80,0.08)";
    text = "rgba(255,150,150,0.95)";
    label = days != null ? `${Math.abs(days)}d late` : "Overdue";
  } else if (days != null && days <= 14) {
    bg = "rgba(232,101,26,0.10)";
    text = "var(--orange-bright)";
  }

  return (
    <span
      className="inline-flex shrink-0 rounded-full border border-gray-border px-2 py-0.5 text-[10.5px] font-medium tabular-nums"
      style={{ background: bg, color: text }}
    >
      {label}
    </span>
  );
}
