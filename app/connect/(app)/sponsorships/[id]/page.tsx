import Link from "next/link";
import { notFound } from "next/navigation";
import {
  loadConnectContext,
  getSponsorshipDetail,
  listEventAttendees,
  listSponsorshipLeads,
} from "@/lib/connect/server";
import {
  formatDateRange,
  formatDate,
  formatUSD,
  daysUntil,
  relativeDate,
} from "@/lib/connect/format";
import {
  TIER_LABEL,
  type Deliverable,
} from "@/lib/connect/types";
import { TierPill } from "../../_TierPill";
import { SeriesPill } from "../../_SeriesPill";

export default async function SponsorshipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await loadConnectContext();
  const sponsorship = await getSponsorshipDetail(id, ctx.organization.id);
  if (!sponsorship) notFound();

  const isPast = sponsorship.event.status === "completed";
  const [attendees, leads] = await Promise.all([
    !isPast ? listEventAttendees(sponsorship.event.id) : Promise.resolve([]),
    isPast ? listSponsorshipLeads(sponsorship.id) : Promise.resolve([]),
  ]);

  // Deliverables progress
  const totalDeliv = sponsorship.deliverables.length;
  const doneDeliv = sponsorship.deliverables.filter((d) => d.status === "complete").length;
  const pct = totalDeliv === 0 ? 0 : Math.round((doneDeliv / totalDeliv) * 100);

  return (
    <div style={{ fontFamily: "var(--font-outfit)" }}>
      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <header
        className="relative overflow-hidden border-b border-gray-border"
        style={{
          minHeight: 280,
        }}
      >
        {sponsorship.event.hero_image_url && (
          <div
            aria-hidden
            className="absolute inset-0 z-0"
            style={{
              background: `
                linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.95) 90%),
                url(${sponsorship.event.hero_image_url})
              `,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        <div className="relative z-10 px-6 py-10 lg:px-10 lg:py-14">
          <Link
            href="/connect/sponsorships"
            className="mb-5 inline-flex items-center gap-2 text-[12px] text-white-dim hover:text-white"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            Back to sponsorships
          </Link>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <SeriesPill series={sponsorship.event.series} />
            <TierPill tier={sponsorship.tier} size="md" />
            <StatusBadge status={sponsorship.status} />
          </div>
          <h1
            className="text-[32px] font-bold leading-[1.05] tracking-tight text-white sm:text-[40px]"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            {sponsorship.event.name}
          </h1>
          <div className="mt-3 text-[14px] text-white-dim">
            {sponsorship.event.city ? `${sponsorship.event.city} · ` : ""}
            {formatDateRange(sponsorship.event.start_date, sponsorship.event.end_date)}
          </div>
          {sponsorship.notes && (
            <p className="mt-5 max-w-[640px] text-[13.5px] leading-relaxed text-white-dim">
              {sponsorship.notes}
            </p>
          )}
        </div>
      </header>

      <div className="space-y-10 px-6 py-10 lg:px-10">
        {/* ─── KEY FACTS ─────────────────────────────────────────────── */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Tier" value={TIER_LABEL[sponsorship.tier]} />
          <Fact label="Contract value" value={formatUSD(sponsorship.contract_value_usd)} tabular />
          <Fact label="Signed" value={formatDate(sponsorship.signed_at)} />
          <Fact
            label={isPast ? "Outcome" : "Starts"}
            value={
              isPast
                ? `${leads.length} leads captured`
                : (() => {
                    const d = daysUntil(sponsorship.event.start_date);
                    return d != null && d > 0 ? `In ${d} days` : "Soon";
                  })()
            }
          />
        </section>

        {/* ─── DELIVERABLES ──────────────────────────────────────────── */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2
                className="text-[18px] font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Deliverables tracker
              </h2>
              <p className="mt-1 text-[12.5px] text-white-dim">
                {doneDeliv} of {totalDeliv} complete · {pct}%
              </p>
            </div>
          </div>
          <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
            <div
              className="h-full rounded-full bg-orange transition-all"
              style={{ width: `${pct}%`, boxShadow: "0 0 12px rgba(232,101,26,0.4)" }}
            />
          </div>
          {sponsorship.deliverables.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-border p-6 text-center text-[13px] text-white-muted">
              No deliverables yet — your EFG account manager is preparing the brief.
            </div>
          ) : (
            <ul className="overflow-hidden rounded-2xl border border-gray-border bg-black-card">
              {sponsorship.deliverables.map((d, i) => (
                <DeliverableRow key={d.id} d={d} last={i === sponsorship.deliverables.length - 1} />
              ))}
            </ul>
          )}
        </section>

        {/* ─── ATTENDEES OR LEADS ────────────────────────────────────── */}
        {isPast ? (
          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2
                  className="text-[18px] font-bold tracking-tight text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Leads captured
                </h2>
                <p className="mt-1 text-[12.5px] text-white-dim">
                  {leads.length} leads from {sponsorship.event.name}
                </p>
              </div>
              <Link
                href={`/api/connect/sponsorships/${sponsorship.id}/leads.csv`}
                className="rounded-lg border border-gray-border-hover bg-black-card px-4 py-2 text-[13px] font-medium text-white transition hover:border-orange/40 hover:bg-black-card-hover"
              >
                Download CSV
              </Link>
            </div>
            {leads.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-border p-6 text-center text-[13px] text-white-muted">
                No leads recorded for this sponsorship.
              </div>
            ) : (
              <LeadsPreview
                rows={leads.slice(0, 6).map((l) => ({
                  name: l.attendee?.full_name ?? "—",
                  title: l.attendee?.job_title ?? "—",
                  company: l.attendee?.company ?? "—",
                  intent: l.intent_level,
                  status: l.follow_up_status,
                  notes: l.notes,
                }))}
                more={Math.max(0, leads.length - 6)}
              />
            )}
          </section>
        ) : (
          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2
                  className="text-[18px] font-bold tracking-tight text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Pre-event attendees
                </h2>
                <p className="mt-1 text-[12.5px] text-white-dim">
                  {attendees.length} verified end-users registered to date
                </p>
              </div>
              <Link
                href={`/connect/attendees?event=${sponsorship.event.id}`}
                className="rounded-lg border border-gray-border-hover bg-black-card px-4 py-2 text-[13px] font-medium text-white transition hover:border-orange/40 hover:bg-black-card-hover"
              >
                Open list & filters →
              </Link>
            </div>
            {attendees.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-border p-6 text-center text-[13px] text-white-muted">
                No attendees confirmed yet — registration ramps in the final weeks.
              </div>
            ) : (
              <AttendeePreview
                rows={attendees.slice(0, 6).map((a) => ({
                  name: a.full_name,
                  title: a.job_title ?? "—",
                  company: a.company ?? "—",
                  country: a.country ?? "—",
                  industry: a.industry ?? "—",
                }))}
                more={Math.max(0, attendees.length - 6)}
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
}

// ─── PARTS ──────────────────────────────────────────────────────────────────

function Fact({ label, value, tabular }: { label: string; value: string; tabular?: boolean }) {
  return (
    <div className="rounded-2xl border border-gray-border bg-black-card p-4">
      <div className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-white-muted">
        {label}
      </div>
      <div
        className={`mt-1 text-[18px] font-semibold tracking-tight text-white ${tabular ? "tabular-nums" : ""}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    active:    { bg: "rgba(15,115,94,0.12)",  text: "rgba(120,220,180,0.95)", label: "Active" },
    confirmed: { bg: "rgba(255,255,255,0.04)", text: "var(--white-dim)",       label: "Confirmed" },
    completed: { bg: "rgba(255,255,255,0.04)", text: "var(--white-muted)",     label: "Completed" },
    draft:     { bg: "rgba(255,255,255,0.04)", text: "var(--white-muted)",     label: "Draft" },
    cancelled: { bg: "rgba(255,80,80,0.08)",   text: "rgba(255,150,150,0.95)", label: "Cancelled" },
  };
  const s = map[status] ?? map.confirmed;
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

function DeliverableRow({ d, last }: { d: Deliverable; last: boolean }) {
  const pillStyles: Record<Deliverable["status"], { bg: string; text: string; label: string }> = {
    complete:    { bg: "rgba(15,115,94,0.14)",   text: "rgba(120,220,180,0.95)", label: "Complete" },
    in_progress: { bg: "rgba(232,101,26,0.10)",  text: "var(--orange-bright)",    label: "In progress" },
    not_started: { bg: "rgba(255,255,255,0.04)", text: "var(--white-dim)",        label: "Not started" },
    overdue:     { bg: "rgba(255,80,80,0.10)",   text: "rgba(255,150,150,0.95)",  label: "Overdue" },
  };
  const p = pillStyles[d.status];
  const due = relativeDate(d.due_date);
  return (
    <li
      className={`flex items-start gap-4 px-5 py-4 ${
        last ? "" : "border-b border-gray-border"
      }`}
    >
      <CheckIcon complete={d.status === "complete"} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13.5px] font-medium text-white">{d.title}</span>
          <span
            className="rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em]"
            style={{ background: p.bg, color: p.text }}
          >
            {p.label}
          </span>
        </div>
        {d.description && (
          <div className="mt-1 text-[12.5px] leading-relaxed text-white-muted">
            {d.description}
          </div>
        )}
      </div>
      <div className="shrink-0 text-right">
        <div className="text-[10.5px] uppercase tracking-[0.14em] text-white-muted">Due</div>
        <div className="text-[12px] tabular-nums text-white-dim">{due}</div>
      </div>
    </li>
  );
}

function CheckIcon({ complete }: { complete: boolean }) {
  return (
    <span
      className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
        complete
          ? "border-orange bg-orange text-white"
          : "border-gray-border-hover bg-transparent"
      }`}
    >
      {complete && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </span>
  );
}

function AttendeePreview({
  rows,
  more,
}: {
  rows: Array<{ name: string; title: string; company: string; country: string; industry: string }>;
  more: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-border bg-black-card">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-gray-border text-left text-[10.5px] uppercase tracking-[0.14em] text-white-muted">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Company</th>
            <th className="hidden px-4 py-3 font-medium lg:table-cell">Industry</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Country</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-gray-border last:border-b-0">
              <td className="px-4 py-3 text-white">{r.name}</td>
              <td className="px-4 py-3 text-white-dim">{r.title}</td>
              <td className="hidden px-4 py-3 text-white-dim md:table-cell">{r.company}</td>
              <td className="hidden px-4 py-3 text-white-muted lg:table-cell">{r.industry}</td>
              <td className="hidden px-4 py-3 text-white-muted sm:table-cell">{r.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {more > 0 && (
        <div className="border-t border-gray-border bg-black-card-hover px-4 py-2.5 text-center text-[11.5px] text-white-muted">
          + {more} more — open the full list & filters
        </div>
      )}
    </div>
  );
}

function LeadsPreview({
  rows,
  more,
}: {
  rows: Array<{
    name: string;
    title: string;
    company: string;
    intent: string | null;
    status: string;
    notes: string | null;
  }>;
  more: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-border bg-black-card">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-gray-border text-left text-[10.5px] uppercase tracking-[0.14em] text-white-muted">
            <th className="px-4 py-3 font-medium">Lead</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Company</th>
            <th className="px-4 py-3 font-medium">Intent</th>
            <th className="hidden px-4 py-3 font-medium lg:table-cell">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-gray-border last:border-b-0">
              <td className="px-4 py-3">
                <div className="text-white">{r.name}</div>
                <div className="text-white-muted">{r.title}</div>
              </td>
              <td className="hidden px-4 py-3 text-white-dim md:table-cell">{r.company}</td>
              <td className="px-4 py-3">
                <IntentPill intent={r.intent} />
              </td>
              <td className="hidden px-4 py-3 text-white-muted lg:table-cell">{r.notes ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {more > 0 && (
        <div className="border-t border-gray-border bg-black-card-hover px-4 py-2.5 text-center text-[11.5px] text-white-muted">
          + {more} more — download CSV for the full list
        </div>
      )}
    </div>
  );
}

function IntentPill({ intent }: { intent: string | null }) {
  const map: Record<string, { bg: string; text: string }> = {
    hot:  { bg: "rgba(232,101,26,0.14)", text: "var(--orange-bright)" },
    warm: { bg: "rgba(232,101,26,0.06)", text: "rgba(232,150,100,0.9)" },
    cold: { bg: "rgba(255,255,255,0.04)", text: "var(--white-muted)" },
  };
  if (!intent) return <span className="text-white-muted">—</span>;
  const s = map[intent] ?? map.cold;
  return (
    <span
      className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
      style={{ background: s.bg, color: s.text }}
    >
      {intent}
    </span>
  );
}
