"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Remembers an interactive hero opening for the current tab and lets personal
 * invitation links skip it. Returns whether the hero is revealed and the
 * callback that opens and records it.
 */
export function useHeroOpening(key: string, skip = false) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (skip) return;
    try {
      if (window.sessionStorage.getItem(key) === "1") setOpened(true);
    } catch {}
  }, [key, skip]);

  const open = useCallback(() => {
    setOpened(true);
    try {
      window.sessionStorage.setItem(key, "1");
    } catch {}
  }, [key]);

  return { revealed: skip || opened, open };
}
