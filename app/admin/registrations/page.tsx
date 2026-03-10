// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

type Event = { id: string; name: string }
type Registration = {
  id: string
  event_id: string
  status: string
  registered_at: string
  events: Event
  profiles: {
    id: string
    full_name: string
    email: string
    title: string | null
    company: string | null
    role_type: string
    linkedin_url: string | null
    bio: string | null
  }
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("interested")
  const [processing, setProcessing] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    loadRegistrations()
  }, [selectedEvent, selectedStatus])

  const loadEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("id, name")
      .eq("is_active", true)
      .order("date")
    if (data) setEvents(data)
  }

  const loadRegistrations = async () => {
    setLoading(true)
    let query = supabase
      .from("event_registrations")
      .select(`*, events(id, name), profiles(id, full_name, email, title, company, role_type, linkedin_url, bio)`)
      .order("registered_at", { ascending: false })

    if (selectedEvent !== "all") query = query.eq("event_id", selectedEvent)
    if (selectedStatus !== "all") query = query.eq("status", selectedStatus)

    const { data } = await query
    if (data) setRegistrations(data as Registration[])
    setLoading(false)
  }

  const handleAction = async (regId: string, action: "approved" | "rejected") => {
    setProcessing(regId)
    await supabase
      .from("event_registrations")
      .update({ status: action, reviewed_at: new Date().toISOString() })
      .eq("id", regId)
    setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: action } : r))
    setProcessing(null)
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  const statusColors: Record<string, { bg: string; color: string }> = {
    interested: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
    approved: { bg: "rgba(34,197,94,0.15)", color: "#22c55e" },
    rejected: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
    confirmed: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6" },
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Registrations</h1>
          <p>Review and manage event registration requests</p>
        </div>
        <div className="filters">
          <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}>
            <option value="all">All Events</option>
            {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="interested">Pending</option>
            <option value="approved">Approved</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </header>

      <div className="stats-row">
        <div className="mini-stat">
          <span className="count">{registrations.filter(r => r.status === "interested").length}</span>
          <span className="label">Pending</span>
        </div>
        <div className="mini-stat">
          <span className="count">{registrations.filter(r => r.status === "approved").length}</span>
          <span className="label">Approved</span>
        </div>
        <div className="mini-stat">
          <span className="count">{registrations.filter(r => r.status === "confirmed").length}</span>
          <span className="label">Confirmed</span>
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : registrations.length === 0 ? (
        <p className="empty">No registrations found</p>
      ) : (
        <div className="registrations">
          {registrations.map(reg => (
            <div key={reg.id} className="reg-card">
              <div className="reg-header">
                <div className="applicant">
                  <div className="avatar">{reg.profiles.full_name?.charAt(0)}</div>
                  <div>
                    <h3>{reg.profiles.full_name}</h3>
                    <p>{reg.profiles.title} {reg.profiles.company ? `at ${reg.profiles.company}` : ""}</p>
                  </div>
                </div>
                <span className="badge" style={statusColors[reg.status]}>{reg.status}</span>
              </div>
              
              <div className="details">
                <div><span className="label">Event</span><span>{reg.events.name}</span></div>
                <div><span className="label">Email</span><span>{reg.profiles.email}</span></div>
                <div><span className="label">Applied</span><span>{formatDate(reg.registered_at)}</span></div>
                {reg.profiles.linkedin_url && (
                  <div><span className="label">LinkedIn</span><a href={reg.profiles.linkedin_url} target="_blank">View →</a></div>
                )}
              </div>

              {reg.profiles.bio && <p className="bio">{reg.profiles.bio}</p>}

              {reg.status === "interested" && (
                <div className="actions">
                  <button className="btn approve" onClick={() => handleAction(reg.id, "approved")} disabled={processing === reg.id}>
                    {processing === reg.id ? "..." : "Approve"}
                  </button>
                  <button className="btn reject" onClick={() => handleAction(reg.id, "rejected")} disabled={processing === reg.id}>
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .page { padding: 32px; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .page-header h1 { font-family: var(--font-display); font-size: 28px; font-weight: 700; color: white; margin: 0 0 4px; }
        .page-header p { font-family: var(--font-outfit); font-size: 14px; color: rgba(255,255,255,0.5); margin: 0; }
        .filters { display: flex; gap: 12px; }
        .filters select { padding: 10px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-family: var(--font-outfit); font-size: 13px; color: white; }
        .filters select option { background: #1a1a1a; }
        .stats-row { display: flex; gap: 16px; margin-bottom: 24px; }
        .mini-stat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px 24px; text-align: center; }
        .mini-stat .count { display: block; font-family: var(--font-display); font-size: 24px; font-weight: 700; color: white; }
        .mini-stat .label { font-family: var(--font-outfit); font-size: 12px; color: rgba(255,255,255,0.5); }
        .loading, .empty { text-align: center; padding: 48px; color: rgba(255,255,255,0.4); font-family: var(--font-outfit); }
        .registrations { display: flex; flex-direction: column; gap: 16px; }
        .reg-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; }
        .reg-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .applicant { display: flex; align-items: center; gap: 12px; }
        .avatar { width: 44px; height: 44px; border-radius: 50%; background: rgba(232,101,26,0.2); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 18px; color: var(--orange); }
        .applicant h3 { font-family: var(--font-display); font-size: 16px; font-weight: 600; color: white; margin: 0 0 2px; }
        .applicant p { font-family: var(--font-outfit); font-size: 13px; color: rgba(255,255,255,0.5); margin: 0; }
        .badge { padding: 6px 12px; border-radius: 20px; font-family: var(--font-outfit); font-size: 12px; font-weight: 600; text-transform: capitalize; }
        .details { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; margin-bottom: 16px; }
        .details div { display: flex; flex-direction: column; gap: 4px; }
        .details .label { font-family: var(--font-outfit); font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase; }
        .details span, .details a { font-family: var(--font-outfit); font-size: 13px; color: rgba(255,255,255,0.8); }
        .details a { color: var(--orange); text-decoration: none; }
        .bio { font-family: var(--font-outfit); font-size: 13px; color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.02); padding: 12px; border-radius: 8px; margin: 0 0 16px; }
        .actions { display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
        .btn { padding: 10px 24px; border-radius: 8px; font-family: var(--font-outfit); font-size: 13px; font-weight: 600; border: none; cursor: pointer; }
        .btn:disabled { opacity: 0.5; }
        .btn.approve { background: rgba(34,197,94,0.15); color: #22c55e; }
        .btn.approve:hover:not(:disabled) { background: rgba(34,197,94,0.25); }
        .btn.reject { background: rgba(239,68,68,0.1); color: #ef4444; }
        .btn.reject:hover:not(:disabled) { background: rgba(239,68,68,0.2); }
      `}</style>
    </div>
  )
}
