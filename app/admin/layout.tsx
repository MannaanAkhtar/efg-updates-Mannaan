"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*, admin_roles(*)")
        .eq("user_id", user.id)
        .single()

      if (!profileData?.is_admin) {
        router.push("/portal")
        return
      }

      setProfile(profileData)
      setIsAdmin(true)
      setIsSuperAdmin(profileData.admin_roles?.[0]?.role === "super_admin")
      setLoading(false)
    }
    checkAdmin()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner" />
        <style jsx>{`
          .admin-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0a0a0a;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.1);
            border-top-color: var(--orange);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/registrations", label: "Registrations", icon: "📋" },
    { href: "/admin/events", label: "Events", icon: "📅" },
    { href: "/admin/users", label: "Users", icon: "👥" },
    { href: "/admin/sponsors", label: "Sponsors", icon: "🏢" },
  ]

  if (isSuperAdmin) {
    navItems.push({ href: "/admin/team", label: "Admin Team", icon: "🔐" })
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Link href="/portal" className="logo">
            <span className="logo-text">EFG</span>
            <span className="logo-badge">Admin</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {profile?.full_name?.charAt(0) || "A"}
            </div>
            <div className="user-details">
              <span className="user-name">{profile?.full_name}</span>
              <span className="user-role">{isSuperAdmin ? "Super Admin" : "Admin"}</span>
            </div>
          </div>
          <Link href="/portal" className="back-link">← Back to Portal</Link>
        </div>
      </aside>

      <main className="admin-content">
        {children}
      </main>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #0a0a0a;
        }

        .admin-sidebar {
          width: 260px;
          background: rgba(255,255,255,0.02);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 100;
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
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

        .logo-badge {
          padding: 4px 8px;
          background: rgba(139, 92, 246, 0.2);
          border-radius: 6px;
          font-family: var(--font-outfit);
          font-size: 11px;
          font-weight: 600;
          color: #8b5cf6;
          text-transform: uppercase;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.05);
        }

        .nav-item.active {
          background: rgba(232, 101, 26, 0.15);
        }

        .nav-icon {
          font-size: 18px;
        }

        .nav-label {
          font-family: var(--font-outfit);
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
        }

        .nav-item.active .nav-label {
          color: var(--orange);
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(232, 101, 26, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 600;
          color: var(--orange);
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-family: var(--font-outfit);
          font-size: 14px;
          font-weight: 500;
          color: white;
        }

        .user-role {
          font-family: var(--font-outfit);
          font-size: 12px;
          color: rgba(255,255,255,0.4);
        }

        .back-link {
          display: block;
          font-family: var(--font-outfit);
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          padding: 8px 0;
        }

        .back-link:hover {
          color: var(--orange);
        }

        .admin-content {
          flex: 1;
          margin-left: 260px;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            width: 100%;
            position: relative;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .admin-content {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  )
}
