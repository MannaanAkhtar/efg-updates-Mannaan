// ═══════════════════════════════════════════════════════════════
// Shared form submission helpers — used by all forms across the site
// ═══════════════════════════════════════════════════════════════

export type FormType =
  | "sponsor"
  | "attend"
  | "speak"
  | "contact"
  | "awards"
  | "networkfirst"
  | "careers";

export interface FormPayload {
  type: FormType;
  full_name: string;
  email: string;
  company?: string;
  job_title?: string;
  phone?: string;
  metadata?: Record<string, string>;
  event_name?: string;
  website?: string; // honeypot — always send empty
}

export interface FormResult {
  success: boolean;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════
// Work email validation
// ═══════════════════════════════════════════════════════════════

const FREE_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "icloud.com", "mail.com", "protonmail.com", "zoho.com", "yandex.com",
  "gmx.com", "gmx.net", "live.com", "me.com", "msn.com",
  "yahoo.co.uk", "yahoo.co.in", "yahoo.ca", "hotmail.co.uk",
  "rediffmail.com", "inbox.com", "fastmail.com", "hushmail.com",
  "tutanota.com", "pm.me", "guerrillamail.com", "mailinator.com",
  "tempmail.com",
];

export function isWorkEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return !FREE_EMAIL_DOMAINS.includes(domain);
}

// ═══════════════════════════════════════════════════════════════
// Phone country codes + validation
// ═══════════════════════════════════════════════════════════════

