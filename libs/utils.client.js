import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getEmailHandle(email = "", fallback = "") {
  const match = email.match(/^([^@+]+)/);
  return match ? match[1] : fallback;
}

export function getNameInitials(name = "") {
  name = name.toString();
  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 0) return "";

  if (parts.length === 1) {
    const part = parts[0];
    // If name contains numbers (e.g. c214435), return just the first letter
    if (/\d/.test(part)) {
      return part.slice(0, 1).toUpperCase();
    }
    // Otherwise return first two letters (e.g. Tudor -> TU)
    return part.slice(0, 2).toUpperCase();
  }

  // If multiple names (e.g. Tudor Crisan), return first letter of first and last name
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return (first + last).toUpperCase();
}

export function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

export function pluralize(word = '', count = 0) {
  return word + ((count > 1 || count === 0) ? 's' : '')
}

export function baseUrl() {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://" + process.env.NEXT_PUBLIC_DOMAIN
}

let clientId = null;
export function getClientId() {
  if (!clientId && typeof window !== 'undefined') {
    clientId = Math.random().toString(36).substring(2, 15);
  }
  return clientId;
}

export function createSlug(name = "", trim = true) {
  const slug = name.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const cleaned = trim ? slug.replace(/^-+|-+$/g, '') : slug;
  return cleaned.slice(0, 30);
}

export function formatCommentDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
