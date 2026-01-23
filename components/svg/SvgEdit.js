export default function SvgEdit({ size = "size-4", className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`${size} ${className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.888 6 18l1.112-4.588 8.646-8.646 2.106-2.278Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.859 10.25 5.304 5.3"
      />
    </svg>
  );
}