export interface CountryCode {
  code: string;
  country: string;
  name: string;
  length: number;
  placeholder: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  // Popular / pinned
  { code: "+971", country: "AE", name: "United Arab Emirates", length: 9, placeholder: "50 123 4567" },
  { code: "+966", country: "SA", name: "Saudi Arabia", length: 9, placeholder: "50 123 4567" },
  { code: "+965", country: "KW", name: "Kuwait", length: 8, placeholder: "5000 1234" },
  { code: "+91", country: "IN", name: "India", length: 10, placeholder: "98765 43210" },
  { code: "+1", country: "US", name: "United States", length: 10, placeholder: "202 555 0123" },
  { code: "+44", country: "GB", name: "United Kingdom", length: 10, placeholder: "7911 123456" },
  // A
  { code: "+93", country: "AF", name: "Afghanistan", length: 9, placeholder: "70 123 4567" },
  { code: "+355", country: "AL", name: "Albania", length: 9, placeholder: "66 123 4567" },
  { code: "+213", country: "DZ", name: "Algeria", length: 9, placeholder: "551 23 45 67" },
  { code: "+376", country: "AD", name: "Andorra", length: 6, placeholder: "312 345" },
  { code: "+244", country: "AO", name: "Angola", length: 9, placeholder: "923 123 456" },
  { code: "+54", country: "AR", name: "Argentina", length: 10, placeholder: "11 2345 6789" },
  { code: "+374", country: "AM", name: "Armenia", length: 8, placeholder: "77 123456" },
  { code: "+61", country: "AU", name: "Australia", length: 9, placeholder: "412 345 678" },
  { code: "+43", country: "AT", name: "Austria", length: 10, placeholder: "664 1234567" },
  { code: "+994", country: "AZ", name: "Azerbaijan", length: 9, placeholder: "40 123 45 67" },
  // B
  { code: "+973", country: "BH", name: "Bahrain", length: 8, placeholder: "3600 1234" },
  { code: "+880", country: "BD", name: "Bangladesh", length: 10, placeholder: "1812 345678" },
  { code: "+375", country: "BY", name: "Belarus", length: 9, placeholder: "29 491 19 11" },
  { code: "+32", country: "BE", name: "Belgium", length: 9, placeholder: "470 12 34 56" },
  { code: "+501", country: "BZ", name: "Belize", length: 7, placeholder: "622 1234" },
  { code: "+229", country: "BJ", name: "Benin", length: 8, placeholder: "90 01 12 34" },
  { code: "+975", country: "BT", name: "Bhutan", length: 8, placeholder: "17 12 34 56" },
  { code: "+591", country: "BO", name: "Bolivia", length: 8, placeholder: "71234567" },
  { code: "+387", country: "BA", name: "Bosnia", length: 8, placeholder: "61 123 456" },
  { code: "+267", country: "BW", name: "Botswana", length: 8, placeholder: "71 123 456" },
  { code: "+55", country: "BR", name: "Brazil", length: 11, placeholder: "11 96123 4567" },
  { code: "+673", country: "BN", name: "Brunei", length: 7, placeholder: "712 3456" },
  { code: "+359", country: "BG", name: "Bulgaria", length: 9, placeholder: "48 123 456" },
  // C
  { code: "+855", country: "KH", name: "Cambodia", length: 9, placeholder: "91 234 567" },
  { code: "+237", country: "CM", name: "Cameroon", length: 9, placeholder: "671 23 45 67" },
  { code: "+1", country: "CA", name: "Canada", length: 10, placeholder: "204 234 5678" },
  { code: "+56", country: "CL", name: "Chile", length: 9, placeholder: "9 1234 5678" },
  { code: "+86", country: "CN", name: "China", length: 11, placeholder: "131 2345 6789" },
  { code: "+57", country: "CO", name: "Colombia", length: 10, placeholder: "321 1234567" },
  { code: "+506", country: "CR", name: "Costa Rica", length: 8, placeholder: "8312 3456" },
  { code: "+385", country: "HR", name: "Croatia", length: 9, placeholder: "91 234 5678" },
  { code: "+53", country: "CU", name: "Cuba", length: 8, placeholder: "5 1234567" },
  { code: "+357", country: "CY", name: "Cyprus", length: 8, placeholder: "96 123456" },
  { code: "+420", country: "CZ", name: "Czech Republic", length: 9, placeholder: "601 123 456" },
  // D
  { code: "+45", country: "DK", name: "Denmark", length: 8, placeholder: "32 12 34 56" },
  { code: "+253", country: "DJ", name: "Djibouti", length: 8, placeholder: "77 83 10 01" },
  { code: "+593", country: "EC", name: "Ecuador", length: 9, placeholder: "99 123 4567" },
  // E
  { code: "+20", country: "EG", name: "Egypt", length: 10, placeholder: "100 123 4567" },
  { code: "+503", country: "SV", name: "El Salvador", length: 8, placeholder: "7012 3456" },
  { code: "+372", country: "EE", name: "Estonia", length: 8, placeholder: "5123 4567" },
  { code: "+251", country: "ET", name: "Ethiopia", length: 9, placeholder: "91 123 4567" },
  // F
  { code: "+679", country: "FJ", name: "Fiji", length: 7, placeholder: "701 2345" },
  { code: "+358", country: "FI", name: "Finland", length: 10, placeholder: "41 2345678" },
  { code: "+33", country: "FR", name: "France", length: 9, placeholder: "6 12 34 56 78" },
  // G
  { code: "+995", country: "GE", name: "Georgia", length: 9, placeholder: "555 12 34 56" },
  { code: "+49", country: "DE", name: "Germany", length: 11, placeholder: "151 23456789" },
  { code: "+233", country: "GH", name: "Ghana", length: 9, placeholder: "23 123 4567" },
  { code: "+30", country: "GR", name: "Greece", length: 10, placeholder: "691 234 5678" },
  { code: "+502", country: "GT", name: "Guatemala", length: 8, placeholder: "5123 4567" },
  // H
  { code: "+504", country: "HN", name: "Honduras", length: 8, placeholder: "9123 4567" },
  { code: "+852", country: "HK", name: "Hong Kong", length: 8, placeholder: "5123 4567" },
  { code: "+36", country: "HU", name: "Hungary", length: 9, placeholder: "20 123 4567" },
  // I
  { code: "+354", country: "IS", name: "Iceland", length: 7, placeholder: "611 1234" },
  { code: "+62", country: "ID", name: "Indonesia", length: 11, placeholder: "812 345 678" },
  { code: "+98", country: "IR", name: "Iran", length: 10, placeholder: "912 345 6789" },
  { code: "+964", country: "IQ", name: "Iraq", length: 10, placeholder: "791 234 5678" },
  { code: "+353", country: "IE", name: "Ireland", length: 9, placeholder: "85 012 3456" },
  { code: "+972", country: "IL", name: "Israel", length: 9, placeholder: "50 234 5678" },
  { code: "+39", country: "IT", name: "Italy", length: 10, placeholder: "312 345 6789" },
  // J
  { code: "+81", country: "JP", name: "Japan", length: 10, placeholder: "90 1234 5678" },
  { code: "+962", country: "JO", name: "Jordan", length: 9, placeholder: "7 9012 3456" },
  // K
  { code: "+7", country: "KZ", name: "Kazakhstan", length: 10, placeholder: "771 000 9998" },
  { code: "+254", country: "KE", name: "Kenya", length: 9, placeholder: "712 123456" },
  { code: "+82", country: "KR", name: "South Korea", length: 10, placeholder: "10 1234 5678" },
  // L
  { code: "+856", country: "LA", name: "Laos", length: 10, placeholder: "20 23 212 123" },
  { code: "+371", country: "LV", name: "Latvia", length: 8, placeholder: "21 234 567" },
  { code: "+961", country: "LB", name: "Lebanon", length: 8, placeholder: "71 123 456" },
  { code: "+218", country: "LY", name: "Libya", length: 9, placeholder: "91 2345678" },
  { code: "+370", country: "LT", name: "Lithuania", length: 8, placeholder: "6 123 4567" },
  { code: "+352", country: "LU", name: "Luxembourg", length: 9, placeholder: "628 123 456" },
  // M
  { code: "+853", country: "MO", name: "Macau", length: 8, placeholder: "6612 3456" },
  { code: "+60", country: "MY", name: "Malaysia", length: 10, placeholder: "12 345 6789" },
  { code: "+960", country: "MV", name: "Maldives", length: 7, placeholder: "771 2345" },
  { code: "+356", country: "MT", name: "Malta", length: 8, placeholder: "9696 1234" },
  { code: "+52", country: "MX", name: "Mexico", length: 10, placeholder: "222 123 4567" },
  { code: "+373", country: "MD", name: "Moldova", length: 8, placeholder: "621 12 345" },
  { code: "+976", country: "MN", name: "Mongolia", length: 8, placeholder: "8812 3456" },
  { code: "+382", country: "ME", name: "Montenegro", length: 8, placeholder: "67 622 901" },
  { code: "+212", country: "MA", name: "Morocco", length: 9, placeholder: "650 123456" },
  { code: "+258", country: "MZ", name: "Mozambique", length: 9, placeholder: "82 123 4567" },
  { code: "+95", country: "MM", name: "Myanmar", length: 9, placeholder: "9 212 3456" },
  // N
  { code: "+264", country: "NA", name: "Namibia", length: 8, placeholder: "81 123 4567" },
  { code: "+977", country: "NP", name: "Nepal", length: 10, placeholder: "984 1234567" },
  { code: "+31", country: "NL", name: "Netherlands", length: 9, placeholder: "6 12345678" },
  { code: "+64", country: "NZ", name: "New Zealand", length: 9, placeholder: "21 123 4567" },
  { code: "+234", country: "NG", name: "Nigeria", length: 10, placeholder: "802 123 4567" },
  { code: "+47", country: "NO", name: "Norway", length: 8, placeholder: "406 12 345" },
  // O
  { code: "+968", country: "OM", name: "Oman", length: 8, placeholder: "9212 3456" },
  // P
  { code: "+92", country: "PK", name: "Pakistan", length: 10, placeholder: "301 2345678" },
  { code: "+507", country: "PA", name: "Panama", length: 8, placeholder: "6123 4567" },
  { code: "+595", country: "PY", name: "Paraguay", length: 9, placeholder: "961 456789" },
  { code: "+51", country: "PE", name: "Peru", length: 9, placeholder: "912 345 678" },
  { code: "+63", country: "PH", name: "Philippines", length: 10, placeholder: "905 123 4567" },
  { code: "+48", country: "PL", name: "Poland", length: 9, placeholder: "512 345 678" },
  { code: "+351", country: "PT", name: "Portugal", length: 9, placeholder: "912 345 678" },
  // Q
  { code: "+974", country: "QA", name: "Qatar", length: 8, placeholder: "3312 3456" },
  // R
  { code: "+40", country: "RO", name: "Romania", length: 9, placeholder: "712 034 567" },
  { code: "+7", country: "RU", name: "Russia", length: 10, placeholder: "912 345 67 89" },
  { code: "+250", country: "RW", name: "Rwanda", length: 9, placeholder: "78 123 4567" },
  // S
  { code: "+381", country: "RS", name: "Serbia", length: 9, placeholder: "60 1234567" },
  { code: "+65", country: "SG", name: "Singapore", length: 8, placeholder: "8123 4567" },
  { code: "+421", country: "SK", name: "Slovakia", length: 9, placeholder: "912 123 456" },
  { code: "+386", country: "SI", name: "Slovenia", length: 8, placeholder: "31 234 567" },
  { code: "+27", country: "ZA", name: "South Africa", length: 9, placeholder: "71 123 4567" },
  { code: "+34", country: "ES", name: "Spain", length: 9, placeholder: "612 34 56 78" },
  { code: "+94", country: "LK", name: "Sri Lanka", length: 9, placeholder: "71 234 5678" },
  { code: "+249", country: "SD", name: "Sudan", length: 9, placeholder: "91 123 1234" },
  { code: "+46", country: "SE", name: "Sweden", length: 9, placeholder: "70 123 45 67" },
  { code: "+41", country: "CH", name: "Switzerland", length: 9, placeholder: "78 123 45 67" },
  // T
  { code: "+886", country: "TW", name: "Taiwan", length: 9, placeholder: "912 345 678" },
  { code: "+255", country: "TZ", name: "Tanzania", length: 9, placeholder: "621 234 567" },
  { code: "+66", country: "TH", name: "Thailand", length: 9, placeholder: "81 234 5678" },
  { code: "+216", country: "TN", name: "Tunisia", length: 8, placeholder: "20 123 456" },
  { code: "+90", country: "TR", name: "Turkey", length: 10, placeholder: "501 234 56 78" },
  // U
  { code: "+256", country: "UG", name: "Uganda", length: 9, placeholder: "700 123456" },
  { code: "+380", country: "UA", name: "Ukraine", length: 9, placeholder: "50 123 4567" },
  { code: "+598", country: "UY", name: "Uruguay", length: 8, placeholder: "94 231 234" },
  { code: "+998", country: "UZ", name: "Uzbekistan", length: 9, placeholder: "91 234 56 78" },
  // V
  { code: "+58", country: "VE", name: "Venezuela", length: 10, placeholder: "412 1234567" },
  { code: "+84", country: "VN", name: "Vietnam", length: 9, placeholder: "91 234 56 78" },
  // Y
  { code: "+967", country: "YE", name: "Yemen", length: 9, placeholder: "712 345 678" },
  // Z
  { code: "+260", country: "ZM", name: "Zambia", length: 9, placeholder: "95 5123456" },
  { code: "+263", country: "ZW", name: "Zimbabwe", length: 9, placeholder: "71 234 5678" },
];

