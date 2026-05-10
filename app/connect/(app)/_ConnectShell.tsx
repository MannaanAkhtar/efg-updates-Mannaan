"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface NavItem {
  href: string;
  label: string;
  active: boolean;
  icon: React.ReactNode;
  badge?: "Phase 2" | "Phase 3";
}

const NAV: NavItem[] = [
  {
    href: "/connect/dashboard",
    label: "Home",
    active: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l9-9 9 9" /><path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    href: "/connect/sponsorships",
    label: "My Sponsorships",
    active: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9h18" />
      </svg>
    ),
  },
  {
    href: "/connect/intelligence",
    label: "Intelligence",
    active: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
      </svg>
    ),
    badge: "Phase 2",
  },
  {
    href: "/connect/community",
    label: "Community",
    active: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    badge: "Phase 3",
  },
  {
    href: "/connect/marketplace",
    label: "Marketplace",
    active: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l1.5-5h15L21 9" /><path d="M3 9v11h18V9" /><path d="M9 13h6" />
      </svg>
    ),
    badge: "Phase 3",
  },
];

const FOOTER_NAV = [
  { href: "/connect/settings", label: "Settings" },
];

interface Props {
  orgName: string;
  orgLogoUrl: string | null;
  userName: string;
  userTitle: string | null;
  children: React.ReactNode;
}

export function ConnectShell({
  orgName,
  orgLogoUrl,
  userName,
  userTitle,
  children,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    await supabase.auth.signOut();
    router.push("/connect/login");
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* ─── SIDEBAR ───────────────────────────────────────────────────── */}
      <aside
        className="hidden w-[260px] shrink-0 flex-col border-r border-gray-border bg-black px-4 py-6 lg:flex"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {/* Brand */}
        <Link
          href="/connect/dashboard"
          className="mb-8 flex items-center gap-2.5 px-2"
        >
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-md"
            style={{
              background: "linear-gradient(135deg, #E8651A 0%, #FF7A2E 100%)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l7.36 3.68L12 11.55 4.64 7.86 12 4.18zM4 9.27l7 3.5v7.96l-7-3.5V9.27zm9 11.46v-7.96l7-3.5v7.96l-7 3.5z"
                fill="white"
              />
            </svg>
          </span>
          <div>
            <div
              className="text-[13px] font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              EFG Connect
            </div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-white-muted">
              Sponsor portal
            </div>
          </div>
        </Link>

        {/* Org switcher */}
        <div className="mb-6 rounded-xl border border-gray-border bg-black-card px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-[0.16em] text-white-muted">
            Organisation
          </div>
          <div className="mt-1 flex items-center gap-2">
            {orgLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={orgLogoUrl}
                alt=""
                className="h-5 w-5 rounded-sm object-contain"
              />
            ) : (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-white/10 text-[10px] font-semibold">
                {orgName.charAt(0)}
              </span>
            )}
            <span className="truncate text-[13px] font-medium text-white">
              {orgName}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between rounded-lg px-3 py-2 text-[13px] transition-all ${
                  isActive
                    ? "bg-white/[0.04] text-white"
                    : "text-white-dim hover:bg-white/[0.02] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={
                      isActive ? "text-orange" : "text-white-muted group-hover:text-white-dim"
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </span>
                {item.badge && (
                  <span className="rounded-full border border-gray-border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white-muted">
                    {item.badge === "Phase 2" ? "Soon" : "Later"}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="my-4 border-t border-gray-border" />

          {FOOTER_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-all ${
                  isActive
                    ? "bg-white/[0.04] text-white"
                    : "text-white-dim hover:bg-white/[0.02] hover:text-white"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="mt-6 rounded-xl border border-gray-border bg-black-card p-3">
          <div className="flex items-start gap-2.5">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[12px] font-semibold uppercase">
              {userName
                .split(" ")
                .slice(0, 2)
                .map((s) => s[0])
                .join("")}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-medium text-white">
                {userName}
              </div>
              {userTitle && (
                <div className="truncate text-[11px] text-white-muted">
                  {userTitle}
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="mt-3 w-full rounded-md border border-gray-border bg-transparent px-2 py-1.5 text-[11px] text-white-dim transition hover:border-gray-border-hover hover:text-white disabled:opacity-50"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </aside>

      {/* ─── MAIN ──────────────────────────────────────────────────────── */}
      <main className="flex min-h-screen flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-gray-border bg-black px-5 py-3 lg:hidden">
          <Link href="/connect/dashboard" className="flex items-center gap-2">
            <span
              className="inline-flex h-7 w-7 items-center justify-center rounded-md"
              style={{
                background: "linear-gradient(135deg, #E8651A 0%, #FF7A2E 100%)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7v10l10 5 10-5V7L12 2z"
                  fill="white"
                  fillOpacity="0.9"
                />
              </svg>
            </span>
            <span
              className="text-[13px] font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              EFG Connect
            </span>
          </Link>
          <span className="truncate text-[12px] text-white-dim">{orgName}</span>
        </div>

        {/* Page content */}
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
