import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════════════════════════
// DAILY.CO API CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const DAILY_API_KEY = process.env.DAILY_API_KEY || "";
const DAILY_API_URL = "https://api.daily.co/v1";

// ═══════════════════════════════════════════════════════════════════════════
// CREATE ROOM
// ═══════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, scheduledTime, maxParticipants = 15 } = body;

    if (!DAILY_API_KEY) {
      return NextResponse.json(
        { error: "Daily API key not configured" },
        { status: 500 }
      );
    }

    // Create room in Daily.co
    const roomName = name || `efg-${Date.now()}`;
    
    const dailyResponse = await fetch(`${DAILY_API_URL}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: roomName,
        privacy: "private", // Requires token to join
        properties: {
          max_participants: maxParticipants,
          enable_screenshare: true,
          enable_chat: true,
          enable_knocking: true, // Waiting room
          enable_recording: "cloud", // Cloud recording
          start_video_off: true,
          start_audio_off: true,
          exp: scheduledTime 
            ? Math.floor(new Date(scheduledTime).getTime() / 1000) + 86400 // Expires 24h after scheduled
            : Math.floor(Date.now() / 1000) + 604800, // Default: 7 days
        },
      }),
    });

    if (!dailyResponse.ok) {
      const error = await dailyResponse.json();
      console.error("Daily API error:", error);
      return NextResponse.json(
        { error: "Failed to create room" },
        { status: 500 }
      );
    }

    const dailyRoom = await dailyResponse.json();

    // Store in Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      await supabase.from("boardrooms").insert({
        room_name: dailyRoom.name,
        room_url: dailyRoom.url,
        title: title || "Virtual Boardroom",
        scheduled_time: scheduledTime || null,
        max_participants: maxParticipants,
        status: "scheduled",
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      room: {
        name: dailyRoom.name,
        url: dailyRoom.url,
        joinUrl: `/boardroom/${dailyRoom.name}`,
      },
    });
  } catch (err) {
    console.error("Create room error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// GET ROOM INFO
// ═══════════════════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get("room");

    if (!roomName) {
      return NextResponse.json(
        { error: "Room name required" },
        { status: 400 }
      );
    }

    if (!DAILY_API_KEY) {
      return NextResponse.json(
        { error: "Daily API key not configured" },
        { status: 500 }
      );
    }

    const dailyResponse = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    });

    if (!dailyResponse.ok) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    const room = await dailyResponse.json();

    return NextResponse.json({
      name: room.name,
      url: room.url,
      createdAt: room.created_at,
      config: room.config,
    });
  } catch (err) {
    console.error("Get room error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
