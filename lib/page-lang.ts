"use client";

import { useCallback, useEffect, useState } from "react";

// ═══════════════════════════════════════════════════════════════
// Per-page language choice (English / Arabic)
// ═══════════════════════════════════════════════════════════════
// One shared choice per page, so separate components stay in step: the event
// nav's EN | ع switch and the registration section's dropdown both read and
// write it. A change in either broadcasts a window event the other listens
// for, and the choice is kept in localStorage so a refresh or a return visit
// opens in the same language. English is always the server-rendered default.

export type PageLang = "en" | "ar";

const EVENT = "efg:page-lang";
const storageKey = (scope: string) => `efg-lang:${scope}`;

export function usePageLang(scope: string): [PageLang, (lang: PageLang) => void] {
  const [lang, setLangState] = useState<PageLang>("en");

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey(scope)) === "ar") setLangState("ar");
    } catch {
      // Storage blocked (private mode etc.) — stay on English.
    }
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ scope: string; lang: PageLang }>).detail;
      if (detail?.scope === scope && (detail.lang === "en" || detail.lang === "ar")) setLangState(detail.lang);
    };
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, [scope]);

  const setLang = useCallback(
    (next: PageLang) => {
      setLangState(next);
      try {
        localStorage.setItem(storageKey(scope), next);
      } catch {
        // Not persisted; the in-page switch still works.
      }
      window.dispatchEvent(new CustomEvent(EVENT, { detail: { scope, lang: next } }));
    },
    [scope],
  );

  return [lang, setLang];
}
