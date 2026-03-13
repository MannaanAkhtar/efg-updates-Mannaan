import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════════════════════════
// GENERATE MEETING TOKEN - Enhanced with registration verification
// ═══════════════════════════════════════════════════════════════════════════

const DAILY_API_KEY = process.env.DAILY_API_KEY || "";
const DAILY_API_URL = "https://api.daily.co/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomName, userName, isOwner = false, joinToken, email } = body;

    if (!roomName || !userName) {
      return NextResponse.json(
        { error: "Room name and user name required" },
        { status: 400 }
      );
    }

    if (!DAILY_API_KEY) {
      return NextResponse.json(
        { error: "Daily API key not configured" },
        { status: 500 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Skip registration check for owners (hosts)
    if (isOwner) {
      // Hosts don't need registration verification
      // Generate owner token directly
    } else if (joinToken && supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: registration, error: regError } = await supabase
        .from("boardroom_registrations")
        .select("*")
        .eq("join_token", joinToken)
        .eq("room_name", roomName)
        .single();

      if (regError || !registration) {
        return NextResponse.json(
          { error: "Invalid registration token. Please register first." },
          { status: 403 }
        );
      }

      // Check registration status
      if (registration.status === "cancelled" || registration.status === "rejected") {
        return NextResponse.json(
          { error: "Your registration has been cancelled" },
          { status: 403 }
        );
      }

      // Track join attempt
      const joinAttempts = (registration.join_attempts || 0) + 1;
      await supabase
        .from("boardroom_registrations")
        .update({
          join_attempts: joinAttempts,
          last_join_attempt: new Date().toISOString(),
          status: registration.status === "registered" ? "joining" : registration.status,
        })
        .eq("id", registration.id);
    } else if (email && supabaseUrl && supabaseKey) {
      // Fallback: verify by email if no token
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: registration } = await supabase
        .from("boardroom_registrations")
        .select("*")
        .eq("email", email.toLowerCase())
        .eq("room_name", roomName)
        .single();

      if (!registration) {
        return NextResponse.json(
          { error: "You must register before joining. Please complete registration first." },
          { status: 403 }
        );
      }

      if (registration.status === "cancelled" || registration.status === "rejected") {
        return NextResponse.json(
          { error: "Your registration has been cancelled" },
          { status: 403 }
        );
      }

      // Track join attempt
      await supabase
        .from("boardroom_registrations")
        .update({
          join_attempts: (registration.join_attempts || 0) + 1,
          last_join_attempt: new Date().toISOString(),
        })
        .eq("id", registration.id);
    }

    // Generate meeting token
    const tokenResponse = await fetch(`${DAILY_API_URL}/meeting-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          user_name: userName,
          is_owner: isOwner,
          enable_screenshare: true,
          enable_recording: isOwner ? "cloud" : undefined,
          start_video_off: false,
          start_audio_off: true,
          exp: Math.floor(Date.now() / 1000) + 86400, // 24 hour expiry
        },
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error("Token generation error:", error);
      return NextResponse.json(
        { error: "Failed to generate token" },
        { status: 500 }
      );
    }

    const { token } = await tokenResponse.json();

    return NextResponse.json({
      success: true,
      token,
    });
  } catch (err) {
    console.error("Token error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
