"use client";

import { useEffect, useMemo, useState } from "react";
import { SENIORITY_LABEL, type Seniority } from "@/lib/connect/types";

interface Row {
  id: string;
  name: string;
  title: string;
  company: string;
  country: string;
  industry: string;
  seniority: Seniority | null;
  registered_at: string;
}

interface SavedView {
  id: string;
  label: string;
  query: string;
  industries: string[];
  countries: string[];
  seniorities: Seniority[];
}

interface Props {
  eventId: string;
  eventName: string;
  eventDate: string;
  attendees: Row[];
}

export function AttendeeBrowser({ eventId, eventName, eventDate, attendees }: Props) {
  const [query, setQuery] = useState("");
  const [industries, setIndustries] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [seniorities, setSeniorities] = useState<Seniority[]>([]);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [newViewLabel, setNewViewLabel] = useState("");

  // Persist saved views in localStorage, scoped per event.
  const STORAGE_KEY = `connect.savedViews.${eventId}`;
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedViews(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  function persistViews(next: SavedView[]) {
    setSavedViews(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  // Distinct values
  const allIndustries = useMemo(
    () => uniqueSorted(attendees.map((a) => a.industry)),
    [attendees],
  );
  const allCountries = useMemo(
    () => uniqueSorted(attendees.map((a) => a.country)),
    [attendees],
  );
  const allSeniorities = useMemo<Seniority[]>(
    () =>
      uniqueSorted(
        attendees.map((a) => a.seniority).filter((s): s is Seniority => Boolean(s)),
      ) as Seniority[],
    [attendees],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return attendees.filter((a) => {
      if (q) {
        const hay = `${a.name} ${a.title} ${a.company}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (industries.length > 0 && !industries.includes(a.industry)) return false;
      if (countries.length > 0 && !countries.includes(a.country)) return false;
      if (seniorities.length > 0 && (!a.seniority || !seniorities.includes(a.seniority))) {
        return false;
      }
      return true;
    });
  }, [attendees, query, industries, countries, seniorities]);

  function toggleFromList<T>(arr: T[], setArr: (v: T[]) => void, value: T) {
    if (arr.includes(value)) setArr(arr.filter((x) => x !== value));
    else setArr([...arr, value]);
  }

  function applySavedView(v: SavedView) {
    setQuery(v.query);
    setIndustries(v.industries);
    setCountries(v.countries);
    setSeniorities(v.seniorities);
  }

  function saveCurrentView() {
    if (!newViewLabel.trim()) return;
    const v: SavedView = {
      id: crypto.randomUUID(),
      label: newViewLabel.trim(),
      query,
      industries,
      countries,
      seniorities,
    };
    persistViews([v, ...savedViews]);
    setNewViewLabel("");
    setShowSavePrompt(false);
  }

  function deleteSavedView(id: string) {
    persistViews(savedViews.filter((v) => v.id !== id));
  }

  function clearAll() {
    setQuery("");
    setIndustries([]);
    setCountries([]);
    setSeniorities([]);
  }

  const filtersActive =
    query !== "" || industries.length > 0 || countries.length > 0 || seniorities.length > 0;

  return (
    <div className="space-y-6">
      {/* Event header strip */}
      <div className="flex items-baseline justify-between border-b border-gray-border pb-4">
        <div>
          <h2
            className="text-[20px] font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            {eventName}
          </h2>
          <div className="mt-1 text-[12.5px] text-white-dim">
            {eventDate} · {attendees.length} verified attendees
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10.5px] uppercase tracking-[0.14em] text-white-muted">
            Showing
          </div>
          <div
            className="text-[20px] font-bold tabular-nums text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {filtered.length}
            <span className="ml-1 text-[12px] font-normal text-white-muted">
              of {attendees.length}
            </span>
          </div>
        </div>
      </div>

      {/* Saved views */}
      {savedViews.length > 0 && (
        <div>
          <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white-muted">
            Saved views
          </div>
          <div className="flex flex-wrap gap-2">
            {savedViews.map((v) => (
              <span
                key={v.id}
                className="group inline-flex items-center gap-2 rounded-full border border-gray-border bg-black-card px-3 py-1 text-[12px] text-white-dim"
              >
                <button
                  type="button"
                  onClick={() => applySavedView(v)}
                  className="hover:text-white"
                >
                  {v.label}
                </button>
                <button
                  type="button"
                  onClick={() => deleteSavedView(v.id)}
                  className="text-white-muted opacity-0 transition group-hover:opacity-100 hover:text-red-300"
                  aria-label={`Delete view ${v.label}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-5 rounded-2xl border border-gray-border bg-black-card p-5">
        {/* Search */}
        <div>
          <label className="mb-2 block text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white-muted">
            Search
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, job title, or company"
            className="w-full rounded-lg border border-gray-border bg-black px-4 py-2.5 text-[13.5px] text-white placeholder:text-white-muted focus:border-orange/40 focus:outline-none"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <FilterChips
            label="Industry"
            options={allIndustries}
            values={industries}
            onToggle={(v) => toggleFromList(industries, setIndustries, v)}
          />
          <FilterChips
            label="Country"
            options={allCountries}
            values={countries}
            onToggle={(v) => toggleFromList(countries, setCountries, v)}
          />
          <FilterChips
            label="Seniority"
            options={allSeniorities}
            values={seniorities}
            renderLabel={(v) => SENIORITY_LABEL[v]}
            onToggle={(v) => toggleFromList(seniorities, setSeniorities, v)}
          />
        </div>

        <div className="flex items-center justify-between border-t border-gray-border pt-4">
          <button
            type="button"
            onClick={clearAll}
            disabled={!filtersActive}
            className="text-[12.5px] text-white-dim transition hover:text-white disabled:opacity-40"
          >
            Clear filters
          </button>

          {showSavePrompt ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newViewLabel}
                onChange={(e) => setNewViewLabel(e.target.value)}
                placeholder="Name this view"
                className="rounded-md border border-gray-border bg-black px-3 py-1.5 text-[12.5px] text-white placeholder:text-white-muted focus:border-orange/40 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={saveCurrentView}
                className="rounded-md bg-orange px-3 py-1.5 text-[12px] font-medium text-white hover:bg-orange-bright"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowSavePrompt(false)}
                className="text-[12px] text-white-muted hover:text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowSavePrompt(true)}
              disabled={!filtersActive}
              className="rounded-md border border-gray-border-hover bg-black px-3 py-1.5 text-[12px] font-medium text-white transition hover:border-orange/40 disabled:opacity-40"
            >
              Save view
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-border bg-black-card">
        {filtered.length === 0 ? (
          <div className="px-6 py-10 text-center text-[13px] text-white-muted">
            No attendees match these filters.
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-gray-border text-left text-[10.5px] uppercase tracking-[0.14em] text-white-muted">
                <th className="px-5 py-3 font-medium">Attendee</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Company</th>
                <th className="hidden px-5 py-3 font-medium lg:table-cell">Industry</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Country</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Seniority</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-gray-border last:border-b-0">
                  <td className="px-5 py-3">
                    <div className="font-medium text-white">{a.name}</div>
                    <div className="text-[12px] text-white-dim">{a.title}</div>
                  </td>
                  <td className="hidden px-5 py-3 text-white-dim md:table-cell">
                    {a.company}
                  </td>
                  <td className="hidden px-5 py-3 text-white-muted lg:table-cell">
                    {a.industry}
                  </td>
                  <td className="hidden px-5 py-3 text-white-muted sm:table-cell">
                    {a.country}
                  </td>
                  <td className="hidden px-5 py-3 text-white-dim md:table-cell">
                    {a.seniority ? SENIORITY_LABEL[a.seniority] : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function FilterChips<T extends string>({
  label,
  options,
  values,
  onToggle,
  renderLabel,
}: {
  label: string;
  options: T[];
  values: T[];
  onToggle: (v: T) => void;
  renderLabel?: (v: T) => string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white-muted">
          {label}
        </span>
        <span className="text-[10.5px] text-white-muted">
          {values.length > 0 ? `${values.length} selected` : "all"}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const selected = values.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`rounded-full border px-2.5 py-1 text-[11.5px] transition ${
                selected
                  ? "border-orange/50 bg-orange/10 text-white"
                  : "border-gray-border bg-transparent text-white-dim hover:border-gray-border-hover hover:text-white"
              }`}
            >
              {renderLabel ? renderLabel(opt) : opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function uniqueSorted<T>(arr: T[]): T[] {
  return Array.from(new Set(arr.filter(Boolean))).sort() as T[];
}
