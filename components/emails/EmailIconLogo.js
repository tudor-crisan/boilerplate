import { defaultSetting, defaultVisual } from "@/libs/defaults";

export default function EmailIconLogo({ branding }) {
  const { container } = defaultVisual.logo;
  const businessWebsite = defaultSetting.business?.website;
  const faviconHref = businessWebsite + (defaultVisual.favicon.href.startsWith('/') ? '' : '/') + defaultVisual.favicon.href;

  // Extract styles based on common Tailwind classes found in visual.logo.container
  const isPrimaryBg = container.includes("bg-primary");
  const isBase100Bg = container.includes("bg-base-100");

  const bgColor = isPrimaryBg ? branding.themeColor :
    isBase100Bg ? branding.base100 : "transparent";

  // size-8 is 32px
  const containerSize = "32px";

  const containerStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: containerSize,
    height: containerSize,
    backgroundColor: bgColor,
    borderRadius: branding.btnRoundness,
    marginRight: "16px",
    verticalAlign: "middle",
    textDecoration: "none"
  };

  const logoSrc = faviconHref;

  if (!logoSrc) return null;

  return (
    <div style={containerStyle}>
      <img
        src={logoSrc}
        alt="Logo"
        width="32"
        height="32"
        style={{
          display: "block",
          width: "32px",
          height: "32px",
          borderRadius: branding.btnRoundness,
          objectFit: "contain"
        }}
      />
    </div>
  );
}


