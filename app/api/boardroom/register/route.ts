import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { randomUUID } from "crypto";

// ═══════════════════════════════════════════════════════════════════════════
// REGISTER FOR BOARDROOM - Enhanced with capacity checks
// ═══════════════════════════════════════════════════════════════════════════

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "ateeq@eventsfirstgroup.com";
const DEFAULT_MAX_PARTICIPANTS = 15;
const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || "Events First Group <noreply@eventsfirstgroup.com>";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomName, fullName, email, company, jobTitle, phone } = body;

    if (!roomName || !fullName || !email) {
      return NextResponse.json(
        { error: "Room name, full name, and email are required" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get boardroom details with max_participants
    const { data: boardroom } = await supabase
      .from("boardrooms")
      .select("*")
      .eq("room_name", roomName)
      .single();

    const maxParticipants = boardroom?.max_participants || DEFAULT_MAX_PARTICIPANTS;

    // Check current registration count
    const { count: registrationCount } = await supabase
      .from("boardroom_registrations")
      .select("*", { count: "exact", head: true })
      .eq("room_name", roomName)
      .in("status", ["registered", "admitted", "joined"]);

    if (registrationCount !== null && registrationCount >= maxParticipants) {
      return NextResponse.json(
        { 
          error: "This boardroom has reached capacity",
          details: `Maximum ${maxParticipants} participants allowed. Please contact the organizer for waitlist options.`
        },
        { status: 400 }
      );
    }

    // Check if already registered
    const { data: existing } = await supabase
      .from("boardroom_registrations")
      .select("id, status, join_token")
      .eq("room_name", roomName)
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      // If cancelled, allow re-registration
      if (existing.status === "cancelled") {
        // Reactivate registration
        const newToken = randomUUID();
        await supabase
          .from("boardroom_registrations")
          .update({
            status: "registered",
            join_token: newToken,
            full_name: fullName,
            company: company || null,
            job_title: jobTitle || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        return NextResponse.json({
          success: true,
          message: "Registration reactivated. Check your email for the join link.",
          joinToken: newToken,
        });
      }

      return NextResponse.json(
        { error: "You are already registered for this session" },
        { status: 400 }
      );
    }

    // Generate unique join token
    const joinToken = randomUUID();

    // Insert registration
    const { error: insertError } = await supabase
      .from("boardroom_registrations")
      .insert({
        room_name: roomName,
        full_name: fullName,
        email: email.toLowerCase(),
        company: company || null,
        job_title: jobTitle || null,
        phone: phone || null,
        join_token: joinToken,
        status: "registered",
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Registration insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to register" },
        { status: 500 }
      );
    }

    // Send confirmation email with branded template
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        const joinUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://eventsfirstgroup.com"}/boardroom/${roomName}?token=${joinToken}`;
        
        const eventDate = boardroom?.scheduled_time 
          ? new Date(boardroom.scheduled_time)
          : new Date("2026-03-27T10:00:00+04:00");
        
        const formattedDate = eventDate.toLocaleDateString("en-US", { 
          weekday: "long", 
          year: "numeric", 
          month: "long", 
          day: "numeric",
          timeZone: "Asia/Dubai"
        });
        
        const formattedTime = eventDate.toLocaleTimeString("en-US", { 
          hour: "numeric", 
          minute: "2-digit",
          timeZone: "Asia/Dubai"
        });

        // Generate calendar links
        const eventTitle = encodeURIComponent(boardroom?.title || "Executive AI Boardroom");
        const eventDescription = encodeURIComponent("Join our exclusive executive roundtable on AI strategy and governance.");
        const startTime = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const endTime = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
        
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startTime}/${endTime}&details=${eventDescription}&location=Virtual`;
        const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${eventTitle}&startdt=${eventDate.toISOString()}&enddt=${new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString()}&body=${eventDescription}&location=Virtual`;

        await resend.emails.send({
          from: EMAIL_FROM,
          to: email,
          subject: `Confirmed: ${boardroom?.title || "Executive AI Boardroom"} – ${formattedDate}`,
          html: generateConfirmationEmail({
            fullName,
            eventTitle: boardroom?.title || "Executive AI Boardroom",
            eventDate: formattedDate,
            eventTime: formattedTime,
            joinUrl,
            googleCalendarUrl,
            outlookCalendarUrl,
            sponsorLogo: boardroom?.sponsor_logo || "https://images.ctfassets.net/5nvgvgqbpp73/6f63ePFTcBtQIWJiVIbKVV/708831f68f139c954afadead4486d894/White_Dataiku_Lockup_Logo.svg",
            sponsorName: boardroom?.sponsor_name || "Dataiku",
          }),
        });

        // Notify admin
        const remainingSeats = maxParticipants - (registrationCount || 0) - 1;
        await resend.emails.send({
          from: EMAIL_FROM,
          to: NOTIFICATION_EMAIL,
          subject: `New Registration: ${fullName} for ${boardroom?.title || roomName}`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #C9935A; margin-bottom: 16px;">New Boardroom Registration</h2>
              <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
                <p style="margin: 0 0 8px;"><strong>Event:</strong> ${boardroom?.title || roomName}</p>
                <p style="margin: 0 0 8px;"><strong>Name:</strong> ${fullName}</p>
                <p style="margin: 0 0 8px;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 0 0 8px;"><strong>Company:</strong> ${company || "N/A"}</p>
                <p style="margin: 0;"><strong>Title:</strong> ${jobTitle || "N/A"}</p>
              </div>
              <p style="color: #666; font-size: 14px;">
                <strong>${remainingSeats}</strong> seats remaining out of ${maxParticipants}
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Email error:", emailErr);
        // Don't fail registration if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful. Check your email for the join link.",
      joinToken,
      seatsRemaining: maxParticipants - (registrationCount || 0) - 1,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL TEMPLATE - Premium Branded Confirmation
// ═══════════════════════════════════════════════════════════════════════════

interface EmailTemplateParams {
  fullName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  joinUrl: string;
  googleCalendarUrl: string;
  outlookCalendarUrl: string;
  sponsorLogo: string;
  sponsorName: string;
}

function generateConfirmationEmail(params: EmailTemplateParams): string {
  const { fullName, eventTitle, eventDate, eventTime, joinUrl, googleCalendarUrl, outlookCalendarUrl, sponsorLogo, sponsorName } = params;
  
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
          
          <!-- Header with Logos -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; border-bottom: 1px solid rgba(201, 147, 90, 0.2);">
              <img src="${sponsorLogo}" alt="${sponsorName}" height="32" style="height: 32px; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
              <p style="color: rgba(255,255,255,0.4); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 0;">
                Executive AI Boardroom
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 48px 40px;">
              
              <!-- Confirmation Badge -->
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, rgba(201,147,90,0.2), transparent); border: 1px solid rgba(201,147,90,0.3); line-height: 80px; text-align: center;">
                  <span style="color: #C9935A; font-size: 36px;">✓</span>
                </div>
              </div>
              
              <!-- Welcome Message -->
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 300; text-align: center; margin: 0 0 16px; letter-spacing: -0.5px;">
                You're Confirmed
              </h1>
              <p style="color: rgba(255,255,255,0.6); font-size: 16px; text-align: center; margin: 0 0 40px; line-height: 1.6;">
                ${fullName}, your seat is reserved for our exclusive executive roundtable.
              </p>
              
              <!-- Event Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(201,147,90,0.05); border: 1px solid rgba(201,147,90,0.2); border-radius: 8px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="70" style="vertical-align: top;">
                          <div style="background: rgba(201,147,90,0.1); border-radius: 8px; padding: 12px 16px; text-align: center;">
                            <div style="color: #C9935A; font-size: 24px; font-weight: 300; line-height: 1;">${eventDate.split(',')[1]?.trim().split(' ')[1] || '27'}</div>
                            <div style="color: rgba(255,255,255,0.4); font-size: 10px; letter-spacing: 1px; margin-top: 4px;">${eventDate.split(',')[1]?.trim().split(' ')[0]?.toUpperCase().slice(0,3) || 'MAR'}</div>
                          </div>
                        </td>
                        <td style="padding-left: 20px; vertical-align: top;">
                          <h2 style="color: #ffffff; font-size: 18px; font-weight: 500; margin: 0 0 8px;">${eventTitle}</h2>
                          <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0 0 4px;">
                            📅 ${eventDate}
                          </p>
                          <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0 0 4px;">
                            🕐 ${eventTime} GST (Dubai)
                          </p>
                          <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0;">
                            💻 Virtual Roundtable
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Join Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${joinUrl}" style="display: inline-block; background: #C9935A; color: #000000; font-size: 14px; font-weight: 600; text-decoration: none; padding: 16px 48px; letter-spacing: 0.5px;">
                      Join Boardroom
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Calendar Links -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 40px;">
                <tr>
                  <td style="text-align: center;">
                    <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0 0 12px;">Add to calendar:</p>
                    <a href="${googleCalendarUrl}" style="color: #C9935A; font-size: 13px; text-decoration: none; margin: 0 12px;">Google Calendar</a>
                    <span style="color: rgba(255,255,255,0.2);">|</span>
                    <a href="${outlookCalendarUrl}" style="color: #C9935A; font-size: 13px; text-decoration: none; margin: 0 12px;">Outlook</a>
                  </td>
                </tr>
              </table>
              
              <!-- What to Expect -->
              <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 32px;">
                <h3 style="color: #C9935A; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 16px;">
                  What to Expect
                </h3>
                <ul style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Intimate discussion with 15 senior executives</li>
                  <li>AI governance and orchestration strategies</li>
                  <li>Real-world implementation insights</li>
                  <li>Networking with industry peers</li>
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
