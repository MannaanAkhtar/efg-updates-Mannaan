"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const ORANGE = "#E8651A";
const BG = "#0A0A0A";
const BG_CARD = "#141414";
const TEXT = "#FFFFFF";
const TEXT_DIM = "#A0A0A0";

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRATION PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function BoardroomRegisterPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    jobTitle: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/boardroom/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: roomId,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: SUCCESS
  // ─────────────────────────────────────────────────────────────────────────

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✓</div>
          <h1 style={styles.title}>You&apos;re Registered!</h1>
          <p style={{ color: TEXT_DIM, marginBottom: 24 }}>
            Check your email for the join link. You&apos;ll receive a reminder before
            the session starts.
          </p>
          <Link href="/" style={styles.button}>
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: FORM
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>EFG</div>
        <h1 style={styles.title}>Register for Boardroom</h1>
        <p style={{ color: TEXT_DIM, marginBottom: 32 }}>
          Complete your registration to receive your personal join link
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Work Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Job Title</label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Now"}
          </button>
        </form>

        <p style={{ color: TEXT_DIM, fontSize: 12, marginTop: 24 }}>
          By registering, you agree to our{" "}
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
    maxWidth: 480,
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
  formGroup: {
    marginBottom: 16,
    textAlign: "left" as const,
  },
  label: {
    display: "block",
    color: TEXT_DIM,
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: 15,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: TEXT,
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
    marginTop: 8,
  },
  error: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#ef4444",
    padding: "12px 16px",
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "rgba(34, 197, 94, 0.1)",
    border: "2px solid #22c55e",
    color: "#22c55e",
    fontSize: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
  },
};
