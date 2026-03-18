"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import EventNavigation, { isEventPage } from "./EventNavigation";

export default function ConditionalNavigation() {
  const pathname = usePathname();

  // Don't show navigation on admin or standalone client pages
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/braze")) {
    return null;
  }

  // Use event-specific navigation for event pages
  if (isEventPage(pathname)) {
    return <EventNavigation />;
  }

  return <Navigation />;
}
