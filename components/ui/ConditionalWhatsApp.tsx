"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import WhatsAppButton from "./WhatsAppButton";

const HIDDEN_PATH_PREFIXES = [
  "/admin",
  "/connect",
  "/braze",
  "/sonicwall",
  "/clevertap",
  "/bigleap",
];

const HIDDEN_HOST_PREFIXES = [
  "braze-webinar.",
  "blaze-webinar.",
  "braze-webinar-2.",
  "vroundtable-braze.",
  "sonicwall-webinar.",
  "big-leap-riyadh.",
];

export default function ConditionalWhatsApp() {
  const pathname = usePathname();
  const [hideForHost, setHideForHost] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    if (HIDDEN_HOST_PREFIXES.some((prefix) => host.startsWith(prefix))) {
      setHideForHost(true);
    }
  }, []);

  if (hideForHost) return null;
  if (pathname && HIDDEN_PATH_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }
  return <WhatsAppButton />;
}
