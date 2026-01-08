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