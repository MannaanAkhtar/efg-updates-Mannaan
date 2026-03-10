"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════════
// EVENT DATA
// ═══════════════════════════════════════════════════════════════

type EventItem = {
  id: string;
  series: string;
  seriesColor: string;
  edition: string;
  title: string;
  date: Date;
  dateDisplay: string;
  location: string;
  venue: string;
  attendees: string;
  href: string;
  status: "open" | "soon";
};

const allEvents: EventItem[] = [
  {
    id: "cyber-first-kuwait",
    series: "Cyber First",
    seriesColor: "#01BBF5",
    edition: "3RD EDITION",
    title: "Cyber First Kuwait",
    date: new Date("2026-04-21"),
    dateDisplay: "April 21, 2026",
    location: "Kuwait City, Kuwait",
    venue: "Jumeirah Messilah Beach Hotel",
    attendees: "350+",
    href: "/events/cyber-first/kuwait-2026",
    status: "open",
  },
  {
    id: "data-first-kuwait",
    series: "Data & AI First",
    seriesColor: "#0F735E",
    edition: "1ST EDITION",
    title: "Data & AI First Kuwait",
    date: new Date("2026-05-18"),
    dateDisplay: "May 18, 2026",
    location: "Kuwait City, Kuwait",
    venue: "Venue TBA",
    attendees: "500+",
    href: "/events/data-ai-first/kuwait-2026",
    status: "soon",
  },
  {
    id: "ot-security-jubail",
    series: "OT Security First",
    seriesColor: "#D34B9A",
    edition: "2ND EDITION",
    title: "OT Security Jubail",
    date: new Date("2026-06-15"),
    dateDisplay: "June 15, 2026",
    location: "Jubail, Saudi Arabia",
    venue: "Venue TBA",
    attendees: "300+",
    href: "/events/ot-security-first",
    status: "soon",
  },
  {
    id: "digital-first-qatar",
    series: "Data & AI First",
    seriesColor: "#0F735E",
    edition: "2ND EDITION",
    title: "Digital First Qatar",
    date: new Date("2026-09-15"),
    dateDisplay: "September 15, 2026",
    location: "Doha, Qatar",
    venue: "Venue TBA",
    attendees: "500+",
    href: "/events/data-ai-first",
    status: "soon",
  },
  {
    id: "cyber-first-qatar",
    series: "Cyber First",
    seriesColor: "#01BBF5",
    edition: "4TH EDITION",
    title: "Cyber First Qatar",
    date: new Date("2026-09-16"),
    dateDisplay: "September 16, 2026",
    location: "Doha, Qatar",
    venue: "Venue TBA",
    attendees: "500+",
    href: "/events/cyber-first",
    status: "soon",
  },
  {
    id: "opex-first-saudi",
    series: "Opex First",
    seriesColor: "#7C3AED",
    edition: "3RD EDITION",
    title: "OPEX First Saudi",
    date: new Date("2026-09-20"),
    dateDisplay: "September 20, 2026",
    location: "Riyadh, Saudi Arabia",
    venue: "Venue TBA",
    attendees: "400+",
    href: "/events/opex-first",
    status: "soon",
  },
  {
    id: "digital-resilience-ksa",
    series: "Cyber First",
    seriesColor: "#01BBF5",
    edition: "1ST EDITION",
    title: "Digital Resilience KSA",
    date: new Date("2026-09-22"),
    dateDisplay: "September 22, 2026",
    location: "Riyadh, Saudi Arabia",
    venue: "Venue TBA",
    attendees: "400+",
    href: "/events/cyber-first",
    status: "soon",
  },
  {
    id: "cyber-first-oman",
    series: "Cyber First",
    seriesColor: "#01BBF5",
    edition: "5TH EDITION",
    title: "Cyber First Oman",
    date: new Date("2026-10-12"),
    dateDisplay: "October 12, 2026",
    location: "Muscat, Oman",
    venue: "Venue TBA",
    attendees: "400+",
    href: "/events/cyber-first",
    status: "soon",
  },
  {
    id: "ot-security-oman",
    series: "OT Security First",
    seriesColor: "#D34B9A",
    edition: "3RD EDITION",
    title: "OT Security Oman",
    date: new Date("2026-10-13"),
    dateDisplay: "October 13, 2026",
    location: "Muscat, Oman",
    venue: "Venue TBA",
    attendees: "300+",
    href: "/events/ot-security-first",
    status: "soon",
  },
];

