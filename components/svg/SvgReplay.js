export default function SvgReplay({
  size = "size-5",
  className = "",
  strokeWidth = 2,
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={`${size} ${className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v5h5" />
    </svg>
  );
}
