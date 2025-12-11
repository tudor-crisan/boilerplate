import styling from "@/config/styling.json";

export default function LogoIcon() {
  return (
    <div className={`${styling.logo.wrapperStyle} ${styling.roundness[0]} ${styling.shadows[0]} inline-flex items-center justify-center`}>
      <svg
        className={styling.logo.svgStyle}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={styling.logo.stroke.width}
        strokeLinecap={styling.logo.stroke.linecap}
        strokeLinejoin={styling.logo.stroke.linejoin}
      >
        {styling.logo.paths.map((d, index) => (
          <path key={index} d={d} />
        ))}
      </svg>
    </div>
  );
}