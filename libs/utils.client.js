
export function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

export function pluralize(word = '', count = 0) {
  return word + (count > 1 ? 's' : '')
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