export function validatePhone(phone: string, country: CountryCode): string | null {
  const digits = phone.replace(/[\s\-()]/g, "");
  if (!digits) return "Phone number is required";
  if (!/^\d+$/.test(digits)) return "Phone number must contain only digits";
  if (digits.length !== country.length) {
    return `${country.name} numbers must be ${country.length} digits`;
  }
  return null;
}

/**
 * Derive a human-readable source category from the current URL pathname.
 */
export function getSourceCategory(): string {
  if (typeof window === "undefined") return "Server";
  const h = window.location.hostname;
  const p = window.location.pathname;

  // Subdomain detection — middleware rewrites path to / but we know the actual source
  if (h.startsWith("braze-webinar-2.")) return "Braze Virtual Roundtable 2";
  if (h.startsWith("braze-webinar.") || h.startsWith("blaze-webinar.")) return "Braze Virtual Roundtable";

  if (p.startsWith("/braze2")) return "Braze Virtual Roundtable 2";
  if (p.startsWith("/braze")) return "Braze Virtual Roundtable";

  if (p === "/") return "Homepage";
  if (p === "/contact") return "Contact Page";
  if (p === "/speakers") return "Speakers Page";
  if (p === "/sponsors-and-partners") return "Sponsors & Partners Page";
  if (p === "/network-first") return "NetworkFirst Page";
  if (p === "/events" && !p.includes("/events/")) return "Events Page";

  // /events/[series]/[slug] → "Event – Cyber First Kuwait 2026"
  const eventMatch = p.match(/^\/events\/([^/]+)\/([^/]+)/);
  if (eventMatch) {
    const series = eventMatch[1]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const slug = eventMatch[2]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return `Event – ${series} ${slug}`;
  }

  // /events/[series] → "Series – Cyber First"
  const seriesMatch = p.match(/^\/events\/([^/]+)$/);
  if (seriesMatch) {
    const series = seriesMatch[1]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return `Series – ${series}`;
  }

  return p;
}

/**
 * Submit a form to the backend API.
 */
export async function submitForm(payload: FormPayload): Promise<FormResult> {
  try {
    const res = await fetch("/api/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        website: "", // honeypot — always empty for real submissions
        source_url: typeof window !== "undefined" ? window.location.href : "",
        source_category: getSourceCategory(),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        success: false,
        error: data.error || "Something went wrong. Please try again.",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    };
  }
}
