"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import EventNavigation, { isEventPage } from "./EventNavigation";

export default function ConditionalNavigation() {
  const pathname = usePathname();
  const [isSubdomain, setIsSubdomain] = useState(false);

  useEffect(() => {
    if (window.location.hostname.startsWith("braze-webinar.") || window.location.hostname.startsWith("blaze-webinar.") || window.location.hostname.startsWith("braze-webinar-2.") || window.location.hostname.startsWith("vroundtable-braze.") || window.location.hostname.startsWith("sonicwall-webinar.") || window.location.hostname.startsWith("big-leap-riyadh.")) {
      setIsSubdomain(true);
    }
  }, []);

  // Don't show navigation on admin, standalone client pages, or blaze-webinar subdomain
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/braze") ||
    pathname?.startsWith("/sonicwall") ||
    pathname?.startsWith("/clevertap") ||
    pathname?.startsWith("/bigleap") ||
    isSubdomain
  ) {
    return null;
  }

  // Use event-specific navigation for event pages
  if (isEventPage(pathname)) {
    return <EventNavigation />;
  }

  return <Navigation />;
}
