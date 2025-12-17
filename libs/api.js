
export const setDataError = (response = null, errorCallback = null) => {
  if (!response) {
    errorCallback("No internet connection");
    return;
  };

  const { data, status, statusText } = response;
  if ([400, 401, 402, 403, 404, 500].includes(status)) {
    const error = data?.error || statusText || "Something went wrong";
    const inputErrors = data?.inputErrors || {};
    if (errorCallback) {
      errorCallback(error, inputErrors);
    }
    return true;
  }
  return false;
}

export const setDataSuccess = (response = null, successCallback = null) => {
  if (!response) return;

  const { data, status, statusText } = response;
  if ([200].includes(status)) {
    const message = data.message || statusText || "Request was successful";
    if (successCallback) {
      successCallback(message);
    }
    return true;
  }
  return false;
}
