import Link from "next/link";
import { LoginForm } from "./_LoginForm";
import { DemoLoginButton } from "./_DemoLoginButton";

export const metadata = {
  title: "Sign in — EFG Connect",
};

const ERROR_MESSAGES: Record<string, string> = {
  profile_missing:
    "Your account is not yet set up. Please contact your EFG account manager.",
  org_missing:
    "Your organisation is not yet active in Connect. Please contact your EFG account manager.",
  invalid: "That sign-in link is invalid or has expired. Request a new one below.",
  expired: "Your session has expired. Sign in again to continue.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const params = await searchParams;
  const error = params.error ? ERROR_MESSAGES[params.error] : null;
  const sent = params.sent === "1";

  return (
    <div className="w-full max-w-[440px]">
      {/* Wordmark */}
      <Link
        href="/"
        className="mb-12 flex items-center gap-3 text-white-dim transition-colors hover:text-white"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
          style={{
            background: "linear-gradient(135deg, #E8651A 0%, #FF7A2E 100%)",
            boxShadow: "0 8px 32px rgba(232,101,26,0.25)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l7.36 3.68L12 11.55 4.64 7.86 12 4.18zM4 9.27l7 3.5v7.96l-7-3.5V9.27zm9 11.46v-7.96l7-3.5v7.96l-7 3.5z"
              fill="white"
            />
          </svg>
        </span>
        <div>
          <div
            className="text-[15px] font-semibold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            EFG Connect
          </div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-white-muted">
            Sponsor portal
          </div>
        </div>
      </Link>

      {/* Card */}
      <div
        className="rounded-3xl border border-gray-border bg-black-card/60 p-8 backdrop-blur-xl sm:p-10"
        style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
      >
        <h1
          className="mb-3 text-[28px] font-bold leading-tight tracking-tight text-white sm:text-[32px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Welcome back
        </h1>
        <p
          className="mb-8 text-[14px] leading-relaxed text-white-dim"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Sign in to your sponsor portal. We&apos;ll email you a secure link —
          no password to remember.
        </p>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-[13px] text-red-300">
            {error}
          </div>
        )}

        {sent ? (
          <div className="rounded-xl border border-orange/20 bg-orange/5 px-5 py-6 text-center">
            <div
              className="mb-2 text-[15px] font-semibold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Check your inbox
            </div>
            <div className="text-[13px] text-white-dim">
              We&apos;ve sent a sign-in link. It&apos;ll expire in 30 minutes.
            </div>
          </div>
        ) : (
          <LoginForm />
        )}
      </div>

      {/* Demo strip */}
      <div className="mt-6 rounded-2xl border border-gray-border bg-black-card/40 p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange" />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Design partner preview
          </span>
        </div>
        <p
          className="mb-4 text-[12.5px] leading-relaxed text-white-dim"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          For tomorrow&apos;s walkthrough — sign in instantly as Sara
          Al-Qahtani, Field Marketing at Palo Alto Networks MENA.
        </p>
        <DemoLoginButton />
      </div>

      <p className="mt-8 text-center text-[12px] text-white-muted">
        Not a sponsor yet?{" "}
        <a
          href="https://www.eventsfirstgroup.com/contact"
          className="text-white-dim underline-offset-2 hover:text-orange-bright hover:underline"
        >
          Speak with the EFG partnerships team
        </a>
      </p>
    </div>
  );
}
