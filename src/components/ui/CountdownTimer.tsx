"use client";

/**
 * Countdown timer — displays days, hours, minutes, seconds until a target date.
 * Used on wedding invitation pages across all templates.
 */

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
  labelClassName?: string;
  numberClassName?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculates the time remaining until the target date.
 */
function calculateTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({
  targetDate,
  className = "",
  labelClassName = "",
  numberClassName = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className={`flex gap-6 ${className}`}>
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <span className={`text-3xl font-bold tabular-nums ${numberClassName}`}>
            {String(value).padStart(2, "0")}
          </span>
          <span className={`mt-1 text-xs uppercase tracking-wider ${labelClassName}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
