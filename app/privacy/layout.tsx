import { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";

export const metadata: Metadata = {
  title: "Privacy Policy | Events First Group",
  description:
    "Events First Group privacy policy. How we collect, use, and protect your personal information when you attend our events or use our services.",
  alternates: {
    canonical: `${BASE_URL}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
