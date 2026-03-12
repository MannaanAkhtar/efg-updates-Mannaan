import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════════════════
// GENERATE MEETING TOKEN
// ═══════════════════════════════════════════════════════════════════════════

const DAILY_API_KEY = process.env.DAILY_API_KEY || "";
const DAILY_API_URL = "https://api.daily.co/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomName, userName, isOwner = false } = body;

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
          is_owner: isOwner, // Owners can mute others, end call, etc.
          enable_screenshare: true,
          enable_recording: isOwner ? "cloud" : undefined,
          start_video_off: true,
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
