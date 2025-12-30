
export default function Sidebar({ className = "", children }) {
  return (
    <div className={`w-full sm:w-96 shrink-0 sm:sticky top-6 ${className}`}>
      {children}
    </div>
  )
}
