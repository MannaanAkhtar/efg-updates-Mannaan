export default function ConnectAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      {/* Ambient orange glow — same vocabulary as the marketing site */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 35% at 18% 8%, rgba(232,101,26,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 82% 92%, rgba(232,101,26,0.07) 0%, transparent 60%)
          `,
        }}
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        {children}
      </div>
    </div>
  );
}
