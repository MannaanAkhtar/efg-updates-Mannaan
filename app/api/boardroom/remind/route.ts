import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// ═══════════════════════════════════════════════════════════════════════════
// SEND REMINDER EMAILS - 24h and 1h before event
// ═══════════════════════════════════════════════════════════════════════════

const ADMIN_SECRET = process.env.BOARDROOM_ADMIN_SECRET || "";
const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || "Events First Group <noreply@eventsfirstgroup.com>";

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !ADMIN_SECRET) return false;
  return authHeader.replace("Bearer ", "") === ADMIN_SECRET;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { roomName, hoursUntil = 24 } = body;

    if (!roomName) {
      return NextResponse.json({ error: "Room name is required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendKey = process.env.RESEND_API_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    if (!resendKey) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendKey);

    // Get boardroom details
    const { data: boardroom } = await supabase
      .from("boardrooms")
      .select("*")
      .eq("room_name", roomName)
      .single();

    if (!boardroom) {
      return NextResponse.json({ error: "Boardroom not found" }, { status: 404 });
    }

    // Get all active registrations
    const { data: registrations } = await supabase
      .from("boardroom_registrations")
      .select("*")
      .eq("room_name", roomName)
      .in("status", ["registered", "admitted"]);

    if (!registrations || registrations.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "No registrations to remind",
        sent: 0 
      });
    }

    const eventDate = new Date(boardroom.scheduled_time);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Dubai",
    });
    const formattedTime = eventDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Dubai",
    });

    const isUrgent = hoursUntil <= 1;
    const timeText = hoursUntil === 1 ? "1 hour" : `${hoursUntil} hours`;

    const agenda = [
      { time: "10:00 AM", title: "Welcome & Introductions" },
      { time: "10:15 AM", title: "Keynote: The AI Success Formula" },
      { time: "10:45 AM", title: "Panel: Governance at Scale" },
      { time: "11:15 AM", title: "Interactive Roundtable Discussion" },
      { time: "11:45 AM", title: "Key Takeaways & Close" },
    ];

    let sent = 0;
    const errors: string[] = [];

    for (const reg of registrations) {
      const joinUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://eventsfirstgroup.com"}/boardroom/${roomName}?token=${reg.join_token}`;

      try {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: reg.email,
          subject: isUrgent 
            ? `⏰ Starting in ${timeText}: ${boardroom.title}`
            : `Reminder: ${boardroom.title} starts in ${timeText}`,
          html: generateReminderEmail({
            fullName: reg.full_name,
            eventTitle: boardroom.title,
            eventDate: formattedDate,
            eventTime: formattedTime,
            joinUrl,
            hoursUntil,
            sponsorLogo: boardroom.sponsor_logo || "",
            sponsorName: boardroom.sponsor_name || "",
            agenda,
          }),
        });
        sent++;
      } catch (err) {
        errors.push(`Failed to send to ${reg.email}: ${err}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${sent} reminder emails`,
      sent,
      total: registrations.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("Remind error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// REMINDER EMAIL TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════

interface ReminderEmailParams {
  fullName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  joinUrl: string;
  hoursUntil: number;
  sponsorLogo: string;
  sponsorName: string;
  agenda: Array<{ time: string; title: string }>;
}

function generateReminderEmail(params: ReminderEmailParams): string {
  const { fullName, eventTitle, eventDate, eventTime, joinUrl, hoursUntil, sponsorLogo, sponsorName, agenda } = params;
  const isUrgent = hoursUntil <= 1;
  const timeText = hoursUntil === 1 ? "1 hour" : `${hoursUntil} hours`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #000000;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; border-bottom: 1px solid rgba(201, 147, 90, 0.2);">
              <img src="${sponsorLogo}" alt="${sponsorName}" height="32" style="height: 32px; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
              <p style="color: rgba(255,255,255,0.4); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 0;">
                Executive AI Boardroom
              </p>
            </td>
          </tr>
          
          ${isUrgent ? `
          <!-- Urgency Banner -->
          <tr>
            <td style="padding: 16px 40px; background: rgba(201,147,90,0.15); text-align: center;">
              <p style="color: #C9935A; font-size: 14px; font-weight: 600; margin: 0;">
                ⏰ Starting in ${timeText}!
              </p>
            </td>
          </tr>
          ` : ''}
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 48px 40px;">
              
              <!-- Timer Icon -->
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; width: 80px; height: 80px; border-radius: 50%; background: ${isUrgent ? 'linear-gradient(135deg, rgba(201,147,90,0.3), rgba(201,147,90,0.1))' : 'linear-gradient(135deg, rgba(201,147,90,0.2), transparent)'}; border: 1px solid rgba(201,147,90,0.3); line-height: 80px; text-align: center;">
                  <span style="color: #C9935A; font-size: 36px;">⏰</span>
                </div>
              </div>
              
              <!-- Title -->
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 300; text-align: center; margin: 0 0 16px; letter-spacing: -0.5px;">
                ${isUrgent ? "Almost Time!" : "Your Boardroom Starts Soon"}
              </h1>
              <p style="color: rgba(255,255,255,0.6); font-size: 16px; text-align: center; margin: 0 0 40px; line-height: 1.6;">
                ${fullName}, your session begins in <strong style="color: #C9935A;">${timeText}</strong>
              </p>
              
              <!-- Event Details -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(201,147,90,0.05); border: 1px solid rgba(201,147,90,0.2); border-radius: 8px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="color: #ffffff; fontSize: 18px; font-weight: 500; margin: 0 0 12px;">${eventTitle}</h2>
                    <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0 0 4px;">📅 ${eventDate}</p>
                    <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0 0 4px;">🕐 ${eventTime} GST (Dubai)</p>
                    <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0;">💻 Virtual Roundtable</p>
                  </td>
                </tr>
              </table>
              
              <!-- Join Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 40px;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${joinUrl}" style="display: inline-block; background: #C9935A; color: #000000; font-size: 16px; font-weight: 600; text-decoration: none; padding: 18px 56px; letter-spacing: 0.5px;">
                      Join Now →
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Agenda -->
              <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 32px;">
                <h3 style="color: #C9935A; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 20px;">
                  Agenda Preview
                </h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  ${agenda.map(item => `
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="80">
                            <span style="color: #C9935A; font-size: 13px;">${item.time}</span>
                          </td>
                          <td>
                            <span style="color: rgba(255,255,255,0.7); font-size: 14px;">${item.title}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  `).join('')}
                </table>
              </div>
              
              <!-- Checklist -->
              <div style="margin-top: 32px; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 8px;">
                <h4 style="color: rgba(255,255,255,0.6); font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 12px;">
                  Quick Checklist
                </h4>
                <ul style="color: rgba(255,255,255,0.5); font-size: 13px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Test your camera and microphone</li>
                  <li>Find a quiet location</li>
                  <li>Have your questions ready</li>
                  <li>Join 5 minutes early</li>
                </ul>
              </div>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; border-top: 1px solid rgba(201, 147, 90, 0.1); text-align: center;">
              <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin: 0 0 8px;">
                Hosted by Events First Group • Powered by ${sponsorName}
              </p>
              <p style="color: rgba(255,255,255,0.2); font-size: 11px; margin: 0;">
                <a href="https://eventsfirstgroup.com" style="color: rgba(255,255,255,0.3); text-decoration: none;">eventsfirstgroup.com</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
