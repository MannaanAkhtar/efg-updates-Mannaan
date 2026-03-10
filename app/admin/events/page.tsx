// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

type Event = {
  id: string
  name: string
  slug: string
  series: string | null
  date: string
  location: string
  venue: string | null
  is_active: boolean
  registration_open: boolean
  _count?: { registrations: number }
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    slug: "",
    series: "",
    date: "",
    location: "",
    venue: "",
    description: "",
  })
  
  const supabase = createClient()

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: false })

    if (eventsData) {
      // Get registration counts
      const eventsWithCounts = await Promise.all(
        eventsData.map(async (event) => {
          const { count } = await supabase
            .from("event_registrations")
            .select("*", { count: "exact", head: true })
            .eq("event_id", event.id)
          return { ...event, _count: { registrations: count || 0 } }
        })
      )
      setEvents(eventsWithCounts)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    
    const { error } = await supabase.from("events").insert({
      name: form.name,
      slug,
      series: form.series || null,
      date: form.date,
      location: form.location,
      venue: form.venue || null,
      description: form.description || null,
      is_active: true,
      registration_open: true,
    })

    if (!error) {
      setForm({ name: "", slug: "", series: "", date: "", location: "", venue: "", description: "" })
      setShowForm(false)
      loadEvents()
    }
    setSaving(false)
  }

  const toggleStatus = async (eventId: string, field: "is_active" | "registration_open", value: boolean) => {
    await supabase.from("events").update({ [field]: !value }).eq("id", eventId)
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, [field]: !value } : e))
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Events</h1>
          <p>Manage your events and registrations</p>
        </div>
        <button className="btn primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Create Event"}
        </button>
      </header>

      {showForm && (
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Event Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Series</label>
              <input value={form.series} onChange={e => setForm({ ...form, series: e.target.value })} placeholder="e.g. Cyber First" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="City, Country" required />
            </div>
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} placeholder="Hotel/Convention Center name" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? "Creating..." : "Create Event"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="events-list">
          {events.map(event => (
            <div key={event.id} className={`event-card ${!event.is_active ? "inactive" : ""}`}>
              <div className="event-main">
                <div className="event-info">
                  {event.series && <span className="series">{event.series}</span>}
                  <h3>{event.name}</h3>
                  <p className="meta">
                    {formatDate(event.date)} • {event.venue ? `${event.venue}, ` : ""}{event.location}
                  </p>
                </div>
                <div className="event-stats">
                  <div className="stat">
                    <span className="value">{event._count?.registrations || 0}</span>
                    <span className="label">Registrations</span>
                  </div>
                </div>
              </div>
              <div className="event-actions">
                <button 
                  className={`toggle ${event.is_active ? "active" : ""}`}
                  onClick={() => toggleStatus(event.id, "is_active", event.is_active)}
                >
                  {event.is_active ? "Active" : "Inactive"}
                </button>
                <button 
                  className={`toggle ${event.registration_open ? "active" : ""}`}
                  onClick={() => toggleStatus(event.id, "registration_open", event.registration_open)}
                >
                  {event.registration_open ? "Registration Open" : "Registration Closed"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .page { padding: 32px; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .page-header h1 { font-family: var(--font-display); font-size: 28px; font-weight: 700; color: white; margin: 0 0 4px; }
        .page-header p { font-family: var(--font-outfit); font-size: 14px; color: rgba(255,255,255,0.5); margin: 0; }
        .btn { padding: 12px 20px; border-radius: 10px; font-family: var(--font-outfit); font-size: 14px; font-weight: 600; border: none; cursor: pointer; }
        .btn.primary { background: var(--orange); color: white; }
        .btn.primary:hover { background: #ff7a2e; }
        .btn:disabled { opacity: 0.5; }
        
        .event-form { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; margin-bottom: 24px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-family: var(--font-outfit); font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 6px; text-transform: uppercase; }
        .form-group input, .form-group textarea { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-family: var(--font-outfit); font-size: 14px; color: white; }
        .form-group input:focus, .form-group textarea:focus { border-color: var(--orange); outline: none; }
        
        .loading { text-align: center; padding: 48px; color: rgba(255,255,255,0.4); }
        .events-list { display: flex; flex-direction: column; gap: 16px; }
        .event-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 20px; }
        .event-card.inactive { opacity: 0.5; }
        .event-main { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .series { font-family: var(--font-outfit); font-size: 11px; font-weight: 600; color: var(--orange); text-transform: uppercase; }
        .event-info h3 { font-family: var(--font-display); font-size: 18px; font-weight: 600; color: white; margin: 4px 0; }
        .meta { font-family: var(--font-outfit); font-size: 13px; color: rgba(255,255,255,0.5); margin: 0; }
        .event-stats { text-align: right; }
        .stat .value { display: block; font-family: var(--font-display); font-size: 24px; font-weight: 700; color: white; }
        .stat .label { font-family: var(--font-outfit); font-size: 11px; color: rgba(255,255,255,0.4); }
        .event-actions { display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
        .toggle { padding: 8px 16px; border-radius: 20px; font-family: var(--font-outfit); font-size: 12px; font-weight: 500; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); cursor: pointer; }
        .toggle.active { background: rgba(34,197,94,0.15); border-color: rgba(34,197,94,0.3); color: #22c55e; }
      `}</style>
    </div>
  )
}
