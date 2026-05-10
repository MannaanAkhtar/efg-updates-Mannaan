"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );

      const redirectTo = `${window.location.origin}/api/connect/auth-callback`;
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: false,
        },
      });

      if (authError) {
        setError(
          authError.message.toLowerCase().includes("user")
            ? "We don't recognise that email. Contact your EFG account manager."
            : "Something went wrong. Try again or use the demo sign-in below.",
        );
        return;
      }

      // Redirect to the same page with ?sent=1 so the success card renders
      // server-side without flickering.
      window.location.href = "/connect/login?sent=1";
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again or use the demo sign-in below.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span
          className="mb-2 block text-[12px] font-medium uppercase tracking-[0.16em] text-white-muted"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Work email
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full rounded-lg border border-gray-border bg-black px-4 py-3 text-[14px] text-white placeholder:text-white-muted focus:border-orange/40 focus:outline-none"
          style={{ fontFamily: "var(--font-outfit)" }}
        />
      </label>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-[12.5px] text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !email}
        className="w-full rounded-lg bg-orange px-4 py-3 text-[14px] font-semibold text-white transition-all hover:bg-orange-bright disabled:opacity-50 disabled:hover:bg-orange"
        style={{
          fontFamily: "var(--font-outfit)",
          boxShadow: "0 8px 24px rgba(232,101,26,0.18)",
        }}
      >
        {submitting ? "Sending link..." : "Email me a sign-in link"}
      </button>
    </form>
  );
}
