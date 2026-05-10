import { NextResponse } from "next/server";
import { ensureDemoUser } from "@/lib/connect/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const creds = await ensureDemoUser();
    return NextResponse.json({
      ok: true,
      email: creds.email,
      password: creds.password,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error during demo provisioning.";
    console.error("[demo-login] failed:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
