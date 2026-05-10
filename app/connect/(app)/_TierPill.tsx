import type { Tier } from "@/lib/connect/types";

const STYLES: Record<Tier, { bg: string; border: string; text: string }> = {
  platinum: {
    bg: "rgba(232,101,26,0.10)",
    border: "rgba(232,101,26,0.30)",
    text: "var(--orange-bright)",
  },
  gold: {
    bg: "rgba(255,215,0,0.06)",
    border: "rgba(255,215,0,0.20)",
    text: "rgba(255,215,0,0.95)",
  },
  silver: {
    bg: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.18)",
    text: "rgba(255,255,255,0.85)",
  },
  bronze: {
    bg: "rgba(180,120,80,0.06)",
    border: "rgba(180,120,80,0.20)",
    text: "rgba(210,150,100,0.95)",
  },
  associate: {
    bg: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.10)",
    text: "var(--white-dim)",
  },
  supporting: {
    bg: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.12)",
    text: "var(--white-dim)",
  },
};

export function TierPill({ tier, size = "sm" }: { tier: Tier; size?: "sm" | "md" }) {
  const s = STYLES[tier];
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold uppercase tracking-[0.16em] ${
        size === "md" ? "px-3 py-1 text-[10.5px]" : "px-2.5 py-0.5 text-[9.5px]"
      }`}
      style={{
        background: s.bg,
        borderColor: s.border,
        color: s.text,
        fontFamily: "var(--font-outfit)",
      }}
    >
      {tier}
    </span>
  );
}
