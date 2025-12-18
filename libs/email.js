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
    if (val.includes("shadow-sm")) return "0 1px 2px 0 rgb(0 0 0 / 0.05)";
    if (val.includes("shadow-md")) return "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)";
    if (val.includes("shadow-lg")) return "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)";
    if (val.includes("shadow-xl")) return "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)";
    if (val.includes("shadow-2xl")) return "0 25px 50px -12px rgb(0 0 0 / 0.25)";
    if (val.includes("shadow-none")) return "none";
    return "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"; // default shadow
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
    const themeColor = themeColors[defaultStyling.theme] || "#000000";
    const appName = defaultCopywriting.SectionHeader.appName || "App";
    const font = defaultStyling.font ? `${defaultStyling.font}, sans-serif` : "sans-serif";

    return {
        themeColor,
        appName,
        font,
        cardRoundness: getRoundness(1),
        btnRoundness: getRoundness(0),
        cardShadow: getShadow(1),
        cardBorder: getBorder(0, themeColor)
    };
}

export function MagicLinkEmail({ host, url }) {
    const { themeColor, appName, font, cardRoundness, btnRoundness, cardShadow, cardBorder } = getEmailBranding();

    const subject = `Sign in to ${appName}`;
    const text = `Sign in to ${appName}\n${url}\n\nIf you did not request this email you can safely ignore it.`;

    const html = `
    <div style="background-color: #f9fafb; padding: 40px 0; font-family: ${font};">
      <div style="max-width: 400px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: ${cardRoundness}; box-shadow: ${cardShadow}; border: ${cardBorder};">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: ${themeColor};">${appName}</h1>
        </div>
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 16px 0;">Sign in to ${host}</h2>
          <a href="${url}" style="display: inline-block; background-color: ${themeColor}; color: #ffffff; padding: 12px 32px; border-radius: ${btnRoundness}; text-decoration: none; font-weight: 500;">Sign in</a>
        </div>
        <p style="font-size: 14px; color: #6b7280; text-align: center; margin: 0;">
          If you did not request this email you can safely ignore it.
        </p>
      </div>
    </div>
  `;

    return { subject, html, text };
}
