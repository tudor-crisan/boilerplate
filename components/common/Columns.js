
export default function Columns({ className = "", children }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-start gap-4 pb-12 ${className}`}>
      {children}
    </div>
  )
}
