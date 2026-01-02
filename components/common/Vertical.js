export default function Vertical({ className = "", children }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {children}
    </div>
  )
}
