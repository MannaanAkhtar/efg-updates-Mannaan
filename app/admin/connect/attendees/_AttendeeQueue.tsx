"use client";

import { useState, useTransition } from "react";
import { approveAttendee, unapproveAttendee, bulkApprove } from "./actions";

interface Row {
  id: string;
  full_name: string;
  job_title: string | null;
  company: string | null;
  country: string | null;
  industry: string | null;
  seniority: string | null;
  registered_at: string;
  approved_at: string | null;
  consent_share_with_sponsors: boolean;
}

export function AttendeeQueue({ rows }: { rows: Row[] }) {
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === rows.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(rows.map(r => r.id)));
    }
  }

  function onApprove(id: string) {
    startTransition(async () => {
      await approveAttendee(id);
    });
  }

  function onUnapprove(id: string) {
    startTransition(async () => {
      await unapproveAttendee(id);
    });
  }

  function onBulkApprove() {
    const pendingOnly = rows.filter(r => selected.has(r.id) && r.approved_at == null).map(r => r.id);
    if (pendingOnly.length === 0) return;
    startTransition(async () => {
      await bulkApprove(pendingOnly);
      setSelected(new Set());
    });
  }

  const anyPendingSelected = rows.some(r => selected.has(r.id) && r.approved_at == null);

  return (
    <div style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", opacity: pending ? 0.6 : 1, transition: "opacity 0.15s" }}>
      {/* Bulk toolbar */}
      {selected.size > 0 && (
        <div style={{ padding: "10px 18px", background: "rgba(232, 101, 26, 0.08)", borderBottom: "1px solid rgba(232, 101, 26, 0.2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 12.5, color: "white" }}>
            <span style={{ fontWeight: 600 }}>{selected.size}</span> selected
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={onBulkApprove}
              disabled={!anyPendingSelected || pending}
              style={{
                padding: "6px 14px",
                background: "#e8651a",
                color: "white",
                border: "none",
                borderRadius: 7,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: anyPendingSelected ? "pointer" : "not-allowed",
                opacity: anyPendingSelected ? 1 : 0.4,
              }}
            >
              Approve selected
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              style={{ padding: "6px 12px", background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, fontSize: 12.5, cursor: "pointer" }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width: 40 }}>
              <input
                type="checkbox"
                checked={selected.size === rows.length && rows.length > 0}
                onChange={toggleAll}
                style={{ cursor: "pointer" }}
              />
            </th>
            <th style={thStyle}>Attendee</th>
            <th style={thStyle}>Company</th>
            <th style={{ ...thStyle, width: 90 }}>Country</th>
            <th style={{ ...thStyle, width: 110 }}>Seniority</th>
            <th style={{ ...thStyle, width: 110 }}>Registered</th>
            <th style={{ ...thStyle, width: 110 }}>Status</th>
            <th style={{ ...thStyle, width: 130 }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const isApproved = r.approved_at != null;
            const isSelected = selected.has(r.id);
            return (
              <tr key={r.id} style={{ background: isSelected ? "rgba(232, 101, 26, 0.05)" : "transparent" }}>
                <td style={tdStyle}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(r.id)}
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 500, color: "white" }}>{r.full_name}</div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>{r.job_title ?? "—"}</div>
                </td>
                <td style={{ ...tdStyle, color: "rgba(255,255,255,0.75)" }}>{r.company ?? "—"}</td>
                <td style={{ ...tdStyle, color: "rgba(255,255,255,0.55)" }}>{r.country ?? "—"}</td>
                <td style={{ ...tdStyle, color: "rgba(255,255,255,0.6)", textTransform: "capitalize" as const }}>
                  {r.seniority ? r.seniority.replace("_", " ") : "—"}
                </td>
                <td style={{ ...tdStyle, color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                  {new Date(r.registered_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </td>
                <td style={tdStyle}>
                  {isApproved ? (
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 999, background: "rgba(34, 197, 94, 0.12)", color: "#86efac", fontSize: 11.5, fontWeight: 600 }}>
                      Approved
                    </span>
                  ) : (
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 999, background: "rgba(239, 68, 68, 0.12)", color: "#fca5a5", fontSize: 11.5, fontWeight: 600 }}>
                      Pending
                    </span>
                  )}
                </td>
                <td style={tdStyle}>
                  {isApproved ? (
                    <button
                      type="button"
                      onClick={() => onUnapprove(r.id)}
                      disabled={pending}
                      style={btnGhost}
                    >
                      Un-approve
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onApprove(r.id)}
                      disabled={pending}
                      style={btnPrimary}
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: "11px 16px", textAlign: "left" as const, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" };
const tdStyle = { padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" };
const btnPrimary = { padding: "5px 12px", background: "#e8651a", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" };
const btnGhost = { padding: "5px 12px", background: "transparent", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 12, cursor: "pointer" };
