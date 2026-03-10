// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import Link from "next/link"

type Stats = {
  totalUsers: number
  totalEvents: number
  pendingRegistrations: number
  approvedRegistrations: number
  confirmedRegistrations: number
  totalSponsors: number
}

type RecentRegistration = {
  id: string
  status: string
  registered_at: string
  profiles: { full_name: string; email: string }
  events: { name: string }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalEvents: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    confirmedRegistrations: 0,
    totalSponsors: 0,
  })
  const [recentRegs, setRecentRegs] = useState<RecentRegistration[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    const loadDashboard = async () => {
      // Get counts
      const [usersRes, eventsRes, regsRes, sponsorsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("event_registrations").select("status"),
        supabase.from("sponsors").select("id", { count: "exact", head: true }).eq("is_active", true),
      ])

      const registrations = regsRes.data || []
      
      setStats({
        totalUsers: usersRes.count || 0,
        totalEvents: eventsRes.count || 0,
        pendingRegistrations: registrations.filter(r => r.status === "interested").length,
        approvedRegistrations: registrations.filter(r => r.status === "approved").length,
        confirmedRegistrations: registrations.filter(r => r.status === "confirmed").length,
        totalSponsors: sponsorsRes.count || 0,
      })

      // Get recent registrations
      const { data: recent } = await supabase
        .from("event_registrations")
        .select("id, status, registered_at, profiles(full_name, email), events(name)")
        .order("registered_at", { ascending: false })
        .limit(5)

      if (recent) setRecentRegs(recent as RecentRegistration[])

      setLoading(false)
    }
    loadDashboard()
  }, [supabase])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      interested: "#fbbf24",
      approved: "#22c55e",
      confirmed: "#3b82f6",
      rejected: "#ef4444",
    }
    return colors[status] || "#888"
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your EFG Networking platform</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalUsers}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalEvents}</span>
            <span className="stat-label">Active Events</span>
          </div>
        </div>

        <div className="stat-card highlight pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-value">{stats.pendingRegistrations}</span>
            <span className="stat-label">Pending Approval</span>
          </div>
          <Link href="/admin/registrations" className="stat-action">Review →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <span className="stat-value">{stats.approvedRegistrations}</span>
            <span className="stat-label">Approved</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎫</div>
          <div className="stat-info">
            <span className="stat-value">{stats.confirmedRegistrations}</span>
            <span className="stat-label">Confirmed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalSponsors}</span>
            <span className="stat-label">Sponsors</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="recent-section">
          <div className="section-header">
            <h2>Recent Registrations</h2>
            <Link href="/admin/registrations" className="view-all">View All →</Link>
          </div>

          <div className="recent-list">
            {recentRegs.length === 0 ? (
              <p className="empty">No registrations yet</p>
            ) : (
              recentRegs.map(reg => (
                <div key={reg.id} className="recent-item">
                  <div className="recent-user">
                    <div className="avatar">{reg.profiles.full_name?.charAt(0) || "?"}</div>
                    <div className="info">
                      <span className="name">{reg.profiles.full_name}</span>
                      <span className="event">{reg.events.name}</span>
                    </div>
                  </div>
                  <div className="recent-meta">
                    <span 
                      className="status"
                      style={{ color: getStatusColor(reg.status) }}
                    >
                      {reg.status}
                    </span>
                    <span className="time">{formatDate(reg.registered_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link href="/admin/registrations?status=interested" className="action-card">
              <span className="action-icon">📋</span>
              <span className="action-label">Review Pending</span>
            </Link>
            <Link href="/admin/events" className="action-card">
              <span className="action-icon">➕</span>
              <span className="action-label">Create Event</span>
            </Link>
            <Link href="/admin/users" className="action-card">
              <span className="action-icon">🔍</span>
              <span className="action-label">Find User</span>
            </Link>
            <Link href="/admin/sponsors" className="action-card">
              <span className="action-icon">🏢</span>
              <span className="action-label">Add Sponsor</span>
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .dashboard {
          padding: 32px;
        }

        .loading {
          padding: 48px;
          text-align: center;
          color: rgba(255,255,255,0.5);
          font-family: var(--font-outfit);
        }

        .page-header {
          margin-bottom: 32px;
        }

        .page-header h1 {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 700;
          color: white;
          margin: 0 0 8px;
        }

        .page-header p {
          font-family: var(--font-outfit);
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
        }

        .stat-card.highlight.pending {
          border-color: rgba(251, 191, 36, 0.3);
          background: rgba(251, 191, 36, 0.05);
        }

        .stat-icon {
          font-size: 24px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          color: white;
        }

        .stat-label {
          font-family: var(--font-outfit);
          font-size: 13px;
          color: rgba(255,255,255,0.5);
        }

        .stat-action {
          position: absolute;
          top: 12px;
          right: 16px;
          font-family: var(--font-outfit);
          font-size: 12px;
          color: var(--orange);
          text-decoration: none;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h2,
        .quick-actions h2 {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin: 0;
        }

        .view-all {
          font-family: var(--font-outfit);
          font-size: 13px;
          color: var(--orange);
          text-decoration: none;
        }

        .recent-section {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .empty {
          color: rgba(255,255,255,0.4);
          font-family: var(--font-outfit);
          font-size: 14px;
          padding: 24px;
          text-align: center;
        }

        .recent-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
        }

        .recent-user {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(232, 101, 26, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          color: var(--orange);
        }

        .info {
          display: flex;
          flex-direction: column;
        }

        .name {
          font-family: var(--font-outfit);
          font-size: 14px;
          font-weight: 500;
          color: white;
        }

        .event {
          font-family: var(--font-outfit);
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }

        .recent-meta {
          text-align: right;
        }

        .status {
          display: block;
          font-family: var(--font-outfit);
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .time {
          font-family: var(--font-outfit);
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }

        .quick-actions {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
        }

        .quick-actions h2 {
          margin-bottom: 16px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .action-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.1);
        }

        .action-icon {
          font-size: 24px;
        }

        .action-label {
          font-family: var(--font-outfit);
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
          text-align: center;
        }

        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  )
}
