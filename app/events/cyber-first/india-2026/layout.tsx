import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cyber First India 2026 | Delhi Edition | Cybersecurity Summit",
  description:
    "Cyber Resilience for India's Digital Future. India's premier cybersecurity summit bringing together CISOs, government cyber leaders, and enterprise security executives. 11 June 2026, Delhi.",
  openGraph: {
    title: "Cyber First India 2026 – Delhi Edition",
    description:
      "Join 350+ security leaders at India's definitive cybersecurity summit. 11 June 2026, Delhi.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
