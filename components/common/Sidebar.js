
export default function Sidebar({ className = "", children }) {
  return (
    <div className={`w-full sm:w-92 shrink-0 sm:sticky top-6 z-40 ${className}`}>
      {children}
    </div>
  )
}
