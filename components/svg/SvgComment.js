export default function SvgComment({ size = "size-4" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={size}>
      <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 2 3.614 2 5.196V11.8c0 1.582 1.806 2.746 2.93 2.885l.024.239a1.92 1.92 0 001.077 1.564l1.817.808a.375.375 0 00.417-.11l2.484-3.081a.5.5 0 00.08-.27v-.086A14.288 14.288 0 0010 13a14.288 14.288 0 005.07-.31c1.124-.139 2.93-1.303 2.93-2.885V5.196c0-1.582-1.806-2.746-2.93-2.885A14.286 14.286 0 0010 2z" clipRule="evenodd" />
    </svg>
  );
}
