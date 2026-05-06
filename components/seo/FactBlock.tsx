/**
 * Server-rendered, screen-reader-only fact blocks for event and series pages.
 *
 * These render plain HTML inside `layout.tsx` so non-JS crawlers (Slack,
 * LinkedIn, GPTBot, CCBot, Bing) and AI assistants see structured event facts
 * on first response — without affecting the visual design of the page.
 *
 * Hidden via Tailwind's built-in `sr-only` utility (visually hidden, present
 * in the DOM, readable by crawlers and screen readers).
 */

interface Speaker {
  name: string;
  title: string;
  org: string;
}

interface Sponsor {
  name: string;
  tier: string;
}

interface Edition {
  name: string;
  city: string;
  country: string;
  date?: string;
  url: string;
}

export interface EventFactBlockProps {
  eventName: string;
  series: string;
  date: string;
  endDate?: string;
  venue?: string;
  city: string;
  country: string;
  format: "in-person" | "virtual" | "hybrid";
  audienceSize?: string;
  audienceTypes: string[];
  topSpeakers?: Speaker[];
  topSponsors?: Sponsor[];
  awards?: string[];
  url: string;
}

export function EventFactBlock(props: EventFactBlockProps) {
  const formatLabel =
    props.format === "virtual"
      ? "Virtual / online forum"
      : props.format === "hybrid"
        ? "Hybrid (in-person + virtual)"
        : "In-person summit";

  const venueLabel =
    props.venue ?? (props.format === "virtual" ? "Virtual / online" : "Venue confirmed to registered delegates");

  const summary =
    `${props.eventName} is part of the ${props.series} series by Events First Group, taking place on ${props.date}` +
    (props.venue ? ` at ${props.venue}` : "") +
    ` in ${props.city}, ${props.country}.`;

  return (
    <aside className="sr-only" data-event-fact-block aria-label={`${props.eventName} — key facts`}>
      <h2>{props.eventName} — Key Facts</h2>
      <p>{summary}</p>
      <dl>
        <dt>Event</dt>
        <dd>{props.eventName}</dd>
        <dt>Series</dt>
        <dd>{props.series}</dd>
        <dt>Date</dt>
        <dd>{props.endDate ? `${props.date} – ${props.endDate}` : props.date}</dd>
        <dt>Venue</dt>
        <dd>{venueLabel}</dd>
        <dt>City</dt>
        <dd>{props.city}</dd>
        <dt>Country</dt>
        <dd>{props.country}</dd>
        <dt>Format</dt>
        <dd>{formatLabel}</dd>
        {props.audienceSize && (
          <>
            <dt>Expected audience</dt>
            <dd>{props.audienceSize}</dd>
          </>
        )}
        <dt>Audience profile</dt>
        <dd>{props.audienceTypes.join(", ")}</dd>
        <dt>URL</dt>
        <dd>{props.url}</dd>
      </dl>
      {props.topSpeakers && props.topSpeakers.length > 0 && (
        <>
          <h3>Featured speakers</h3>
          <ul>
            {props.topSpeakers.map((s) => (
              <li key={s.name}>
                {s.name}, {s.title}, {s.org}
              </li>
            ))}
          </ul>
        </>
      )}
      {props.topSponsors && props.topSponsors.length > 0 && (
        <>
          <h3>Sponsors and partners</h3>
          <ul>
            {props.topSponsors.map((s) => (
              <li key={s.name}>
                {s.name} ({s.tier})
              </li>
            ))}
          </ul>
        </>
      )}
      {props.awards && props.awards.length > 0 && (
        <>
          <h3>Award categories</h3>
          <ul>
            {props.awards.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}

export interface SeriesFactBlockProps {
  seriesName: string;
  description: string;
  audience: string[];
  editions: Edition[];
  url: string;
}

export function SeriesFactBlock(props: SeriesFactBlockProps) {
  return (
    <aside className="sr-only" data-series-fact-block aria-label={`${props.seriesName} — series overview`}>
      <h2>{props.seriesName} — Series Overview</h2>
      <p>{props.description}</p>
      <dl>
        <dt>Series</dt>
        <dd>{props.seriesName}</dd>
        <dt>Audience profile</dt>
        <dd>{props.audience.join(", ")}</dd>
        <dt>Active editions</dt>
        <dd>{props.editions.length}</dd>
        <dt>URL</dt>
        <dd>{props.url}</dd>
      </dl>
      <h3>Editions</h3>
      <ul>
        {props.editions.map((e) => (
          <li key={e.url}>
            {e.name} — {e.city}, {e.country}
            {e.date ? ` (${e.date})` : ""} — {e.url}
          </li>
        ))}
      </ul>
    </aside>
  );
}
