"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import DailyIframe from "@daily-co/daily-js";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type JoinState = "loading" | "prejoin" | "joining" | "joined" | "left" | "error";

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const ORANGE = "#E8651A";
const BG = "#0A0A0A";
const BG_CARD = "#141414";
const TEXT = "#FFFFFF";
const TEXT_DIM = "#A0A0A0";

// ═══════════════════════════════════════════════════════════════════════════
// BOARDROOM PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function BoardroomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const tokenFromUrl = searchParams.get("token");

  const [joinState, setJoinState] = useState<JoinState>("loading");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);

  const callRef = useRef<ReturnType<typeof DailyIframe.createFrame> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // LOAD ROOM INFO
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const res = await fetch(`/api/boardroom?room=${roomId}`);
        if (!res.ok) {
          setError("This boardroom does not exist or has expired.");
          setJoinState("error");
          return;
        }
        const data = await res.json();
        setRoomUrl(data.url);
        setJoinState("prejoin");
      } catch {
        setError("Failed to load boardroom.");
        setJoinState("error");
      }
    };
    loadRoom();
  }, [roomId]);

  // ─────────────────────────────────────────────────────────────────────────
  // JOIN CALL
  // ─────────────────────────────────────────────────────────────────────────

  const joinCall = useCallback(async () => {
    if (!roomUrl || !userName.trim()) return;

    setJoinState("joining");

    try {
      // Get meeting token
      const tokenRes = await fetch("/api/boardroom/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: roomId,
          userName: userName.trim(),
          isOwner: false,
        }),
      });

      if (!tokenRes.ok) {
        throw new Error("Failed to get meeting token");
      }

      const { token } = await tokenRes.json();

      // Create Daily iframe
      if (containerRef.current) {
        callRef.current = DailyIframe.createFrame(containerRef.current, {
          iframeStyle: {
            width: "100%",
            height: "100%",
            border: "0",
            borderRadius: "12px",
          },
          showLeaveButton: true,
          showFullscreenButton: true,
        });

        callRef.current.on("joined-meeting", () => {
          setJoinState("joined");
        });

        callRef.current.on("left-meeting", () => {
          setJoinState("left");
          callRef.current?.destroy();
        });

        callRef.current.on("error", (e) => {
          console.error("Daily error:", e);
          setError("Connection error. Please try again.");
          setJoinState("error");
        });

        await callRef.current.join({
          url: roomUrl,
          token,
        });
      }
    } catch (err) {
      console.error("Join error:", err);
      setError("Failed to join the boardroom.");
      setJoinState("error");
    }
  }, [roomUrl, userName, roomId]);

  // ─────────────────────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (callRef.current) {
        callRef.current.destroy();
      }
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: LOADING
  // ─────────────────────────────────────────────────────────────────────────

  if (joinState === "loading") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.spinner} />
          <p style={{ color: TEXT_DIM }}>Loading boardroom...</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: ERROR
  // ─────────────────────────────────────────────────────────────────────────

  if (joinState === "error") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Unable to Join</h1>
          <p style={{ color: TEXT_DIM, marginBottom: 24 }}>{error}</p>
          <Link href="/" style={styles.button}>
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: LEFT MEETING
  // ─────────────────────────────────────────────────────────────────────────

  if (joinState === "left") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Thanks for joining!</h1>
          <p style={{ color: TEXT_DIM, marginBottom: 24 }}>
            You have left the boardroom.
          </p>
          <Link href="/" style={styles.button}>
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: PRE-JOIN
  // ─────────────────────────────────────────────────────────────────────────

  if (joinState === "prejoin") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logo}>EFG</div>
          <h1 style={styles.title}>Virtual Boardroom</h1>
          <p style={{ color: TEXT_DIM, marginBottom: 32 }}>
            Enter your name to join the session
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              joinCall();
            }}
          >
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={styles.input}
              autoFocus
              required
            />

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: userName.trim() ? 1 : 0.5,
                cursor: userName.trim() ? "pointer" : "not-allowed",
              }}
              disabled={!userName.trim()}
            >
              Join Boardroom
            </button>
          </form>

          <p style={{ color: TEXT_DIM, fontSize: 12, marginTop: 24 }}>
            By joining, you agree to our{" "}
            <Link href="/terms" style={{ color: ORANGE }}>
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" style={{ color: ORANGE }}>
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: JOINING / JOINED (VIDEO CALL)
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={styles.videoContainer}>
      {joinState === "joining" && (
        <div style={styles.joiningOverlay}>
          <div style={styles.spinner} />
          <p style={{ color: TEXT }}>Joining boardroom...</p>
        </div>
      )}
      <div ref={containerRef} style={styles.videoFrame} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: BG,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    background: BG_CARD,
    borderRadius: 16,
    padding: 48,
    maxWidth: 420,
    width: "100%",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  logo: {
    fontSize: 32,
    fontWeight: 800,
    color: ORANGE,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: TEXT,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 16,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: TEXT,
    marginBottom: 16,
    outline: "none",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "14px 24px",
    fontSize: 16,
    fontWeight: 600,
    background: ORANGE,
    color: TEXT,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "center" as const,
  },
  videoContainer: {
    position: "fixed" as const,
    inset: 0,
    background: BG,
  },
  videoFrame: {
    width: "100%",
    height: "100%",
  },
  joiningOverlay: {
    position: "absolute" as const,
    inset: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  spinner: {
    width: 40,
    height: 40,
    border: `3px solid ${TEXT_DIM}`,
    borderTopColor: ORANGE,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: 16,
  },
};
