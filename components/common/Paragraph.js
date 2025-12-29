
export default function Paragraph({ className = '', children }) {
  return (
    <p className={`text-base-content/70 overflow-auto ${className}`}>
      {children}
    </p>
  )
}