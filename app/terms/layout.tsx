import { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";

export const metadata: Metadata = {
  title: "Terms of Service | Events First Group",
  description:
    "Events First Group terms of service. Terms and conditions for attending our events, using our website, and engaging with our services.",
  alternates: {
    canonical: `${BASE_URL}/terms`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
