"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveInterestsAction } from "./actions";

interface Props {
  organizationName: string;
  organizationLogoUrl: string | null;
  organizationWebsite: string | null;
  userFullName: string;
}

const INDUSTRIES = [
  "BFSI", "Energy", "Telecom", "Government", "Healthcare", "Retail / FMCG",
  "Manufacturing", "Petrochem", "Utilities", "Aviation", "Real Estate",
  "Investment", "Logistics", "Hospitality", "Mining", "Education",
];
const TITLES = [
  "CISO", "CIO", "CTO", "CDO", "VP Cybersecurity", "VP Information Security",
  "VP Cyber Operations", "Head of OT Security", "Head of Cloud Security",
  "Director of Cybersecurity", "Head of GRC", "Head of Threat Intelligence",
  "VP Engineering", "Chief Data Officer",
];
const GEOS = [
  "UAE", "Saudi Arabia", "Kuwait", "Qatar", "Oman", "Bahrain",
  "Egypt", "Jordan", "India", "Kenya", "South Africa", "Nigeria",
];
const TOPICS = [
  "Zero Trust", "SASE / SSE", "Cloud security", "OT / ICS security",
  "Threat intelligence", "AI in security operations", "Identity & access",
  "Data privacy & sovereignty", "Quantum readiness", "DevSecOps",
  "Industrial cybersecurity", "Critical infrastructure resilience",
];

const STEPS = [
  { n: 1, label: "Confirm organisation" },
  { n: 2, label: "Target audience" },
  { n: 3, label: "Topics & competitors" },
] as const;

