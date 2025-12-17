import { NextResponse } from "next/server";
import { defaultSetting as settings } from "@/libs/defaults";

export function getEmailHandle(email, fallback = "") {
  const match = email.match(/^([^@+]+)/);
  return match ? match[1] : fallback;
}

export function responseSuccess(message = "", data = {}, status = 200) {
  return NextResponse.json({ message, data }, { status });
}

export function responseError(error = "", inputErrors = {}, status = 401) {
  return NextResponse.json({ error, inputErrors }, { status })
}

export function responseMock(target = "") {
  const { isEnabled, isError, isSuccess, responses: { error, success } } = settings.forms[target].mockConfig;
  if (!isEnabled) return false;

  if (isError) return responseError(error.error, error.inputErrors, error.status);
  if (isSuccess) return responseSuccess(success.message, success.data, success.status);

  return false;
}

export function isResponseMock(target = "") {
  return settings.forms[target]?.mockConfig?.isEnabled || false;
}
