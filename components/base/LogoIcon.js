import styling from "@/config/styling.json";

export default function LogoIcon({ children }) {
  const { wrapper, icon, width, rounded, text } = styling.logo.props;

  return (
    <div className={`size-${wrapper} inline-flex items-center justify-center p-1 rounded-${rounded} bg-primary text-${text}`}>
      <svg
        className={`size-${icon}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={width}
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