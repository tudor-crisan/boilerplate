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

  const textColor = container.includes("text-base-100") ? branding.base100 :
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
    borderRadius: branding.btnRoundness, // Using element roundness per IconLogo usage
    marginRight: "12px",
    verticalAlign: "middle"
  };

  return (
    <div style={containerStyle}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={svg.viewbox}
        fill={svg.fill === "none" ? "none" : (svg.fill === "currentColor" ? textColor : svg.fill)}
        stroke={svg.stroke === "currentColor" ? textColor : svg.stroke}
        strokeWidth={svg.strokewidth}
        strokeLinecap={svg.strokelinecap}
        strokeLinejoin={svg.strokelinejoin}
        style={{ display: "block" }}
      >
        {logoData.path.map((d, i) => (
          <path key={`path-${i}`} d={d} />
        ))}
        {logoData.circle.map((c, i) => (
          <circle key={`circle-${i}`} cx={c[0]} cy={c[1]} r={c[2]} />
        ))}
        {logoData.rect.map((r, i) => (
          <rect key={`rect-${i}`} x={r[0]} y={r[1]} width={r[2]} height={r[3]} rx={r[4]} />
        ))}
      </svg>
    </div>
  );
}
