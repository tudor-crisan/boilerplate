import styling from "@/config/styling.json";

export default function LogoIcon() {
  const { wrapperStyle, svgStyle, strokeWidth } = styling.logo;
  return (
    <div className={`${wrapperStyle} inline-flex items-center justify-center`}>
      <svg
        className={svgStyle}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {styling.logo.paths.map((d, index) => (
          <path key={index} d={d} />
        ))}
      </svg>
    </div>
  );
}