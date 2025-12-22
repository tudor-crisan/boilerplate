
export default function Paragraph({ className, children }) {
  return (
    <p className={`text-base-content/70 ${className}`}>
      {children}
    </p>
  )
}