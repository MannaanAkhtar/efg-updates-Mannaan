import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// ═══════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════

const VALID_TYPES = [
  "sponsor",
  "attend",
  "speak",
  "contact",
  "awards",
  "networkfirst",
  "careers",
];

const ALLOWED_ORIGINS = [
  "https://eventsfirstgroup.com",
  "https://www.eventsfirstgroup.com",
  "https://braze-webinar.eventsfirstgroup.com",
  "https://braze-webinar-2.eventsfirstgroup.com",
  "https://vroundtable-braze.eventsfirstgroup.com",
  "https://sonicwall-webinar.eventsfirstgroup.com",
  "https://big-leap-riyadh.eventsfirstgroup.com",
  "http://localhost:3000",
  "http://localhost:3001",
];

const NOTIFICATION_EMAIL =
  process.env.NOTIFICATION_EMAIL || "ateeq@eventsfirstgroup.com";

const MAX_PAYLOAD_SIZE = 10 * 1024; // 10KB

// Free email providers, require work email for all forms
const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.co.in",
  "hotmail.com",
  "hotmail.co.uk",
  "outlook.com",
  "outlook.co.uk",
  "live.com",
  "live.co.uk",
  "msn.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "protonmail.com",
  "proton.me",
  "zoho.com",
  "mail.com",
  "gmx.com",
  "gmx.net",
  "yandex.com",
  "yandex.ru",
  "rediffmail.com",
  "tutanota.com",
  "fastmail.com",
  "hushmail.com",
  "inbox.com",
];

// Disposable email domains to block
const DISPOSABLE_DOMAINS = [
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "throwaway.email",
  "yopmail.com",
  "sharklasers.com",
  "guerrillamailblock.com",
  "grr.la",
  "discard.email",
  "trashmail.com",
  "temp-mail.org",
  "fakeinbox.com",
  "10minutemail.com",
  "mailnesia.com",
];

// ═══════════════════════════════════════════════════════════════
// RATE LIMITER (in-memory, per-IP)
// ═══════════════════════════════════════════════════════════════

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }, 5 * 60 * 1000);
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function sanitize(str: string): string {
  return str
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  if (FREE_EMAIL_DOMAINS.includes(domain)) return false;
  if (DISPOSABLE_DOMAINS.includes(domain)) return false;
  return true;
}

function buildEmailHtml(data: {
  type: string;
  full_name: string;
  email: string;
  company: string;
  job_title: string;
  phone?: string;
  metadata: Record<string, unknown>;
  source_category?: string;
  event_name?: string;
}) {
  const metaRows = Object.entries(data.metadata || {})
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;color:#666;font-size:14px;border-bottom:1px solid #eee">${k.replace(/_/g, " ")}</td><td style="padding:8px 12px;font-size:14px;border-bottom:1px solid #eee">${String(v)}</td></tr>`
    )
    .join("");

  const typeLabel =
    data.type.charAt(0).toUpperCase() + data.type.slice(1);

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#E8651A;padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px">New ${typeLabel} Inquiry</h1>
      </div>
      <div style="padding:24px 32px;background:#fff;border:1px solid #eee;border-top:0;border-radius:0 0 8px 8px">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 12px;color:#666;font-size:14px;border-bottom:1px solid #eee">Name</td><td style="padding:8px 12px;font-size:14px;border-bottom:1px solid #eee">${data.full_name}</td></tr>
          <tr><td style="padding:8px 12px;color:#666;font-size:14px;border-bottom:1px solid #eee">Email</td><td style="padding:8px 12px;font-size:14px;border-bottom:1px solid #eee"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding:8px 12px;color:#666;font-size:14px;border-bottom:1px solid #eee">Company</td><td style="padding:8px 12px;font-size:14px;border-bottom:1px solid #eee">${data.company || "—"}</td></tr>
          <tr><td style="padding:8px 12px;color:#666;font-size:14px;border-bottom:1px solid #eee">Job Title</td><td style="padding:8px 12px;font-size:14px;border-bottom:1px solid #eee">${data.job_title || "—"}</td></tr>
          ${data.phone ? `<tr><td style="padding:8px 12px;color:#666;font-size:14px;border-bottom:1px solid #eee">Phone</td><td style="padding:8px 12px;font-size:14px;border-bottom:1px solid #eee">${data.phone}</td></tr>` : ""}
          ${metaRows}
        </table>
        <div style="margin-top:20px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#999">
          <p>Source: ${data.source_category || "Unknown"}</p>
          ${data.event_name ? `<p>Event: ${data.event_name}</p>` : ""}
          <p>Submitted: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Dubai" })}</p>
        </div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════
// POST /api/submit-form
// ═══════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    // 1. CSRF, validate Origin
    const origin = request.headers.get("origin");
    if (
      origin &&
      !ALLOWED_ORIGINS.some((o) => origin.startsWith(o))
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // 2. Request size check
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_SIZE) {
      return NextResponse.json(
        { error: "Payload too large" },
        { status: 413 }
      );
    }

    // 3. Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // 4. Parse body
    const body = await request.json();

    // 5. Honeypot, if `website` field is filled, it's a bot
    if (body.website) {
      // Return success to not alert the bot
      return NextResponse.json({ success: true });
    }

    // 6. Type validation
    const type = sanitize(String(body.type || ""));
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Invalid form type" },
        { status: 400 }
      );
    }

    // 7. Required fields
    const full_name = sanitize(String(body.full_name || ""));
    const email = sanitize(String(body.email || "")).toLowerCase();

    if (!full_name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // 8. Email validation (work email required, no free/disposable providers)
    // Careers applications allow personal emails
    if (type !== "careers" && !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please use your work email address" },
        { status: 400 }
      );
    }

    // 9. Sanitize all fields
    const company = sanitize(String(body.company || ""));
    const job_title = sanitize(String(body.job_title || ""));
    const phone = body.phone ? sanitize(String(body.phone)) : null;
    const source_url = body.source_url
      ? sanitize(String(body.source_url))
      : null;
    const source_category = body.source_category
      ? sanitize(String(body.source_category))
      : null;
    const event_name = body.event_name
      ? sanitize(String(body.event_name))
      : null;

    // Sanitize metadata values
    const rawMeta = body.metadata || {};
    const metadata: Record<string, string> = {};
    for (const [key, val] of Object.entries(rawMeta)) {
      if (val) metadata[sanitize(key)] = sanitize(String(val));
    }

    // 10. Insert into Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase env vars not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error: dbError } = await supabase
      .from("form_submissions")
      .insert({
        type,
        full_name,
        email,
        company,
        job_title,
        phone,
        metadata,
        source_url,
        source_category,
        event_name,
      });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to submit form" },
        { status: 500 }
      );
    }

    // 11. Send email notification (non-blocking, don't fail the request)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        const typeLabel =
          type.charAt(0).toUpperCase() + type.slice(1);

        await resend.emails.send({
          from: "EFG Forms <onboarding@resend.dev>",
          to: NOTIFICATION_EMAIL,
          subject: `New ${typeLabel} Inquiry, ${full_name} from ${company || "N/A"}`,
          html: buildEmailHtml({
            type,
            full_name,
            email,
            company,
            job_title,
            phone: phone || undefined,
            metadata,
            source_category: source_category || undefined,
            event_name: event_name || undefined,
          }),
        });
      } catch (emailErr) {
        // Log but don't fail the request
        console.error("Email notification failed:", emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Form submission error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
