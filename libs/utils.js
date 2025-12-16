
export function getEmailHandle(email, fallback = "") {
  const match = email.match(/^([^@+]+)/);
  return match ? match[1] : fallback;
}
