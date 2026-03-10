// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type Admin = {
  id: string
  role: string
  profiles: {
    id: string
    email: string
    full_name: string
    title: string | null
  }
}

export default function TeamPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [addEmail, setAddEmail] = useState("")
  const [addRole, setAddRole] = useState("producer")
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState("")
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkAccess()
    loadAdmins()
  }, [])

  const checkAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push("/login")

    const { data } = await supabase
      .from("admin_roles")
      .select("role")
      .eq("profile_id", (await supabase.from("profiles").select("id").eq("user_id", user.id).single()).data?.id)
      .single()

    if (data?.role !== "super_admin") {
      router.push("/admin")
    } else {
      setIsSuperAdmin(true)
    }
  }

  const loadAdmins = async () => {
    const { data } = await supabase
      .from("admin_roles")
      .select("id, role, profiles(id, email, full_name, title)")
      .order("role")
    if (data) setAdmins(data as Admin[])
    setLoading(false)
  }

  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    setError("")

    // Find user by email
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", addEmail)
      .single()

    if (!profile) {
      setError("User not found. They must sign up first.")
      setAdding(false)
      return
    }

    // Add to admin_roles
    const { error: insertError } = await supabase
      .from("admin_roles")
      .upsert({ profile_id: profile.id, role: addRole })

    if (insertError) {
      setError(insertError.message)
    } else {
      // Also update is_admin flag
      await supabase.from("profiles").update({ is_admin: true }).eq("id", profile.id)
      setAddEmail("")
      loadAdmins()
    }
    setAdding(false)
  }

  const updateRole = async (adminId: string, newRole: string) => {
    await supabase.from("admin_roles").update({ role: newRole }).eq("id", adminId)
    setAdmins(prev => prev.map(a => a.id === adminId ? { ...a, role: newRole } : a))
  }

  const removeAdmin = async (adminId: string, profileId: string) => {
    if (!confirm("Remove this admin?")) return
    await supabase.from("admin_roles").delete().eq("id", adminId)
    await supabase.from("profiles").update({ is_admin: false }).eq("id", profileId)
    setAdmins(prev => prev.filter(a => a.id !== adminId))
  }

  const getRoleBadge = (role: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      super_admin: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
      producer: { bg: "rgba(139,92,246,0.15)", color: "#8b5cf6" },
      coordinator: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6" },
    }
    return styles[role] || styles.coordinator
  }

  if (!isSuperAdmin) {
    return <div className="loading">Checking access...</div>
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Admin Team</h1>
          <p>Manage who has admin access</p>
        </div>
      </header>

      <form className="add-form" onSubmit={addAdmin}>
        <h3>Add Admin</h3>
        {error && <p className="error">{error}</p>}
        <div className="form-row">
          <input
            type="email"
            placeholder="Email address"
            value={addEmail}
            onChange={e => setAddEmail(e.target.value)}
            required
          />
          <select value={addRole} onChange={e => setAddRole(e.target.value)}>
            <option value="coordinator">Coordinator</option>
            <option value="producer">Producer</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <button type="submit" disabled={adding}>
            {adding ? "Adding..." : "Add Admin"}
          </button>
        </div>
        <p className="hint">
          <strong>Roles:</strong> Super Admin (full access) → Producer (manage events & users) → Coordinator (approve registrations)
        </p>
      </form>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="admins-list">
          {admins.map(admin => (
            <div key={admin.id} className="admin-card">
              <div className="admin-info">
                <div className="avatar">{admin.profiles.full_name?.charAt(0)}</div>
                <div>
                  <h4>{admin.profiles.full_name}</h4>
                  <p>{admin.profiles.email}</p>
                  {admin.profiles.title && <span className="title">{admin.profiles.title}</span>}
                </div>
              </div>
              <div className="admin-actions">
                <select 
                  value={admin.role} 
                  onChange={e => updateRole(admin.id, e.target.value)}
                  style={getRoleBadge(admin.role)}
                  className="role-select"
                >
                  <option value="coordinator">Coordinator</option>
                  <option value="producer">Producer</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <button 
                  className="remove-btn"
                  onClick={() => removeAdmin(admin.id, admin.profiles.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .page { padding: 32px; }
        .page-header h1 { font-family: var(--font-display); font-size: 28px; font-weight: 700; color: white; margin: 0 0 4px; }
        .page-header p { font-family: var(--font-outfit); font-size: 14px; color: rgba(255,255,255,0.5); margin: 0 0 24px; }
        
        .add-form { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; margin-bottom: 24px; }
        .add-form h3 { font-family: var(--font-display); font-size: 18px; color: white; margin: 0 0 16px; }
        .error { color: #ef4444; font-family: var(--font-outfit); font-size: 13px; margin: 0 0 12px; }
        .form-row { display: flex; gap: 12px; margin-bottom: 12px; }
        .form-row input { flex: 2; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; font-family: var(--font-outfit); font-size: 14px; color: white; }
        .form-row select { flex: 1; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; font-family: var(--font-outfit); font-size: 14px; color: white; }
        .form-row button { padding: 12px 24px; background: var(--orange); border: none; border-radius: 10px; font-family: var(--font-outfit); font-size: 14px; font-weight: 600; color: white; cursor: pointer; }
        .form-row button:disabled { opacity: 0.5; }
        .hint { font-family: var(--font-outfit); font-size: 12px; color: rgba(255,255,255,0.4); margin: 0; }
        
        .loading { text-align: center; padding: 48px; color: rgba(255,255,255,0.4); font-family: var(--font-outfit); }
        
        .admins-list { display: flex; flex-direction: column; gap: 12px; }
        .admin-card { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px 20px; }
        .admin-info { display: flex; align-items: center; gap: 16px; }
        .avatar { width: 44px; height: 44px; border-radius: 50%; background: rgba(232,101,26,0.2); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 18px; color: var(--orange); }
        .admin-info h4 { font-family: var(--font-outfit); font-size: 15px; font-weight: 600; color: white; margin: 0; }
        .admin-info p { font-family: var(--font-outfit); font-size: 13px; color: rgba(255,255,255,0.5); margin: 2px 0 0; }
        .title { font-family: var(--font-outfit); font-size: 12px; color: rgba(255,255,255,0.4); }
        
        .admin-actions { display: flex; align-items: center; gap: 12px; }
        .role-select { padding: 8px 16px; border-radius: 20px; font-family: var(--font-outfit); font-size: 12px; font-weight: 600; border: none; cursor: pointer; }
        .remove-btn { padding: 8px 16px; background: rgba(239,68,68,0.1); border: none; border-radius: 8px; font-family: var(--font-outfit); font-size: 12px; font-weight: 600; color: #ef4444; cursor: pointer; }
        .remove-btn:hover { background: rgba(239,68,68,0.2); }
      `}</style>
    </div>
  )
}
