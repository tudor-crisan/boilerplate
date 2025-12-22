
export default function GeneralTitle({ className, children }) {
  return (
    <h1 className={`font-extrabold text-xl ${className}`}>
      {children}
    </h1>
  )
}