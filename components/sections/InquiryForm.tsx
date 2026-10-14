"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { submitForm, isWorkEmail, isValidEmail, normalizePhoneDigits, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { FormType, CountryCode } from "@/lib/form-helpers";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX_W = 1320;
const PAD = "0 clamp(20px, 4vw, 60px)";

// ─────────────────────────────────────────────────────────────────────────────
// TAB DATA
// ─────────────────────────────────────────────────────────────────────────────

const INQUIRY_TABS = [
  {
    key: "sponsor",
    label: "Sponsor",
    heading: "Become a Summit\nSponsor",
    description:
      "Put your brand in the room with top decision-makers worldwide. Sponsorship packages are designed for maximum visibility and qualified lead generation.",
    perks: [
      { icon: "layers", text: "Boardroom hosting & keynote slots" },
      { icon: "target", text: "Qualified lead generation" },
      { icon: "eye", text: "Premium brand visibility worldwide" },
    ],
    trust: "Trusted by 80+ sponsors across 6+ global markets",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+971 xxxx xxxx" },
      { name: "company", label: "Company", type: "text", placeholder: "Company name" },
      { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
      { name: "interest", label: "Event Interest", type: "select", placeholder: "Select an event series", options: ["Cyber First", "OT Security First", "Digital First", "Opex First", "Other"] },
      { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Tell us about your sponsorship goals..." },
    ],
    cta: "Request Sponsorship Info",
  },
  {
    key: "pass",
    label: "Attend",
    heading: "Register for an\nExecutive Summit",
    description:
      "Our events are curated for senior leaders \u2014 CISOs, CIOs, CTOs, COOs, and VP-level executives. Submit your details and we\u2019ll match you to the right room.",
    perks: [
      { icon: "users", text: "Invite-only, C-suite audience" },
      { icon: "calendar", text: "Multiple events across global cities" },
      { icon: "shield", text: "Chatham House Rule sessions" },
    ],
    trust: "5,000+ senior leaders attended EFG events since 2023",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+971 xxxx xxxx" },
      { name: "company", label: "Company", type: "text", placeholder: "Company name" },
      { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
      { name: "interest", label: "Event Interest", type: "select", placeholder: "Select an event series", options: ["Cyber First", "OT Security First", "Digital First", "Opex First", "Other"] },
      { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Tell us about your interests..." },
    ],
    cta: "Request Pass",
  },
  {
    key: "speaker",
    label: "Speak",
    heading: "Apply to Speak\nat a Summit",
    description:
      "We platform practitioners, not salespeople. If you\u2019re a hands-on leader with real-world experience, we want you on stage.",
    perks: [
      { icon: "mic", text: "Keynote & panel opportunities" },
      { icon: "globe", text: "Reach 5,000+ senior leaders" },
      { icon: "award", text: "Join our speaker alumni network" },
    ],
    trust: "200+ practitioners have spoken at EFG events since 2023",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+971 xxxx xxxx" },
      { name: "company", label: "Company", type: "text", placeholder: "Company name" },
      { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
      { name: "interest", label: "Event Interest", type: "select", placeholder: "Select an event series", options: ["Cyber First", "OT Security First", "Digital First", "Opex First", "Other"] },
      { name: "topic", label: "Proposed Topic", type: "text", placeholder: "Brief topic or area of expertise" },
      { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Tell us about your background..." },
    ],
    cta: "Submit Speaker Proposal",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ARABIC COPY
// Used only when a page passes lang="ar" (OT Security First Jubail's language
// switch). English stays the default everywhere else. Field values, the event
// series names and what is sent to the API are left untouched.
// ─────────────────────────────────────────────────────────────────────────────

export type InquiryLang = "en" | "ar";

type TabCopy = {
  label: string;
  heading: string;
  description: string;
  perks: string[];
  trust: string;
  cta: string;
  messagePlaceholder: string;
};

const AR_TABS: Record<string, TabCopy> = {
  sponsor: {
    label: "الرعاية",
    heading: "كن راعياً\nللقمة",
    description: "ضع علامتك التجارية أمام كبار صنّاع القرار حول العالم. صُممت باقات الرعاية لتحقيق أقصى قدر من الظهور وتوليد فرص عملاء مؤهلة.",
    perks: ["استضافة الطاولات المستديرة وفرص الكلمات الرئيسية", "توليد فرص عملاء مؤهلة", "حضور مميز للعلامة التجارية عالمياً"],
    trust: "موثوق من قبل أكثر من 80 راعياً في أكثر من 6 أسواق عالمية",
    cta: "اطلب معلومات الرعاية",
    messagePlaceholder: "أخبرنا عن أهدافك من الرعاية...",
  },
  pass: {
    label: "الحضور",
    heading: "سجّل لحضور\nقمة تنفيذية",
    description: "صُممت فعالياتنا لكبار القادة: مسؤولي أمن المعلومات، ومديري تقنية المعلومات، ومديري التقنية، ومديري العمليات، وكبار التنفيذيين. أرسل بياناتك وسنرشّحك للجلسة الأنسب لك.",
    perks: ["حضور بالدعوة فقط لكبار التنفيذيين", "فعاليات متعددة في مدن عالمية", "جلسات وفق قاعدة تشاتام هاوس"],
    trust: "أكثر من 5,000 من كبار القادة حضروا فعاليات EFG منذ عام 2023",
    cta: "اطلب تذكرتك",
    messagePlaceholder: "أخبرنا عن اهتماماتك...",
  },
  speaker: {
    label: "التحدث",
    heading: "قدّم طلبك\nللتحدث في القمة",
    description: "نمنح المنصة للممارسين لا لمندوبي المبيعات. إن كنت قائداً ميدانياً تمتلك خبرة عملية حقيقية، فنحن نرحب بك على المنصة.",
    perks: ["فرص الكلمات الرئيسية وحلقات النقاش", "الوصول إلى أكثر من 5,000 من كبار القادة", "انضم إلى شبكة متحدثينا"],
    trust: "أكثر من 200 ممارس تحدثوا في فعاليات EFG منذ عام 2023",
    cta: "أرسل مقترح المشاركة",
    messagePlaceholder: "أخبرنا عن خلفيتك المهنية...",
  },
};

const AR_FIELDS: Record<string, { label: string; placeholder?: string }> = {
  name: { label: "الاسم الكامل", placeholder: "اسمك الكامل" },
  email: { label: "البريد الإلكتروني للعمل" },
  phone: { label: "رقم الهاتف" },
  company: { label: "الشركة", placeholder: "اسم الشركة" },
  title: { label: "المسمى الوظيفي", placeholder: "منصبك" },
  interest: { label: "الفعالية المهتم بها", placeholder: "اختر سلسلة الفعاليات" },
  topic: { label: "الموضوع المقترح", placeholder: "نبذة عن الموضوع أو مجال الخبرة" },
  message: { label: "رسالة (اختياري)" },
};

const UI_COPY = {
  en: {
    submitted: "Inquiry Submitted",
    submittedBody: "Our team will review your submission and get back to you within 2 working hours.",
    another: "Submit another inquiry",
    submitting: "Submitting...",
    privacy: "Your information is kept confidential. We'll only use it to respond to your inquiry.",
    invalidEmail: "Please enter a valid email address",
    workEmail: "Please use your work email address",
    genericError: "Something went wrong.",
    arrow: "→",
  },
  ar: {
    submitted: "تم إرسال طلبك",
    submittedBody: "سيراجع فريقنا طلبك ويتواصل معك خلال ساعتي عمل.",
    another: "إرسال طلب آخر",
    submitting: "جارٍ الإرسال...",
    privacy: "معلوماتك سرية، ولن نستخدمها إلا للرد على طلبك.",
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح",
    workEmail: "يرجى استخدام البريد الإلكتروني الخاص بالعمل",
    genericError: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    arrow: "←",
  },
} as const;

// validatePhone() returns English, country-specific messages; Arabic shows one
// plain message instead.
const AR_PHONE_ERROR = "يرجى إدخال رقم هاتف صحيح";

// ─────────────────────────────────────────────────────────────────────────────
// SECTION LABEL
// ─────────────────────────────────────────────────────────────────────────────

function SectionLabel({ text, rtl = false }: { text: string; rtl?: boolean }) {
  return (
    <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
      <span
        style={{
          width: 30,
          height: 1,
          background: "var(--orange)",
          flexShrink: 0,
        }}
      />
      <span
        className="inquiry-section-label"
        style={{
          fontSize: rtl ? 13 : 11,
          fontWeight: 600,
          // Letter-spacing pulls joined Arabic letters apart.
          letterSpacing: rtl ? 0 : "3px",
          textTransform: "uppercase",
          color: "var(--orange)",
          fontFamily: "var(--font-outfit)",
        }}
      >
        {text}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PERK ICONS
// ─────────────────────────────────────────────────────────────────────────────

function InquiryPerkIcon({ type }: { type: string }) {
  const s: React.CSSProperties = { opacity: 0.7 };
  const props = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, style: s };
  if (type === "layers") return <svg {...props}><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>;
  if (type === "target") return <svg {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
  if (type === "eye") return <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
  if (type === "users") return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
  if (type === "calendar") return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
  if (type === "shield") return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
  if (type === "mic") return <svg {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /></svg>;
  if (type === "globe") return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
  return <svg {...props}><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function InquiryForm({ defaultCountry, eventName, hideLabel, labelText, lang = "en" }: { defaultCountry?: string; eventName?: string; hideLabel?: boolean; labelText?: string; lang?: InquiryLang } = {}) {
  const isAr = lang === "ar";
  const ui = UI_COPY[lang];
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeTab, setActiveTab] = useState<string>("sponsor");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    (defaultCountry ? COUNTRY_CODES.find(c => c.country === defaultCountry) : null) || COUNTRY_CODES[0]
  );
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Allow other components on the page to switch the active tab via a custom event.
  // Tier CTAs elsewhere dispatch: window.dispatchEvent(new CustomEvent("efg:set-form-tab", { detail: "sponsor" | "pass" | "speaker" }))
  useEffect(() => {
    const onSet = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail === "string" && INQUIRY_TABS.some((t) => t.key === detail)) {
        setActiveTab(detail);
        if (submitted) {
          setSubmitted(false);
          setFormError(null);
          setFormData({});
          setPhoneError(null);
          setEmailError(null);
        }
      }
    };
    window.addEventListener("efg:set-form-tab", onSet as EventListener);
    return () => window.removeEventListener("efg:set-form-tab", onSet as EventListener);
  }, [submitted]);

  // Deep-link: ?tab=speak (also sponsor / attend / register) preselects a tab.
  // Read directly here on mount so email/UTM links land on the right tab without
  // depending on any other component's timing.
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("tab");
    if (!raw) return;
    const alias: Record<string, string> = {
      speak: "speaker",
      speaker: "speaker",
      sponsor: "sponsor",
      attend: "pass",
      register: "pass",
      pass: "pass",
    };
    const key = alias[raw.toLowerCase()];
    if (key && INQUIRY_TABS.some((t) => t.key === key)) setActiveTab(key);
  }, []);

  // Swap in the Arabic copy over the English tab; keys, field names and types
  // are unchanged, so the submission is identical in either language.
  const localize = (t: (typeof INQUIRY_TABS)[number]) => {
    if (!isAr) return t;
    const c = AR_TABS[t.key];
    return {
      ...t,
      label: c.label,
      heading: c.heading,
      description: c.description,
      perks: t.perks.map((p, i) => ({ ...p, text: c.perks[i] ?? p.text })),
      trust: c.trust,
      cta: c.cta,
      fields: t.fields.map((f) => ({
        ...f,
        label: AR_FIELDS[f.name]?.label ?? f.label,
        placeholder: f.name === "message" ? c.messagePlaceholder : AR_FIELDS[f.name]?.placeholder ?? f.placeholder,
      })),
    };
  };
  const tabs = INQUIRY_TABS.map(localize);
  const tab = tabs.find((t) => t.key === activeTab)!;
  const phoneMessage = (err: string | null) => (err && isAr ? AR_PHONE_ERROR : err);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    if (formData.email && !isValidEmail(formData.email)) {
      setEmailError(ui.invalidEmail);
      setSubmitting(false);
      return;
    }

    if (formData.email && !isWorkEmail(formData.email)) {
      setEmailError(ui.workEmail);
      setSubmitting(false);
      return;
    }

    const phoneErr = validatePhone(formData.phone || "", selectedCountry);
    if (phoneErr) {
      setPhoneError(phoneMessage(phoneErr));
      setSubmitting(false);
      return;
    }

    const typeMap: Record<string, FormType> = { sponsor: "sponsor", pass: "attend", speaker: "speak" };
    const type = typeMap[activeTab] || "attend";

    const combinedPhone = `${selectedCountry.code}${(formData.phone || "").replace(/[\s\-()]/g, "")}`;

    const sharedMeta = {
      event_interest: formData.interest || "",
      message: formData.message || "",
    };

    const metadataMap: Record<string, () => Record<string, string>> = {
      sponsor: () => ({ ...sharedMeta }),
      pass: () => ({ ...sharedMeta }),
      speaker: () => ({ ...sharedMeta, proposed_topic: formData.topic || "" }),
    };

    const meta = metadataMap[activeTab]?.() || {};
    if (isAr) meta.form_language = "Arabic";
    const result = await submitForm({
      type,
      full_name: formData.name || "",
      email: formData.email || "",
      company: formData.company || "",
      job_title: formData.title || "",
      phone: combinedPhone,
      event_name: eventName || meta.event_interest || undefined,
      metadata: meta,
    });

    setSubmitting(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setFormError(isAr ? ui.genericError : result.error || ui.genericError);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormError(null);
    setFormData({});
    setPhoneError(null);
    setEmailError(null);
    setSelectedCountry(COUNTRY_CODES[0]);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "white",
    fontFamily: "var(--font-outfit)",
    fontSize: 13.5,
    fontWeight: 400,
    outline: "none",
    transition: "border-color 0.3s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-outfit)",
    fontSize: 11,
    fontWeight: 500,
    color: "rgba(255,255,255,0.4)",
    marginBottom: 5,
    display: "block",
    letterSpacing: "0.3px",
  };

  return (
    <section
      id="get-involved"
      ref={ref}
      style={{
        background: "var(--black)",
        padding: "clamp(36px, 4.5vw, 56px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 700px 500px at 20% 40%, rgba(232,101,26,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 500px 400px at 80% 60%, rgba(232,101,26,0.03) 0%, transparent 70%)
          `,
        }}
      />

      <div
        dir={isAr ? "rtl" : "ltr"}
        lang={isAr ? "ar" : undefined}
        style={{
          maxWidth: MAX_W, margin: "0 auto", padding: PAD, position: "relative",
          // Arabic: the page supplies --font-arabic; Latin fallbacks keep digits and emails tidy.
          ...(isAr ? { ["--font-outfit" as string]: "var(--font-arabic), system-ui, sans-serif", ["--font-display" as string]: "var(--font-arabic), system-ui, sans-serif" } : {}),
        }}
      >
        {/* Tab pills, top of section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ display: "flex", alignItems: "center", justifyContent: hideLabel ? "center" : "flex-start", gap: 8, marginBottom: 48 }}
        >
          {!hideLabel && <SectionLabel text={labelText || "Get Involved"} rtl={isAr} />}
          {!hideLabel && <div style={{ flex: 1 }} />}
          <div style={{ display: "flex", gap: 6 }}>
            {tabs.map((t) => {
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => {
                    setActiveTab(t.key);
                    if (submitted) resetForm();
                  }}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 40,
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "white" : "rgba(255,255,255,0.4)",
                    background: isActive ? "var(--orange)" : "rgba(255,255,255,0.04)",
                    border: isActive
                      ? "1px solid var(--orange)"
                      : "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    letterSpacing: isAr ? 0 : "0.2px",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Split layout */}
        <div
          className="inquiry-split"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.25fr",
            gap: "clamp(32px, 4vw, 64px)",
            alignItems: "start",
          }}
        >
          {/* ── LEFT COLUMN: Editorial ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`left-${activeTab}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ paddingTop: 8 }}
            >
              {/* Headline */}
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(32px, 3.5vw, 50px)",
                  letterSpacing: isAr ? 0 : "-2px",
                  color: "var(--white)",
                  lineHeight: isAr ? 1.3 : 1.08,
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {tab.heading}
              </h2>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 300,
                  fontSize: "clamp(14px, 1.2vw, 16px)",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.7,
                  margin: "20px 0 0",
                  maxWidth: 440,
                }}
              >
                {tab.description}
              </p>

              {/* Perks */}
              <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 18 }}>
                {tab.perks.map((perk) => (
                  <div key={perk.text} className="flex items-center gap-3">
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "rgba(232,101,26,0.06)",
                        border: "1px solid rgba(232,101,26,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--orange)",
                        flexShrink: 0,
                      }}
                    >
                      <InquiryPerkIcon type={perk.icon} />
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: 14,
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.55)",
                      }}
                    >
                      {perk.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Trust line */}
              <div
                style={{
                  marginTop: 40,
                  paddingTop: 24,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 12,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: isAr ? 0 : "0.3px",
                    margin: 0,
                  }}
                >
                  {tab.trust}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── RIGHT COLUMN: Form card ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            style={{
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
              padding: "clamp(24px, 3vw, 36px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Card ambient glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: -40,
                right: -40,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(232,101,26,0.05) 0%, transparent 70%)",
              }}
            />

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{ textAlign: "center", padding: "40px 0" }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "rgba(34,197,94,0.12)",
                      border: "1px solid rgba(34,197,94,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "clamp(20px, 2.5vw, 26px)",
                      letterSpacing: "-0.5px",
                      color: "white",
                      margin: "0 0 8px",
                    }}
                  >
                    {ui.submitted}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontWeight: 300,
                      fontSize: 14,
                      color: "#A0A0A0",
                      margin: "0 0 20px",
                      lineHeight: 1.6,
                    }}
                  >
                    {ui.submittedBody}
                  </p>
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={resetForm}
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--orange)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {ui.another} {ui.arrow}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`form-${activeTab}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <form onSubmit={handleSubmit}>
                    <div
                      className="inquiry-form-grid"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 14,
                      }}
                    >
                      {tab.fields.filter((f) => !(eventName && f.name === "interest")).map((field) => {
                        const isFullWidth = field.type === "textarea" || field.type === "tel";
                        if (field.type === "tel") {
                          return (
                            <div key={field.name} style={{ gridColumn: "1 / -1" }}>
                              <label style={labelStyle}>{field.label}</label>
                              <div dir="ltr" style={{ display: "flex", gap: 8 }}>
                                <select
                                  suppressHydrationWarning
                                  value={`${selectedCountry.code}|${selectedCountry.country}`}
                                  onChange={(e) => {
                                    const [code, country] = e.target.value.split("|");
                                    const c = COUNTRY_CODES.find((cc) => cc.code === code && cc.country === country);
                                    if (!c) return;
                                    setSelectedCountry(c);
                                    // The number already in the box was capped
                                    // to the old country's length, so re-cap it
                                    // and re-check it against the new one.
                                    const current = formData[field.name] || "";
                                    const recapped = normalizePhoneDigits(current, c);
                                    if (recapped !== current) handleChange(field.name, recapped);
                                    setPhoneError(recapped ? phoneMessage(validatePhone(recapped, c)) : null);
                                  }}
                                  style={{ ...inputStyle, width: 120, flexShrink: 0, appearance: "none", cursor: "pointer" }}
                                >
                                  {COUNTRY_CODES.map((cc) => (
                                    <option key={`${cc.code}-${cc.country}`} value={`${cc.code}|${cc.country}`} style={{ color: "#222", background: "#fff" }}>
                                      {cc.country} {cc.code}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  suppressHydrationWarning
                                  type="tel"
                                  inputMode="numeric"
                                  autoComplete="tel-national"
                                  value={formData[field.name] || ""}
                                  onChange={(e) => {
                                    // No maxLength on the input: it counts raw
                                    // characters, so it truncated anyone who
                                    // typed the spaces the placeholder shows.
                                    handleChange(field.name, normalizePhoneDigits(e.target.value, selectedCountry));
                                    setPhoneError(null);
                                  }}
                                  placeholder={selectedCountry.placeholder}
                                  aria-invalid={!!phoneError}
                                  style={{ ...inputStyle, flex: 1 }}
                                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(232,101,26,0.3)"; }}
                                  onBlur={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                    const v = formData[field.name] || e.currentTarget.value;
                                    if (v) setPhoneError(phoneMessage(validatePhone(v, selectedCountry)));
                                  }}
                                />
                              </div>
                              {phoneError && <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}>{phoneError}</p>}
                            </div>
                          );
                        }
                        if (field.type === "email") {
                          return (
                            <div key={field.name}>
                              <label style={labelStyle}>{field.label}</label>
                              <input
                                suppressHydrationWarning
                                type="email"
                                dir="ltr"
                                value={formData[field.name] || ""}
                                onChange={(e) => { handleChange(field.name, e.target.value); setEmailError(null); }}
                                placeholder={field.placeholder}
                                required
                                style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(232,101,26,0.3)"; }}
                                aria-invalid={!!emailError}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                  const val = formData[field.name] || e.currentTarget.value;
                                  if (!val) return;
                                  if (!isValidEmail(val)) setEmailError(ui.invalidEmail);
                                  else if (!isWorkEmail(val)) setEmailError(ui.workEmail);
                                }}
                              />
                              {emailError && <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}>{emailError}</p>}
                            </div>
                          );
                        }
                        return (
                          <div
                            key={field.name}
                            style={{
                              gridColumn: isFullWidth ? "1 / -1" : undefined,
                            }}
                          >
                            <label style={labelStyle}>{field.label}</label>
                            {field.type === "textarea" ? (
                              <textarea
                                suppressHydrationWarning
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                placeholder={field.placeholder}
                                rows={3}
                                style={{
                                  ...inputStyle,
                                  resize: "vertical",
                                  minHeight: 72,
                                }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(232,101,26,0.3)"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                              />
                            ) : field.type === "select" ? (
                              <select
                                suppressHydrationWarning
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                required
                                style={{
                                  ...inputStyle,
                                  appearance: "none",
                                  WebkitAppearance: "none",
                                  cursor: "pointer",
                                  color: formData[field.name] ? "white" : "rgba(255,255,255,0.3)",
                                }}
                              >
                                <option value="" style={{ color: "#222", background: "#fff" }}>
                                  {field.placeholder}
                                </option>
                                {field.options?.map((opt) => (
                                  <option key={opt} value={opt} style={{ color: "#222", background: "#fff" }}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                suppressHydrationWarning
                                type={field.type}
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                placeholder={field.placeholder}
                                required
                                style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(232,101,26,0.3)"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Honeypot, hidden from real users */}
                    <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

                    {/* Error message */}
                    {formError && (
                      <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 13, margin: "8px 0 0" }}>
                        {formError}
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      suppressHydrationWarning
                      disabled={submitting}
                      style={{
                        width: "100%",
                        marginTop: 20,
                        padding: "13px 28px",
                        borderRadius: 10,
                        background: submitting ? "rgba(232,101,26,0.6)" : "var(--orange)",
                        color: "white",
                        fontFamily: "var(--font-outfit)",
                        fontSize: 14,
                        fontWeight: 600,
                        border: "none",
                        cursor: submitting ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        opacity: submitting ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!submitting) {
                          e.currentTarget.style.background = "var(--orange-bright)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 12px 40px var(--orange-glow)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = submitting ? "rgba(232,101,26,0.6)" : "var(--orange)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {submitting ? ui.submitting : tab.cta} {!submitting && <span>{ui.arrow}</span>}
                    </button>
                  </form>

                  {/* Privacy note */}
                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 400,
                      color: "#3A3A3A",
                      textAlign: "center",
                      margin: "14px 0 0",
                    }}
                  >
                    {ui.privacy}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 860px) {
          .inquiry-split {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .inquiry-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
