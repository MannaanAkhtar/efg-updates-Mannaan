import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Executive Roundtable Riyadh — Empowering Saudi Public Sector Through Agentic AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BLACKSTONE_LOGO =
  "https://efg-final.s3.eu-north-1.amazonaws.com/logos/BlackstoneeIT_logolight.png";
const OUTSYSTEMS_LOGO =
  "https://efg-final.s3.eu-north-1.amazonaws.com/logos/outsystems.png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #0B1F3B 0%, #08152a 45%, #050d1c 75%, #0A0A0A 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -200,
            left: -150,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,194,255,0.35) 0%, rgba(0,194,255,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(20,93,160,0.35) 0%, rgba(20,93,160,0) 70%)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            zIndex: 1,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BLACKSTONE_LOGO}
            alt="Blackstone eIT"
            width={260}
            style={{ height: 64, width: "auto", objectFit: "contain" }}
          />
          <div
            style={{
              width: 1,
              height: 44,
              background: "rgba(255,255,255,0.25)",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              display: "flex",
            }}
          >
            With OutSystems
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={OUTSYSTEMS_LOGO}
            alt="OutSystems"
            width={180}
            style={{ height: 44, width: "auto", objectFit: "contain" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#00C2FF",
            }}
          >
            <div
              style={{
                width: 36,
                height: 1,
                background: "#00C2FF",
                display: "flex",
              }}
            />
            Executive Roundtable · Riyadh
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 980,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <span>Empowering Saudi Public Sector through&nbsp;</span>
            <span
              style={{
                background:
                  "linear-gradient(90deg, #00C2FF 0%, #4DA3FF 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Agentic AI.
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            zIndex: 1,
            borderTop: "1px solid rgba(0,194,255,0.25)",
            paddingTop: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 14,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                display: "flex",
              }}
            >
              Date
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, display: "flex" }}>
              10 June 2026
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 14,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                display: "flex",
              }}
            >
              Venue
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, display: "flex" }}>
              Fairmont Riyadh
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                fontSize: 14,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                display: "flex",
              }}
            >
              Format
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, display: "flex" }}>
              Invitation only
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
