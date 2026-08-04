"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone, type CountryCode } from "@/lib/form-helpers";
import "./powprocess.css";

// Register once, at module scope — never inside the component body.
gsap.registerPlugin(ScrollTrigger, useGSAP);

// Many images decode near-simultaneously on load; one ScrollTrigger.refresh() per
// image storms ScrollTrigger and interrupts in-flight scroll reveals. Debounce so
// a burst of image loads collapses into a single refresh after they settle.
let __stRefreshTimer: ReturnType<typeof setTimeout> | undefined;
function scheduleScrollRefresh() {
  if (typeof window === "undefined") return;
  clearTimeout(__stRefreshTimer);
  __stRefreshTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
}

/* ────────────────────────────────────────────────────────────────────────────
   PowProcess — Powder & Bulk Solids Arabia, Riyadh
   Bespoke, self-contained event page. Light theme, electric blue, Apple-style
   restraint with industrial weight. All content sourced from the team brief.
   Hero video is a placeholder (HERO_VIDEO) — drop the URL in when available.
   ──────────────────────────────────────────────────────────────────────────── */

const CONTACT = "partnerships@eventsfirstgroup.com";

// Brand logo (glowing wordmark on a gray plate) — shown as a cropped logo badge.
const POWPROCESS_LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/powprocess/Powprocess+logo.png";
// Hero card wordmark — source logop.png had heavy transparent padding, cropped tight
// so it fills its box (visible logo large, card height unchanged).
const POWPROCESS_LOGO_HERO = "/powprocess-logo.png";
// Nav bar — compact P monogram (faviconlogo.png), padding cropped off.
const POWPROCESS_LOGO_NAV = "/powprocess-navlogo.png";
// Tight square crop of the monogram (padding removed) so it fills the tab.
const POWPROCESS_FAVICON = "/powprocess-favicon.png";

// Hero background video — placeholder stock clip (floating particles, on-theme
// for a powder event). Swap this one const for the real file when it's ready.
const HERO_VIDEO = "https://efg-final.s3.eu-north-1.amazonaws.com/powprocess/PowProcess+Hero.mp4";
const HERO_POSTER =
  "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1600&q=80";

const IMG = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Full overview (the highlighted paragraph from the brief) — rendered verbatim.
const OVERVIEW =
  "PowProcess aligns with the Kingdom's industrial transformation agenda and supports the objectives of key government initiatives including Vision 2030, the National Industrial Strategy, Made in Saudi and the Future Factories programme. As Saudi Arabia accelerates manufacturing localisation, supply chain resilience, industrial diversification and the adoption of advanced technologies, PowProcess provides a dedicated platform focused on the critical processing capabilities that enable this growth. The event brings together manufacturers, government stakeholders, technology providers, EPC companies and investors to explore the innovations shaping the future of powder and bulk solids processing, including mixing, milling, drying, granulation, conveying, dosing, filtration, automation and process optimisation. Through its cross-sector approach, PowProcess addresses the processing needs of key industries including FMCG and food & beverage, pharmaceuticals and nutraceuticals, petrochemicals and polymers, cement and construction materials, and minerals and new energy materials. By connecting industrial decision-makers with global technology leaders, PowProcess supports the Kingdom's ambition to build a globally competitive manufacturing ecosystem, strengthen local capabilities and accelerate the adoption of advanced production technologies.";

// Framed accent images that flank The Event heading (fill the hero→section gap).
const FLANK_L = IMG("1581092160562-40aa08e78837", 700);
const FLANK_R = IMG("1581094794329-c8112a89af12", 700);
// Riyadh skyline (King Fahd Road) — atmospheric backdrop for the Why This Matters band.
const RIYADH_SKYLINE =
  "https://efg-final.s3.eu-north-1.amazonaws.com/powprocess/riyadh-city-skyline-drone-shoot-drone-shot-king-fahd-road-riyadh-capital-city-saudi-arabia.jpg";

// ── Content ───────────────────────────────────────────────────────────────────
// The event's headline figures — shown as a compact stats block inside The Event.
const EVENT_STATS: { value: number; suffix?: string; label: string; plain?: boolean }[] = [
  { value: 220, suffix: "+", label: "Delegates" },
  { value: 30, suffix: "+", label: "Speakers" },
  { value: 2, suffix: "+", label: "Government partners" },
  { value: 35, suffix: "+", label: "Media partners" },
  { value: 1, label: "Day, cross-sector", plain: true },
];

// Why Saudi Arabia — the five target-sector markets, with figures verbatim from
// the brief. `decimals` drives the count-up formatting (6.2, 2.5 keep one place).
const KSA_MARKETS: { sector: string; value: number; decimals?: number; prefix: string; suffix: string; note: string; img: string }[] = [
  {
    sector: "Food & Beverage",
    value: 30,
    prefix: "$",
    suffix: "B+",
    note: "market, with ~60% growth in feed-product manufacturing during H1 2025.",
    img: "https://images.unsplash.com/photo-1470119693884-47d3a1d1f180?auto=format&fit=crop&w=1200&q=80",
  },
  {
    sector: "Pharma & Nutraceuticals",
    value: 10,
    prefix: "$",
    suffix: "B+",
    note: "pharmaceutical market: the largest in the GCC, driven by localisation and domestic manufacturing.",
    img: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=1200&q=80",
  },
  {
    sector: "Petrochemicals & Polymers",
    value: 60,
    prefix: "$",
    suffix: "B+",
    note: "industry, positioning Saudi Arabia among the world's leading petrochemical producers.",
    img: "https://efg-final.s3.eu-north-1.amazonaws.com/powprocess/scientist-mixing-chemicals-close-up.jpg",
  },
  {
    sector: "Cement & Construction",
    value: 6.2,
    decimals: 1,
    prefix: "$",
    suffix: "B",
    note: "market forecast by 2034, supported by major infrastructure and giga-projects.",
    img: "https://efg-final.s3.eu-north-1.amazonaws.com/powprocess/pile-cement-sitting-top-pile-dirt-versatile-image-construction-projects-building-materials.jpg",
  },
  {
    sector: "Minerals & New-Energy Materials",
    value: 2.5,
    decimals: 1,
    prefix: "$",
    suffix: "T+",
    note: "estimated mineral wealth, with investment in mining, critical minerals and battery materials under Vision 2030.",
    img: "https://efg-final.s3.eu-north-1.amazonaws.com/powprocess/selective-focus-shot-person-wearing-gloves-holding-shredded-rubber-tires.jpg",
  },
];

