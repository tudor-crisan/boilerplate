import { defaultVisual, defaultSetting } from "@/libs/defaults";

export default function EmailIconLogo({ branding }) {
  // Use the favicon logic as requested, ignoring complex SVG implementation.
  const faviconHref = defaultVisual.favicon?.href || "";
  const website = defaultSetting.business?.website || defaultSetting.appUrl || "";

  // Construct absolute URL
  const logoUrl = (faviconHref.startsWith("/") && website)
    ? `${website}${faviconHref}`
    : faviconHref;

  // Render logo if URL exists
  if (!logoUrl) return null;

  const containerSize = "32px";

  const containerStyle = {
    display: "inline-block",
    width: containerSize,
    height: containerSize,
    borderRadius: branding?.btnRoundness || "4px",
    verticalAlign: "middle",
    marginRight: "12px",
    backgroundColor: "transparent" // Ensure no background conflict
  };

  const imgStyle = {
    display: "block",
    width: "100%",
    height: "100%",
    borderRadius: branding?.btnRoundness || "4px",
    objectFit: "contain",
    // Ensure image is fully visible
    border: "none",
    outline: "none"
  };

  return (
    <div style={containerStyle}>
      <img
        src={logoUrl}
        alt="Logo"
        width="32"
        height="32"
        style={imgStyle}
      />
    </div>
  );
}
