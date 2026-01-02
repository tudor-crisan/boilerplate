
export default function Columns({ className = "", children }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-start sm:gap-4 gap-10 pb-12 ${className}`}>
      {children}
    </div>
  )
}
