import logos from "@/lists/logos";
import { defaultVisual } from "@/libs/defaults";



export default function EmailIconLogo({ branding }) {
  const { shape, container, svg } = defaultVisual.logo;
  const logoData = logos[shape];

  if (!logoData) return null;

  // Extract styles based on common Tailwind classes found in visual.logo.container
  const isPrimaryBg = container.includes("bg-primary");
  const isBase100Bg = container.includes("bg-base-100");

  const bgColor = isPrimaryBg ? branding.themeColor :
    isBase100Bg ? branding.base100 : "transparent";

  // Determine text color for SVG
  const textColor = isPrimaryBg ? "#ffffff" :
    container.includes("text-base-100") ? branding.base100 :
      container.includes("text-primary") ? branding.themeColor :
        container.includes("text-base-content") ? branding.content : "#ffffff";

  // size-8 is 32px
  const containerSize = "32px";

  // size-4 is 16px
  const svgSize = "16px";

  const containerStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: containerSize,
    height: containerSize,
    backgroundColor: bgColor,
    color: textColor,
    borderRadius: branding.btnRoundness,
    marginRight: "16px", // Restore spacing
    verticalAlign: "middle", // Restore alignment
    textDecoration: "none"
  };

  if (branding.logo) {
    return (
      <div style={containerStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={branding.logo}
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

  const STAR_PATH = "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z";

  const paths = logoData?.path?.length ? logoData.path : [STAR_PATH];

  // Determine effective colors
  const configuredFill = svg.fill || "none";
  const configuredStroke = svg.stroke || "none";

  // If "currentColor" is used, we use the resolved textColor (which handles primary bg logic).
  // We added a safety check: if primary bg, force white.
  const finalFill = (configuredFill === "currentColor" || (isPrimaryBg && configuredFill !== "none")) ? "#ffffff" : configuredFill;
  const finalStroke = (configuredStroke === "currentColor" || (isPrimaryBg && configuredStroke !== "none")) ? "#ffffff" : configuredStroke;

  // Explicit props for the path/rect/circle elements
  const elementProps = {
    fill: finalFill,
    stroke: finalStroke,
    strokeWidth: svg.strokewidth || 2,
    strokeLinecap: svg.strokelinecap || "round",
    strokeLinejoin: svg.strokelinejoin || "round"
  };

  return (
    <div style={containerStyle}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={svg.viewbox || "0 0 24 24"}
        width={svgSize}
        height={svgSize}
        preserveAspectRatio="xMidYMid meet"
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          width: svgSize,
          height: svgSize,
          color: textColor
        }}
      >
        {paths.map((d, i) => (
          <path
            key={`path-${i}`}
            d={d}
            {...elementProps}
          />
        ))}
        {logoData.circle && logoData.circle.map((c, i) => (
          <circle
            key={`circle-${i}`}
            cx={c[0]}
            cy={c[1]}
            r={c[2]}
            {...elementProps}
          />
        ))}
        {logoData.rect && logoData.rect.map((r, i) => (
          <rect
            key={`rect-${i}`}
            x={r[0]}
            y={r[1]}
            width={r[2]}
            height={r[3]}
            rx={r[4]}
            {...elementProps}
          />
        ))}
      </svg>
    </div>
  );
}


