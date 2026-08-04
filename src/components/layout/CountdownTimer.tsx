"use client";

import { useEffect, useState } from "react";

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function parisOffsetHours(instant: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    timeZoneName: "shortOffset",
  }).formatToParts(instant);
  const offset = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+1";
  const match = offset.match(/GMT([+-]\d+)/);
  return match ? parseInt(match[1], 10) : 1;
}

/** Next Wednesday 9PM CET/CEST (Europe/Paris local time), as a UTC timestamp. */
function nextWednesday9pm(): number {
  const now = new Date();
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      weekday: "short",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );

  const currentWeekday = WEEKDAY_INDEX[parts.weekday];
  const y = Number(parts.year);
  const mo = Number(parts.month);
  const d = Number(parts.day);
  const h = Number(parts.hour);

  let daysUntilWednesday = (3 - currentWeekday + 7) % 7;
  if (daysUntilWednesday === 0 && h >= 21) daysUntilWednesday = 7;

  const targetDate = new Date(Date.UTC(y, mo - 1, d));
  targetDate.setUTCDate(targetDate.getUTCDate() + daysUntilWednesday);

  const probe = new Date(
    Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), 19, 0, 0),
  );
  const offsetHours = parisOffsetHours(probe);

  return Date.UTC(
    targetDate.getUTCFullYear(),
    targetDate.getUTCMonth(),
    targetDate.getUTCDate(),
    21 - offsetHours,
    0,
    0,
  );
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
    const target = nextWednesday9pm();
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
