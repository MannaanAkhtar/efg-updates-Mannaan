"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Industry = { id: string; name: string }
type Interest = { id: string; name: string }

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

type Profile = {
  id: string
  email: string
  full_name: string
  title: string | null
  company: string | null
  industry_id: string | null
  company_size: string | null
  role_type: string
  phone: string | null
  linkedin_url: string | null
  bio: string | null
  interests: string[]
  looking_for: string[]
  open_to_sponsors: boolean
  profile_completed: boolean
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Partial<Profile>>({})
  const [industries, setIndustries] = useState<Industry[]>([])
  const [interests, setInterests] = useState<Interest[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }
      
      setUser(user)
      
      // Load industries and interests
      const [industriesRes, interestsRes, profileRes] = await Promise.all([
        supabase.from("industries").select("*").order("name"),
        supabase.from("interests").select("*").order("name"),
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      ])

      if (industriesRes.data) setIndustries(industriesRes.data)
      if (interestsRes.data) setInterests(interestsRes.data)
      if (profileRes.data) setProfile(profileRes.data)
      
      setLoading(false)
    }
    
    loadProfile()
  }, [supabase, router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        title: profile.title,
        company: profile.company,
        industry_id: profile.industry_id || null,
        company_size: profile.company_size || null,
        role_type: profile.role_type || "attendee",
        phone: profile.phone || null,
        linkedin_url: profile.linkedin_url || null,
        bio: profile.bio || null,
        interests: profile.interests || [],
        looking_for: profile.looking_for || [],
        open_to_sponsors: profile.open_to_sponsors ?? true,
        profile_completed: true,
      })
      .eq("user_id", user.id)

    if (error) {
      setError(error.message)
      setSaving(false)
    } else {
      // Redirect to portal after saving
      router.push("/portal")
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const toggleInterest = (interestId: string) => {
    const current = profile.interests || []
    const updated = current.includes(interestId)
      ? current.filter(i => i !== interestId)
      : [...current, interestId]
    setProfile({ ...profile, interests: updated })
  }

  const toggleLookingFor = (item: string) => {
    const current = profile.looking_for || []
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item]
    setProfile({ ...profile, looking_for: updated })
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner" />
        <p>Loading profile...</p>
        <style jsx>{`
          .profile-loading {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #0A0A0A;
            gap: 16px;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.1);
            border-top-color: var(--orange);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          p {
            font-family: var(--font-outfit);
            color: rgba(255,255,255,0.5);
            font-size: 14px;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-gradient-mesh" />
      <div className="profile-noise" />
      
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="header-left">
            <Link href="/" className="back-link">← Back to site</Link>
            <h1>Your Profile</h1>
            <p>Complete your profile to unlock networking features</p>
          </div>
          <button onClick={handleSignOut} className="signout-btn">Sign Out</button>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave}>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">Profile saved successfully!</div>}

          {/* Basic Info Section */}
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={profile.full_name || ""}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="Ahmed Al-Rashid"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  value={profile.title || ""}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  placeholder="Chief Information Security Officer"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Company *</label>
                <input
                  type="text"
                  value={profile.company || ""}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  placeholder="Kuwait Finance House"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Industry *</label>
                <select
                  value={profile.industry_id || ""}
                  onChange={(e) => setProfile({ ...profile, industry_id: e.target.value })}
                  required
                >
                  <option value="">Select industry...</option>
                  {industries.map((ind) => (
                    <option key={ind.id} value={ind.id}>{ind.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>I am joining as *</label>
                <select
                  value={profile.role_type || "attendee"}
                  onChange={(e) => setProfile({ ...profile, role_type: e.target.value })}
                  required
                >
                  {ROLE_TYPES.map((role) => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Company Size</label>
                <select
                  value={profile.company_size || ""}
                  onChange={(e) => setProfile({ ...profile, company_size: e.target.value })}
                >
                  <option value="">Select company size...</option>
                  {COMPANY_SIZES.map((size) => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="form-section">
            <h2>Contact Information</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profile.email || ""}
                  disabled
                  className="disabled"
                />
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+971 50 123 4567"
                />
              </div>
              
              <div className="form-group full-width">
                <label>LinkedIn URL</label>
                <input
                  type="url"
                  value={profile.linkedin_url || ""}
                  onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="form-section">
            <h2>About You</h2>
            
            <div className="form-group">
              <label>Short Bio</label>
              <textarea
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell others about your experience and what you're working on..."
                rows={4}
                maxLength={500}
              />
              <span className="char-count">{(profile.bio || "").length}/500</span>
            </div>
          </div>

          {/* Interests Section */}
          <div className="form-section">
            <h2>Your Interests</h2>
            <p className="section-subtitle">Select topics you want to discuss at events</p>
            
            <div className="chips-grid">
              {interests.map((interest) => (
                <button
                  key={interest.id}
                  type="button"
                  className={`chip ${(profile.interests || []).includes(interest.id) ? 'active' : ''}`}
                  onClick={() => toggleInterest(interest.id)}
                >
                  {interest.name}
                </button>
              ))}
            </div>
          </div>

          {/* Looking For Section */}
          <div className="form-section">
            <h2>What are you looking for?</h2>
            <p className="section-subtitle">Help us match you with the right people</p>
            
            <div className="chips-grid">
              {LOOKING_FOR_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`chip ${(profile.looking_for || []).includes(item) ? 'active' : ''}`}
                  onClick={() => toggleLookingFor(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Section */}
          <div className="form-section">
            <h2>Privacy Settings</h2>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={profile.open_to_sponsors ?? true}
                onChange={(e) => setProfile({ ...profile, open_to_sponsors: e.target.checked })}
              />
              <span className="checkbox-text">
                <strong>Allow sponsors to contact me</strong>
                <span>Sponsors can see your profile and request meetings</span>
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button type="submit" disabled={saving} className="save-btn">
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          background: #0A0A0A;
          position: relative;
          padding: 40px 20px 80px;
        }
        
        .profile-gradient-mesh {
          position: fixed;
          inset: -50%;
          background: 
            radial-gradient(ellipse 60% 40% at 20% 20%, rgba(232, 101, 26, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 50% 50% at 80% 80%, rgba(124, 58, 237, 0.08) 0%, transparent 50%);
          filter: blur(80px);
          pointer-events: none;
        }
        
        .profile-noise {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.02;
          pointer-events: none;
        }
        
        .profile-container {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .back-link {
          display: inline-block;
          font-family: var(--font-outfit);
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          margin-bottom: 8px;
        }
        
        .back-link:hover {
          color: var(--orange);
        }
        
        .profile-header h1 {
          font-family: var(--font-display);
          font-size: clamp(28px, 5vw, 36px);
          font-weight: 800;
          color: white;
          margin: 0 0 8px;
          letter-spacing: -1px;
        }
        
        .profile-header p {
          font-family: var(--font-outfit);
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          margin: 0;
        }
        
        .signout-btn {
          padding: 10px 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          font-family: var(--font-outfit);
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .signout-btn:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        
        .form-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 24px;
          font-family: var(--font-outfit);
          font-size: 14px;
          color: #ef4444;
        }
        
        .form-success {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 24px;
          font-family: var(--font-outfit);
          font-size: 14px;
          color: #22c55e;
        }
        
        .form-section {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 24px;
        }
        
        .form-section h2 {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin: 0 0 20px;
          letter-spacing: -0.5px;
        }
        
        .section-subtitle {
          font-family: var(--font-outfit);
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          margin: -12px 0 20px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        
        .form-group label {
          font-family: var(--font-outfit);
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          font-family: var(--font-outfit);
          font-size: 14px;
          color: white;
          outline: none;
          transition: all 0.2s ease;
        }
        
        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: var(--orange);
          background: rgba(232, 101, 26, 0.05);
        }
        
        .form-group input.disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
          min-height: 100px;
        }
        
        .char-count {
          font-family: var(--font-outfit);
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          text-align: right;
          margin-top: 6px;
        }
        
        .chips-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .chip {
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 50px;
          font-family: var(--font-outfit);
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .chip:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.12);
        }
        
        .chip.active {
          background: rgba(232, 101, 26, 0.15);
          border-color: rgba(232, 101, 26, 0.4);
          color: var(--orange);
        }
        
        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          cursor: pointer;
        }
        
        .checkbox-label input {
          width: 20px;
          height: 20px;
          margin-top: 2px;
          accent-color: var(--orange);
          cursor: pointer;
        }
        
        .checkbox-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .checkbox-text strong {
          font-family: var(--font-outfit);
          font-size: 14px;
          font-weight: 500;
          color: white;
        }
        
        .checkbox-text span {
          font-family: var(--font-outfit);
          font-size: 13px;
          color: rgba(255,255,255,0.4);
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 32px;
        }
        
        .save-btn {
          padding: 16px 40px;
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
        
        .save-btn:hover:not(:disabled) {
          background: #ff7a2e;
          transform: translateY(-1px);
        }
        
        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