// Months with events
const MONTHS = [
  { abbr: "APR", full: "April", index: 3 },
  { abbr: "MAY", full: "May", index: 4 },
  { abbr: "JUN", full: "June", index: 5 },
  { abbr: "SEP", full: "September", index: 8 },
  { abbr: "OCT", full: "October", index: 9 },
];

// Series filters
const SERIES_FILTERS = [
  { label: "All", value: "all", color: null },
  { label: "Cyber First", value: "Cyber First", color: "#01BBF5" },
  { label: "Data & AI First", value: "Data & AI First", color: "#0F735E" },
  { label: "OT Security First", value: "OT Security First", color: "#D34B9A" },
  { label: "Opex First", value: "Opex First", color: "#7C3AED" },
];

// Group events by month
function groupEventsByMonth(events: EventItem[]) {
  const grouped: Record<number, EventItem[]> = {};
  events.forEach((e) => {
    const month = e.date.getMonth();
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(e);
  });
  return grouped;
}

// Get next upcoming event
function getNextEvent(): EventItem {
  const now = new Date();
  const upcoming = allEvents
    .filter((e) => e.date.getTime() > now.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  return upcoming[0] || allEvents[0];
}

// Days until
function getDaysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// Detect touch device
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  return isTouch;
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function AnnualTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const monthRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isTouch = useIsTouchDevice();
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeMonth, setActiveMonth] = useState<number | null>(null);
  const [activeSeries, setActiveSeries] = useState<string>("all");
  
  const nextEvent = useMemo(() => getNextEvent(), []);
  
  // Filter events by series
  const filteredEvents = useMemo(() => {
    if (activeSeries === "all") return allEvents;
    return allEvents.filter(e => e.series === activeSeries);
  }, [activeSeries]);
  
  const groupedEvents = useMemo(() => groupEventsByMonth(filteredEvents), [filteredEvents]);
  
  // Get months that have events after filtering
  const visibleMonths = useMemo(() => {
    return MONTHS.filter(m => groupedEvents[m.index] && groupedEvents[m.index].length > 0);
  }, [groupedEvents]);

  // Handle scroll progress and detect active month
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const progress = scrollLeft / (scrollWidth - clientWidth);
    setScrollProgress(Math.min(1, Math.max(0, progress)));
    
    // Detect which month is most visible
    const scrollCenter = scrollLeft + clientWidth / 3;
    let closestMonth: number | null = null;
    let closestDistance = Infinity;
    
    visibleMonths.forEach(month => {
      const el = monthRefs.current[month.index];
      if (el) {
        const rect = el.getBoundingClientRect();
        const scrollRect = scrollRef.current!.getBoundingClientRect();
        const elLeft = rect.left - scrollRect.left + scrollLeft;
        const distance = Math.abs(elLeft - scrollCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestMonth = month.index;
        }
      }
    });
    
    setActiveMonth(closestMonth);
  }, [visibleMonths]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Scroll to specific month
  const scrollToMonth = useCallback((monthIndex: number) => {
    const el = monthRefs.current[monthIndex];
    if (el && scrollRef.current) {
      const scrollRect = scrollRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const targetScroll = scrollRef.current.scrollLeft + (elRect.left - scrollRect.left) - 20;
      
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="timeline-section"
      style={{
        position: "relative",
        padding: "clamp(60px, 10vw, 120px) 0",
        overflow: "hidden",
        background: "#0A0A0A",
      }}
    >
      {/* Animated Gradient Mesh */}
      <div className="timeline-gradient-mesh" />
      
      {/* Noise Overlay */}
      <div className="timeline-noise" />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(16px, 4vw, 60px)" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: "clamp(24px, 4vw, 40px)" }}
          >
            {/* Label */}
            <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
              <span className="timeline-label-line" />
              <span className="timeline-label-text">2026 Calendar</span>
            </div>

            {/* Title */}
            <h2 className="timeline-title">The Year Ahead</h2>

            {/* Subtitle */}
            <p className="timeline-subtitle">
              {filteredEvents.length} events across {visibleMonths.length} months. Scroll to explore.
            </p>
          </motion.div>

          {/* Series Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="timeline-filters"
          >
            <span className="filter-label">Series</span>
            <div className="filter-pills">
              {SERIES_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveSeries(filter.value)}
                  className={`filter-pill ${activeSeries === filter.value ? 'active' : ''}`}
                  style={{
                    '--pill-color': filter.color || 'var(--orange)',
                  } as React.CSSProperties}
                >
                  {filter.color && activeSeries === filter.value && (
                    <span 
                      className="filter-dot" 
                      style={{ background: filter.color }}
                    />
                  )}
                  {filter.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="timeline-progress-track"
          >
            <motion.div
              className="timeline-progress-bar"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </motion.div>

          {/* Month Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="timeline-month-nav"
          >
            <div className="timeline-month-pills">
              {visibleMonths.map((month) => (
                <button
                  key={month.abbr}
                  onClick={() => scrollToMonth(month.index)}
                  className={`month-pill ${activeMonth === month.index ? 'active' : ''}`}
                >
                  {month.abbr}
                  <span className="month-count">
                    {groupedEvents[month.index]?.length || 0}
                  </span>
                </button>
              ))}
            </div>
            <span className="timeline-hint">
              {isTouch ? "Swipe to explore" : "Drag to explore"}
            </span>
          </motion.div>
        </div>

        {/* Horizontal Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {visibleMonths.length > 0 ? (
            <div
              ref={scrollRef}
              className="timeline-scroll"
              style={{
                cursor: isTouch ? "default" : (isDragging ? "grabbing" : "grab"),
              }}
              onMouseDown={() => !isTouch && setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              {/* Left Spacer */}
              <div className="timeline-spacer" />

              {/* Timeline Track */}
              <div className="timeline-track">
                {visibleMonths.map((month, monthIdx) => {
                  const monthEvents = groupedEvents[month.index] || [];
                  return (
                    <div 
                      key={month.abbr} 
                      className="timeline-month-section"
                      ref={(el) => { monthRefs.current[month.index] = el; }}
                    >
                      {/* Month Header */}
                      <div className="timeline-month-header">
                        {monthIdx > 0 && <div className="timeline-month-connector" />}
                        <span className="timeline-month-name">{month.full}</span>
                      </div>

                      {/* Events Row */}
                      <div className="timeline-events-row">
                        {monthEvents.map((event, eventIdx) => (
                          <TimelineCard
                            key={event.id}
                            event={event}
                            isNext={event.id === nextEvent.id}
                            index={eventIdx}
                            isTouch={isTouch}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Spacer */}
              <div className="timeline-spacer" />
            </div>
          ) : (
            <div className="timeline-empty">
              <p>No events found for this filter.</p>
              <button onClick={() => setActiveSeries("all")}>Show All Events</button>
            </div>
          )}
        </motion.div>

        {/* Scroll fade hints */}
        <div className="timeline-fade-right" />
      </div>

      <style jsx global>{`
        /* ═══════════════════════════════════════════════════════════════
           BASE STYLES
           ═══════════════════════════════════════════════════════════════ */
        
        .timeline-section {
          --card-width: 340px;
          --card-width-next: 400px;
          --card-width-mobile: 280px;
          --card-width-next-mobile: 300px;
          --section-padding: clamp(16px, 4vw, 60px);
        }
        
        .timeline-gradient-mesh {
          position: absolute;
          inset: -50%;
          background: 
            radial-gradient(ellipse 60% 40% at 10% 20%, rgba(232, 101, 26, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 50% 50% at 90% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 80% 40% at 50% 100%, rgba(1, 187, 245, 0.06) 0%, transparent 40%);
          animation: timelineMeshFloat 25s ease-in-out infinite;
          filter: blur(80px);
          pointer-events: none;
        }
        
        @keyframes timelineMeshFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(3%, -2%) scale(1.02); }
          66% { transform: translate(-2%, 3%) scale(0.98); }
        }
        
        .timeline-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
        }
        
        /* ═══════════════════════════════════════════════════════════════
           HEADER
           ═══════════════════════════════════════════════════════════════ */
        
        .timeline-label-line {
          width: 40px;
          height: 1px;
          background: var(--orange);
        }
        
        .timeline-label-text {
          font-family: var(--font-outfit);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--orange);
        }
        
        .timeline-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(32px, 5vw, 64px);
          letter-spacing: -2px;
          color: var(--white);
          line-height: 1.05;
          margin: 0 0 16px;
        }
        
        .timeline-subtitle {
          font-family: var(--font-dm-sans);
          font-size: clamp(14px, 1.5vw, 18px);
          font-weight: 300;
          color: rgba(255,255,255,0.5);
          max-width: 500px;
          line-height: 1.7;
          margin: 0;
        }
        
        /* ═══════════════════════════════════════════════════════════════
           SERIES FILTER
           ═══════════════════════════════════════════════════════════════ */
        
        .timeline-filters {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: clamp(20px, 3vw, 32px);
          flex-wrap: wrap;
        }
        
        .filter-label {
          font-family: var(--font-outfit);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          flex-shrink: 0;
        }
        
        .filter-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 50px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          font-family: var(--font-outfit);
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        
        .filter-pill:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.1);
        }
        
        .filter-pill.active {
          background: color-mix(in srgb, var(--pill-color) 15%, transparent);
          border-color: color-mix(in srgb, var(--pill-color) 40%, transparent);
          color: var(--pill-color);
        }
        
        .filter-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        
        /* ═══════════════════════════════════════════════════════════════
           PROGRESS BAR
           ═══════════════════════════════════════════════════════════════ */
        
        .timeline-progress-track {
          height: 2px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          margin-bottom: clamp(16px, 3vw, 24px);
          overflow: hidden;
        }
        
        .timeline-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--orange), #7C3AED);
          border-radius: 2px;
          transition: width 0.1s ease-out;
        }
        
        /* ═══════════════════════════════════════════════════════════════
           MONTH NAV
           ═══════════════════════════════════════════════════════════════ */
        
        .timeline-month-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: clamp(24px, 4vw, 32px);
          flex-wrap: wrap;
        }
        
        .timeline-month-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .timeline-month-pills::-webkit-scrollbar {
          display: none;
        }
        
        .month-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 50px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          font-family: var(--font-outfit);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        
        .month-pill:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
        }
        
        .month-pill.active {
          background: rgba(232, 101, 26, 0.15);
          border-color: rgba(232, 101, 26, 0.4);
          color: var(--orange);
        }
        
        .month-count {
          font-size: 9px;
          font-weight: 500;
          padding: 2px 6px;
          background: rgba(255,255,255,0.08);
          border-radius: 10px;
          color: rgba(255,255,255,0.5);
        }
        
        .month-pill.active .month-count {
          background: rgba(232, 101, 26, 0.25);
          color: var(--orange);
        }
        
        .timeline-hint {
          font-family: var(--font-outfit);
          font-size: 12px;
          font-weight: 400;
          color: rgba(255,255,255,0.3);
          flex-shrink: 0;
        }
        
        /* ═══════════════════════════════════════════════════════════════
           TIMELINE SCROLL
           ═══════════════════════════════════════════════════════════════ */
        
        .timeline-scroll {
          display: flex;
          gap: 0;
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 24px;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }
        
        .timeline-scroll::-webkit-scrollbar {
          display: none;
        }
        
        .timeline-spacer {
          flex-shrink: 0;
          width: var(--section-padding);
        }
        
        .timeline-track {
          display: flex;
          align-items: stretch;
          gap: 0;
        }
        
        .timeline-month-section {
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }
        
        .timeline-month-header {
          display: flex;
          align-items: center;
          padding-left: 0;
          margin-bottom: clamp(20px, 3vw, 32px);
        }
        
        .timeline-month-section:not(:first-child) .timeline-month-header {
          padding-left: clamp(24px, 4vw, 48px);
        }
        
        .timeline-month-connector {
          width: clamp(40px, 6vw, 80px);
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1));
          margin-right: clamp(12px, 2vw, 24px);
        }
        
        .timeline-month-name {
          font-family: var(--font-display);
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 800;
          letter-spacing: -3px;
          background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        
        .timeline-events-row {
          display: flex;
          align-items: start;
          gap: clamp(12px, 2vw, 20px);
        }
        
        .timeline-month-section:not(:first-child) .timeline-events-row {
          padding-left: clamp(24px, 4vw, 48px);
        }
        
        .timeline-fade-right {
          position: absolute;
          right: 0;
          top: 50%;
          width: clamp(60px, 10vw, 120px);
          height: 60%;
          transform: translateY(-50%);
          background: linear-gradient(90deg, transparent, #0A0A0A);
          pointer-events: none;
          z-index: 10;
        }
        
        .timeline-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }
        
        .timeline-empty p {
          font-family: var(--font-outfit);
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          margin: 0 0 16px;
        }
        
        .timeline-empty button {
          padding: 10px 20px;
          border-radius: 50px;
          background: rgba(232, 101, 26, 0.1);
          border: 1px solid rgba(232, 101, 26, 0.3);
          color: var(--orange);
          font-family: var(--font-outfit);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .timeline-empty button:hover {
          background: rgba(232, 101, 26, 0.2);
        }
        
        /* ═══════════════════════════════════════════════════════════════
           TIMELINE CARD
           ═══════════════════════════════════════════════════════════════ */
        
        .timeline-card-wrapper {
          perspective: 1000px;
          flex-shrink: 0;
          width: var(--card-width);
        }
        
        .timeline-card-wrapper.is-next {
          width: var(--card-width-next);
        }
        
        .timeline-card {
          text-decoration: none;
          display: block;
        }
        
        .timeline-card-content {
          position: relative;
          overflow: hidden;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: clamp(18px, 2.5vw, 24px);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 24px rgba(0,0,0,0.2);
        }
        
        .timeline-card-wrapper.is-next .timeline-card-content {
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
          padding: clamp(20px, 3vw, 28px);
          border-radius: 24px;
        }
        
        .timeline-card:hover .timeline-card-content {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        
        .timeline-card-accent {
          position: absolute;
          top: 0;
          left: clamp(16px, 2vw, 24px);
          right: clamp(16px, 2vw, 24px);
          height: 2px;
          border-radius: 0 0 2px 2px;
        }
        
        .timeline-card-wrapper.is-next .timeline-card-accent {
          height: 3px;
        }
        
        /* ═══════════════════════════════════════════════════════════════
           MOBILE STYLES
           ═══════════════════════════════════════════════════════════════ */
        
        @media (max-width: 768px) {
          .timeline-section {
            --card-width: var(--card-width-mobile);
            --card-width-next: var(--card-width-next-mobile);
          }
          
          .timeline-label-line {
            width: 24px;
          }
          
          .timeline-label-text {
            font-size: 10px;
            letter-spacing: 2px;
          }
          
          .timeline-hint {
            display: none;
          }
          
          .timeline-filters {
            gap: 8px;
          }
          
          .filter-pills {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 4px;
            scrollbar-width: none;
          }
          
          .filter-pills::-webkit-scrollbar {
            display: none;
          }
          
          .filter-pill {
            padding: 6px 12px;
            font-size: 10px;
            flex-shrink: 0;
          }
          
          .month-pill {
            padding: 6px 12px;
            font-size: 10px;
          }
          
          .timeline-card-date {
            font-size: 36px !important;
          }
          
          .timeline-card-wrapper.is-next .timeline-card-date {
            font-size: 44px !important;
          }
          
          .timeline-card-title {
            font-size: 16px !important;
          }
          
          .timeline-card-wrapper.is-next .timeline-card-title {
            font-size: 18px !important;
          }
        }
        
        @media (max-width: 480px) {
          .timeline-section {
            --card-width: 260px;
            --card-width-next: 280px;
          }
          
          .timeline-month-name {
            font-size: 32px;
            letter-spacing: -2px;
          }
          
          .timeline-month-connector {
            width: 30px;
            margin-right: 10px;
          }
          
          .timeline-events-row {
            gap: 10px;
          }
          
          .timeline-card-content {
            padding: 16px;
            border-radius: 16px;
          }
          
          .timeline-card-cta {
            padding: 12px 14px !important;
          }
          
          .filter-label {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// TIMELINE CARD
// ═══════════════════════════════════════════════════════════════

function TimelineCard({
  event,
  isNext,
  index,
  isTouch,
}: {
  event: EventItem;
  isNext: boolean;
  index: number;
  isTouch: boolean;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // 3D Tilt effect (disabled on touch)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouch || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const daysUntil = getDaysUntil(event.date);
  const dayNum = event.date.getDate();
  const accentColor = event.seriesColor;

  return (
    <motion.div
      className={`timeline-card-wrapper ${isNext ? 'is-next' : ''}`}
      style={isTouch ? {} : { perspective: 1000 }}
    >
      <motion.a
        ref={cardRef}
        href={event.href}
        className="timeline-card"
        style={isTouch ? {} : {
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card Glow (for next event) */}
        {isNext && (
          <div
            className="absolute -inset-1 rounded-3xl opacity-40 blur-xl pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${accentColor}40, transparent 70%)`,
            }}
          />
        )}
        
        {/* Card Content */}
        <div
          className="timeline-card-content"
          style={{
            borderColor: isHovered ? `${accentColor}50` : "rgba(255,255,255,0.08)",
          }}
        >
          {/* Colored accent line */}
          <div className="timeline-card-accent" style={{ background: accentColor }} />

          {/* Top Row: Date + Badge */}
          <div className="flex items-start justify-between" style={{ marginBottom: "clamp(14px, 2vw, 20px)" }}>
            <span
              className="timeline-card-date"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: isNext ? 48 : 40,
                fontWeight: 800,
                letterSpacing: "-2px",
                color: "white",
                lineHeight: 1,
              }}
            >
              {dayNum}
            </span>
            
            <div className="flex flex-col items-end gap-2">
              {isNext && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    background: "rgba(232, 101, 26, 0.15)",
                    border: "1px solid rgba(232, 101, 26, 0.3)",
                    borderRadius: 50,
                    fontFamily: "var(--font-outfit)",
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "#E8651A",
                  }}
                >
                  <PulsingDot color="#E8651A" />
                  Next
                </span>
              )}
              <span
                style={{
                  padding: "4px 10px",
                  background: `${accentColor}18`,
                  border: `1px solid ${accentColor}30`,
                  borderRadius: 50,
                  fontFamily: "var(--font-outfit)",
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: accentColor,
                }}
              >
                {daysUntil}d
              </span>
            </div>
          </div>

          {/* Series Badge */}
          <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 10 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 8px",
                background: `${accentColor}14`,
                borderRadius: 5,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: accentColor,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  color: accentColor,
                }}
              >
                {event.series}
              </span>
            </span>
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 8,
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              {event.edition}
            </span>
          </div>

          {/* Title */}
          <h3
            className="timeline-card-title"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: isNext ? 20 : 17,
              fontWeight: 700,
              letterSpacing: "-0.3px",
              color: "white",
              lineHeight: 1.25,
              margin: "0 0 clamp(12px, 1.5vw, 16px)",
            }}
          >
            {event.title}
          </h3>

          {/* Details */}
          <div className="flex flex-col gap-1.5" style={{ marginBottom: "clamp(14px, 2vw, 20px)" }}>
            <div className="flex items-center gap-2">
              <MapPinIcon />
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {event.location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon />
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {event.attendees} Delegates
              </span>
            </div>
          </div>

          {/* CTA */}
          <div
            className="timeline-card-cta flex items-center justify-between"
            style={{
              padding: "12px 16px",
              background: isHovered ? accentColor : "rgba(255,255,255,0.04)",
              borderRadius: 10,
              transition: "all 0.3s ease",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 12,
                fontWeight: 500,
                color: isHovered ? "#0A0A0A" : "rgba(255,255,255,0.7)",
                transition: "color 0.3s ease",
              }}
            >
              {event.status === "open" ? "Register" : "Details"}
            </span>
            <span
              style={{
                color: isHovered ? "#0A0A0A" : "rgba(255,255,255,0.5)",
                transition: "color 0.3s ease",
                fontSize: 14,
              }}
            >
              →
            </span>
          </div>
        </div>
      </motion.a>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════

function PulsingDot({ color }: { color: string }) {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
        style={{ background: color, animationDuration: "2s" }}
      />
      <span
        className="relative inline-flex rounded-full h-1.5 w-1.5"
        style={{ background: color }}
      />
    </span>
  );
}

function MapPinIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
