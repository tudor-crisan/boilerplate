import { loadAppEnv } from "./env";

loadAppEnv();

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

const renderTemplate = async (Template, props, styling) => {
  const { appName } = getEmailBranding(styling);
  const { renderToStaticMarkup } = (await import('react-dom/server')).default;
  const html = "<!DOCTYPE html>" + renderToStaticMarkup(<Template {...props} styling={styling} />);
  return { html, appName };
}

const getSubject = (text, isTest) => {
  return `${isTest ? `[TEST ${new Date().toLocaleTimeString()}] ` : ""}${text}`;
}

export async function QuickLinkEmail({ host, url, styling, isTest = false }) {
  const { QuickLinkTemplate } = emailTemplates;
  const businessWebsite = settings.business?.website;
  const redirectUrl = businessWebsite + `?redirect=${encodeURIComponent(url)}`;

  const { html, appName } = await renderTemplate(QuickLinkTemplate, { host, url: redirectUrl }, styling);

  const subject = getSubject(`Sign in to ${appName}`, isTest);
  const text = `Sign in to ${appName}\n\nIf you did not request this email you can safely ignore it.`;

  return { subject, html, text };
}

export async function WeeklyDigestEmail({ baseUrl, userName, boards, styling, isTest = false }) {
  const { WeeklyDigestTemplate } = emailTemplates;
  const businessWebsite = settings.business?.website;
  const redirectUrl = businessWebsite + `?redirect=${encodeURIComponent(baseUrl)}`;

  const { html, appName } = await renderTemplate(WeeklyDigestTemplate, { baseUrl: redirectUrl, userName, boards }, styling);

  const subject = getSubject(`Your Weekly Board Stats 📈`, isTest);
  const text = `Hi ${userName || 'there'}, here is your weekly summary for your boards. Please check the html version.\n${appName}`;

  return { subject, html, text };
}
