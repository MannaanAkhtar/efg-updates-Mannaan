import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketing Through Uncertainty | Braze x Events First Group",
  description:
    "A private virtual roundtable for senior martech leaders in MENAT. How brands are adjusting customer engagement strategies during uncertain times.",
  openGraph: {
    title: "Marketing Through Uncertainty | Braze x EFG Roundtable",
    description:
      "A private virtual roundtable for senior martech leaders in MENAT.",
  },
};

export default function BrazeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
