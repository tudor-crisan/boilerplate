import { NextResponse } from "next/server";
import { defaultSetting as settings } from "@/libs/defaults";

export const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://" + process.env.NEXT_PUBLIC_DOMAIN;
};

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