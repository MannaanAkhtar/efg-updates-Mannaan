import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Earned, not automated — What happens to brand loyalty when AI becomes the decision-maker? | Braze x Talon.One";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LOCKUP_LOGO =
  "https://efg-final.s3.eu-north-1.amazonaws.com/logos/brazextalon1.png";

const CREAM = "#FFF7EE";
const INK = "#300266";
const B_PINK = "#FFA4FB";
const B_ORANGE = "#FFA524";
const B_RED = "#E9371F";

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
          background: `linear-gradient(168deg, #FFFFFF 0%, #FFFBF8 45%, #FFF0EC 100%)`,
          color: INK,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Soft pink bloom — lower-right */}
        <div
          style={{
            position: "absolute",
            bottom: -180,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${B_PINK}55 0%, ${B_PINK}00 70%)`,
            display: "flex",
          }}
        />
        {/* Orange wash — upper right */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -100,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${B_ORANGE}40 0%, ${B_ORANGE}00 70%)`,
            display: "flex",
          }}
        />
        {/* Lavender wash — center-left */}
        <div
          style={{
            position: "absolute",
            top: 100,
            left: -120,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: `radial-gradient(circle, #C9C4FF55 0%, #C9C4FF00 70%)`,
            display: "flex",
          }}
        />

        {/* Top heat-gradient rail */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 120,
            right: 120,
            height: 4,
            background: `linear-gradient(90deg, ${B_PINK} 0%, ${B_ORANGE} 50%, ${B_RED} 100%)`,
            display: "flex",
          }}
        />

        {/* HEADER — Webinar chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 20px",
              borderRadius: 50,
              border: "1px solid rgba(48,2,102,0.12)",
              background: "rgba(255,255,255,0.85)",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: INK,
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: B_RED,
                display: "flex",
              }}
            />
            Webinar
          </div>
        </div>

        {/* MIDDLE — Eyebrow + Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              color: B_RED,
              letterSpacing: 1,
            }}
          >
            Earned, not automated:
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 70,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: INK,
              maxWidth: 1040,
            }}
          >
            What happens to brand loyalty when AI becomes the decision-maker?
          </div>
        </div>

        {/* FOOTER — Lockup + meta */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            zIndex: 1,
            borderTop: "1px solid rgba(48,2,102,0.12)",
            paddingTop: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOCKUP_LOGO}
              alt="Braze x Talon.One"
              width={360}
              style={{ height: 80, width: "auto", objectFit: "contain" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 64,
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "rgba(48,2,102,0.5)",
                  display: "flex",
                }}
              >
                Format
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: INK,
                  display: "flex",
                }}
              >
                Virtual
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
                  color: "rgba(48,2,102,0.5)",
                  display: "flex",
                }}
              >
                Date
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: INK,
                  display: "flex",
                }}
              >
                18 June 2026
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
