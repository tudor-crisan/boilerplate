import logos from "@/lists/logos";
import { defaultVisual } from "@/libs/defaults";

export default function EmailIconLogo({ branding }) {
  const { shape, container, svg } = defaultVisual.logo;
  const logoData = logos[shape];

  if (!logoData) return null;

  // Extract styles based on common Tailwind classes found in visual.logo.container
  // This is a naive extraction but covers standard cases like "bg-primary text-base-100"
  const bgColor = container.includes("bg-primary") ? branding.themeColor :
    container.includes("bg-base-100") ? branding.base100 : "transparent";

  const textColor = container.includes("bg-primary") ? "#ffffff" :
    container.includes("text-base-100") ? branding.base100 :
      container.includes("text-primary") ? branding.themeColor :
        container.includes("text-base-content") ? branding.content : "#ffffff";

  // size-8 is 32px
  const containerSize = "32px";

  // size-4 is 16px
  const svgSize = "16px";

  const containerStyle = {
    display: "inline-block",
    width: containerSize,
    height: containerSize,
    backgroundColor: bgColor,
    color: textColor,
    borderRadius: branding.btnRoundness, // Using element roundness per IconLogo usage
    marginRight: "16px",
    verticalAlign: "middle",
    textAlign: "center",
    lineHeight: containerSize,
    textDecoration: "none"
  };

  // Hardcoded path for fallback/debugging to ensure rendering
  const STAR_PATH = "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z";

  // Use logoData but fallback to hardcoded star if path is empty/missing logic
  const paths = logoData?.path?.length ? logoData.path : [STAR_PATH];

  // Force white for primary background
  const finalFill = container.includes("bg-primary") ? "white" : textColor;

  return (
    <div style={containerStyle}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={svg.viewbox}
        width={svgSize}
        height={svgSize}
        fill={svg.fill === "currentColor" ? finalFill : "none"}
        stroke={svg.stroke === "currentColor" ? finalFill : "none"}
        strokeWidth={svg.strokewidth}
        strokeLinecap={svg.strokelinecap}
        strokeLinejoin={svg.strokelinejoin}
        preserveAspectRatio="xMidYMid meet"
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          width: svgSize,
          height: svgSize,
          fill: svg.fill === "currentColor" ? finalFill : "none",
          stroke: svg.stroke === "currentColor" ? finalFill : "none"
        }}
      >
        {paths.map((d, i) => (
          <path
            key={`path-${i}`}
            d={d}
          />
        ))}
        {logoData.circle && logoData.circle.map((c, i) => (
          <circle
            key={`circle-${i}`}
            cx={c[0]}
            cy={c[1]}
            r={c[2]}
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
          />
        ))}
      </svg>
    </div>
  );
}
