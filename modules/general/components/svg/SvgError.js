export default function SvgError({ className = "size-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`stroke-current shrink-0 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
