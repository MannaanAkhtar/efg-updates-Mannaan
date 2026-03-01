"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { createClient } from "@/lib/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/profile")
      router.refresh()
    }
  }

  return (
    <div className="auth-card">
      {/* Logo/Brand */}
      <div className="auth-brand">
        <Link href="/">
          <span className="brand-text">EFG</span>
        </Link>
        <span className="brand-divider" />
        <span className="brand-sub">Networking</span>
      </div>

      <h1>Welcome back</h1>
      <p className="auth-subtitle">
        Sign in to access your networking dashboard
      </p>

      <form onSubmit={handleLogin}>
        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ahmed@company.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="auth-footer">
        Don&apos;t have an account? <Link href="/signup">Create one</Link>
      </p>

      <style jsx>{`
        .auth-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 48px 40px;
        }
        
        .auth-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 32px;
        }
        
        .brand-text {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 800;
          color: white;
          letter-spacing: -1px;
        }
        
        .brand-divider {
          width: 1px;
          height: 20px;
          background: rgba(255, 255, 255, 0.2);
        }
        
        .brand-sub {
          font-family: var(--font-outfit);
          font-size: 14px;
          font-weight: 500;
          color: var(--orange);
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        
        h1 {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          color: white;
          text-align: center;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
        }
        
        .auth-subtitle {
          font-family: var(--font-outfit);
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
          margin: 0 0 32px;
        }
        
        .auth-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-family: var(--font-outfit);
          font-size: 13px;
          color: #ef4444;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          font-family: var(--font-outfit);
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }
        
        .form-group input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          font-family: var(--font-outfit);
          font-size: 15px;
          color: white;
          outline: none;
          transition: all 0.2s ease;
        }
        
        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        
        .form-group input:focus {
          border-color: var(--orange);
          background: rgba(232, 101, 26, 0.05);
        }
        
        .auth-button {
          width: 100%;
          padding: 16px;
          background: var(--orange);
          border: none;
          border-radius: 12px;
          font-family: var(--font-outfit);
          font-size: 15px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 8px;
        }
        
        .auth-button:hover:not(:disabled) {
          background: #ff7a2e;
          transform: translateY(-1px);
        }
        
        .auth-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .auth-footer {
          text-align: center;
          margin-top: 24px;
          font-family: var(--font-outfit);
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
        }
        
        .auth-footer :global(a) {
          color: var(--orange);
          text-decoration: none;
          font-weight: 500;
        }
        
        .auth-footer :global(a:hover) {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
