import { NextResponse } from "next/server";
import settings from "@/config/settings.json";

export function getEmailHandle(email, fallback = "") {
  const match = email.match(/^([^@+]+)/);
  return match ? match[1] : fallback;
}

export function frontendMock(target = "") {
  const { isEnabled, givesError, givesSuccess } = settings.mocks[target];
  if (!isEnabled) return "";
  if (givesError) return `Mock is enabled for "${target}" to respond with errors ❌`;
  if (givesSuccess) return `Mock is enabled for "${target}" to respond with success ✅`;
}

///////////// server-side //////////////////

export function responseSuccess(message = "", data = {}, status = 200) {
  return NextResponse.json({ message, data }, { status });
}

export function responseError(error = "", errors = {}, status = 401) {
  return NextResponse.json({ error, errors }, { status })
}

export function responseMock(target = "") {
  const { isEnabled, givesError, givesSuccess, responses } = settings.mocks[target];
  if (!isEnabled) return false;

  if (givesError) return responseError(responses.error, responses.errors);
  if (givesSuccess) return responseSuccess(responses.message, responses.data);

  return false;
}

