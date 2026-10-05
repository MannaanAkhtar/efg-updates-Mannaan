export type ReportEntry = {
  edition: string;
  year: string;
  title: string;
  subtitle: string;
  url: string;
  filename: string;
  logo?: string;
  logoScale?: number;
  /**
   * An edition that has not run yet, so no post-event report exists for it.
   * It is offered in the request modal's edition dropdown so interest can be
   * captured ahead of the event, but it is kept out of the report-card grids
   * (see PUBLISHED_POST_EVENT_REPORTS below) so no card advertises a report
   * that cannot be sent.
   */
  upcoming?: boolean;
};

export const POST_EVENT_REPORTS: ReportEntry[] = [
  {
    edition: "KSA",
    year: "2025",
    title: "OPEX First KSA",
    subtitle: "2025 Edition",
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/OPEX+First+KSA+2025+-+Post+Event+Report.pdf",
    filename: "OPEX-First-KSA-2025-Report.pdf",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/assets/Opex+KSA+logo-02.png",
    logoScale: 1.5,
  },
  {
    edition: "UAE",
    year: "2026",
    title: "OPEX First UAE",
    subtitle: "2026 Edition",
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/Opex+UAE+Post+Event+Report_compressed.pdf",
    filename: "OPEX-First-UAE-2026-Report.pdf",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/efg_logo/opex_uae.png",
    logoScale: 1.7,
  },
  {
    edition: "Process Intelligence Webinar",
    year: "2026",
    title: "Process Intelligence Webinar",
    subtitle: "2026 Edition",
    // TODO: replace with the real S3 URL once the report PDF is uploaded.
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/Process+Intelligence+Webinar+2026+-+Post+Event+Report.pdf",
    filename: "OPEX-Process-Intelligence-Webinar-2026-Report.pdf",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/OPEX+FIRST+logo-1.png",
    logoScale: 1.3,
  },
  {
    edition: "KSA",
    year: "2026",
    title: "OPEX First KSA",
    subtitle: "2026 Edition",
    // Event runs 21 October 2026, so the report does not exist yet. The URL
    // follows the naming convention the other KSA report uses; replace it if
    // the uploaded file is named differently.
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/OPEX+First+KSA+2026+-+Post+Event+Report.pdf",
    filename: "OPEX-First-KSA-2026-Report.pdf",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/assets/Opex+KSA+logo-02.png",
    logoScale: 1.5,
    upcoming: true,
  },
];

/**
 * The editions with a report that can actually be sent. The card grids render
 * from this; the request modal's dropdown renders from the full list.
 */
export const PUBLISHED_POST_EVENT_REPORTS: ReportEntry[] =
  POST_EVENT_REPORTS.filter((r) => !r.upcoming);