const TECH = [
  "Mixing",
  "Milling & fine grinding",
  "Spray & fluid-bed drying",
  "Granulation",
  "Feeding & dosing",
  "Pneumatic conveying",
  "Screening & filtration",
  "Weighing & bagging",
  "Dust control",
];

// Key Discussion Themes (the brief's "Focus Areas / Key Discussion Themes"),
// rendered verbatim. Images are thematically mapped and HTTP-verified.
const FOCUS: { n: string; title: string; body: string; img: string }[] = [
  {
    n: "01",
    title: "Localisation & industrial growth",
    body: "Accelerating local manufacturing, import substitution and processing capacity under Vision 2030.",
    img: "https://efg-final.s3.eu-north-1.amazonaws.com/powprocess/Localisation+%26+industrial+growth.png",
  },
  {
    n: "02",
    title: "Smart processing & Industry 4.0",
    body: "AI, digital twins, process automation, inline quality monitoring, predictive maintenance and data-driven production.",
    img: IMG("1581094794329-c8112a89af12"),
  },
  {
    n: "03",
    title: "Powder handling, material flow & plant safety",
    body: "Conveying, storage, mixing, dust management, explosion prevention, process optimisation and operational efficiency.",
    img: IMG("1513828583688-c52646db42da"),
  },
  {
    n: "04",
    title: "Sustainability & energy efficiency",
    body: "Reducing emissions, improving resource utilisation, waste minimisation and circular manufacturing practices.",
    img: IMG("1466611653911-95081537e5b7"),
  },
  {
    n: "05",
    title: "Advanced processing technologies",
    body: "Milling, drying, granulation, blending, screening, classification, filtration and next-generation processing equipment.",
    img: IMG("1504328345606-18bbc8c9d7d1"),
  },
  {
    n: "06",
    title: "Quality, compliance & investment",
    body: "Manufacturing standards, quality assurance, certification, localisation initiatives, investment opportunities and the future of Saudi Arabia's processing industry.",
    img: IMG("1532187863486-abf9dbad1b69"),
  },
];

const AUDIENCE: { n: string; title: string; body: string; profiles: string[] }[] = [
  {
    n: "01",
    title: "Government & industrial enablers",
    body: "Representatives shaping the Kingdom's industrial growth, localisation and manufacturing ecosystem.",
    profiles: [
      "Government Officials",
      "Industrial Development Leaders",
      "Manufacturing Policy Experts",
      "Investment Promotion Professionals",
      "Industrial Zone Authorities",
      "Economic Development Stakeholders",
    ],
  },
  {
    n: "02",
    title: "End-users & buyers",
    body: "Senior professionals responsible for processing operations, production excellence and technology decisions across food, pharma, petrochemicals, cement, minerals and industrial manufacturing.",
    profiles: [
      "Process Engineers",
      "Production Engineers",
      "Plant Managers",
      "Operations Directors",
      "Manufacturing Heads",
      "Engineering Managers",
      "R&D & Formulation Leaders",
      "QA / QC Managers",
      "Procurement & Sourcing Leaders",
      "Project Managers",
      "EPC Project Leads",
      "Automation & Process Control Specialists",
    ],
  },
  {
    n: "03",
    title: "Technology providers & solution leaders",
    body: "Global equipment manufacturers, technology providers and regional solution partners showcasing innovation across powder handling, milling, mixing, drying, conveying, screening, filtration and process automation.",
    profiles: [
      "Managing Directors",
      "Regional Sales Directors",
      "Technology Leaders",
      "Product Managers",
      "Engineering Specialists",
      "Business Development Leaders",
      "Application Engineers",
    ],
  },
  {
    n: "04",
    title: "Investors & industry capital",
    body: "Stakeholders evaluating opportunities across Saudi Arabia's expanding industrial landscape.",
    profiles: [
      "Industrial Investors",
      "Private Equity Professionals",
      "Venture Capital Representatives",
      "Project Finance Leaders",
      "Investment Advisors",
    ],
  },
];

// Who Will Sponsor & Exhibit — solution categories across the value chain, plus
// the decision-makers exhibitors engage. Content verbatim from the brief.
const SPONSOR_CATEGORIES: { title: string; items: string[] }[] = [
  {
    title: "Processing equipment manufacturers",
    items: [
      "Milling & grinding systems",
      "Mixing & blending equipment",
      "Drying & granulation technologies",
      "Screening & separation solutions",
      "Conveying & material handling systems",
    ],
  },
  {
    title: "Automation & digital technology providers",
    items: [
      "Industrial automation",
      "Process control systems",
      "Digital twins & simulation solutions",
      "AI-driven optimisation",
      "Predictive maintenance technologies",
    ],
  },
  {
    title: "Plant engineering & industrial solutions",
    items: [
      "EPC companies",
      "Process engineering firms",
      "Plant design & integration specialists",
      "Safety & compliance solutions",
    ],
  },
  {
    title: "Material handling & safety specialists",
    items: [
      "Storage & silo systems",
      "Dust collection & explosion protection",
      "Bulk handling technologies",
      "Industrial safety solutions",
    ],
  },
  {
    title: "Industry technology & service providers",
    items: [
      "Testing & analysis equipment",
      "Quality control solutions",
      "Laboratory & R&D technologies",
      "Maintenance & operational excellence",
    ],
  },
];

const SPONSOR_ENGAGE = [
  "Plant Directors",
  "Engineering Heads",
  "Operations Leaders",
  "Process Engineers",
  "Procurement Decision-Makers",
  "R&D & Formulation Teams",
  "Project & EPC Leaders",
  "Industrial Investors",
];

