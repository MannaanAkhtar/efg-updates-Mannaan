import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/effects/SmoothScrollProvider";
import CursorGlow from "@/components/effects/CursorGlow";
import ConditionalNavigation from "@/components/ui/ConditionalNavigation";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

// Plus Jakarta Sans — The voice that commands the room
// Geometric, clean, commanding — pure precision at display sizes
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  style: "normal",
});

// Outfit — The voice that explains
// Clean, modern, effortlessly legible
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// DM Sans — The quiet voice
// Used sparingly: testimonial quotes and the hidden sign-off
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Events First Group | Premium Technology Conferences in the GCC",
  description:
    "EFG runs premium technology conferences across Dubai, Riyadh, Abu Dhabi, and Doha — cybersecurity, OT security, digital transformation, and AI events for the region's technology leaders.",
  keywords: [
    "technology conferences",
    "cybersecurity events",
    "GCC tech summit",
    "Dubai conferences",
    "Riyadh technology events",
    "CISO summit",
    "digital transformation",
    "AI conferences Middle East",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${outfit.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        <SmoothScrollProvider>
          <CursorGlow />
          <ConditionalNavigation />
          <main>{children}</main>
          <WhatsAppButton />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
