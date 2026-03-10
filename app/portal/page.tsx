"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Profile = {
  id: string
  full_name: string
  title: string
  company: string
  photo_url: string | null
  profile_completed: boolean
  is_admin: boolean
}

type Event = {
  id: string
  name: string
  slug: string
  series: string | null
  date: string
  location: string
  venue: string | null
  description: string | null
  banner_url: string | null
  registration_open: boolean
}

type Registration = {
  id: string
  event_id: string
  status: string
  registered_at: string
}

export default function PortalPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [submitting, setSubmitting] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (!profileData) {
        router.push("/complete-profile")
        return
      }

      if (!profileData.profile_completed) {
        router.push("/complete-profile")
        return
      }

      setProfile(profileData)

      // Fetch events
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("is_active", true)
        .order("date", { ascending: true })

      if (eventsData) setEvents(eventsData)

      // Fetch user's registrations
      const { data: regsData } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("profile_id", profileData.id)

      if (regsData) setRegistrations(regsData)

      setLoading(false)
    }
    init()
  }, [supabase, router])

  const getRegistrationStatus = (eventId: string) => {
    const reg = registrations.find(r => r.event_id === eventId)
    return reg?.status || null
  }

  const handleInterest = async (eventId: string) => {
    if (!profile) return
    setSubmitting(eventId)

    const { data, error } = await supabase
      .from("event_registrations")
      .insert({
        event_id: eventId,
        profile_id: profile.id,
        status: "interested",
      })
      .select()
      .single()

    if (!error && data) {
      setRegistrations([...registrations, data])
    }

    setSubmitting(null)
  }

  const handleConfirm = async (eventId: string) => {
    if (!profile) return
    setSubmitting(eventId)

    const { error } = await supabase
      .from("event_registrations")
      .update({ status: "confirmed" })
      .eq("event_id", eventId)
      .eq("profile_id", profile.id)

    if (!error) {
      setRegistrations(prev => 
        prev.map(r => r.event_id === eventId ? { ...r, status: "confirmed" } : r)
      )
    }

    setSubmitting(null)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; text: string }> = {
      interested: { bg: "rgba(251, 191, 36, 0.1)", color: "#fbbf24", text: "Interest Submitted" },
      approved: { bg: "rgba(34, 197, 94, 0.1)", color: "#22c55e", text: "Approved - Confirm Attendance" },
      confirmed: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e", text: "Confirmed" },
      rejected: { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444", text: "Not Approved" },
      attended: { bg: "rgba(99, 102, 241, 0.1)", color: "#6366f1", text: "Attended" },
    }
    return styles[status] || styles.interested
  }

  if (loading) {
    return (
      <div className="portal-loading">
        <div className="spinner" />
        <style jsx>{`
          .portal-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0a0a0a;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top-color: var(--orange);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="portal">
      {/* Header */}
      <header className="portal-header">
        <div className="header-content">
          <Link href="/" className="logo">
            <span className="logo-text">EFG</span>
            <span className="logo-sub">Networking</span>
          </Link>
          
          <div className="user-menu">
            {profile?.is_admin && (
              <Link href="/admin" className="admin-link">Admin</Link>
            )}
            <span className="user-name">{profile?.full_name}</span>
            <Link href="/profile" className="avatar">
              {profile?.photo_url ? (
                <img src={profile.photo_url} alt="" />
              ) : (
                <span>{profile?.full_name?.charAt(0) || "?"}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="portal-main">
        <div className="container">
          {/* Welcome */}
          <section className="welcome">
            <h1>Welcome, {profile?.full_name?.split(" ")[0]}</h1>
            <p>{profile?.title} at {profile?.company}</p>
          </section>

          {/* Events */}
          <section className="events-section">
            <h2>Upcoming Events</h2>
            <p className="section-subtitle">Express your interest to attend our exclusive events</p>

            <div className="events-grid">
              {events.map(event => {
                const status = getRegistrationStatus(event.id)
                const badge = status ? getStatusBadge(status) : null

                return (
                  <div key={event.id} className="event-card">
                    {event.banner_url && (
                      <div className="event-banner">
                        <img src={event.banner_url} alt="" />
                      </div>
                    )}
                    
                    <div className="event-content">
                      {event.series && <span className="event-series">{event.series}</span>}
                      <h3>{event.name}</h3>
                      <p className="event-date">{formatDate(event.date)}</p>
                      <p className="event-location">{event.venue ? `${event.venue}, ` : ""}{event.location}</p>
                      
                      {event.description && (
                        <p className="event-description">{event.description}</p>
                      )}

                      {status === "approved" ? (
                        <button
                          className="confirm-button"
                          onClick={() => handleConfirm(event.id)}
                          disabled={submitting === event.id}
                        >
                          {submitting === event.id ? "Confirming..." : "✓ Confirm Attendance"}
                        </button>
                      ) : status ? (
                        <div 
                          className="status-badge"
                          style={{ background: badge?.bg, color: badge?.color }}
                        >
                          {badge?.text}
                        </div>
                      ) : event.registration_open ? (
                        <button
                          className="interest-button"
                          onClick={() => handleInterest(event.id)}
                          disabled={submitting === event.id}
                        >
                          {submitting === event.id ? "Submitting..." : "I'm Interested"}
                        </button>
                      ) : (
                        <div className="status-badge closed">Registration Closed</div>
                      )}
                    </div>
                  </div>
                )
              })}

              {events.length === 0 && (
                <div className="no-events">
                  <p>No upcoming events at the moment.</p>
                  <p>Check back soon!</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .portal {
          min-height: 100vh;
          background: #0a0a0a;
        }
        
        .portal-header {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        
        .logo-text {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 800;
          color: white;
        }
        
        .logo-sub {
          font-family: var(--font-outfit);
          font-size: 12px;
          color: var(--orange);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .user-menu {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .admin-link {
          padding: 8px 16px;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 8px;
          font-family: var(--font-outfit);
          font-size: 13px;
          font-weight: 600;
          color: #8b5cf6;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .admin-link:hover {
          background: rgba(139, 92, 246, 0.25);
        }
        
        .user-name {
          font-family: var(--font-outfit);
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(232, 101, 26, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          text-decoration: none;
        }
        
        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .avatar span {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 600;
          color: var(--orange);
        }
        
        .portal-main {
          padding: 48px 24px;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .welcome {
          margin-bottom: 48px;
        }
        
        .welcome h1 {
          font-family: var(--font-display);
          font-size: 36px;
          font-weight: 700;
          color: white;
          margin: 0 0 8px;
        }
        
        .welcome p {
          font-family: var(--font-outfit);
          font-size: 16px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }
        
        .events-section h2 {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin: 0 0 8px;
        }
        
        .section-subtitle {
          font-family: var(--font-outfit);
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0 0 32px;
        }
        
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
        }
        
        .event-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.2s ease;
        }
        
        .event-card:hover {
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        
        .event-banner {
          height: 160px;
          overflow: hidden;
        }
        
        .event-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .event-content {
          padding: 24px;
        }
        
        .event-series {
          display: inline-block;
          font-family: var(--font-outfit);
          font-size: 11px;
          font-weight: 600;
          color: var(--orange);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        
        .event-content h3 {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin: 0 0 12px;
        }
        
        .event-date {
          font-family: var(--font-outfit);
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 4px;
        }
        
        .event-location {
          font-family: var(--font-outfit);
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0 0 16px;
        }
        
        .event-description {
          font-family: var(--font-outfit);
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
          margin: 0 0 20px;
        }
        
        .interest-button {
          width: 100%;
          padding: 14px;
          background: var(--orange);
          border: none;
          border-radius: 12px;
          font-family: var(--font-outfit);
          font-size: 14px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .interest-button:hover:not(:disabled) {
          background: #ff7a2e;
        }
        
        .confirm-button {
          width: 100%;
          padding: 14px;
          background: rgba(34, 197, 94, 0.15);
          border: 2px solid #22c55e;
          border-radius: 12px;
          font-family: var(--font-outfit);
          font-size: 14px;
          font-weight: 600;
          color: #22c55e;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .confirm-button:hover:not(:disabled) {
          background: rgba(34, 197, 94, 0.25);
        }
        
        .confirm-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .interest-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .status-badge {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          font-family: var(--font-outfit);
          font-size: 13px;
          font-weight: 600;
          text-align: center;
        }
        
        .status-badge.closed {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.4);
        }
        
        .no-events {
          grid-column: 1 / -1;
          text-align: center;
          padding: 48px;
          color: rgba(255, 255, 255, 0.5);
          font-family: var(--font-outfit);
        }
        
        @media (max-width: 480px) {
          .events-grid {
            grid-template-columns: 1fr;
          }
          
          .welcome h1 {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  )
}
