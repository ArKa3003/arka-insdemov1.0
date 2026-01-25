"use client";

import { useAnnouncerStore } from "@/stores/announcer-store";

/**
 * Live region for screen reader announcements.
 * Renders nothing visibly; speaks on aria-live when message updates.
 * Use useAnnouncer() from child components to announce.
 */
export function ScreenReaderAnnouncer() {
  const message = useAnnouncerStore((s) => s.message);
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      data-announcer
    >
      {message}
    </div>
  );
}

export function useAnnouncer() {
  return useAnnouncerStore((s) => s.announce);
}
