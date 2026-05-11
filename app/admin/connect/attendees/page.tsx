import Link from "next/link";
import { requireConnectAdmin } from "@/lib/connect/server";
import { AttendeeQueue } from "./_AttendeeQueue";

export const dynamic = "force-dynamic";
export const metadata = { title: "Attendee approval — EFG Admin" };

type SP = Promise<{ event?: string; status?: "pending" | "approved" | "all" }>;

export default async function AttendeeApprovalPage({ searchParams }: { searchParams: SP }) {
  const params = await searchParams;
  const { admin } = await requireConnectAdmin();

  const { data: events } = await admin
    .from("connect_events")
    .select("id, name, start_date")
    .order("start_date");

  const eventId = params.event ?? (events?.[0]?.id ?? "");
  const status = params.status ?? "pending";

  let query = admin
    .from("connect_attendees")
    .select("id, full_name, job_title, company, country, industry, seniority, registered_at, approved_at, consent_share_with_sponsors")
    .eq("event_id", eventId)
    .order("registered_at", { ascending: false });

  if (status === "pending") query = query.is("approved_at", null);
  if (status === "approved") query = query.not("approved_at", "is", null);

  const { data: attendees } = eventId ? await query : { data: [] };

  // counts for the badges across statuses on this event
  const [pendingCountRes, approvedCountRes, totalCountRes] = eventId
    ? await Promise.all([
        admin.from("connect_attendees").select("*", { count: "exact", head: true }).eq("event_id", eventId).is("approved_at", null),
        admin.from("connect_attendees").select("*", { count: "exact", head: true }).eq("event_id", eventId).not("approved_at", "is", null),
        admin.from("connect_attendees").select("*", { count: "exact", head: true }).eq("event_id", eventId),
      ])
    : [{ count: 0 }, { count: 0 }, { count: 0 }];

  const activeEvent = events?.find(e => e.id === eventId);

  return (
    <div style={{ padding: "32px 40px", color: "white", fontFamily: "var(--font-outfit)" }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin/connect" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 12.5 }}>
          ← Admin overview
        </Link>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, margin: "10px 0 4px", letterSpacing: "-0.02em" }}>
          Attendee approval
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", maxWidth: 720 }}>
          Approve registrations before they're exposed to sponsors. Only attendees with consent + your approval show up on sponsor dashboards.
        </p>
      </div>

      {/* Event picker */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>
          Event
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {(events ?? []).map(e => {
            const active = e.id === eventId;
            return (
              <Link
                key={e.id}
                href={`/admin/connect/attendees?event=${e.id}&status=${status}`}
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: `1px solid ${active ? "rgba(232, 101, 26, 0.5)" : "rgba(255,255,255,0.08)"}`,
                  background: active ? "rgba(232, 101, 26, 0.12)" : "transparent",
                  color: active ? "white" : "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  fontSize: 12.5,
                }}
              >
                {e.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Status filter + summary */}
      {activeEvent && (
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {(["pending", "approved", "all"] as const).map(s => {
              const isActive = status === s;
              const count = s === "pending" ? pendingCountRes.count : s === "approved" ? approvedCountRes.count : totalCountRes.count;
              return (
                <Link
                  key={s}
                  href={`/admin/connect/attendees?event=${eventId}&status=${s}`}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: isActive ? "rgba(255,255,255,0.07)" : "transparent",
                    color: isActive ? "white" : "rgba(255,255,255,0.55)",
                    textDecoration: "none",
                    fontSize: 12.5,
                    fontWeight: isActive ? 600 : 400,
                    border: "1px solid transparent",
                    textTransform: "capitalize" as const,
                  }}
                >
                  {s} <span style={{ color: "rgba(255,255,255,0.4)", marginLeft: 4 }}>({count ?? 0})</span>
                </Link>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            {activeEvent.name} · {new Date(activeEvent.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>
      )}

      {/* Queue */}
      {!eventId || !attendees ? (
        <div style={{ padding: 32, textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: 13, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
          Pick an event above.
        </div>
      ) : attendees.length === 0 ? (
        <div style={{ padding: 32, textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: 13, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
          {status === "pending"
            ? "Nothing pending for this event."
            : status === "approved"
              ? "No approved attendees yet."
              : "No registrations for this event yet."}
        </div>
      ) : (
        <AttendeeQueue rows={attendees as any} />
      )}
    </div>
  );
}
