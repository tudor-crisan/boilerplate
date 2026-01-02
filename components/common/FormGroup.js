export default function FormGroup({ className = "", children }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {children}
    </div>
  )
}
