"use client"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout">
      <div className="auth-gradient-mesh" />
      <div className="auth-noise" />
      <div className="auth-content">
        {children}
      </div>
      
      <style jsx global>{`
        .auth-layout {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0A0A0A;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }
        
        .auth-gradient-mesh {
          position: absolute;
          inset: -50%;
          background: 
            radial-gradient(ellipse 60% 40% at 30% 20%, rgba(232, 101, 26, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 50% 50% at 70% 80%, rgba(124, 58, 237, 0.12) 0%, transparent 50%);
          filter: blur(80px);
          pointer-events: none;
          animation: meshFloat 20s ease-in-out infinite;
        }
        
        @keyframes meshFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-3%, 3%) scale(1.02); }
        }
        
        .auth-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
        }
        
        .auth-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
        }
      `}</style>
    </div>
  )
}
