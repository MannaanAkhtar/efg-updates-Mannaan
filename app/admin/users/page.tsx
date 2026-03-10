// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

type User = {
  id: string
  email: string
  full_name: string
  title: string | null
  company: string | null
  is_admin: boolean
  profile_completed: boolean
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, title, company, is_admin, profile_completed, created_at")
      .order("created_at", { ascending: false })
    if (data) setUsers(data)
    setLoading(false)
  }

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    setProcessing(userId)
    await supabase.from("profiles").update({ is_admin: !isAdmin }).eq("id", userId)
    
    if (!isAdmin) {
      // Adding admin - also add to admin_roles
      await supabase.from("admin_roles").upsert({ profile_id: userId, role: "producer" })
    } else {
      // Removing admin - remove from admin_roles
      await supabase.from("admin_roles").delete().eq("profile_id", userId)
    }
    
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_admin: !isAdmin } : u))
    setProcessing(null)
  }

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.company?.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Users</h1>
          <p>{users.length} registered users</p>
        </div>
        <div className="search-box">
          <input 
            type="text"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <p className="loading">Loading users...</p>
      ) : (
        <div className="users-table">
          <div className="table-header">
            <span>User</span>
            <span>Company</span>
            <span>Joined</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {filteredUsers.map(user => (
            <div key={user.id} className="table-row">
              <div className="user-cell">
                <div className="avatar">{user.full_name?.charAt(0) || "?"}</div>
                <div>
                  <span className="name">{user.full_name || "—"}</span>
                  <span className="email">{user.email}</span>
                </div>
              </div>
              <div className="cell">
                {user.title && <span className="title">{user.title}</span>}
                <span className="company">{user.company || "—"}</span>
              </div>
              <div className="cell">
                <span>{formatDate(user.created_at)}</span>
              </div>
              <div className="cell">
                <div className="badges">
                  {user.is_admin && <span className="badge admin">Admin</span>}
                  {user.profile_completed ? (
                    <span className="badge complete">Complete</span>
                  ) : (
                    <span className="badge incomplete">Incomplete</span>
                  )}
                </div>
              </div>
              <div className="cell actions">
                <button
                  className={`btn ${user.is_admin ? "remove" : "add"}`}
                  onClick={() => toggleAdmin(user.id, user.is_admin)}
                  disabled={processing === user.id}
                >
                  {processing === user.id ? "..." : user.is_admin ? "Remove Admin" : "Make Admin"}
                </button>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <p className="empty">No users found</p>
          )}
        </div>
      )}

      <style jsx>{`
        .page { padding: 32px; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .page-header h1 { font-family: var(--font-display); font-size: 28px; font-weight: 700; color: white; margin: 0 0 4px; }
        .page-header p { font-family: var(--font-outfit); font-size: 14px; color: rgba(255,255,255,0.5); margin: 0; }
        
        .search-box input { padding: 12px 20px; width: 300px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; font-family: var(--font-outfit); font-size: 14px; color: white; }
        .search-box input::placeholder { color: rgba(255,255,255,0.3); }
        .search-box input:focus { border-color: var(--orange); outline: none; }
        
        .loading, .empty { text-align: center; padding: 48px; color: rgba(255,255,255,0.4); font-family: var(--font-outfit); }
        
        .users-table { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; }
        .table-header { display: grid; grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr; padding: 16px 24px; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .table-header span { font-family: var(--font-outfit); font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; }
        
        .table-row { display: grid; grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr; padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.04); align-items: center; }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: rgba(255,255,255,0.02); }
        
        .user-cell { display: flex; align-items: center; gap: 12px; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; background: rgba(232,101,26,0.2); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 16px; color: var(--orange); }
        .name { display: block; font-family: var(--font-outfit); font-size: 14px; font-weight: 500; color: white; }
        .email { display: block; font-family: var(--font-outfit); font-size: 12px; color: rgba(255,255,255,0.5); }
        
        .cell { font-family: var(--font-outfit); font-size: 13px; color: rgba(255,255,255,0.7); }
        .title { display: block; font-size: 12px; color: rgba(255,255,255,0.5); }
        .company { display: block; }
        
        .badges { display: flex; gap: 6px; flex-wrap: wrap; }
        .badge { padding: 4px 8px; border-radius: 12px; font-family: var(--font-outfit); font-size: 11px; font-weight: 600; }
        .badge.admin { background: rgba(139,92,246,0.2); color: #8b5cf6; }
        .badge.complete { background: rgba(34,197,94,0.15); color: #22c55e; }
        .badge.incomplete { background: rgba(251,191,36,0.15); color: #fbbf24; }
        
        .actions { text-align: right; }
        .btn { padding: 8px 16px; border-radius: 8px; font-family: var(--font-outfit); font-size: 12px; font-weight: 600; border: none; cursor: pointer; }
        .btn:disabled { opacity: 0.5; }
        .btn.add { background: rgba(139,92,246,0.15); color: #8b5cf6; }
        .btn.add:hover:not(:disabled) { background: rgba(139,92,246,0.25); }
        .btn.remove { background: rgba(239,68,68,0.1); color: #ef4444; }
        .btn.remove:hover:not(:disabled) { background: rgba(239,68,68,0.2); }
        
        @media (max-width: 900px) {
          .table-header, .table-row { grid-template-columns: 1fr 1fr; }
          .table-header span:nth-child(n+3), .table-row .cell:nth-child(n+3) { display: none; }
        }
      `}</style>
    </div>
  )
}