// Real EFG delegates / rooms (from S3) — social-proof wall for the Networking section.
const OT_UAE = "https://efg-final.s3.eu-north-1.amazonaws.com/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos";
const CF_KWT = "https://efg-final.s3.eu-north-1.amazonaws.com/events/Cyber+First+Kuwait+2025/filemail_photos";
const PROOF = [
  { src: `${CF_KWT}/cyber21-04-380.jpg`, alt: "Delegates across the exhibition floor at a Cyber First summit", size: "lg" },
  { src: `${OT_UAE}/4N8A0480.JPG`, alt: "A full room of delegates at an OT Security First summit", size: "sm" },
  { src: `${CF_KWT}/cyber21-04-400.jpg`, alt: "Networking at an exhibitor stand", size: "sm" },
  { src: `${OT_UAE}/4N8A0650.JPG`, alt: "Delegates in conversation between sessions", size: "wide" },
  { src: `${CF_KWT}/cyber21-04-300.jpg`, alt: "Senior delegates in the front row of a keynote", size: "sm" },
  { src: `${OT_UAE}/4N8A0550.JPG`, alt: "Roundtable audience at an OT Security First summit", size: "sm" },
  { src: `${CF_KWT}/cyber21-04-360.jpg`, alt: "Delegates meeting at an exhibitor stand", size: "tall" },
  { src: `${OT_UAE}/4N8A0750.JPG`, alt: "Practitioners in discussion on the show floor", size: "sm" },
  { src: `${CF_KWT}/cyber21-04-320.jpg`, alt: "One-to-one conversation at a technology stand", size: "sm" },
  { src: `${OT_UAE}/4N8A0850.JPG`, alt: "Delegates networking on the exhibition floor", size: "lg" },
  { src: `${CF_KWT}/cyber21-04-440.jpg`, alt: "Two delegates in conversation", size: "sm" },
  { src: `${OT_UAE}/4N8A0420.JPG`, alt: "Networking over coffee at an OT Security First summit", size: "sm" },
];

const NAV_LINKS = [
  { id: "event", label: "The Event" },
  { id: "why-ksa", label: "Why KSA" },
  { id: "alignment", label: "Alignment" },
  { id: "audience", label: "Who Attends" },
  { id: "networking", label: "Networking" },
];

// ── Stock image with graceful fallback (hides on 404, tinted tile remains) ──────
// `priority` marks an above-the-fold/LCP image so it loads eagerly at high
// fetch priority instead of lazily.
function Stock({ src, alt, className, style, priority }: { src: string; alt: string; className?: string; style?: React.CSSProperties; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
      style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", ...style }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.opacity = "0";
      }}
      onLoad={scheduleScrollRefresh}
    />
  );
}

// ── Section marker — ruled editorial band with a boxed index numeral ───────────
function Marker({ n, label }: { n: string; label: string }) {
  return (
    <div className="pp-marker">
      <span className="pp-marker-box">{n}</span>
      <span className="pp-marker-label">{label}</span>
      <span className="pp-marker-rule" aria-hidden />
    </div>
  );
}

