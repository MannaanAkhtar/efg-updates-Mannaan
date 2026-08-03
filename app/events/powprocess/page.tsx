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
   PowProcess — Powder & Bulk Solids Arabia, Dammam
   Bespoke, self-contained event page. Light theme, electric blue, Apple-style
   restraint with industrial weight. All content sourced from the team brief.
   Hero video is a placeholder (HERO_VIDEO) — drop the URL in when available.
   ──────────────────────────────────────────────────────────────────────────── */

const CONTACT = "partnerships@eventsfirstgroup.com";

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

const FORMAT_ITEMS = [
  "Opening keynote",
  "4 panels",
  "2 fireside chats",
  "6 technology spotlights",
  "Exhibition tour",
  "Hosted networking lunch",
];

// Atmospheric industrial texture behind the Dammam location band. Heavily
// darkened — evokes the Eastern-Province industrial region without claiming to
// be a specific skyline. Swap for a real Dammam photo when one is available.
// Framed accent images that flank The Event heading (fill the hero→section gap).
const FLANK_L = IMG("1581092160562-40aa08e78837", 700);
const FLANK_R = IMG("1581094794329-c8112a89af12", 700);
// Real Dammam / Eastern Province location photo (Al Khobar Corniche).
const DAMMAM_PHOTO =
  "https://efg-final.s3.eu-north-1.amazonaws.com/powprocess/al-khobar-feb-20-2024-khobar-water-tower-al-khobar-corniche-dammam-eastern-province-saudi-arabia.jpg";

// ── Content ───────────────────────────────────────────────────────────────────
const NUMBERS: { value: number; suffix?: string; label: string; big?: boolean; plain?: boolean }[] = [
  { value: 220, suffix: "+", label: "Delegates", big: true },
  { value: 30, suffix: "+", label: "Speakers", big: true },
  { value: 4, label: "Panels" },
  { value: 2, label: "Fireside chats" },
  { value: 6, label: "Technology spotlights" },
  { value: 2, suffix: "+", label: "Government partners" },
  { value: 35, suffix: "+", label: "Media partners" },
  { value: 1, label: "Day, cross-sector", plain: true },
];

