"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Industry = { id: string; name: string; slug: string }
type Interest = { id: string; name: string; slug: string }

const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" },
]

const ROLE_TYPES = [
  { value: "attendee", label: "Attendee / Professional" },
  { value: "sponsor_rep", label: "Sponsor Representative" },
  { value: "speaker", label: "Speaker" },
]

const LOOKING_FOR_OPTIONS = [
  "Technology Partners",
  "Solution Vendors",
  "Investment Opportunities",
  "Talent / Hiring",
  "Clients / Sales",
  "Knowledge Sharing",
  "Government Connections",
]

export default function CompleteProfilePage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [industries, setIndustries] = useState<Industry[]>([])
  const [interests, setInterests] = useState<Interest[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    industry_id: "",
    company_size: "",
    role_type: "attendee",
    phone: "",
    linkedin_url: "",
    bio: "",
    interests: [] as string[],
    looking_for: [] as string[],
    open_to_sponsors: true,
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUserId(user.id)

      // Fetch industries and interests
      const [industriesRes, interestsRes] = await Promise.all([
        supabase.from("industries").select("*").order("name"),
        supabase.from("interests").select("*").order("name"),
      ])

      if (industriesRes.data) setIndustries(industriesRes.data)
      if (interestsRes.data) setInterests(interestsRes.data)
      
      setLoading(false)
    }
    init()
  }, [supabase, router])

  const updateForm = (field: string, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: "interests" | "looking_for", value: string) => {
    setFormData(prev => {
      const arr = prev[field]
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter(v => v !== value) }
      } else {
        return { ...prev, [field]: [...arr, value] }
      }
    })
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)

    const { error } = await supabase
      .from("profiles")
      .update({
        title: formData.title,
        company: formData.company,
        industry_id: formData.industry_id || null,
        company_size: formData.company_size || null,
        role_type: formData.role_type,
        phone: formData.phone || null,
        linkedin_url: formData.linkedin_url || null,
        bio: formData.bio || null,
        interests: formData.interests,
        looking_for: formData.looking_for,
        open_to_sponsors: formData.open_to_sponsors,
        profile_completed: true,
      })
      .eq("user_id", userId)

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    // Redirect to dashboard/events
    router.push("/portal")
  }

  if (loading) {
    return (
      <div className="auth-card loading">
        <div className="spinner" />
        <p>Loading...</p>
        <style jsx>{`
          .auth-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            padding: 48px 40px;
            text-align: center;
          }
          .loading p {
            color: rgba(255, 255, 255, 0.5);
            font-family: var(--font-outfit);
            margin-top: 16px;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top-color: var(--orange);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="auth-card wide">
      {/* Header */}
      <div className="auth-brand">
        <Link href="/">
          <span className="brand-text">EFG</span>
        </Link>
        <span className="brand-divider" />
        <span className="brand-sub">Networking</span>
      </div>

      <h1>Complete Your Profile</h1>
      <p className="auth-subtitle">
        Step {step} of 3, {step === 1 ? "Professional Info" : step === 2 ? "Contact & Role" : "Interests"}
      </p>

      {/* Progress */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
      </div>

      {error && <div className="auth-error">{error}</div>}

      {/* Step 1: Professional Info */}
      {step === 1 && (
        <div className="step-content">
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateForm("title", e.target.value)}
              placeholder="e.g. Chief Information Security Officer"
              required
            />
          </div>

          <div className="form-group">
            <label>Company *</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => updateForm("company", e.target.value)}
              placeholder="e.g. National Bank of Kuwait"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Industry *</label>
              <select
                value={formData.industry_id}
                onChange={(e) => updateForm("industry_id", e.target.value)}
                required
              >
                <option value="">Select industry</option>
                {industries.map(ind => (
                  <option key={ind.id} value={ind.id}>{ind.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Company Size</label>
              <select
                value={formData.company_size}
                onChange={(e) => updateForm("company_size", e.target.value)}
              >
                <option value="">Select size</option>
                {COMPANY_SIZES.map(size => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Short Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => updateForm("bio", e.target.value)}
              placeholder="Tell us about yourself and what you do..."
              rows={3}
            />
          </div>

          <button 
            className="auth-button"
            onClick={() => setStep(2)}
            disabled={!formData.title || !formData.company || !formData.industry_id}
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Role & Contact */}
      {step === 2 && (
        <div className="step-content">
          <div className="form-group">
            <label>I am joining as *</label>
            <div className="radio-group">
              {ROLE_TYPES.map(role => (
                <label key={role.value} className={`radio-card ${formData.role_type === role.value ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="role_type"
                    value={role.value}
                    checked={formData.role_type === role.value}
                    onChange={(e) => updateForm("role_type", e.target.value)}
                  />
                  <span>{role.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateForm("phone", e.target.value)}
              placeholder="+971 50 123 4567"
            />
          </div>

          <div className="form-group">
            <label>LinkedIn Profile</label>
            <input
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => updateForm("linkedin_url", e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.open_to_sponsors}
                onChange={(e) => updateForm("open_to_sponsors", e.target.checked)}
              />
              <span>I'm open to being contacted by event sponsors</span>
            </label>
          </div>

          <div className="button-row">
            <button className="auth-button secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="auth-button" onClick={() => setStep(3)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Interests */}
      {step === 3 && (
        <div className="step-content">
          <div className="form-group">
            <label>Topics I'm interested in</label>
            <p className="input-hint">Select all that apply</p>
            <div className="tag-grid">
              {interests.map(interest => (
                <button
                  key={interest.id}
                  type="button"
                  className={`tag ${formData.interests.includes(interest.id) ? "selected" : ""}`}
                  onClick={() => toggleArrayItem("interests", interest.id)}
                >
                  {interest.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>I'm looking for</label>
            <p className="input-hint">What do you hope to get from EFG events?</p>
            <div className="tag-grid">
              {LOOKING_FOR_OPTIONS.map(option => (
                <button
                  key={option}
                  type="button"
                  className={`tag ${formData.looking_for.includes(option) ? "selected" : ""}`}
                  onClick={() => toggleArrayItem("looking_for", option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="button-row">
            <button className="auth-button secondary" onClick={() => setStep(2)}>
              Back
            </button>
            <button 
              className="auth-button" 
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Saving..." : "Complete Profile"}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .auth-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 48px 40px;
        }
        
        .auth-card.wide {
          max-width: 560px;
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
        }
        
        .auth-subtitle {
          font-family: var(--font-outfit);
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
          margin: 0 0 24px;
        }
        
        .progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          margin-bottom: 32px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: var(--orange);
          border-radius: 2px;
          transition: width 0.3s ease;
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
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        .form-group label {
          display: block;
          font-family: var(--font-outfit);
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
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
        
        .form-group select {
          cursor: pointer;
        }
        
        .form-group select option {
          background: #1a1a1a;
          color: white;
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }
        
        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: var(--orange);
          background: rgba(232, 101, 26, 0.05);
        }
        
        .input-hint {
          font-family: var(--font-outfit);
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          margin: 4px 0 12px;
        }
        
        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .radio-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .radio-card:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .radio-card.selected {
          border-color: var(--orange);
          background: rgba(232, 101, 26, 0.1);
        }
        
        .radio-card input {
          display: none;
        }
        
        .radio-card span {
          font-family: var(--font-outfit);
          font-size: 14px;
          color: white;
        }
        
        .checkbox-label {
          display: flex !important;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        
        .checkbox-label input {
          width: 18px;
          height: 18px;
          accent-color: var(--orange);
        }
        
        .checkbox-label span {
          font-family: var(--font-outfit);
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .tag-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .tag {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          font-family: var(--font-outfit);
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .tag:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        
        .tag.selected {
          background: rgba(232, 101, 26, 0.2);
          border-color: var(--orange);
          color: var(--orange);
        }
        
        .button-row {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        
        .auth-button {
          flex: 1;
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
        }
        
        .auth-button:hover:not(:disabled) {
          background: #ff7a2e;
          transform: translateY(-1px);
        }
        
        .auth-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .auth-button.secondary {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .auth-button.secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
        }
        
        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
