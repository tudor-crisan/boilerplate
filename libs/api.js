import { defaultSetting as settings } from "@/libs/defaults";

const {
  serverError,
  requestSuccessful,
  noInternetConnection,
} = settings.forms.general.backend.responses;

export const setDataError = (response = null, errorCallback = null) => {
  if (response?.code === "ERR_NETWORK") {
    errorCallback(noInternetConnection.message, {}, noInternetConnection.status);
    return;
  };

  const { data, status, statusText } = response;
  if ([400, 401, 402, 403, 404, 429, 500].includes(status)) {
    const error = data?.error || statusText || serverError;
    const inputErrors = data?.inputErrors || {};
    if (errorCallback) {
      errorCallback(error, inputErrors, status);
    }
    return true;
  }
  return false;
}

export const setDataSuccess = (response = null, successCallback = null) => {
  if (!response) return;

  const { data, status, statusText } = response;
  if ([200].includes(status)) {
    const message = data.message || statusText || requestSuccessful;
    if (successCallback) {
      successCallback(message, data.data, status);
    }
    return true;
  }
  return false;
}

export const sendEmail = async ({
  apiUrl = "https://api.resend.com/",
  apiPath = "emails",
  method = "POST",
  apiKey = "",
  from,
  email,
  subject,
  html,
  text
}) => {
  try {
    const res = await fetch(apiUrl + apiPath, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from,
        to: email,
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(JSON.stringify(error));
    }
  } catch (err) {
    throw new Error(err);
  }
}
