import Link from "next/link";
import {
  loadConnectContext,
  listOrgSponsorships,
  listOrgSignals,
  listEventAttendees,
  createConnectServerClient,
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
  type Attendee,
  type IntelligenceSignal,
  type SponsorshipWithEventAndDeliverables,
  TIER_LABEL,
} from "@/lib/connect/types";
import { PageHeader } from "../_PageHeader";
import { TierPill } from "../_TierPill";
import { SeriesPill } from "../_SeriesPill";

export const metadata = { title: "Home — EFG Connect" };

export default async function DashboardPage() {
  const ctx = await loadConnectContext();
  const sponsorships = await listOrgSponsorships(ctx.organization.id);
  const signals = await listOrgSignals(ctx.organization.id);

  const upcoming = sponsorships.filter(
    (s) => s.event.status === "upcoming" || s.event.status === "active",
  );
  const past = sponsorships.filter((s) => s.event.status === "completed");

  // Pull open deliverables across all sponsorships
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
          .limit(8)
      : { data: [] as Array<Deliverable & {
          sponsorship: { id: string; event: { name: string } };
        }> };

  const openDeliverables =
    (openDeliverablesData ?? []) as Array<Deliverable & {
      sponsorship: { id: string; event: { name: string } };
    }>;

  // ─── SINGLE-ACTIVE-SPONSORSHIP MODE ─────────────────────────────────────
  // Render the rich command-center layout when the org has exactly one
  // active/upcoming sponsorship — pulls in deliverables breakdown and
  // confirmed attendee preview for that featured event.
  if (upcoming.length === 1 && past.length === 0) {
    const featured = upcoming[0];
    const { data: featuredDetail } = await supabase
      .from("connect_sponsorships")
      .select("*, event:connect_events(*), deliverables:connect_deliverables(*)")
      .eq("id", featured.id)
      .single();
    const detail = featuredDetail as unknown as SponsorshipWithEventAndDeliverables;
    detail.deliverables = [...(detail.deliverables ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order,
    );
    const attendees = await listEventAttendees(featured.event.id);

    return (
      <SingleSponsorshipDashboard
        firstName={ctx.profile.full_name.split(" ")[0]}
        sponsorship={detail}
        attendees={attendees}
        signals={signals}
      />
    );
  }

  // ─── MULTI / EMPTY MODE ─────────────────────────────────────────────────
  // Original grid layout for orgs with 0 or 2+ sponsorships.
  return (
    <MultiSponsorshipDashboard
      firstName={ctx.profile.full_name.split(" ")[0]}
      sponsorships={sponsorships}
      upcoming={upcoming}
      past={past}
      signals={signals}
      openDeliverables={openDeliverables}
    />
  );
}

// ═════════════════════════════════════════════════════════════════════════
// SINGLE-SPONSORSHIP COMMAND CENTER
// ═════════════════════════════════════════════════════════════════════════

function SingleSponsorshipDashboard({
  firstName,
  sponsorship: s,
  attendees,
  signals,
}: {
  firstName: string;
  sponsorship: SponsorshipWithEventAndDeliverables;
  attendees: Attendee[];
  signals: IntelligenceSignal[];
}) {
  const days = daysUntil(s.event.start_date) ?? 0;
  const totalDeliv = s.deliverables.length;
  const doneDeliv = s.deliverables.filter((d) => d.status === "complete").length;
  const pct = totalDeliv === 0 ? 0 : Math.round((doneDeliv / totalDeliv) * 100);
  const openDelivs = s.deliverables.filter((d) => d.status !== "complete");
  const upcomingDelivs = openDelivs.slice(0, 5);

  // Top attendees: show 6 with seniority weighting (c_suite first)
  const SENIORITY_RANK: Record<string, number> = {
    c_suite: 0, svp_evp: 1, vp: 2, director: 3, head: 4, manager: 5, other: 6,
  };
  const topAttendees = [...attendees]
    .sort(
      (a, b) =>
        (SENIORITY_RANK[a.seniority ?? "other"] ?? 99) -
        (SENIORITY_RANK[b.seniority ?? "other"] ?? 99),
    )
    .slice(0, 6);

  return (
    <div style={{ fontFamily: "var(--font-outfit)" }}>
      <PageHeader
        eyebrow={greetingEyebrow()}
        title={`Good ${timeOfDay()}, ${firstName}`}
        description={`Your ${s.event.name} command centre. Live data from EFG Operations.`}
      />

      <div className="space-y-8 px-6 py-8 lg:px-10 lg:py-10">
        {/* ─── HERO CARD ─────────────────────────────────────────────── */}
        <FeaturedHero sponsorship={s} days={days} pct={pct} />

        {/* ─── AT-A-GLANCE STRIP ─────────────────────────────────────── */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Glance
            label="Days to event"
            value={
              days < 0
                ? `${Math.abs(days)}d ago`
                : days === 0
                ? "Today"
                : `${days}`
            }
            sub={days > 0 ? "until live" : days === 0 ? "live today" : "completed"}
            tabular
          />
          <Glance
            label="Deliverables"
            value={`${doneDeliv}/${totalDeliv}`}
            sub={`${pct}% complete`}
            tabular
          />
          <Glance
            label="Confirmed attendees"
            value={attendees.length.toString()}
            sub="verified end-users"
            tabular
          />
          <Glance
            label="Contract value"
            value={formatUSD(s.contract_value_usd)}
            sub={TIER_LABEL[s.tier]}
            tabular
          />
        </section>

        {/* ─── TWO COLUMN: deliverables + intelligence ────────────────── */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Up next deliverables */}
          <div className="lg:col-span-2">
            <SectionHeader
              title="Up next"
              hint={`${openDelivs.length} open`}
              link={{
                href: `/connect/sponsorships/${s.id}`,
                label: "Open tracker",
              }}
            />
            {openDelivs.length === 0 ? (
              <EmptyState text="All deliverables complete. Lead capture opens on event day." />
            ) : (
              <ul className="overflow-hidden rounded-2xl border border-gray-border bg-black-card">
                {upcomingDelivs.map((d, i) => (
                  <UpNextRow key={d.id} d={d} last={i === upcomingDelivs.length - 1} />
                ))}
              </ul>
            )}
          </div>

          {/* Intelligence */}
          <div>
            <SectionHeader
              title="Intelligence"
              hint="Live"
              link={{ href: "/connect/intelligence", label: "Open feed" }}
            />
            {signals.length === 0 ? (
              <EmptyState text="Intelligence signals will appear as the event approaches." />
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
                    <div className="mt-1.5 text-[13.5px] font-semibold leading-snug text-white">
                      {sig.headline}
                    </div>
                    {sig.body && (
                      <div className="mt-1.5 text-[12.5px] leading-relaxed text-white-dim">
                        {sig.body}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ─── CONFIRMED ATTENDEES PREVIEW ────────────────────────────── */}
        {topAttendees.length > 0 && (
          <section>
            <SectionHeader
              title="Top confirmed attendees"
              hint={`${attendees.length} verified`}
              link={{
                href: `/connect/attendees?event=${s.event.id}`,
                label: "Browse all + filters",
              }}
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topAttendees.map((a) => (
                <AttendeeChip key={a.id} a={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ─── HERO CARD ─────────────────────────────────────────────────────────────

function FeaturedHero({
  sponsorship: s,
  days,
  pct,
}: {
  sponsorship: SponsorshipWithEventAndDeliverables;
  days: number;
  pct: number;
}) {
  return (
    <Link
      href={`/connect/sponsorships/${s.id}`}
      className="group relative block overflow-hidden rounded-3xl border border-gray-border bg-black-card transition-all hover:border-gray-border-hover"
      style={{ minHeight: 360 }}
    >
      {/* Image */}
      {s.event.hero_image_url && (
        <div
          aria-hidden
          className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-[1.02]"
          style={{
            backgroundImage: `
              linear-gradient(180deg, rgba(10,10,10,0.40) 0%, rgba(10,10,10,0.95) 85%),
              url(${s.event.hero_image_url})
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Orange glow */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(232,101,26,0.18) 0%, transparent 65%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-7 sm:p-10">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange">
              Your active sponsorship
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <SeriesPill series={s.event.series} />
            <TierPill tier={s.tier} size="md" />
          </div>
          <h2
            className="mt-4 max-w-[820px] text-[34px] font-bold leading-[1.05] tracking-tight text-white sm:text-[44px] lg:text-[52px]"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            {s.event.name}
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[14px] text-white-dim">
            <span>{s.event.city ?? "TBC"}</span>
            <span className="text-white-muted">·</span>
            <span>{formatDateRange(s.event.start_date, s.event.end_date)}</span>
            {s.notes && (
              <>
                <span className="text-white-muted">·</span>
                <span className="max-w-[420px] truncate text-white-muted">
                  {s.notes}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Bottom strip — countdown + progress + CTA */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
            <Stat
              label="Time to event"
              value={
                days > 0
                  ? `${days}d`
                  : days === 0
                  ? "Today"
                  : `${Math.abs(days)}d ago`
              }
              accent
            />
            <Stat label="Deliverables" value={`${pct}%`} sub="complete" />
          </div>
          <div className="ml-auto inline-flex items-center gap-2 rounded-lg border border-gray-border-hover bg-black/60 px-4 py-2.5 text-[13px] font-medium text-white backdrop-blur transition-all group-hover:border-orange/40 group-hover:bg-orange/10">
            Open sponsorship
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </div>
        </div>

        {/* Progress bar — full width inside hero, subtle */}
        <div className="mt-5">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-orange transition-all"
              style={{ width: `${pct}%`, boxShadow: "0 0 12px rgba(232,101,26,0.4)" }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── PARTS ─────────────────────────────────────────────────────────────────

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-white-muted">
        {label}
      </div>
      <div
        className={`mt-1 text-[26px] font-bold tabular-nums tracking-tight sm:text-[32px] ${accent ? "text-orange-bright" : "text-white"}`}
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
      >
        {value}
        {sub && (
          <span className="ml-1.5 text-[12px] font-normal text-white-muted">
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

function Glance({
  label,
  value,
  sub,
  tabular,
}: {
  label: string;
  value: string;
  sub: string;
  tabular?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-border bg-black-card p-5">
      <div className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-white-muted">
        {label}
      </div>
      <div
        className={`mt-2 text-[24px] font-bold tracking-tight text-white ${tabular ? "tabular-nums" : ""}`}
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
      >
        {value}
      </div>
      <div className="mt-1 text-[11.5px] text-white-muted">{sub}</div>
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
    <div className="rounded-2xl border border-dashed border-gray-border p-6 text-center text-[12.5px] text-white-muted">
      {text}
    </div>
  );
}

function UpNextRow({ d, last }: { d: Deliverable; last: boolean }) {
  const days = daysUntil(d.due_date);
  let dueColor = "var(--white-dim)";
  let dueBg = "rgba(255,255,255,0.04)";
  if (d.status === "overdue" || (days != null && days < 0)) {
    dueColor = "rgba(255,150,150,0.95)";
    dueBg = "rgba(255,80,80,0.08)";
  } else if (days != null && days <= 7) {
    dueColor = "var(--orange-bright)";
    dueBg = "rgba(232,101,26,0.10)";
  }
  const statusLabel: Record<Deliverable["status"], string> = {
    not_started: "Not started",
    in_progress: "In progress",
    complete: "Complete",
    overdue: "Overdue",
  };

  return (
    <li
      className={`flex items-start gap-4 px-5 py-4 ${
        last ? "" : "border-b border-gray-border"
      }`}
    >
      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-border-hover" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13.5px] font-medium text-white">{d.title}</span>
          <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white-muted">
            {statusLabel[d.status]}
          </span>
        </div>
        {d.description && (
          <div className="mt-1 line-clamp-1 text-[12px] text-white-muted">
            {d.description}
          </div>
        )}
      </div>
      <span
        className="shrink-0 rounded-full border border-gray-border px-2.5 py-1 text-[10.5px] font-medium tabular-nums"
        style={{ background: dueBg, color: dueColor }}
      >
        {relativeDate(d.due_date)}
      </span>
    </li>
  );
}

function AttendeeChip({ a }: { a: Attendee }) {
  const initials = a.full_name
    .replace(/^(H\.E\.|Dr\.)\s+/, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
  return (
    <div className="rounded-2xl border border-gray-border bg-black-card p-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold uppercase">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold text-white">
            {a.full_name}
          </div>
          {a.job_title && (
            <div className="truncate text-[11.5px] text-white-dim">
              {a.job_title}
            </div>
          )}
          {a.company && (
            <div className="mt-1 truncate text-[11px] text-white-muted">
              {a.company}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// MULTI / EMPTY DASHBOARD (original grid)
// ═════════════════════════════════════════════════════════════════════════

function MultiSponsorshipDashboard({
  firstName,
  sponsorships,
  upcoming,
  past,
  signals,
  openDeliverables,
}: {
  firstName: string;
  sponsorships: SponsorshipWithEvent[];
  upcoming: SponsorshipWithEvent[];
  past: SponsorshipWithEvent[];
  signals: IntelligenceSignal[];
  openDeliverables: Array<Deliverable & {
    sponsorship: { id: string; event: { name: string } };
  }>;
}) {
  const totalContractValue = sponsorships.reduce(
    (sum, s) => sum + (s.contract_value_usd ?? 0),
    0,
  );

  return (
    <div>
      <PageHeader
        eyebrow={greetingEyebrow()}
        title={`Good ${timeOfDay()}, ${firstName}`}
        description="Everything you sponsor with EFG, in one place. Updated in real time."
      />

      <div
        className="space-y-10 px-6 py-10 lg:px-10"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Glance label="Active sponsorships" value={String(upcoming.length)} sub="" tabular />
          <Glance label="Past editions" value={String(past.length)} sub="" tabular />
          <Glance label="Open deliverables" value={String(openDeliverables.length)} sub="due soon" tabular />
          <Glance label="Annual commitment" value={formatUSD(totalContractValue)} sub="contract total" tabular />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
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
                  <li key={s.id}>
                    <Link
                      href={`/connect/sponsorships/${s.id}`}
                      className="group flex items-center gap-4 rounded-2xl border border-gray-border bg-black-card p-4 transition-all hover:border-gray-border-hover hover:bg-black-card-hover"
                    >
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
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <SectionHeader
                title="Intelligence"
                hint="Live"
                link={{ href: "/connect/intelligence", label: "Open feed" }}
              />
              {signals.length === 0 ? (
                <EmptyState text="No signals yet." />
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
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── SHARED HELPERS ────────────────────────────────────────────────────────

function timeOfDay(): "morning" | "afternoon" | "evening" {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

function greetingEyebrow(): string {
  return "Home";
}
