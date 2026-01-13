import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getEmailHandle(email = "", fallback = "") {
  const match = email.match(/^([^@+]+)/);
  return match ? match[1] : fallback;
}

export function getNameInitials(name = "") {
  name = name.toString();
  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 0) return "";

  if (parts.length === 1) {
    const part = parts[0];
    // If name contains numbers (e.g. c214435), return just the first letter
    if (/\d/.test(part)) {
      return part.slice(0, 1).toUpperCase();
    }
    // Otherwise return first two letters (e.g. Tudor -> TU)
    return part.slice(0, 2).toUpperCase();
  }

  // If multiple names (e.g. Tudor Crisan), return first letter of first and last name
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return (first + last).toUpperCase();
}

export function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

export function pluralize(word = '', count = 0) {
  return word + ((count > 1 || count === 0) ? 's' : '')
}

export function baseUrl() {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://" + process.env.NEXT_PUBLIC_DOMAIN
}

export function oklchToHex(oklchStr) {
  if (!oklchStr || !oklchStr.startsWith("oklch(")) return "#000000";

  // Parse: oklch(L% C H) or oklch(L C H)
  // Remove "oklch(" and ")" and split by space/dividers
  const match = oklchStr.match(/oklch\(([^)]+)\)/);
  if (!match) return "#000000";

  const parts = match[1].trim().split(/\s+/);
  if (parts.length < 3) return "#000000";

  let l = parseFloat(parts[0]);
  if (parts[0].includes('%')) {
    l = l / 100;
  }
  const c = parseFloat(parts[1]);
  const h = parseFloat(parts[2]);

  // Convert OKLCH to linear RGB (D65)
  // Using standard conversion matrices from OKLAB/OKLCH spec

  // 1. OKLCH -> OKLAB
  const L = l;
  const a = c * Math.cos(h * Math.PI / 180);
  const b = c * Math.sin(h * Math.PI / 180);

  // 2. OKLAB -> Linear sRGB (approximate)
  // First OKLAB -> LMS
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l_lin = l_ * l_ * l_;
  const m_lin = m_ * m_ * m_;
  const s_lin = s_ * s_ * s_;

  // LMS -> Linear RGB
  let r = +4.0767416621 * l_lin - 3.3077115913 * m_lin + 0.2309699292 * s_lin;
  let g = -1.2684380046 * l_lin + 2.6097574011 * m_lin - 0.3413193965 * s_lin;
  let bl = -0.0041960863 * l_lin - 0.7034186147 * m_lin + 1.7076147010 * s_lin;

  // 3. Linear RGB -> sRGB (Gamma Corrected)
  r = r >= 0.0031308 ? 1.055 * Math.pow(r, 1.0 / 2.4) - 0.055 : 12.92 * r;
  g = g >= 0.0031308 ? 1.055 * Math.pow(g, 1.0 / 2.4) - 0.055 : 12.92 * g;
  bl = bl >= 0.0031308 ? 1.055 * Math.pow(bl, 1.0 / 2.4) - 0.055 : 12.92 * bl;

  // Clamp 0-1
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  bl = Math.max(0, Math.min(1, bl));

  // 4. Trace to Hex
  const toHex = (n) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

let clientId = null;
export function getClientId() {
  if (!clientId && typeof window !== 'undefined') {
    clientId = Math.random().toString(36).substring(2, 15);
  }
  return clientId;
}

export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // As Base64 string
  return canvas.toDataURL("image/jpeg");
}

export function createSlug(name = "", trim = true) {
  const slug = name.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const cleaned = trim ? slug.replace(/^-+|-+$/g, '') : slug;
  return cleaned.slice(0, 30);
}

export function formatCommentDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
