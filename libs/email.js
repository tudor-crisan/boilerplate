import { defaultStyling, defaultCopywriting } from "@/libs/defaults";
import themeColors from "@/lists/themeColors";

// Style mapping helpers
const getRoundness = (idx) => {
  const val = defaultStyling.roundness?.[idx] || "";
  if (val.includes("rounded-none")) return "0";
  if (val.includes("rounded-sm")) return "2px";
  if (val.includes("rounded-md")) return "6px";
  if (val.includes("rounded-lg")) return "8px";
  if (val.includes("rounded-xl")) return "12px";
  if (val.includes("rounded-2xl")) return "16px";
  if (val.includes("rounded-3xl")) return "24px";
  if (val.includes("rounded-full")) return "9999px";
  return "4px"; // default rounded
};

const getShadow = (idx) => {
  const val = defaultStyling.shadows?.[idx] || "";
  if (val.includes("shadow-sm")) return "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
  if (val.includes("shadow-md")) return "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
  if (val.includes("shadow-lg")) return "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)";
  if (val.includes("shadow-xl")) return "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)";
  if (val.includes("shadow-2xl")) return "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
  if (val.includes("shadow-none")) return "none";
  return "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)"; // default shadow
};

const getBorder = (idx, themeColor) => {
  const val = defaultStyling.borders?.[idx] || "";
  if (!val || val.includes("border-none")) return "none";
  let width = "1px";
  if (val.includes("border-2")) width = "2px";
  if (val.includes("border-4")) width = "4px";
  if (val.includes("border-8")) width = "8px";

  let color = "#e5e7eb"; // gray-200
  if (val.includes("border-primary")) color = themeColor;

  return `${width} solid ${color}`;
};

export function getEmailBranding() {
  const theme = defaultStyling.theme || "light";
  const colors = themeColors[theme] || themeColors.light;

  const themeColor = colors.primary;
  const base100 = colors.base100;
  const base200 = colors.base200;
  const content = colors.content;

  const appName = defaultCopywriting.SectionHeader.appName || "App";
  const font = defaultStyling.font ? `${defaultStyling.font}, sans-serif` : "sans-serif";

  return {
    themeColor,
    base100,
    base200,
    content,
    appName,
    font,
    cardRoundness: getRoundness(1),
    btnRoundness: getRoundness(0),
    cardShadow: getShadow(1),
    cardBorder: getBorder(0, themeColor)
  };
}

export function MagicLinkEmail({ host, url }) {
  const { themeColor, base100, base200, content, appName, font, cardRoundness, btnRoundness, cardShadow, cardBorder } = getEmailBranding();

  const subject = `Sign in to ${appName}`;
  const text = `Sign in to ${appName}\n${url}\n\nIf you did not request this email you can safely ignore it.`;

  const html = `
    <div style="background-color: ${base200}; padding: 60px 20px; font-family: ${font}; min-height: 100vh;">
      <div style="max-width: 440px; margin: 0 auto; background-color: ${base100}; padding: 48px 32px; border-radius: ${cardRoundness}; box-shadow: ${cardShadow}; border: ${cardBorder};">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 28px; font-weight: 800; margin: 0; color: ${themeColor}; letter-spacing: -0.025em;">${appName}</h1>
        </div>
        <div style="text-align: center; margin-bottom: 40px;">
          <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 16px 0; color: ${content};">Sign in to ${host}</h2>
          <p style="font-size: 16px; color: ${content}; opacity: 0.8; margin-bottom: 32px; line-height: 1.5;">Click the button below to securely sign in to your account.</p>
          <a href="${url}" style="display: inline-block; background-color: ${themeColor}; color: #ffffff; padding: 14px 40px; border-radius: ${btnRoundness}; text-decoration: none; font-weight: 600; font-size: 16px;">Sign in</a>
        </div>
        <div style="border-top: 1px solid rgba(0,0,0,0.1); padding-top: 32px; margin-top: 32px;">
          <p style="font-size: 14px; color: ${content}; opacity: 0.7; text-align: center; margin: 0; line-height: 1.4;">
            If you did not request this email, you can safely ignore it.
          </p>
        </div>
      </div>
    </div>
  `;

  return { subject, html, text };
}
