import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EFG Connect",
  description:
    "EFG Connect — the sponsor portal for Events First Group. Every event, every signal, every lead — in one place.",
  robots: { index: false, follow: false },
};

export default function ConnectRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-black text-white">{children}</div>;
}
