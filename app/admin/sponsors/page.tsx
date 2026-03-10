// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

type Sponsor = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  website: string | null
  is_active: boolean
  created_at: string
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", website: "", logo_url: "" })
  
  const supabase = createClient()

  useEffect(() => {
    loadSponsors()
  }, [])

  const loadSponsors = async () => {
    const { data } = await supabase
      .from("sponsors")
      .select("*")
      .order("name")
    if (data) setSponsors(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    
    await supabase.from("sponsors").insert({
      name: form.name,
      slug,
      website: form.website || null,
      logo_url: form.logo_url || null,
      is_active: true,
    })

    setForm({ name: "", website: "", logo_url: "" })
    setShowForm(false)
    loadSponsors()
    setSaving(false)
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    await supabase.from("sponsors").update({ is_active: !isActive }).eq("id", id)
    setSponsors(prev => prev.map(s => s.id === id ? { ...s, is_active: !isActive } : s))
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Sponsors</h1>
          <p>Manage sponsor companies</p>
        </div>
        <button className="btn primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Sponsor"}
        </button>
      </header>

      {showForm && (
        <form className="sponsor-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name *</label>
            <input 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input 
              type="url"
              value={form.website} 
              onChange={e => setForm({ ...form, website: e.target.value })} 
              placeholder="https://..."
            />
          </div>
          <div className="form-group">
            <label>Logo URL</label>
            <input 
              type="url"
              value={form.logo_url} 
              onChange={e => setForm({ ...form, logo_url: e.target.value })} 
              placeholder="https://..."
            />
          </div>
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? "Saving..." : "Add Sponsor"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="loading">Loading...</p>
      ) : sponsors.length === 0 ? (
        <p className="empty">No sponsors yet. Add your first sponsor!</p>
      ) : (
        <div className="sponsors-grid">
          {sponsors.map(sponsor => (
            <div key={sponsor.id} className={`sponsor-card ${!sponsor.is_active ? "inactive" : ""}`}>
              <div className="sponsor-logo">
                {sponsor.logo_url ? (
                  <img src={sponsor.logo_url} alt={sponsor.name} />
                ) : (
                  <span>{sponsor.name.charAt(0)}</span>
                )}
              </div>
              <div className="sponsor-info">
                <h3>{sponsor.name}</h3>
                {sponsor.website && (
                  <a href={sponsor.website} target="_blank" rel="noopener">
                    {sponsor.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                )}
              </div>
              <button
                className={`toggle ${sponsor.is_active ? "active" : ""}`}
                onClick={() => toggleActive(sponsor.id, sponsor.is_active)}
              >
                {sponsor.is_active ? "Active" : "Inactive"}
              </button>
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
        .btn:disabled { opacity: 0.5; }
        
        .sponsor-form { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; margin-bottom: 24px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-family: var(--font-outfit); font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 6px; text-transform: uppercase; }
        .form-group input { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-family: var(--font-outfit); font-size: 14px; color: white; }
        .form-group input:focus { border-color: var(--orange); outline: none; }
        
        .loading, .empty { text-align: center; padding: 48px; color: rgba(255,255,255,0.4); font-family: var(--font-outfit); }
        
        .sponsors-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .sponsor-card { display: flex; align-items: center; gap: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; }
        .sponsor-card.inactive { opacity: 0.5; }
        
        .sponsor-logo { width: 48px; height: 48px; border-radius: 8px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
        .sponsor-logo img { width: 100%; height: 100%; object-fit: contain; }
        .sponsor-logo span { font-family: var(--font-display); font-size: 20px; color: var(--orange); }
        
        .sponsor-info { flex: 1; min-width: 0; }
        .sponsor-info h3 { font-family: var(--font-outfit); font-size: 15px; font-weight: 600; color: white; margin: 0 0 4px; }
        .sponsor-info a { font-family: var(--font-outfit); font-size: 12px; color: rgba(255,255,255,0.5); text-decoration: none; }
        .sponsor-info a:hover { color: var(--orange); }
        
        .toggle { padding: 6px 14px; border-radius: 20px; font-family: var(--font-outfit); font-size: 11px; font-weight: 600; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); cursor: pointer; }
        .toggle.active { background: rgba(34,197,94,0.15); border-color: rgba(34,197,94,0.3); color: #22c55e; }
      `}</style>
    </div>
  )
}
