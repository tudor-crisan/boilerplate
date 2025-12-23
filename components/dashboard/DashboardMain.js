
export default function DashboardMain({ children, className = "" }) {
  return (
    <section className={`max-w-5xl mx-auto px-5 py-6 ${className}`}>
      {children}
    </section>
  )
}