export default function PowProcessPage() {
  const root = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ── Registration form (same submitForm pipeline as every EFG event page) ──────
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>(
    COUNTRY_CODES.find((c) => c.country === "SA") || COUNTRY_CODES[0]
  );
  const [interest, setInterest] = useState("Exhibit");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Work email is required";
    else if (!isWorkEmail(email.trim())) newErrors.email = "Please use your work email; free providers aren't accepted";
    if (!company.trim()) newErrors.company = "Company is required";
    if (!jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    const phoneErr = validatePhone(phone, countryCode);
    if (phoneErr) newErrors.phone = phoneErr;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setPhoneTouched(true);
      return;
    }

    setSubmitState("submitting");
    setSubmitError("");
    const res = await submitForm({
      type: "contact",
      full_name: fullName.trim(),
      email: email.trim(),
      company: company.trim(),
      job_title: jobTitle.trim(),
      phone: `${countryCode.code} ${phone.trim()}`,
      event_name: "PowProcess — Powder & Bulk Solids Arabia, Riyadh",
      metadata: {
        "Event Page": "PowProcess — Powder & Bulk Solids Arabia, Riyadh",
        "Interest": interest,
        "Page Section": "Register",
      },
    });
    if (res.success) {
      setSubmitState("success");
      setFullName(""); setEmail(""); setCompany(""); setJobTitle(""); setPhone("");
    } else {
      setSubmitState("error");
      setSubmitError(res.error || "Something went wrong. Please try again.");
    }
  };

  // Nav border appears once past the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Per-route favicon. The root layout hardcodes a site-wide EFG <svg> icon in
  // <head>, and Chrome prefers a scalable SVG — so page-level metadata can't win.
  // Swap the icon links on mount (client-side) and restore them on unmount so
  // every other route keeps the EFG favicon.
  useEffect(() => {
    const head = document.head;
    const selector = "link[rel~='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']";
    const previous = Array.from(head.querySelectorAll<HTMLLinkElement>(selector));
    previous.forEach((el) => el.remove());
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    // Cache-bust so Chrome re-fetches instead of reusing a stale tab icon.
    link.href = `${POWPROCESS_FAVICON}?v=2`;
    head.appendChild(link);
    return () => {
      link.remove();
      previous.forEach((el) => head.appendChild(el));
    };
  }, []);

  // Wire GSAP/ScrollTrigger to the EXISTING Lenis instance (window.__lenis).
  // The app-level provider already drives lenis.raf — we only keep ScrollTrigger
  // in sync with Lenis's scroll, never spin up a second rAF loop.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { on: (e: string, cb: () => void) => void; off?: (e: string, cb: () => void) => void } }).__lenis;
    const update = () => ScrollTrigger.update();
    if (lenis) lenis.on("scroll", update);
    ScrollTrigger.refresh();
    return () => {
      if (lenis && lenis.off) lenis.off("scroll", update);
    };
  }, []);

  const smoothTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: { offset?: number; duration?: number }) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.0 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      // ── All scroll-driven motion lives behind the reduced-motion gate ──────────
      mm.add("(prefers-reduced-motion: no-preference)", () => {

        // Hero logo reveal.
        gsap.from(".pp-hero-logo", {
          opacity: 0,
          y: 24,
          scale: 0.96,
          duration: 1.05,
          ease: "power4.out",
          delay: 0.15,
        });
        gsap.from(".pp-hero-subline", {
          opacity: 0,
          y: 14,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.5,
        });

        // Every section heading rises in as it enters — the through-line that makes
        // each section announce itself on scroll.
        gsap.utils.toArray<HTMLElement>(".pp-h2").forEach((h) => {
          gsap.from(h, {
            opacity: 0,
            y: 34,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: h, start: "top 86%", once: true },
          });
        });

        // Framed flank images beside The Event heading — fly in from the sides and
        // settle, then drift on scroll for depth.
        gsap.utils.toArray<HTMLElement>(".pp-flank").forEach((f) => {
          const dir = f.classList.contains("pp-flank-l") ? -1 : 1;
          const section = f.closest(".pp-section");
          gsap.fromTo(
            f,
            { autoAlpha: 0, x: dir * 150, yPercent: -50, rotate: dir * 18, scale: 0.88 },
            {
              autoAlpha: 1,
              x: 0,
              yPercent: -50,
              rotate: dir * 4,
              scale: 1,
              duration: 1.15,
              ease: "power4.out",
              scrollTrigger: { trigger: section, start: "top 82%", once: true },
            }
          );
          gsap.fromTo(
            f,
            { y: dir * 26 },
            {
              y: dir * -26,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });

        // Networking feature photo — flies in from off-screen, then the pushpin
        // "catches" it and it swings to rest (elastic settle around the pin).
        gsap.utils.toArray<HTMLElement>(".pp-net-feature").forEach((photo) => {
          // Trigger on the SECTION, never on `photo` itself: this animation slides
          // the figure 720px sideways, and a self-transformed trigger makes
          // ScrollTrigger mis-measure the start point (it fires far above the real
          // section, so the fly-in burns off-screen before you scroll to it).
          const section = photo.closest("#networking") as HTMLElement | null;
          // Apply the hidden/off-screen state deterministically at mount instead of
          // leaning on fromTo's immediateRender timing.
          gsap.set(photo, { autoAlpha: 0, x: 720, rotate: 13, transformOrigin: "50% 0%" });
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section ?? photo,
              start: "top 70%",
              // Play in on enter, reverse out when you scroll back above the
              // section. Not `once`: a one-shot can burn against a stale start and
              // never recover — direction-linked toggling re-evaluates every pass,
              // so it only ever shows while the section is actually in view.
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          });
          tl.to(photo, { autoAlpha: 1, x: 0, rotate: 13, duration: 0.85, ease: "power4.out" }).to(
            photo,
            { rotate: -3, transformOrigin: "50% 0%", duration: 1.15, ease: "elastic.out(1, 0.4)" },
            "-=0.32"
          );
        });

        // Per-section tile reveals — each section gets a DIFFERENT motion signature,
        // chosen via data-anim on the .pp-stagger container.
        gsap.utils.toArray<HTMLElement>(".pp-stagger").forEach((group) => {
          const tiles = gsap.utils.toArray<HTMLElement>(group.querySelectorAll(".pp-anim"));
          if (!tiles.length) return;
          // once: a played reveal must not reset when a later refresh fires.
          const st = { trigger: group, start: "top 78%", once: true } as const;

          switch (group.dataset.anim) {
            // The Event — cards sweep up from below and settle (no tilt, stays square).
            case "curtain":
              gsap.from(tiles, {
                opacity: 0,
                y: 64,
                scale: 0.97,
                duration: 0.95,
                ease: "power4.out",
                stagger: 0.12,
                scrollTrigger: st,
              });
              break;

            // Numbers — figures pop in with an overshoot.
            case "pop":
              gsap.from(tiles, {
                opacity: 0,
                scale: 0.5,
                y: 28,
                transformOrigin: "center bottom",
                duration: 0.7,
                ease: "back.out(1.7)",
                stagger: 0.08,
                scrollTrigger: st,
              });
              break;

            // Focus — tiles slide in alternately from left and right.
            case "slide-alt":
              gsap.from(tiles, {
                opacity: 0,
                x: (i: number) => (i % 2 === 0 ? -80 : 80),
                y: 20,
                duration: 0.85,
                ease: "power3.out",
                stagger: 0.1,
                scrollTrigger: st,
              });
              break;

            // Who Attends — cards flip down on an X axis like turning cards.
            case "flip":
              gsap.from(tiles, {
                opacity: 0,
                rotationX: -75,
                y: 40,
                transformOrigin: "center top",
                transformPerspective: 1000,
                duration: 0.85,
                ease: "power3.out",
                stagger: 0.1,
                clearProps: "transform",
                scrollTrigger: st,
              });
              break;

            // Focus Areas — cards rise on a diagonal grid stagger; the photos
            // settle out of a slow zoom and the index badges pop in behind.
            case "focus": {
              const grid = [2, 3] as [number, number];
              gsap.from(tiles, {
                opacity: 0,
                y: 64,
                scale: 0.94,
                duration: 0.9,
                ease: "power3.out",
                stagger: { each: 0.12, grid, from: "start" },
                scrollTrigger: st,
              });
              gsap.from(group.querySelectorAll<HTMLElement>(".pp-focus-media img"), {
                scale: 1.3,
                duration: 1.2,
                ease: "power2.out",
                stagger: { each: 0.12, grid, from: "start" },
                scrollTrigger: { trigger: group, start: "top 78%", once: true },
              });
              gsap.from(group.querySelectorAll<HTMLElement>(".pp-focus-media-n"), {
                opacity: 0,
                scale: 0.4,
                transformOrigin: "center center",
                duration: 0.5,
                ease: "back.out(1.8)",
                stagger: { each: 0.12, grid, from: "start" },
                delay: 0.2,
                scrollTrigger: { trigger: group, start: "top 78%", once: true },
              });
              break;
            }

            // Networking mosaic — photos bloom out from the centre of the grid.
            case "mosaic":
              gsap.from(tiles, {
                opacity: 0,
                scale: 0.4,
                duration: 0.75,
                ease: "power2.out",
                stagger: { each: 0.05, grid: "auto", from: "center" },
                scrollTrigger: st,
              });
              break;

            // Why Saudi Arabia — market cards rise and settle, then the accent
            // rule under each figure grows out from the left as an underline.
            case "market":
              gsap.from(tiles, {
                opacity: 0,
                y: 56,
                scale: 0.96,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.1,
                scrollTrigger: st,
              });
              gsap.fromTo(
                group.querySelectorAll(".pp-ksa-bar"),
                { scaleX: 0 },
                {
                  scaleX: 1,
                  transformOrigin: "center center",
                  duration: 0.9,
                  ease: "power2.out",
                  stagger: 0.1,
                  scrollTrigger: st,
                }
              );
              break;

            default:
              gsap.from(tiles, {
                y: 40,
                opacity: 0,
                scale: 0.97,
                duration: 0.8,
                ease: "power3.out",
                stagger: { each: 0.07, grid: "auto", from: "start" },
                scrollTrigger: st,
              });
          }
        });

        // Count-up numbers. Real values are in the SSR HTML; swap to 0 then tween.
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((node) => {
          const target = Number(node.getAttribute("data-count")) || 0;
          const decimals = Number(node.getAttribute("data-decimals")) || 0;
          const obj = { v: 0 };
          node.textContent = decimals ? (0).toFixed(decimals) : "0";
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: node, start: "top 85%", once: true },
            onUpdate: () => {
              node.textContent = decimals
                ? obj.v.toFixed(decimals)
                : Math.round(obj.v).toLocaleString();
            },
          });
        });

        // Marquee — two identical groups; slide the rail by half.
        const rail = el.querySelector<HTMLElement>(".pp-marquee-rail");
        if (rail) {
          gsap.to(rail, { xPercent: -50, duration: 24, ease: "none", repeat: -1 });
        }

        // Navy block glow — gentle parallax.
        const glow = el.querySelector<HTMLElement>(".pp-glow");
        if (glow) {
          gsap.fromTo(
            glow,
            { yPercent: 20 },
            {
              yPercent: -30,
              ease: "none",
              scrollTrigger: { trigger: ".pp-navy", start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        }

        // National Alignment — spec-badge chips flip up in sequence.
        gsap.from(".pp-navy-chips .pp-chip", {
          opacity: 0,
          y: 22,
          scale: 0.9,
          duration: 0.6,
          ease: "back.out(1.6)",
          stagger: 0.08,
          scrollTrigger: { trigger: ".pp-navy-chips", start: "top 90%", once: true },
        });

        // Why This Matters — the statement rises, then the supporting paragraphs
        // deal in one after another.
        const why = el.querySelector<HTMLElement>(".pp-why");
        if (why) {
          gsap.from(".pp-why-h2", {
            opacity: 0,
            y: 36,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: why, start: "top 78%", once: true },
          });
          gsap.from(why.querySelectorAll<HTMLElement>(".pp-why-body p"), {
            opacity: 0,
            y: 26,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.14,
            scrollTrigger: { trigger: why, start: "top 74%", once: true },
          });
        }

        // Who Will Sponsor & Exhibit — the engage band and closing line reveal
        // after the category cards (which ride the shared .pp-stagger reveal).
        gsap.from(".pp-spon-engage", {
          opacity: 0,
          y: 28,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".pp-spon-engage", start: "top 90%", once: true },
        });
        gsap.from(".pp-spon-close", {
          opacity: 0,
          y: 22,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".pp-spon-close", start: "top 92%", once: true },
        });

        // Register — the pitch column rises line by line and the form card lifts
        // in beside it.
        const cta = el.querySelector<HTMLElement>(".pp-cta");
        if (cta) {
          gsap.from(cta.querySelectorAll<HTMLElement>(".pp-cta-copy > *"), {
            opacity: 0,
            y: 30,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: cta, start: "top 76%", once: true },
          });
          gsap.from(".pp-form-card", {
            opacity: 0,
            y: 44,
            scale: 0.98,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: cta, start: "top 76%", once: true },
          });
        }

        return () => {};
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className="pp-root">
      {/* ─── NAV ─────────────────────────────────────────────────────────────── */}
      <header className={`pp-nav${scrolled ? " is-scrolled" : ""}`}>
        <button className="pp-nav-brand" onClick={() => smoothTo("top")} aria-label="PowProcess, back to top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={POWPROCESS_LOGO_NAV} alt="PowProcess" decoding="async" />
        </button>
        <nav className="pp-nav-links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <button key={l.id} onClick={() => smoothTo(l.id)}>
              {l.label}
            </button>
          ))}
        </nav>
        <div className="pp-nav-actions">
          <a className="pp-nav-efg" href="/" aria-label="Back to Events First Group">
            <span aria-hidden>←</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo+icon-01.svg" alt="" width={16} height={16} decoding="async" />
            Events First Group
          </a>
          <button className="pp-nav-cta" onClick={() => smoothTo("register")}>
            Register Interest
          </button>
        </div>
        <button className="pp-nav-burger" aria-label="Menu" aria-expanded={menuOpen} aria-controls="pp-nav-mobile" onClick={() => setMenuOpen((v) => !v)}>
          <span />
          <span />
        </button>
        {menuOpen && (
          <div className="pp-nav-mobile" id="pp-nav-mobile">
            {NAV_LINKS.map((l) => (
              <button key={l.id} onClick={() => smoothTo(l.id)}>
                {l.label}
              </button>
            ))}
            <a className="pp-nav-mobile-efg" href="/">
              <span aria-hidden>←</span> Back to Events First Group
            </a>
            <button className="pp-nav-mobile-cta" onClick={() => smoothTo("register")}>
              Register Interest
            </button>
          </div>
        )}
      </header>

      <span id="top" style={{ position: "absolute", top: 0 }} aria-hidden />

      {/* ─── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="pp-hero" id="event">
        <div className="pp-tile pp-hero-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pp-hero-logo" src={POWPROCESS_LOGO_HERO} alt="PowProcess" decoding="async" />
          <p className="pp-hero-subline">The Middle East&rsquo;s Only Dedicated Powder &amp; Bulk Processing Summit</p>
        </div>

        <div className="pp-hero-grid">
          <div className="pp-tile pp-hero-copy">
            <div className="pp-hero-tags">
              <span className="pp-pill pp-pill-solid">1st Edition</span>
              <span className="pp-pill">Riyadh · KSA</span>
              <span className="pp-pill">17 Nov 2026</span>
              <span className="pp-pill pp-pill-accent">Cross-sector</span>
            </div>
            <h1 className="pp-hero-tagline">
              Powder &amp; Bulk Solids Arabia: Processing the Kingdom&rsquo;s <em>Materials</em>
            </h1>
            <p className="pp-hero-lede">
              Powder &amp; Bulk Solids Arabia. One day, five sectors, in Riyadh, at the heart of Saudi Arabia&rsquo;s
              processing economy.
            </p>
            <div className="pp-hero-cta">
              <a className="pp-btn pp-btn-primary" href={`mailto:${CONTACT}?subject=PowProcess%20Exhibitor%20Enquiry`}>
                Become an Exhibitor
              </a>
              <button className="pp-btn pp-btn-ghost" onClick={() => smoothTo("register")}>
                Register Interest
              </button>
            </div>
          </div>

          <div className="pp-hero-visual-col">
            <div className="pp-tile pp-hero-visual">
              {HERO_VIDEO ? (
                <video className="pp-hero-media" autoPlay muted loop playsInline preload="metadata" poster={HERO_POSTER}>
                  <source src={HERO_VIDEO} type="video/mp4" />
                </video>
              ) : (
                <Stock src={HERO_POSTER} alt="Powder and bulk-solids processing plant" className="pp-hero-media" priority />
              )}
            </div>
            <div className="pp-hero-meta">
              <div className="pp-tile pp-meta">
                <span className="pp-meta-k">When</span>
                <span className="pp-meta-v">17 Nov 2026 · 09:00 – 16:00</span>
              </div>
              <div className="pp-tile pp-meta">
                <span className="pp-meta-k">Where</span>
                <span className="pp-meta-v">Riyadh, Saudi Arabia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. WHAT THIS EVENT IS ───────────────────────────────────────────── */}
      <section className="pp-section">
        <div className="pp-center pp-about-head">
          <figure className="pp-flank pp-flank-l" aria-hidden="true">
            <Stock src={FLANK_L} alt="" />
          </figure>
          <figure className="pp-flank pp-flank-r" aria-hidden="true">
            <Stock src={FLANK_R} alt="" />
          </figure>
          <Marker n="01" label="The Event" />
          <h2 className="pp-h2">
            The Middle East&rsquo;s only summit for <em>powder</em> &amp; bulk solids
          </h2>
          <p className="pp-lede">
            PowProcess is the Middle East&rsquo;s only dedicated summit and exhibition for powder, particle and bulk-solids processing:
            the mixing, milling, drying, granulation, conveying, dosing, screening, filtration and bagging technology underpinning
            five of the fastest-growing manufacturing sectors in Saudi Arabia.
          </p>
        </div>
        <div className="pp-about-bento pp-stagger" data-anim="curtain">
          <div className="pp-tile pp-overview pp-anim">
            <span className="pp-eyebrow">The Overview</span>
            <p className="pp-overview-text">{OVERVIEW}</p>
          </div>
          <div className="pp-about-side">
            <div className="pp-tile pp-format pp-format-stats pp-anim">
              <span className="pp-eyebrow">The Event in Numbers</span>
              <div className="pp-estats-grid">
                {EVENT_STATS.map((s, i) => (
                  <div key={i} className="pp-estat">
                    <div className="pp-estat-v">
                      {s.plain ? (
                        <span>{s.value}</span>
                      ) : (
                        <span data-count={s.value} data-decimals={0}>
                          {s.value}
                        </span>
                      )}
                      {s.suffix && <span className="pp-estat-suffix">{s.suffix}</span>}
                    </div>
                    <div className="pp-estat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2b. WHY SAUDI ARABIA ────────────────────────────────────────────── */}
      <section className="pp-section" id="why-ksa">
        <h2 className="pp-sr-only">Why Saudi Arabia</h2>
        <div className="pp-center pp-ksa-head">
          <Marker n="02" label="Why Saudi Arabia" />
          <h2 className="pp-h2">
            Where the <em>demand</em> concentrates
          </h2>
          <p className="pp-lede pp-lede-wide">
            Saudi Arabia is the largest concentrated processing-demand pool in the Gulf. The localisation drive under
            Vision 2030 and Made in Saudi is pushing every one of our five target sectors to scale capacity at once.
          </p>
        </div>
        <div className="pp-ksa-grid pp-stagger" data-anim="market">
          {KSA_MARKETS.map((m) => (
            <article key={m.sector} className="pp-tile pp-ksa-card pp-anim">
              <div className="pp-ksa-media">
                <Stock src={m.img} alt={m.sector} />
              </div>
              <span className="pp-ksa-sector">{m.sector}</span>
              <div className="pp-ksa-fig">
                <span className="pp-ksa-prefix">{m.prefix}</span>
                <span data-count={m.value} data-decimals={m.decimals || 0}>
                  {m.decimals ? m.value.toFixed(m.decimals) : m.value}
                </span>
                <span className="pp-ksa-suffix">{m.suffix}</span>
              </div>
              <span className="pp-ksa-bar" aria-hidden />
              <p className="pp-ksa-note">{m.note}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ─── 3. TECHNOLOGY ON SHOW — marquee ─────────────────────────────────── */}
      <section className="pp-marquee-sec" aria-label="Technology on show">
        <div className="pp-marquee-head">
          <span className="pp-marquee-box">TECH</span>
          <span className="pp-marquee-label">Technology on Show</span>
          <span className="pp-marquee-count">09 disciplines</span>
        </div>
        <div className="pp-marquee" aria-hidden="true">
          <div className="pp-marquee-rail">
            <div className="pp-marquee-group">
              {TECH.map((t, i) => (
                <span key={`a${i}`} className="pp-marquee-item">
                  {t}
                  <i className="pp-marquee-dot" />
                </span>
              ))}
            </div>
            <div className="pp-marquee-group">
              {TECH.map((t, i) => (
                <span key={`b${i}`} className="pp-marquee-item">
                  {t}
                  <i className="pp-marquee-dot" />
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Static, accessible list for screen readers */}
        <ul className="pp-sr-only">
          {TECH.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      {/* ─── 6. FOCUS AREAS ──────────────────────────────────────────────────── */}
      <section className="pp-section">
        <h2 className="pp-sr-only">Focus Areas</h2>
        <Marker n="03" label="Focus Areas" />
        <div className="pp-focus pp-stagger" data-anim="focus">
          {FOCUS.map((f) => (
            <div key={f.n} className="pp-tile pp-focus-tile pp-focus-img-tile pp-anim">
              <div className="pp-focus-media">
                <Stock src={f.img} alt="" />
                <span className="pp-focus-media-n">{f.n}</span>
              </div>
              <div className="pp-focus-copy">
                <h3 className="pp-focus-title">{f.title}</h3>
                <p className="pp-focus-body">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. NATIONAL ALIGNMENT — full-bleed navy ─────────────────────────── */}
      <section className="pp-navy" id="alignment">
        <div className="pp-glow" aria-hidden />
        <div className="pp-navy-inner">
          <Marker n="04" label="National Alignment" />
          <h2 className="pp-h2 pp-navy-h2">
            Aligned with <em>Vision 2030</em>
          </h2>
          <p className="pp-navy-body">
            PowProcess aligns with Vision 2030, the National Industrial Strategy, Made in Saudi and the Future Factories
            programme, supporting manufacturing localisation, supply-chain resilience, industrial diversification and the
            adoption of advanced technologies.
          </p>
          <div className="pp-navy-chips">
            {["Vision 2030", "National Industrial Strategy", "Made in Saudi", "Future Factories"].map((c) => (
              <span key={c} className="pp-chip">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. WHO WE'LL MEET ───────────────────────────────────────────────── */}
      <section className="pp-section" id="audience">
        <h2 className="pp-sr-only">Who We&rsquo;ll Meet</h2>
        <Marker n="05" label="Who We'll Meet" />
        <div className="pp-audience pp-stagger" data-anim="flip">
          {[
            [AUDIENCE[0], AUDIENCE[2]],
            [AUDIENCE[1], AUDIENCE[3]],
          ].map((col, ci) => (
            <div key={ci} className="pp-aud-col">
              {col.map((a) => (
                <div key={a.n} className="pp-aud-cell pp-anim">
                  <div className="pp-aud-gauge" aria-hidden="true">
                    <span className="pp-aud-n">{a.n}</span>
                  </div>
                  <div className="pp-aud-body">
                    <h3 className="pp-aud-title">{a.title}</h3>
                    <p className="pp-aud-text">{a.body}</p>
                    <div className="pp-aud-tags">
                      {a.profiles.map((p) => (
                        <span key={p} className="pp-aud-tag">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHY THIS MATTERS — modern oil-dark band, brass accents ───────────── */}
      <section className="pp-why" id="why-matters">
        <div className="pp-why-pattern" aria-hidden />
        <div className="pp-why-inner">
          <figure className="pp-why-skyline" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={RIYADH_SKYLINE} alt="" loading="lazy" decoding="async" />
          </figure>
          <h2 className="pp-sr-only">Why This Matters</h2>
          <div className="pp-why-top">
            <Marker n="06" label="Why This Matters" />
            <span className="pp-why-loc">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Riyadh · KSA
            </span>
          </div>
          <div className="pp-why-grid">
            <div className="pp-why-lead">
              <h2 className="pp-why-h2">
                Saudi Arabia is entering a <em>new phase</em> of industrial expansion
              </h2>
            </div>
            <div className="pp-why-body">
              <p>
                Billions of dollars are being invested into local manufacturing, advanced materials, food security,
                pharmaceuticals, petrochemicals, minerals and industrial production capacity.
              </p>
              <p>
                As industries scale, the demand for efficient, safe and advanced powder and bulk processing technologies is
                accelerating: from raw-material handling and formulation to automation, quality control and sustainable
                production.
              </p>
              <p className="pp-why-close">
                Powder &amp; Bulk Solids Arabia provides a dedicated platform for industry leaders to connect, exchange
                knowledge, explore technologies and build partnerships that support the Kingdom&rsquo;s manufacturing
                ambitions &mdash; convening in <em>Riyadh</em>, the capital and central hub of Saudi Arabia&rsquo;s
                industrial and investment agenda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHO WILL SPONSOR & EXHIBIT ──────────────────────────────────────── */}
      <section className="pp-section" id="sponsor">
        <h2 className="pp-sr-only">Who Will Sponsor &amp; Exhibit</h2>
        <div className="pp-center pp-spon-head">
          <Marker n="07" label="Who Will Sponsor & Exhibit" />
          <h2 className="pp-h2">
            Who will <em>exhibit</em> &amp; sponsor
          </h2>
          <p className="pp-lede pp-lede-wide">
            The summit is designed for organisations providing technologies, solutions and services across the powder and
            bulk processing value chain.
          </p>
        </div>
        <div className="pp-spon-grid pp-stagger" data-anim="slide-alt">
          {SPONSOR_CATEGORIES.map((c, i) => (
            <article key={c.title} className="pp-tile pp-spon-card pp-anim">
              <span className="pp-spon-ix">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="pp-spon-title">{c.title}</h3>
              <ul className="pp-spon-list">
                {c.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="pp-spon-engage">
          <span className="pp-spon-engage-label">Sponsors &amp; exhibitors will engage with</span>
          <div className="pp-spon-engage-tags">
            {SPONSOR_ENGAGE.map((e) => (
              <span key={e} className="pp-spon-tag">
                {e}
              </span>
            ))}
          </div>
        </div>
        <p className="pp-spon-close">
          Powder &amp; Bulk Solids Arabia connects global technology providers with the decision-makers shaping Saudi
          Arabia&rsquo;s next generation of manufacturing.
        </p>
      </section>

      {/* ─── NETWORKING — real EFG event photography ─────────────────────────── */}
      <section className="pp-section" id="networking">
        <div className="pp-net-head">
          <div className="pp-net-head-copy">
            <Marker n="08" label="Networking" />
            <h2 className="pp-h2 pp-h2-left">
              Every buyer you need, <em>in one room</em>
            </h2>
            <p className="pp-lede pp-lede-left">
              A hosted networking lunch and a full exhibition floor, where OEMs meet plant buyers across all five sectors.
              PowProcess is a 1st edition, but not our first summit. Scenes from recent{" "}
              <strong>Events First Group</strong> summits across the Gulf.
            </p>
          </div>
          <figure className="pp-net-feature">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PROOF[PROOF.length - 1].src} alt={PROOF[PROOF.length - 1].alt} loading="lazy" decoding="async" />
          </figure>
        </div>
        <div className="pp-proof-grid pp-stagger" data-anim="mosaic">
          {PROOF.slice(0, -1).map((p, i) => (
            <div key={i} className={`pp-proof-cell pp-proof-${p.size} pp-anim`}>
              <Stock src={p.src} alt={p.alt} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── REGISTER — functional form (shared submitForm pipeline) ──────────── */}
      <section className="pp-cta" id="register">
        <div className="pp-cta-grid">
          <div className="pp-cta-copy">
            <span className="pp-cta-eyebrow">Register</span>
            <h2 className="pp-cta-h2">
              One platform. <em>Five sectors.</em> One day in Riyadh.
            </h2>
            <p className="pp-cta-body">
              Exhibit once and reach food, pharma, petrochem, cement and minerals buyers in the same room. Tell us how
              you&rsquo;d like to take part and the team will be in touch.
            </p>
            <ul className="pp-cta-points">
              <li>Exhibition floor &amp; hosted networking lunch</li>
              <li>Qualified plant &amp; procurement buyers across all five sectors</li>
              <li>Sponsorship &amp; speaking opportunities</li>
            </ul>
            <a className="pp-cta-mail" href={`mailto:${CONTACT}`}>
              {CONTACT}
            </a>
          </div>

          <div className="pp-form-card">
            {submitState === "success" ? (
              <div className="pp-form-done">
                <div className="pp-form-done-mark" aria-hidden>
                  ✓
                </div>
                <h3>Request received</h3>
                <p>Thank you. A member of the PowProcess team will be in touch shortly.</p>
                <button type="button" className="pp-btn pp-btn-ghostline" onClick={() => setSubmitState("idle")}>
                  Submit another
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} noValidate className="pp-form">
                {/* honeypot — bots fill this; humans never see it */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />
                <div className="pp-form-head">
                  <span className="pp-form-eyebrow">Express interest</span>
                  <h3 className="pp-form-title">Secure your place at PowProcess</h3>
                </div>

                <div className="pp-field">
                  <label htmlFor="pp-name">Full name</label>
                  <input
                    id="pp-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: "" });
                    }}
                    placeholder="Your full name"
                    autoComplete="name"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? "pp-name-err" : undefined}
                  />
                  {errors.fullName && <span id="pp-name-err" className="pp-field-err">{errors.fullName}</span>}
                </div>

                <div className="pp-field">
                  <label htmlFor="pp-email">Work email</label>
                  <input
                    id="pp-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    placeholder="you@company.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "pp-email-err" : undefined}
                  />
                  {errors.email && <span id="pp-email-err" className="pp-field-err">{errors.email}</span>}
                </div>

                <div className="pp-field-row">
                  <div className="pp-field">
                    <label htmlFor="pp-company">Company</label>
                    <input
                      id="pp-company"
                      type="text"
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                        if (errors.company) setErrors({ ...errors, company: "" });
                      }}
                      placeholder="Company name"
                      autoComplete="organization"
                      aria-invalid={!!errors.company}
                      aria-describedby={errors.company ? "pp-company-err" : undefined}
                    />
                    {errors.company && <span id="pp-company-err" className="pp-field-err">{errors.company}</span>}
                  </div>
                  <div className="pp-field">
                    <label htmlFor="pp-title">Job title</label>
                    <input
                      id="pp-title"
                      type="text"
                      value={jobTitle}
                      onChange={(e) => {
                        setJobTitle(e.target.value);
                        if (errors.jobTitle) setErrors({ ...errors, jobTitle: "" });
                      }}
                      placeholder="Plant Manager, Buyer…"
                      autoComplete="organization-title"
                      aria-invalid={!!errors.jobTitle}
                      aria-describedby={errors.jobTitle ? "pp-title-err" : undefined}
                    />
                    {errors.jobTitle && <span id="pp-title-err" className="pp-field-err">{errors.jobTitle}</span>}
                  </div>
                </div>

                <div className="pp-field">
                  <label htmlFor="pp-phone">
                    Phone <span className="pp-field-hint">{countryCode.length} digits expected</span>
                  </label>
                  <div className="pp-phone">
                    <select
                      value={`${countryCode.country}-${countryCode.code}`}
                      onChange={(e) => {
                        const [country, code] = e.target.value.split("-");
                        const found = COUNTRY_CODES.find((c) => c.country === country && c.code === code);
                        if (found) {
                          setCountryCode(found);
                          setPhone((prev) => prev.replace(/\D/g, "").slice(0, found.length));
                        }
                      }}
                      className="pp-phone-cc"
                      aria-label="Country dialing code"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={`${c.country}-${c.code}`} value={`${c.country}-${c.code}`}>
                          {c.country} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      id="pp-phone"
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, countryCode.length);
                        setPhone(digits);
                        if (errors.phone) setErrors({ ...errors, phone: "" });
                      }}
                      onBlur={() => setPhoneTouched(true)}
                      placeholder={countryCode.placeholder}
                      autoComplete="tel-national"
                      maxLength={countryCode.length}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone && phoneTouched ? "pp-phone-err" : undefined}
                    />
                  </div>
                  {errors.phone && phoneTouched && <span id="pp-phone-err" className="pp-field-err">{errors.phone}</span>}
                </div>

                <div className="pp-field">
                  <label htmlFor="pp-interest">I&rsquo;d like to</label>
                  <select
                    id="pp-interest"
                    className="pp-select"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                  >
                    <option value="Exhibit">Exhibit at PowProcess</option>
                    <option value="Visit">Visit / attend</option>
                    <option value="Sponsor">Sponsor</option>
                    <option value="Speak">Speak</option>
                  </select>
                </div>

                {submitState === "error" && <div className="pp-form-alert">{submitError}</div>}

                <button type="submit" className="pp-btn pp-btn-submit" disabled={submitState === "submitting"}>
                  {submitState === "submitting" ? "Submitting…" : "Request to attend"}
                </button>
                <p className="pp-form-fine">
                  Use your work email. We&rsquo;ll only use your details to contact you about PowProcess.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="pp-footer">
        <div className="pp-footer-row">
          <div className="pp-footer-left">
            <div className="pp-footer-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={POWPROCESS_LOGO} alt="PowProcess" loading="lazy" decoding="async" />
            </div>
            <p className="pp-footer-tag">Powder &amp; Bulk Solids Arabia: Processing the Kingdom&rsquo;s Materials.</p>
            <a className="pp-footer-mail" href={`mailto:${CONTACT}`}>
              {CONTACT}
            </a>
          </div>
          <a
            className="pp-footer-efg"
            href="https://www.eventsfirstgroup.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Events First Group"
          >
            <span className="pp-footer-efg-label">A production by</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/events-first-group_logo_alt.svg" alt="Events First Group" width={131} height={46} loading="lazy" decoding="async" />
          </a>
        </div>
      </footer>

      {/* ─── STYLES ──────────────────────────────────────────────────────────── */}
      {/* Styles live in ./powprocess.css (imported at top) */}
    </div>
  );
}
