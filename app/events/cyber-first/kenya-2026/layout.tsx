import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cyber First Kenya 2026 | Nairobi | Beyond Firewalls",
  description:
    "Beyond Firewalls — Strategic Cyber Defense for Kenya's Digital Age. East Africa's premier cybersecurity summit bringing together CISOs, government leaders, and enterprise security executives. June 2026, Nairobi.",
  openGraph: {
    title: "Cyber First Kenya 2026 – Nairobi Edition",
    description:
      "Join 300+ security leaders at East Africa's definitive cybersecurity summit. June 2026, Nairobi — The Silicon Savannah.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
