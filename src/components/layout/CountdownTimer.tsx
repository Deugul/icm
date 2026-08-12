"use client";

import { useEffect, useState } from "react";

// Fixed launch date: August 6, 2026, 8:30PM IST. IST is a fixed UTC+5:30
// offset year-round (no daylight saving), so no timezone-library needed.
const TARGET_YEAR = 2026;
const TARGET_MONTH = 8;
const TARGET_DAY = 6;
const TARGET_HOUR_IST = 20;
const TARGET_MINUTE_IST = 30;
const IST_OFFSET_MINUTES = 5 * 60 + 30;

function launchTarget(): number {
  const targetMinutesUTC = TARGET_HOUR_IST * 60 + TARGET_MINUTE_IST - IST_OFFSET_MINUTES;
  return Date.UTC(TARGET_YEAR, TARGET_MONTH - 1, TARGET_DAY, 0, targetMinutesUTC, 0);
}

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return days > 0
    ? `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export default function CountdownTimer({ className }: { className?: string }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const target = launchTarget();
    const tick = () => setRemaining(target - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (remaining === null) return null;

  return (
    <span className={className}>
      <span className="font-mono tabular-nums text-brand">{formatRemaining(remaining)}</span>
    </span>
  );
}
