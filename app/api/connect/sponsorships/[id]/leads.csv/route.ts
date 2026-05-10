import { NextResponse } from "next/server";
import {
  loadConnectContext,
  getSponsorshipDetail,
  listSponsorshipLeads,
} from "@/lib/connect/server";

export const runtime = "nodejs";

const CSV_HEADERS = [
  "Captured at",
  "Lead name",
  "Job title",
  "Company",
  "Industry",
  "Country",
  "Seniority",
  "Intent",
  "Follow-up status",
  "Notes",
];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ctx = await loadConnectContext();
  const sponsorship = await getSponsorshipDetail(id, ctx.organization.id);
  if (!sponsorship) {
    return NextResponse.json({ error: "Sponsorship not found" }, { status: 404 });
  }

  const leads = await listSponsorshipLeads(id);

  const rows = leads.map((lead) => {
    const a = lead.attendee;
    return [
      lead.captured_at,
      a?.full_name ?? "",
      a?.job_title ?? "",
      a?.company ?? "",
      a?.industry ?? "",
      a?.country ?? "",
      a?.seniority ?? "",
      lead.intent_level ?? "",
      lead.follow_up_status ?? "",
      lead.notes ?? "",
    ];
  });

  const csv = [CSV_HEADERS, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");

  const slug =
    sponsorship.event.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "leads";
  const filename = `${slug}-leads.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

function csvCell(value: unknown): string {
  if (value == null) return "";
  const s = String(value);
  if (s.includes(",") || s.includes("\"") || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
