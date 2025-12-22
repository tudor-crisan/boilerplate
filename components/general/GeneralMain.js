
export default function GeneralMain({ className = "", children }) {
  return (
    <main className={`${className} min-h-screen`}>
      {children}
    </main>
  )
}