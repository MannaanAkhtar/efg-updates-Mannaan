import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { randomUUID } from "crypto";

// ═══════════════════════════════════════════════════════════════════════════
// REGISTER FOR BOARDROOM
// ═══════════════════════════════════════════════════════════════════════════

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "ateeq@eventsfirstgroup.com";

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

    // Generate unique join token
    const joinToken = randomUUID();

    // Store in Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if already registered
    const { data: existing } = await supabase
      .from("boardroom_registrations")
      .select("id")
      .eq("room_name", roomName)
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "You are already registered for this session" },
        { status: 400 }
      );
    }

    // Get boardroom details
    const { data: boardroom } = await supabase
      .from("boardrooms")
      .select("*")
      .eq("room_name", roomName)
      .single();

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

    // Send confirmation email
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        const joinUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://eventsfirstgroup.com"}/boardroom/${roomName}?token=${joinToken}`;

        await resend.emails.send({
          from: "EFG Boardrooms <onboarding@resend.dev>",
          to: email,
          subject: `You're registered: ${boardroom?.title || "Virtual Boardroom"}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #E8651A; padding: 24px 32px; border-radius: 8px 8px 0 0;">
                <h1 style="color: #fff; margin: 0; font-size: 20px;">You're Registered!</h1>
              </div>
              <div style="padding: 24px 32px; background: #fff; border: 1px solid #eee; border-top: 0; border-radius: 0 0 8px 8px;">
                <p>Hi ${fullName},</p>
                <p>You're confirmed for <strong>${boardroom?.title || "Virtual Boardroom"}</strong>.</p>
                ${boardroom?.scheduled_time ? `<p><strong>When:</strong> ${new Date(boardroom.scheduled_time).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Dubai" })} (Dubai Time)</p>` : ""}
                <div style="margin: 24px 0;">
                  <a href="${joinUrl}" style="background: #E8651A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Join Boardroom</a>
                </div>
                <p style="color: #666; font-size: 14px;">Or copy this link: ${joinUrl}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
                <p style="color: #999; font-size: 12px;">Events First Group | eventsfirstgroup.com</p>
              </div>
            </div>
          `,
        });

        // Notify admin
        await resend.emails.send({
          from: "EFG Boardrooms <onboarding@resend.dev>",
          to: NOTIFICATION_EMAIL,
          subject: `New Boardroom Registration: ${fullName}`,
          html: `
            <p><strong>New registration for ${boardroom?.title || roomName}</strong></p>
            <ul>
              <li>Name: ${fullName}</li>
              <li>Email: ${email}</li>
              <li>Company: ${company || "N/A"}</li>
              <li>Title: ${jobTitle || "N/A"}</li>
            </ul>
          `,
        });
      } catch (emailErr) {
        console.error("Email error:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful. Check your email for the join link.",
      joinToken,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
