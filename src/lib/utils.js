import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(value) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function getScheduleStatus(startTime, endTime) {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start > now) return "scheduled";
  if (start <= now && end >= now) return "active";
  return "expired";
}

export function safeJsonParse(value, fallback = null) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getStoredSession() {
  if (typeof window === "undefined") return null;
  return safeJsonParse(localStorage.getItem("cbs_auth"), null);
}

export function setAuthCookie(session) {
  if (typeof document === "undefined") return;
  const payload = encodeURIComponent(JSON.stringify(session));
  document.cookie = `cbs_auth=${payload}; path=/; max-age=86400; SameSite=Lax`;
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "cbs_auth=; path=/; max-age=0; SameSite=Lax";
}
