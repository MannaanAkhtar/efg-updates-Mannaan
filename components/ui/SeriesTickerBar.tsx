"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface SeriesTickerBarProps {
  accentColor: string;
  eventName?: string;
  location?: string;
  targetDate?: Date;
  announcingText?: string;
  ctaText: string;
  ctaHref?: string;
  angularRadius?: boolean;
}

export default function SeriesTickerBar({
  accentColor,
  eventName,
  location,
  targetDate,
  announcingText,
  ctaText,
  ctaHref = "#register",
  angularRadius = false,
}: SeriesTickerBarProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [secondsPulse, setSecondsPulse] = useState(false);

  // Countdown logic
  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - Date.now();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(() => {
      calculateTimeLeft();
      setSecondsPulse(true);
      setTimeout(() => setSecondsPulse(false), 100);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const hasCountdown = !!targetDate;
  const borderRadius = angularRadius ? 6 : 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1 }}
      className="absolute bottom-0 left-0 right-0 z-20"
      style={{
        background: "rgba(10, 10, 10, 0.8)",
        borderTop: `1px solid ${accentColor}14`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        padding: "14px 0",
      }}
    >
      <div
        className="ticker-content flex items-center justify-between"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 40px",
        }}
      >
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Pulsing Dot */}
          <div className="relative flex items-center justify-center">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: accentColor,
              }}
            />
            <span
              className="absolute animate-ping"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: accentColor,
                opacity: 0.5,
              }}
            />
          </div>

          {/* Label */}
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "#505050",
            }}
          >
            {hasCountdown ? "NEXT UP" : "NEXT EDITION"}
          </span>

          {/* Separator */}
          <span
            style={{
              width: 1,
              height: 16,
              background: "rgba(255, 255, 255, 0.08)",
            }}
          />

          {/* Event Name or Announcing Text */}
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 14,
              fontWeight: 700,
              color: "var(--white)",
            }}
          >
            {eventName || announcingText || "Announcing Soon"}
          </span>

          {/* Location */}
          {location && (
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 400,
                color: "#606060",
              }}
            >
              · {location}
            </span>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          {/* Countdown or Get Notified */}
          {hasCountdown ? (
            <div className="flex items-center gap-1">
              <CountdownUnit
                value={timeLeft.days}
                unit="D"
                accentColor={accentColor}
              />
              <span style={{ color: "#303030", fontWeight: 600 }}>:</span>
              <CountdownUnit
                value={timeLeft.hours}
                unit="H"
                accentColor={accentColor}
              />
              <span style={{ color: "#303030", fontWeight: 600 }}>:</span>
              <CountdownUnit
                value={timeLeft.minutes}
                unit="M"
                accentColor={accentColor}
              />
              <span style={{ color: "#303030", fontWeight: 600 }}>:</span>
              <CountdownUnit
                value={timeLeft.seconds}
                unit="S"
                accentColor={accentColor}
                pulse={secondsPulse}
              />
            </div>
          ) : null}

          {/* CTA Button */}
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-1.5 transition-all"
            style={{
              padding: hasCountdown ? "0" : "8px 20px",
              borderRadius: hasCountdown ? 0 : borderRadius,
              background: hasCountdown
                ? "transparent"
                : isHovered
                  ? `${accentColor}40`
                  : `${accentColor}25`,
              border: hasCountdown ? "none" : `1px solid ${accentColor}40`,
              fontFamily: "var(--font-outfit)",
              fontSize: hasCountdown ? 13 : 12,
              fontWeight: 600,
              color: isHovered ? (hasCountdown ? "#33CCFF" : "white") : accentColor,
              transitionDuration: "0.3s",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span>{ctaText}</span>
            <span
              className="transition-transform"
              style={{
                transform: isHovered ? "translateX(4px)" : "translateX(0)",
                transitionDuration: "0.3s",
              }}
            >
              →
            </span>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .ticker-content {
            flex-direction: column !important;
            gap: 12px !important;
            padding: 0 20px !important;
          }
        }
      `}</style>
    </motion.div>
  );
}

/**
 * CountdownUnit — Single countdown unit (days, hours, minutes, seconds)
 */
function CountdownUnit({
  value,
  unit,
  accentColor,
  pulse = false,
}: {
  value: number;
  unit: string;
  accentColor: string;
  pulse?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-0.5">
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          fontWeight: 800,
          color: accentColor,
          transform: pulse ? "scaleY(1.02)" : "scaleY(1)",
          transition: "transform 0.1s ease-out",
          display: "inline-block",
        }}
      >
        {value.toString().padStart(2, "0")}
      </span>
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 9,
          fontWeight: 600,
          color: "#404040",
          textTransform: "uppercase",
        }}
      >
        {unit}
      </span>
    </div>
  );
}
