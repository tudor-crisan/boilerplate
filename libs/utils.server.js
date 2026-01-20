import { oklchToHex } from "@/libs/colors";
import { defaultSetting as settings } from "@/libs/defaults";
import blockedDomains from "@/lists/blockedDomains";
import logos from "@/lists/logos";
import themeColors from "@/lists/themeColors";
import { NextResponse } from "next/server";
import { z } from "zod";

export const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  if (!process.env.NEXT_PUBLIC_DOMAIN) {
    console.error("Critical: NEXT_PUBLIC_DOMAIN is not defined in the environment.");
    return "";
  }
  return "https://" + process.env.NEXT_PUBLIC_DOMAIN;
};

export function formatWebsiteUrl(url = "") {
  if (!url) return "";
  // remove any protocol and www to force https://www.${clean}`;
  const clean = url.replace(/(^\w+:|^)\/\//, '').replace(/^www\./, '');
  return `https://www.${clean}`;
}

/**
 * Generates a URL-safe slug from a string.
 * @param {string} text - The input text to slugify.
 * @param {number} maxLength - Maximum length of the slug.
 * @returns {string} The formatted slug.
 */
export function generateSlug(text = "", maxLength = 30) {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, '')          // Remove leading/trailing hyphens
    .slice(0, maxLength);
}

export function responseSuccess(message = "", data = {}, status = 200) {
  return NextResponse.json({ message, data }, { status });
}

export function responseError(error = "", inputErrors = {}, status = 401) {
  return NextResponse.json({ error, inputErrors }, { status })
}

export function responseMock(target = "") {
  const { isEnabled, isError, responses: { error, success } } = settings.forms[target].mockConfig;
  if (!isEnabled) return false;

  if (isError) return responseError(error.error, error.inputErrors, error.status);

  return responseSuccess(success.message, success.data, success.status);
}

export function isResponseMock(target = "") {
  return settings.forms[target]?.mockConfig?.isEnabled || false;
}

// Helper to serialize Mongoose objects (convert ObjectIds, Dates to strings/numbers compatible with JSON)
export const cleanObject = (obj) => {
  if (!obj) return null;
  return JSON.parse(JSON.stringify(obj));
};

const emailSchema = z.email();

export const validateEmail = (email) => {
  if (!email) return { isValid: false, error: "Email is required" };

  // 1. Format validation using Zod
  const result = emailSchema.safeParse(email);
  if (!result.success) {
    return { isValid: false, error: "Invalid email format" };
  }

  // 2. Check for '+' aliases
  if (email.includes("+")) {
    return { isValid: false, error: "Email aliases with '+' are not allowed" };
  }

  // 3. Check for disposable domains
  const domain = email.split("@")[1].toLowerCase();
  if (blockedDomains.includes(domain)) {
    return { isValid: false, error: "Disposable email domains are not allowed" };
  }

  return { isValid: true };
};

export const getAnalyticsDateRange = (range = "30d") => {
  const startDate = new Date();
  const endDate = new Date(); // Default to now

  // Reset to start of day for cleaner calculations
  startDate.setHours(0, 0, 0, 0);

  switch (range) {
    case "today":
      // Start is today 00:00, End is now
      break;
    case "yesterday":
      startDate.setDate(startDate.getDate() - 1);

      // End date should be end of yesterday
      const yEnd = new Date(startDate);
      yEnd.setHours(23, 59, 59, 999);
      return { startDate, endDate: yEnd };
    case "7d":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(startDate.getDate() - 30);
      break;
    case "3m":
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case "thisYear":
      startDate.setMonth(0, 1); // Jan 1st
      break;
    case "lastYear":
      startDate.setFullYear(startDate.getFullYear() - 1, 0, 1);

      // End date is Dec 31st of last year
      const lEnd = new Date(startDate);
      lEnd.setFullYear(lEnd.getFullYear(), 11, 31);
      lEnd.setHours(23, 59, 59, 999);
      return { startDate, endDate: lEnd };
    default:
      // Default 30d
      startDate.setDate(startDate.getDate() - 30);
  }

  return { startDate, endDate };
};

export const generateLogoBase64 = (styling, visual) => {
  if (!styling || !visual) return "";

  const theme = styling.theme || "light";
  const colors = themeColors[theme] || themeColors.light;

  const primaryColor = oklchToHex(colors["--color-primary"]); // fallback violet

  const shape = visual.logo.shape || "star";
  // Use the 'logos' list from @/lists/logos to support all shapes.
  return internalGenerate(styling, shape, primaryColor);
};


function internalGenerate(styling, shape, primaryColor) {
  const logoData = logos[shape] || logos["star"]; // Fallback to star
  const radiusMap = {
    "rounded-none": 0, "rounded-sm": 2, "rounded-md": 6, "rounded-lg": 8,
    "rounded-xl": 12, "rounded-2xl": 16, "rounded-3xl": 24, "rounded-full": 16
  };

  let radius = 4;
  const elementClasses = styling.components?.element || "";
  for (const [cls, r] of Object.entries(radiusMap)) {
    if (elementClasses.includes(cls)) radius = r;
  }

  const paths = logoData.path.map(d => `<path d="${d}" fill="#ffffff" stroke="none" />`).join("");
  const circles = (logoData.circle || []).map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="#ffffff" stroke="none" />`).join("");
  const rects = (logoData.rect || []).map(r => `<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" rx="${r[4]}" fill="#ffffff" stroke="none" />`).join("");

  const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect x="0" y="0" width="32" height="32" rx="${radius}" fill="${primaryColor}" />
  <g transform="translate(8, 8)">
    <svg width="16" height="16" viewBox="0 0 24 24">
      ${paths}
      ${circles}
      ${rects}
    </svg>
  </g>
</svg>
    `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
}
