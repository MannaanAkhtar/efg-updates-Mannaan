import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data & AI First | The Premier Data & AI Leadership Summit",
  description:
    "Data & AI First brings together CDOs, AI architects, and enterprise leaders worldwide. Intelligence amplified — shaping the AI-driven future.",
};

export default function DataAIFirstLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
