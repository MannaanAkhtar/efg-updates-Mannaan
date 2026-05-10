"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export function DemoLoginButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setPending(true);

    try {
      // 1. Ensure the demo auth user + profile exist (server-side, uses
      //    SUPABASE_SERVICE_ROLE_KEY) and get back the credentials to use.
      const ensureRes = await fetch("/api/connect/demo-login", {
        method: "POST",
      });
      const ensureJson = (await ensureRes.json()) as
        | { ok: true; email: string; password: string }
        | { ok: false; error: string };

      if (!ensureJson.ok) {
        setError(ensureJson.error);
        return;
      }

      // 2. Sign in client-side so cookies are set in this browser.
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: ensureJson.email,
        password: ensureJson.password,
      });
      if (signInError) {
        setError(signInError.message);
        return;
      }

      window.location.href = "/connect/dashboard";
    } catch (err) {
      console.error(err);
      setError("Demo sign-in failed. Check that Supabase is configured.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="w-full rounded-lg border border-gray-border-hover bg-black-card px-4 py-3 text-[13px] font-medium text-white transition-all hover:border-orange/40 hover:bg-black-card-hover disabled:opacity-50"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {pending ? "Signing in..." : "Sign in as Sara → Palo Alto MENA"}
      </button>
      {error && (
        <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-[12px] text-red-300">
          {error}
        </div>
      )}
    </>
  );
}
