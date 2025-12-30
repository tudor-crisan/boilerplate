import { defaultSetting, defaultStyling, defaultVisual } from "@/libs/defaults";
import themeColors from "@/lists/themeColors";
import { oklchToHex } from "@/libs/utils.client";
import { fontMap } from "@/lists/fonts";

export const getRoundness = (idx) => {
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

export const getShadow = (idx) => {
  const val = defaultStyling.shadows?.[idx] || "";
  if (val.includes("shadow-sm")) return "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
  if (val.includes("shadow-md")) return "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
  if (val.includes("shadow-lg")) return "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)";
  if (val.includes("shadow-xl")) return "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)";
  if (val.includes("shadow-2xl")) return "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
  if (val.includes("shadow-none")) return "none";
  return "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)"; // default shadow
};

export const getBorder = (idx, themeColor) => {
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

export const getEmailBranding = () => {
  const theme = defaultStyling.theme || "light";
  const colors = themeColors[theme] || themeColors.light;

  // Convert OKLCH strings to HEX
  const themeColor = oklchToHex(colors["--color-primary"]);
  const base100 = oklchToHex(colors["--color-base-100"]);
  const base200 = oklchToHex(colors["--color-base-200"]);
  const content = oklchToHex(colors["--color-base-content"]);

  const appName = defaultSetting.appName || "App";

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
};

export const getLogoUrl = (host) => {
  const favicon = defaultVisual.favicon;
  if (!favicon || !favicon.href) return "";

  // Construction of absolute URL for the image
  // Check if we are on localhost to use http, otherwise https
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}${favicon.href}`;
};
