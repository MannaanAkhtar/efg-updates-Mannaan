import Link from "next/link";
import { requireConnectAdmin } from "@/lib/connect/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Connect — EFG Admin" };

export default async function ConnectAdminOverviewPage() {
  const { admin } = await requireConnectAdmin();

  const [
    { count: eventCount },
    { count: orgCount },
    { count: sponsorshipCount },
    { count: attendeeCount },
    { count: pendingCount },
    { data: recentSponsorships },
    { data: eventsWithPending },
  ] = await Promise.all([
    admin.from("connect_events").select("*", { count: "exact", head: true }),
    admin.from("connect_organizations").select("*", { count: "exact", head: true }),
    admin.from("connect_sponsorships").select("*", { count: "exact", head: true }),
    admin.from("connect_attendees").select("*", { count: "exact", head: true }),
    admin
      .from("connect_attendees")
      .select("*", { count: "exact", head: true })
      .is("approved_at", null),
    admin
      .from("connect_sponsorships")
      .select("id, tier, contract_value_usd, signed_at, status, organization:connect_organizations(name), event:connect_events(name, start_date)")
      .order("signed_at", { ascending: false, nullsFirst: false })
      .limit(8),
    admin
      .from("connect_attendees")
      .select("event_id, connect_events!inner(id, name, start_date)")
      .is("approved_at", null),
  ]);

  // Aggregate pending counts per event
  const pendingByEvent = new Map<string, { name: string; start_date: string; count: number }>();
  for (const row of (eventsWithPending ?? []) as any[]) {
    const ev = row.connect_events;
    if (!ev) continue;
    const prev = pendingByEvent.get(ev.id);
    if (prev) {
      prev.count += 1;
    } else {
      pendingByEvent.set(ev.id, { name: ev.name, start_date: ev.start_date, count: 1 });
    }
  }
  const eventsWithPendingList = Array.from(pendingByEvent.entries())
    .sort((a, b) => a[1].start_date.localeCompare(b[1].start_date));

  return (
    <div style={{ padding: "32px 40px", color: "white", fontFamily: "var(--font-outfit)" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
          EFG Connect
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, margin: "6px 0 4px", letterSpacing: "-0.02em" }}>
          Admin overview
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", maxWidth: 720 }}>
          The sponsor portal. From here you approve attendee registrations before they're exposed to sponsors, edit sponsorship contracts, and (soon) invite sponsors to log in.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Events" value={eventCount ?? 0} accent="white" />
        <StatCard label="Organisations" value={orgCount ?? 0} accent="white" />
        <StatCard label="Active sponsorships" value={sponsorshipCount ?? 0} accent="orange" />
        <StatCard
          label="Pending attendees"
          value={pendingCount ?? 0}
          accent={(pendingCount ?? 0) > 0 ? "red" : "white"}
          sublabel={`of ${attendeeCount ?? 0} total registrations`}
        />
      </div>

      {/* Events needing approval */}
      <Section
        title="Events with pending attendees"
        subtitle="Approve before these surfaces to sponsors"
        right={
          <Link href="/admin/connect/attendees" style={linkStyle}>
            Open approval queue →
          </Link>
        }
      >
        {eventsWithPendingList.length === 0 ? (
          <EmptyState
            label="Nothing pending."
            body="All registrations have been approved or there are no new ones."
          />
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Event</th>
                <th style={{ ...thStyle, width: 140 }}>Starts</th>
                <th style={{ ...thStyle, width: 120, textAlign: "right" }}>Pending</th>
                <th style={{ ...thStyle, width: 140 }}></th>
              </tr>
            </thead>
            <tbody>
              {eventsWithPendingList.map(([id, ev]) => (
                <tr key={id}>
                  <td style={tdStyle}>{ev.name}</td>
                  <td style={{ ...tdStyle, color: "rgba(255,255,255,0.55)" }}>
                    {new Date(ev.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 999, background: "rgba(239, 68, 68, 0.15)", color: "#fca5a5", fontSize: 12, fontWeight: 600 }}>
                      {ev.count}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <Link href={`/admin/connect/attendees?event=${id}`} style={linkStyle}>Review →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {/* Recent sponsorships */}
      <Section title="Recent sponsorships" subtitle="Latest deals across all events">
        {(recentSponsorships ?? []).length === 0 ? (
          <EmptyState label="No sponsorships yet." body="Add one once a deal is signed." />
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Sponsor</th>
                <th style={thStyle}>Event</th>
                <th style={{ ...thStyle, width: 100 }}>Tier</th>
                <th style={{ ...thStyle, width: 130, textAlign: "right" }}>Value</th>
                <th style={{ ...thStyle, width: 130 }}>Signed</th>
              </tr>
            </thead>
            <tbody>
              {(recentSponsorships ?? []).map((s: any) => (
                <tr key={s.id}>
                  <td style={tdStyle}>{s.organization?.name ?? "—"}</td>
                  <td style={{ ...tdStyle, color: "rgba(255,255,255,0.75)" }}>{s.event?.name ?? "—"}</td>
                  <td style={tdStyle}>
                    <TierPill tier={s.tier} />
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right", fontVariantNumeric: "tabular-nums", color: "rgba(255,255,255,0.75)" }}>
                    {s.contract_value_usd != null ? `$${Number(s.contract_value_usd).toLocaleString()}` : "—"}
                  </td>
                  <td style={{ ...tdStyle, color: "rgba(255,255,255,0.55)" }}>
                    {s.signed_at ? new Date(s.signed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>
    </div>
  );
}

// ─── small presentational helpers ──────────────────────────────────────────

function StatCard({ label, value, sublabel, accent }: { label: string; value: number; sublabel?: string; accent: "white" | "orange" | "red" }) {
  const accentColor = accent === "orange" ? "#e8651a" : accent === "red" ? "#fca5a5" : "white";
  return (
    <div style={{ padding: 20, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: accentColor, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
        {value.toLocaleString()}
      </div>
      {sublabel && <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{sublabel}</div>}
    </div>
  );
}

function Section({ title, subtitle, right, children }: { title: string; subtitle?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>{title}</h2>
          {subtitle && <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{subtitle}</div>}
        </div>
        {right}
      </div>
      <div style={{ borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
        {children}
      </div>
    </section>
  );
}

function EmptyState({ label, body }: { label: string; body: string }) {
  return (
    <div style={{ padding: "32px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{label}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{body}</div>
    </div>
  );
}

function TierPill({ tier }: { tier: string | null }) {
  const colorMap: Record<string, string> = {
    platinum: "#d4d4d8",
    gold: "#fbbf24",
    supporting: "#94a3b8",
  };
  const color = (tier && colorMap[tier]) ?? "#94a3b8";
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 999, background: `${color}1f`, color, fontSize: 11.5, fontWeight: 600, textTransform: "capitalize" }}>
      {tier ?? "—"}
    </span>
  );
}

const tableStyle = { width: "100%", borderCollapse: "collapse" as const, fontSize: 13.5 };
const thStyle = { padding: "12px 18px", textAlign: "left" as const, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.06)" };
const tdStyle = { padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" };
const linkStyle = { color: "#e8651a", textDecoration: "none", fontSize: 13, fontWeight: 500 };
