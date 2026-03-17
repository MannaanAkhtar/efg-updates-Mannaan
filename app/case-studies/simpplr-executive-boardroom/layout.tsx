import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Executive Boardroom Case Study | Simpplr x Events First Group",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SimpplrCaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        /* DECK MODE: Hide ALL site chrome */
        
        /* Navigation bar */
        body > nav {
          display: none !important;
        }
        
        /* WhatsApp floating button */
        body > a {
          display: none !important;
        }
        
        /* Cursor glow - second child div of body (first is React root) */
        body > div:nth-child(2) {
          display: none !important;
        }
        
        /* Clean styling */
        body {
          background: #FFFFFF !important;
          cursor: auto !important;
        }
      `}</style>
      {children}
    </>
  );
}