export function OnboardingFlow({
  organizationName,
  organizationLogoUrl,
  organizationWebsite,
  userFullName,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Step 1: organisation confirmation (display-only for now)
  // Step 2 state
  const [industries, setIndustries] = useState<string[]>(["BFSI", "Energy", "Telecom"]);
  const [titles, setTitles] = useState<string[]>(["CISO", "VP Cybersecurity", "Head of OT Security"]);
  const [geos, setGeos] = useState<string[]>(["Saudi Arabia", "UAE", "Qatar"]);

  // Step 3 state
  const [topics, setTopics] = useState<string[]>(["Zero Trust", "Cloud security", "AI in security operations"]);
  const [accountsText, setAccountsText] = useState<string>(
    "Saudi Aramco\nSABIC\nMaaden\nADNOC\nstc\nMobily\nQatarEnergy\nReliance Industries",
  );
  const [competitorsText, setCompetitorsText] = useState<string>(
    "Fortinet\nCheck Point\nCisco Security\nCrowdStrike\nMicrosoft Security",
  );

  function toggle(arr: string[], setArr: (v: string[]) => void, value: string) {
    if (arr.includes(value)) setArr(arr.filter((x) => x !== value));
    else setArr([...arr, value]);
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await saveInterestsAction({
        target_industries: industries,
        target_titles: titles,
        target_geos: geos,
        topics,
        target_accounts: accountsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        competitors: competitorsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/connect/dashboard");
    });
  }

  return (
    <div
      className="mx-auto max-w-[820px]"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      {/* Stepper */}
      <ol className="mb-12 flex items-center gap-3">
        {STEPS.map((s, i) => {
          const isActive = step === s.n;
          const isDone = step > s.n;
          return (
            <li key={s.n} className="flex flex-1 items-center gap-3">
              <div className="flex flex-1 items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold transition ${
                    isDone
                      ? "border-orange bg-orange text-white"
                      : isActive
                      ? "border-orange bg-transparent text-orange"
                      : "border-gray-border bg-transparent text-white-muted"
                  }`}
                >
                  {isDone ? "✓" : s.n}
                </span>
                <span
                  className={`hidden text-[13px] font-medium sm:inline ${
                    isActive ? "text-white" : "text-white-dim"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`hidden h-px flex-1 sm:block ${
                    step > s.n ? "bg-orange/40" : "bg-gray-border"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Card */}
      <div className="rounded-3xl border border-gray-border bg-black-card p-8 sm:p-10">
        {step === 1 && (
          <StepOne
            organizationName={organizationName}
            organizationLogoUrl={organizationLogoUrl}
            organizationWebsite={organizationWebsite}
            userFullName={userFullName}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepTwo
            industries={industries}
            titles={titles}
            geos={geos}
            toggle={toggle}
            setIndustries={setIndustries}
            setTitles={setTitles}
            setGeos={setGeos}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <StepThree
            topics={topics}
            setTopics={setTopics}
            accountsText={accountsText}
            setAccountsText={setAccountsText}
            competitorsText={competitorsText}
            setCompetitorsText={setCompetitorsText}
            toggle={toggle}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
            pending={pending}
            error={error}
          />
        )}
      </div>
    </div>
  );
}

// ─── STEP 1 ─────────────────────────────────────────────────────────────────
function StepOne({
  organizationName,
  organizationLogoUrl,
  organizationWebsite,
  userFullName,
  onNext,
}: {
  organizationName: string;
  organizationLogoUrl: string | null;
  organizationWebsite: string | null;
  userFullName: string;
  onNext: () => void;
}) {
  return (
    <>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-orange">
        Step 1 of 3
      </div>
      <h2
        className="mb-3 text-[26px] font-bold tracking-tight text-white sm:text-[28px]"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
      >
        Welcome to EFG Connect, {userFullName.split(" ")[0]}
      </h2>
      <p className="mb-8 text-[14.5px] leading-relaxed text-white-dim">
        Three quick steps before you see your portal. We&apos;ll use these
        answers to surface the right events, the right attendees, and the right
        signals — and only that.
      </p>

      <div className="rounded-2xl border border-gray-border bg-black px-5 py-5">
        <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white-muted">
          Your organisation
        </div>
        <div className="flex items-center gap-4">
          {organizationLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={organizationLogoUrl}
              alt=""
              className="h-12 w-12 rounded-md object-contain"
            />
          ) : (
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-white/10 text-[18px] font-semibold">
              {organizationName.charAt(0)}
            </span>
          )}
          <div className="min-w-0">
            <div
              className="text-[16px] font-semibold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {organizationName}
            </div>
            {organizationWebsite && (
              <div className="truncate text-[12.5px] text-white-muted">
                {organizationWebsite}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 text-[12.5px] text-white-dim">
          Looks right?{" "}
          <a
            href="https://www.eventsfirstgroup.com/contact"
            className="text-orange-bright underline-offset-2 hover:underline"
          >
            Tell us if anything&apos;s off
          </a>
          .
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-orange px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-orange-bright"
          style={{ boxShadow: "0 8px 24px rgba(232,101,26,0.18)" }}
        >
          Continue →
        </button>
      </div>
    </>
  );
}

// ─── STEP 2 ─────────────────────────────────────────────────────────────────
function StepTwo({
  industries, titles, geos,
  toggle,
  setIndustries, setTitles, setGeos,
  onBack, onNext,
}: {
  industries: string[];
  titles: string[];
  geos: string[];
  toggle: (arr: string[], set: (v: string[]) => void, value: string) => void;
  setIndustries: (v: string[]) => void;
  setTitles: (v: string[]) => void;
  setGeos: (v: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const valid = industries.length > 0 && titles.length > 0 && geos.length > 0;
  return (
    <>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-orange">
        Step 2 of 3
      </div>
      <h2
        className="mb-3 text-[26px] font-bold tracking-tight text-white sm:text-[28px]"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
      >
        Who are you trying to reach?
      </h2>
      <p className="mb-8 text-[14.5px] leading-relaxed text-white-dim">
        Tell us your buyer. We&apos;ll match every event&apos;s attendee list
        against this profile and surface the most relevant rooms first.
      </p>

      <div className="space-y-7">
        <ChipGroup
          label="Industries"
          options={INDUSTRIES}
          values={industries}
          onToggle={(v) => toggle(industries, setIndustries, v)}
        />
        <ChipGroup
          label="Job titles"
          options={TITLES}
          values={titles}
          onToggle={(v) => toggle(titles, setTitles, v)}
        />
        <ChipGroup
          label="Geographies"
          options={GEOS}
          values={geos}
          onToggle={(v) => toggle(geos, setGeos, v)}
        />
      </div>

      <div className="mt-10 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-border bg-transparent px-5 py-3 text-[13.5px] font-medium text-white-dim transition hover:border-gray-border-hover hover:text-white"
        >
          ← Back
        </button>
        <button
          type="button"
          disabled={!valid}
          onClick={onNext}
          className="rounded-lg bg-orange px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-orange-bright disabled:cursor-not-allowed disabled:opacity-40"
          style={{ boxShadow: "0 8px 24px rgba(232,101,26,0.18)" }}
        >
          Continue →
        </button>
      </div>
    </>
  );
}

// ─── STEP 3 ─────────────────────────────────────────────────────────────────
function StepThree({
  topics, setTopics,
  accountsText, setAccountsText,
  competitorsText, setCompetitorsText,
  toggle,
  onBack, onSubmit, pending, error,
}: {
  topics: string[];
  setTopics: (v: string[]) => void;
  accountsText: string;
  setAccountsText: (v: string) => void;
  competitorsText: string;
  setCompetitorsText: (v: string) => void;
  toggle: (arr: string[], set: (v: string[]) => void, value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  pending: boolean;
  error: string | null;
}) {
  return (
    <>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-orange">
        Step 3 of 3
      </div>
      <h2
        className="mb-3 text-[26px] font-bold tracking-tight text-white sm:text-[28px]"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
      >
        What matters most?
      </h2>
      <p className="mb-8 text-[14.5px] leading-relaxed text-white-dim">
        Topics, target accounts, and competitors. We use this to flag relevant
        signals across every EFG event — automatically.
      </p>

      <div className="space-y-7">
        <ChipGroup
          label="Topics"
          options={TOPICS}
          values={topics}
          onToggle={(v) => toggle(topics, setTopics, v)}
        />

        <TextareaField
          label="Target accounts"
          hint="One per line. We'll alert you when any of these companies registers for an EFG event."
          value={accountsText}
          onChange={setAccountsText}
          placeholder="Saudi Aramco&#10;ADNOC&#10;Reliance Industries"
        />

        <TextareaField
          label="Competitors"
          hint="One per line. We'll surface when they sponsor or speak at events you're interested in."
          value={competitorsText}
          onChange={setCompetitorsText}
          placeholder="Fortinet&#10;Cisco Security&#10;CrowdStrike"
        />
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-[13px] text-red-300">
          {error}
        </div>
      )}

      <div className="mt-10 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={pending}
          className="rounded-lg border border-gray-border bg-transparent px-5 py-3 text-[13.5px] font-medium text-white-dim transition hover:border-gray-border-hover hover:text-white disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={pending}
          className="rounded-lg bg-orange px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-orange-bright disabled:opacity-50"
          style={{ boxShadow: "0 8px 24px rgba(232,101,26,0.18)" }}
        >
          {pending ? "Saving..." : "Enter Connect →"}
        </button>
      </div>
    </>
  );
}

// ─── PRIMITIVES ─────────────────────────────────────────────────────────────
function ChipGroup({
  label,
  options,
  values,
  onToggle,
}: {
  label: string;
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-white-muted">
          {label}
        </span>
        <span className="text-[11px] text-white-muted">
          {values.length} selected
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = values.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-all ${
                selected
                  ? "border-orange bg-orange/10 text-white"
                  : "border-gray-border bg-transparent text-white-dim hover:border-gray-border-hover hover:text-white"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TextareaField({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.16em] text-white-muted">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-border bg-black px-4 py-3 text-[13.5px] leading-relaxed text-white placeholder:text-white-muted focus:border-orange/40 focus:outline-none"
      />
      <div className="mt-1.5 text-[11.5px] text-white-muted">{hint}</div>
    </div>
  );
}
