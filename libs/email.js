
import emailTemplates from '@/lists/emailTemplates';
import { getEmailBranding } from '@/components/emails/email-theme';

export async function MagicLinkEmail({ host, url }) {
  const { appName } = getEmailBranding();
  const { MagicLinkTemplate } = emailTemplates;
  const { renderToStaticMarkup } = (await import('react-dom/server')).default;

  const subject = `Sign in to ${appName}`;
  const text = `Sign in to ${appName}\n${url}\n\nIf you did not request this email you can safely ignore it.`;

  const html = "<!DOCTYPE html>" + renderToStaticMarkup(<MagicLinkTemplate host={host} url={url} />);

  return { subject, html, text };
}
