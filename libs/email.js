import emailTemplates from '@/lists/emailTemplates';
import { getEmailBranding } from '@/components/emails/email-theme';
import { defaultSetting as settings } from "@/libs/defaults";

export const sendEmail = async ({
  apiUrl = settings.integrations?.resend?.baseUrl || "https://api.resend.com", // Fallback if settings structure differs
  apiPath = "/emails", // Make sure to handle leading slash if needed, api.js had "emails" but base might not have slash
  method = "POST",
  apiKey = process.env.RESEND_API_KEY,
  from,
  email,
  subject,
  html,
  text,
  replyTo,
  headers
}) => {
  try {
    const base = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const path = apiPath.startsWith('/') ? apiPath : '/' + apiPath;
    const fullUrl = base + path;

    const body = {
      from: from,
      to: email,
      reply_to: replyTo,
      subject,
      html,
      text,
      headers
    };

    console.log("resend API request body:", JSON.stringify(body, null, 2));

    const res = await fetch(fullUrl, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(JSON.stringify(error));
    }
  } catch (err) {
    throw new Error(err);
  }
}

export async function QuickLinkEmail({ host, url, styling, isTest = false }) {
  const { appName } = getEmailBranding(styling);
  const { QuickLinkTemplate } = emailTemplates;
  const { renderToStaticMarkup } = (await import('react-dom/server')).default;

  const businessWebsite = settings.business?.website;
  const redirectUrl = businessWebsite + `?redirect=${encodeURIComponent(url)}`;

  const subject = `${isTest ? `[TEST ${new Date().toLocaleTimeString()}] ` : ""}Sign in to ${appName}`;
  const text = `Sign in to ${appName}\n\nIf you did not request this email you can safely ignore it.`;

  const html = "<!DOCTYPE html>" + renderToStaticMarkup(<QuickLinkTemplate host={host} url={redirectUrl} styling={styling} />);

  return { subject, html, text };
}

export async function WeeklyDigestEmail({ baseUrl, userName, boards, styling, isTest = false }) {
  const { appName } = getEmailBranding(styling);
  const { WeeklyDigestTemplate } = emailTemplates;
  const { renderToStaticMarkup } = (await import('react-dom/server')).default;

  const businessWebsite = settings.business?.website;
  const redirectUrl = businessWebsite + `?redirect=${encodeURIComponent(url)}`;

  const subject = `${isTest ? `[TEST ${new Date().toLocaleTimeString()}] ` : ""}Your Weekly Board Stats 📈`;
  // Simple text fallback
  const text = `Hi ${userName || 'there'}, here is your weekly summary for your boards. Please check the html version.\n${appName}`;

  const html = "<!DOCTYPE html>" + renderToStaticMarkup(<WeeklyDigestTemplate baseUrl={redirectUrl} userName={userName} boards={boards} styling={styling} />);

  return { subject, html, text };
}
