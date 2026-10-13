"use client";

/**
 * EnvelopeWrapper — Guards invitation content behind a one-time envelope animation.
 * Uses localStorage to track whether the current user has already seen the envelope
 * for a specific wedding, so returning visitors skip straight to the content.
 */

import { useState, useEffect } from "react";
import EnvelopeAnimation from "./EnvelopeAnimation";

interface EnvelopeWrapperProps {
  weddingId: string;
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  partnerNames: [string, string];
  children: React.ReactNode;
}

/** Returns the localStorage key for a given wedding. */
function storageKey(weddingId: string): string {
  return `dearly-envelope-${weddingId}`;
}

export default function EnvelopeWrapper({
  weddingId,
  theme,
  partnerNames,
  children,
}: EnvelopeWrapperProps) {
  /**
   * `showEnvelope` starts as `false` to avoid a flash of the envelope on
   * returning visits during SSR/hydration. We set the real value inside
   * `useEffect` once we can safely read localStorage.
   */
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(storageKey(weddingId));
      if (!seen) {
        setShowEnvelope(true);
      }
    } catch {
      // localStorage may be blocked (private mode, etc.) — skip envelope silently.
    }
    setHydrated(true);
  }, [weddingId]);

  /** Called by EnvelopeAnimation when its exit animation finishes. */
  function handleAnimationComplete() {
    try {
      localStorage.setItem(storageKey(weddingId), "1");
    } catch {
      // Silently ignore write failures.
    }
    setShowEnvelope(false);
  }

  // During SSR and before hydration, render nothing visible to avoid layout shift.
  if (!hydrated) {
    return null;
  }

  return (
    <>
      {showEnvelope && (
        <EnvelopeAnimation
          onComplete={handleAnimationComplete}
          theme={theme}
          partnerNames={partnerNames}
        />
      )}
      {children}
    </>
  );
}
