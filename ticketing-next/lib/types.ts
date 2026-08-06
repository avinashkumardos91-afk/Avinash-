export const STATUSES = ["Raised", "Picked up", "In progress", "Resolved", "Closed"] as const;
export const PRIORITIES = ["Urgent", "High", "Normal", "Low"] as const;
export const CATEGORIES = ["Bug", "Feature request", "Account / Access", "Billing", "How-to / Query", "Other"] as const;

export type Status = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];

export const REGIONS: { name: string; tz: string }[] = [
  { name: "North America", tz: "America/New_York" },
  { name: "Latin America", tz: "America/Sao_Paulo" },
  { name: "Europe", tz: "Europe/Berlin" },
  { name: "Middle East & Africa", tz: "Asia/Dubai" },
  { name: "South Asia", tz: "Asia/Kolkata" },
  { name: "Asia-Pacific", tz: "Asia/Singapore" },
];
export const REGION_TZ: Record<string, string> = Object.fromEntries(REGIONS.map((r) => [r.name, r.tz]));
export const LANGUAGES = ["English", "Spanish", "Portuguese", "French", "German", "Arabic", "Hindi", "Mandarin", "Japanese"];

// Priority → colour (hex used by both 2D UI and the 3D materials).
export const PRIORITY_HEX: Record<string, string> = {
  Urgent: "#ff5c72", High: "#ffab5e", Normal: "#6ea8fe", Low: "#7f89a8",
};
export const STATUS_HEX: Record<string, string> = {
  "Raised": "#7f89a8", "Picked up": "#6ea8fe", "In progress": "#8b7bff", "Resolved": "#3fe0a0", "Closed": "#4a5270",
};

export type Activity = { id: string; text: string; at: string };
export type Ticket = {
  id: string;
  ref: string;
  title: string;
  description: string;
  requester: string;
  category: string;
  priority: string;
  status: string;
  owner: string | null;
  region: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  activity: Activity[];
};

// Only the next valid step(s) are exposed in the UI.
export function nextActions(status: string): { label: string; to: Status; tone: "go" | "warn" }[] {
  switch (status) {
    case "Raised": return [{ label: "Pick up", to: "Picked up", tone: "go" }];
    case "Picked up": return [{ label: "Start work", to: "In progress", tone: "go" }];
    case "In progress": return [{ label: "Mark resolved", to: "Resolved", tone: "go" }];
    case "Resolved": return [{ label: "Close", to: "Closed", tone: "go" }, { label: "Reopen", to: "In progress", tone: "warn" }];
    case "Closed": return [{ label: "Reopen", to: "In progress", tone: "warn" }];
    default: return [];
  }
}