const SECTORS: { n: string; name: string; body: string; img: string }[] = [
  {
    n: "01",
    name: "Food & beverage",
    body: "SFDA reported ~60% growth in feed-product manufacturing in H1 2025 alone.",
    img: "https://images.unsplash.com/photo-1470119693884-47d3a1d1f180?auto=format&fit=crop&w=1200&q=80",
  },
  {
    n: "02",
    name: "Pharma & nutraceuticals",
    body: "Health-security-driven local manufacturing: the highest-value powder-processing niche.",
    img: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=1200&q=80",
  },
  {
    n: "03",
    name: "Petrochemicals & polymers",
    body: "SABIC and Aramco expanding downstream into specialty polymers and compounds.",
    img: "https://efg-final.s3.eu-north-1.amazonaws.com/powprocess/scientist-mixing-chemicals-close-up.jpg",
  },
  {
    n: "04",
    name: "Cement & construction materials",
    body: "Saudi cement market forecast toward ~$6.2bn by 2034.",
    img: "https://efg-final.s3.eu-north-1.amazonaws.com/powprocess/pile-cement-sitting-top-pile-dirt-versatile-image-construction-projects-building-materials.jpg",
  },
  {
    n: "05",
    name: "Minerals & new-energy materials",
    body: "Vision 2030 mining (Ma'aden) and battery-materials ambitions.",
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

const FOCUS: { n: string; title: string; body: string; img: string }[] = [
  {
    n: "01",
    title: "Localisation in motion",
    body: "Turning industrial strategy into real processing capacity: the make-vs-import decision.",
    img: IMG("1581092160562-40aa08e78837"),
  },
  {
    n: "02",
    title: "Processing 4.0 & digital powder",
    body: "PAT and inline sensing, digital twins, DEM/CFD simulation, AI for yield and predictive quality.",
    img: IMG("1581094794329-c8112a89af12"),
  },
  {
    n: "03",
    title: "Bulk handling, storage & safety",
    body: "Silo and hopper flow, pneumatic vs. mechanical conveying, combustible-dust / ATEX, an area the region under-invests in.",
    img: IMG("1518709268805-4e9042af9f23"),
  },
  {
    n: "04",
    title: "Standards, certification & the investment case",
    body: "Made in Saudi, MoIM&MR standards, investor appetite for processing plays.",
    img: IMG("1503387762-592deb58ef4e"),
  },
];

const DAMMAM: { k: string; v: string }[] = [
  { k: "Heavy-processing buyers", v: "Jubail is the world's largest industrial complex: Ma'aden, Sadara, SATORP all on the doorstep." },
  { k: "Industrial investment concentration", v: "Eastern Province holds ~46% of the Kingdom's industrial investment (~SAR 447bn) vs. Riyadh's ~SAR 182bn." },
  { k: "Exhibition ROI", v: "The plant floor is here, where OEMs actually close deals, not just generate leads." },
  { k: "GCC cross-border pull", v: "45 minutes from UAE, ~1 hour from Bahrain / Qatar / Kuwait." },
  { k: "Cleaner calendar", v: "Riyadh is crowded with Saudi Industrial Expo, LEAP, Big 5. Dammam gives us a clean lane." },
];

const AUDIENCE: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "End-users / buyers",
    body: "Process & production engineers, plant and operations directors, R&D and formulation, QA/QC, procurement, and project/EPC leads across food, pharma, petrochemical, cement and minerals plants.",
  },
  {
    n: "02",
    title: "Technology providers",
    body: "Global equipment OEMs and regional distributors: GEA, Coperion, Hosokawa, Bühler, Schenck Process, Malvern Panalytical, Andritz, Netzsch.",
  },
  {
    n: "03",
    title: "Government & enablers",
    body: "Ministry of Industry & Mineral Resources, National Industrial Development Center, MODON and industrial-city authorities.",
  },
  {
    n: "04",
    title: "Capital",
    body: "Industrial investors and financiers weighing the localisation build-out.",
  },
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
  { id: "numbers", label: "Numbers" },
  { id: "sectors", label: "Sectors" },
  { id: "dammam", label: "Why Dammam" },
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
      event_name: "PowProcess — Powder & Bulk Solids Arabia, Dammam",
      metadata: {
        "Event Page": "PowProcess — Powder & Bulk Solids Arabia, Dammam",
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

        // Hero line reveal.
        gsap.set(".pp-hero-line", { yPercent: 115 });
        gsap.to(".pp-hero-line", {
          yPercent: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.08,
          delay: 0.15,
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
          const obj = { v: 0 };
          node.textContent = "0";
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: node, start: "top 85%", once: true },
            onUpdate: () => {
              node.textContent = Math.round(obj.v).toLocaleString();
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

        return () => {};
      });

      // ── Pinned horizontal sectors — desktop + motion only ─────────────────────
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = el.querySelector<HTMLElement>(".pp-sectors-track");
        const panels = gsap.utils.toArray<HTMLElement>(".pp-sector-panel");
        if (!track || panels.length < 2) return;
        // Distance the track must travel so the last panel ends flush right.
        const distance = () => track.scrollWidth - track.parentElement!.clientWidth;
        const tween = gsap.to(track, {
          x: () => -distance() + "px",
          ease: "none",
          scrollTrigger: {
            trigger: ".pp-sectors",
            pin: true,
            // No snap — snapping fights Lenis and causes the jerky feel. Lenis
            // already smooths the scroll; a tight scrub keeps the track glued to
            // it (a higher value floats behind and reads as "laggy").
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // Must refresh BEFORE the triggers below it: this pin injects a large
            // scroll spacer, and any trigger created earlier (e.g. Networking) would
            // otherwise measure its start without that spacer and fire far too early.
            refreshPriority: 1,
            end: () => "+=" + distance(),
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
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
          POW<span>PROCESS</span>
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
          <span className="pp-hero-linewrap">
            <span className="pp-hero-line">POWPROCESS</span>
          </span>
        </div>

        <div className="pp-hero-grid">
          <div className="pp-tile pp-hero-copy">
            <div className="pp-hero-tags">
              <span className="pp-pill pp-pill-solid">1st Edition</span>
              <span className="pp-pill">Dammam · KSA</span>
              <span className="pp-pill pp-pill-accent">Cross-sector</span>
            </div>
            <h1 className="pp-hero-tagline">
              Processing the Kingdom&rsquo;s <em>Materials</em>
            </h1>
            <p className="pp-hero-lede">
              Powder &amp; Bulk Solids Arabia, the Gulf&rsquo;s first dedicated summit and exhibition for powder, particle and
              bulk-solids processing.
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
                <span className="pp-meta-v">One Day · 09:00 – 16:00</span>
              </div>
              <div className="pp-tile pp-meta">
                <span className="pp-meta-k">Where</span>
                <span className="pp-meta-v">Dammam, Eastern Province</span>
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
            The Gulf&rsquo;s first summit for <em>powder</em> &amp; bulk solids
          </h2>
          <p className="pp-lede">
            PowProcess is the Gulf&rsquo;s first dedicated summit and exhibition for powder, particle and bulk-solids processing:
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
            <div className="pp-tile pp-format pp-anim">
              <span className="pp-eyebrow">One-Day Format · 09:00 – 16:00</span>
              <ul className="pp-format-list">
                {FORMAT_ITEMS.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div className="pp-tile pp-quote pp-anim">
              <p>
                Powder &amp; Bulk Solids Arabia: <em>Processing the Kingdom&rsquo;s Materials.</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. EVENT IN NUMBERS ─────────────────────────────────────────────── */}
      <section className="pp-section" id="numbers">
        <h2 className="pp-sr-only">Event in Numbers</h2>
        <div className="pp-center pp-numbers-head">
          <Marker n="02" label="Event in Numbers" />
        </div>
        <div className="pp-numbers">
          <div className="pp-num-lead pp-stagger" data-anim="pop">
            {NUMBERS.filter((s) => s.big).map((s, i) => (
              <div key={i} className="pp-num pp-num-big pp-anim">
                <span className="pp-num-ix">{String(i + 1).padStart(2, "0")}</span>
                <div className="pp-num-val">
                  <span data-count={s.value}>{s.value}</span>
                  {s.suffix && <span className="pp-num-suffix">{s.suffix}</span>}
                </div>
                <span className="pp-num-tick" aria-hidden />
                <div className="pp-num-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="pp-num-grid pp-stagger" data-anim="pop">
            {NUMBERS.filter((s) => !s.big).map((s, i) => {
              const plain = (s as { plain?: boolean }).plain;
              return (
                <div key={i} className="pp-num pp-anim">
                  <span className="pp-num-ix">{String(i + 3).padStart(2, "0")}</span>
                  <div className="pp-num-val">
                    {plain ? (
                      <span>{s.value}</span>
                    ) : (
                      <>
                        <span data-count={s.value}>{s.value}</span>
                        {s.suffix && <span className="pp-num-suffix">{s.suffix}</span>}
                      </>
                    )}
                  </div>
                  <span className="pp-num-tick" aria-hidden />
                  <div className="pp-num-label">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 4. FIVE SECTORS — pinned horizontal ─────────────────────────────── */}
      <section className="pp-sectors" id="sectors">
        <h2 className="pp-sr-only">Five Sectors, One Floor</h2>
        <div className="pp-sectors-head">
          <Marker n="03" label="Five Sectors, One Floor" />
        </div>
        <div className="pp-sectors-track">
          {SECTORS.map((sct) => (
            <article key={sct.n} className="pp-sector-panel">
              <div className="pp-sector-media">
                <Stock src={sct.img} alt={sct.name} />
              </div>
              <div className="pp-sector-copy">
                <span className="pp-sector-n">{sct.n}</span>
                <h3 className="pp-sector-name">{sct.name}</h3>
                <p className="pp-sector-body">{sct.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── 5. TECHNOLOGY ON SHOW — marquee ─────────────────────────────────── */}
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
        <Marker n="04" label="Focus Areas" />
        <div className="pp-focus pp-stagger" data-anim="slide-alt">
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

      {/* ─── 7. WHY DAMMAM — full-bleed location band ────────────────────────── */}
      <section className="pp-dammam" id="dammam">
        <div className="pp-dammam-glow" aria-hidden />
        <div className="pp-dammam-grid" aria-hidden />
        <div className="pp-dammam-inner">
          <Marker n="05" label="Why Dammam" />
          <div className="pp-dammam-head">
            <div className="pp-dammam-locator">
              <span className="pp-dammam-eyebrow">The Location</span>
              <h2 className="pp-dammam-title">DAMMAM</h2>
              <p className="pp-dammam-sub">Eastern Province · Kingdom of Saudi Arabia</p>
              <div className="pp-dammam-coords">
                <span>26.43° N</span>
                <i />
                <span>50.10° E</span>
              </div>
              <div className="pp-dammam-pins">
                <span className="on">Dammam</span>
                <span>Jubail · 40 km</span>
                <span>UAE · 45 min</span>
              </div>
              <p className="pp-dammam-lead">
                We chose <em>depth of buyer</em> over breadth of profile: the plant floor is here.
              </p>
            </div>
            <figure className="pp-dammam-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DAMMAM_PHOTO}
                alt="Al Khobar Corniche and Water Tower in the Dammam metropolitan area, Eastern Province, Saudi Arabia"
                loading="lazy"
                decoding="async"
              />
              <figcaption>Al Khobar Corniche · Dammam Metro, Eastern Province</figcaption>
            </figure>
          </div>
          <div className="pp-dammam-ledger">
            {DAMMAM.map((row, i) => (
              <div
                key={i}
                className={`pp-dammam-row${i === DAMMAM.length - 1 ? " pp-dammam-row-wide" : ""}`}
              >
                <span className="pp-dammam-idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="pp-dammam-k">{row.k}</span>
                <span className="pp-dammam-v">{row.v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. NATIONAL ALIGNMENT — full-bleed navy ─────────────────────────── */}
      <section className="pp-navy" id="alignment">
        <div className="pp-glow" aria-hidden />
        <div className="pp-navy-inner">
          <Marker n="06" label="National Alignment" />
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
        <Marker n="07" label="Who We'll Meet" />
        <div className="pp-audience pp-stagger" data-anim="flip">
          {AUDIENCE.map((a) => (
            <div key={a.n} className="pp-aud-cell pp-anim">
              <div className="pp-aud-gauge" aria-hidden="true">
                <span className="pp-aud-n">{a.n}</span>
              </div>
              <div className="pp-aud-body">
                <h3 className="pp-aud-title">{a.title}</h3>
                <p className="pp-aud-text">{a.body}</p>
              </div>
            </div>
          ))}
        </div>
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
              One platform. <em>Five sectors.</em> One day in Dammam.
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
              POW<span>PROCESS</span>
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
