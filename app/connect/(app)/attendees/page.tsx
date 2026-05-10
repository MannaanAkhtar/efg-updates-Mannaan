import { redirect } from "next/navigation";
import {
  loadConnectContext,
  listOrgSponsorships,
  listEventAttendees,
} from "@/lib/connect/server";
import { formatDateRange } from "@/lib/connect/format";
import { PageHeader } from "../_PageHeader";
import { SeriesPill } from "../_SeriesPill";
import { AttendeeBrowser } from "./_AttendeeBrowser";

export const metadata = { title: "Attendees — EFG Connect" };

export default async function AttendeesPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const params = await searchParams;
  const ctx = await loadConnectContext();
  const sponsorships = await listOrgSponsorships(ctx.organization.id);

  // Only events your org is sponsoring AND that haven't ended yet.
  const sponsoredEvents = sponsorships
    .filter((s) => s.event.status === "upcoming" || s.event.status === "active")
    .map((s) => s.event)
    // dedupe by id
    .filter((e, i, arr) => arr.findIndex((x) => x.id === e.id) === i)
    .sort((a, b) => a.start_date.localeCompare(b.start_date));

  if (sponsoredEvents.length === 0) {
    return (
      <div>
        <PageHeader
          eyebrow="Attendees"
          title="Pre-event attendee lists"
          description="See who's registered for the events you're sponsoring."
        />
        <div className="px-6 py-10 lg:px-10">
          <div className="rounded-2xl border border-dashed border-gray-border p-10 text-center text-[13px] text-white-muted">
            You don&apos;t have any active sponsorships yet. Pre-event lists appear here once you do.
          </div>
        </div>
      </div>
    );
  }

  // Pick the active event: from query param, or first upcoming.
  const activeEventId =
    params.event && sponsoredEvents.find((e) => e.id === params.event)
      ? params.event
      : sponsoredEvents[0].id;

  if (!params.event) {
    redirect(`/connect/attendees?event=${activeEventId}`);
  }

  const activeEvent = sponsoredEvents.find((e) => e.id === activeEventId)!;
  const attendees = await listEventAttendees(activeEventId);

  return (
    <div>
      <PageHeader
        eyebrow="Attendees"
        title="Pre-event attendee lists"
        description="Verified registrations from EFG events you're sponsoring. Use filters to find your buyer; save views to revisit them."
      />

      <div
        className="px-6 py-8 lg:px-10"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {/* Event picker */}
        <div className="mb-8">
          <div className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white-muted">
            Pick an event
          </div>
          <div className="flex flex-wrap gap-2">
            {sponsoredEvents.map((e) => {
              const active = e.id === activeEventId;
              return (
                <a
                  key={e.id}
                  href={`/connect/attendees?event=${e.id}`}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] transition ${
                    active
                      ? "border-orange/50 bg-orange/10 text-white"
                      : "border-gray-border bg-black-card text-white-dim hover:border-gray-border-hover hover:text-white"
                  }`}
                >
                  <SeriesPill series={e.series} />
                  <span>{e.name}</span>
                  <span className="text-[10.5px] text-white-muted">
                    {formatDateRange(e.start_date, e.end_date)}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        <AttendeeBrowser
          eventId={activeEventId}
          eventName={activeEvent.name}
          eventDate={formatDateRange(activeEvent.start_date, activeEvent.end_date)}
          attendees={attendees.map((a) => ({
            id: a.id,
            name: a.full_name,
            title: a.job_title ?? "",
            company: a.company ?? "",
            country: a.country ?? "",
            industry: a.industry ?? "",
            seniority: a.seniority,
            registered_at: a.registered_at,
          }))}
        />
      </div>
    </div>
  );
}
