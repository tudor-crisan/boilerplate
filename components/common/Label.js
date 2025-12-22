
export default function Label({ className, children }) {
  return (
    <label className={`text-sm sm:text-md font-bold ${className}`}>
      {children}
    </label>
  )
}