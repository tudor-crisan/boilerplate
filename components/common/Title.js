
export default function Title({ className, children }) {
  return (
    <h1 className={`font-extrabold text-lg sm:text-xl ${className}`}>
      {children}
    </h1>
  )
}