export function timeAgo(iso: string): string {
  const d = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(d / 60000), h = Math.floor(d / 3600000), day = Math.floor(d / 86400000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  if (h < 24) return `${h}h ${m % 60}m`;
  if (day < 7) return `${day}d ${h % 24}h`;
  return `${Math.floor(day / 7)}w ${day % 7}d`;
}

export function fmt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function fmtTz(iso: string, tz: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, { timeZone: tz, month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return fmt(iso); }
}

export function clientNow(tz: string): { time: string; business: boolean } | null {
  try {
    const s = new Date().toLocaleTimeString("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false });
    const h = parseInt(s.slice(0, 2), 10);
    return { time: s, business: h >= 9 && h < 18 };
  } catch { return null; }
}

export const isOpen = (status: string) => status !== "Closed";
