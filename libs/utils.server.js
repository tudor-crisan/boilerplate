import { z } from "zod";
import { NextResponse } from "next/server";
import { defaultSetting as settings } from "@/libs/defaults";
import blockedDomains from "@/lists/blockedDomains";

export const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://" + process.env.NEXT_PUBLIC_DOMAIN;
};

export function formatWebsiteUrl(url = "") {
  if (!url) return "";
  // remove any protocol and www to force https://www.
  const clean = url.replace(/(^\w+:|^)\/\//, '').replace(/^www\./, '');
  return `https://www.${clean}`;
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