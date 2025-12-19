import { defaultStyling, defaultCopywriting, defaultVisual } from "@/libs/defaults";
import themeColors from "@/lists/themeColors";
import { oklchToHex } from "@/libs/utils.client";
import { fontMap } from "@/lists/fonts";

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

const getEmailBranding = () => {
  const theme = defaultStyling.theme || "light";
  const colors = themeColors[theme] || themeColors.light;

  // Convert OKLCH strings to HEX
  const themeColor = oklchToHex(colors["--color-primary"]);
  const base100 = oklchToHex(colors["--color-base-100"]);
  const base200 = oklchToHex(colors["--color-base-200"]);
  const content = oklchToHex(colors["--color-base-content"]);

  const appName = defaultCopywriting.SectionHeader.appName || "App";

  // Use font map to get correct Google Font family
  const fontKey = defaultStyling.font || "inter";
  const fontName = fontMap[fontKey] || "Inter";
  const font = `${fontName}, sans-serif`;

  // Determine divider color based on theme (dark vs light)
  const isDark = ["dracula", "dark", "night", "synthwave", "halloween", "forest", "luxury", "abyss", "dim", "business", "sunset", "coffee", "aqua", "black", "luxury", "abyss"].includes(theme);
  const dividerColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  return {
    themeColor,
    base100,
    base200,
    content,
    appName,
    font,
    dividerColor,
    cardRoundness: getRoundness(1),
    btnRoundness: getRoundness(0),
    cardShadow: getShadow(1),
    cardBorder: getBorder(0, themeColor)
  };
}

const getLogoHtml = (host) => {
  const favicon = defaultVisual.favicon;

  if (!favicon || !favicon.href) return "";

  // Construction of absolute URL for the image
  // Check if we are on localhost to use http, otherwise https
  const protocol = host.includes("localhost") ? "http" : "https";
  const imageUrl = `${protocol}://${host}${favicon.href}`;

  return `
    <div style="display: inline-block; vertical-align: middle; margin-right: 12px; line-height: 0;">
      <img 
        src="${imageUrl}" 
        width="32" 
        height="32" 
        alt="Logo" 
        style="display: block; width: 32px; height: 32px; border-radius: ${getRoundness(0)};"
      />
    </div>
  `;
};

/////////////////

export function MagicLinkEmail({ host, url }) {
  const branding = getEmailBranding();
  const { themeColor, base100, base200, content, appName, font, dividerColor, cardRoundness, btnRoundness, cardShadow, cardBorder } = branding;

  const subject = `Sign in to ${appName}`;
  const text = `Sign in to ${appName}\n${url}\n\nIf you did not request this email you can safely ignore it.`;

  // Extract font name for Google Fonts from the mapping (it's already the correct string)
  const primaryFont = font.split(',')[0].trim();

  // URL Encode font family for import
  const fontImportName = primaryFont.replace(/\s+/g, '+');

  const googleFontImport = (primaryFont && primaryFont !== "Sans-serif")
    ? `@import url('https://fonts.googleapis.com/css2?family=${fontImportName}:wght@400;600;700;800&display=swap');`
    : "";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          ${googleFontImport}
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: ${base200};">
        <div style="background-color: ${base200}; padding: 60px 20px; font-family: ${font};">
          <div style="max-width: 440px; margin: 0 auto; background-color: ${base100}; padding: 48px 32px; border-radius: ${cardRoundness}; box-shadow: ${cardShadow}; border: ${cardBorder};">
            <div style="text-align: center; margin-bottom: 40px; white-space: nowrap;">
              ${getLogoHtml(host)}
              <h1 style="display: inline-block; font-size: 28px; font-weight: 800; margin: 0; color: ${themeColor}; letter-spacing: -0.025em; vertical-align: middle;">${appName}</h1>
            </div>
            <div style="text-align: center; margin-bottom: 40px;">
              <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 16px 0; color: ${content};">Sign in to ${host}</h2>
              <p style="font-size: 16px; color: ${content}; opacity: 0.8; margin-bottom: 32px; line-height: 1.5;">Click the button below to securely sign in to your account.</p>
              <a href="${url}" style="display: inline-block; background-color: ${themeColor}; color: #ffffff; padding: 14px 40px; border-radius: ${btnRoundness}; text-decoration: none; font-weight: 600; font-size: 16px;">Sign in</a>
            </div>
            <div style="border-top: 1px solid ${dividerColor}; padding-top: 32px; margin-top: 32px;">
              <p style="font-size: 14px; color: ${content}; opacity: 0.7; text-align: center; margin: 0; line-height: 1.4;">
                If you did not request this email, you can safely ignore it.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return { subject, html, text };
}
