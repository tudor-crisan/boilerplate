export default function DashboardHeader({ children }) {
  return (
    <section className={`max-w-5xl mx-auto bg-base-100 flex justify-between items-center px-3 sm:px-5 py-3`}>
      {children}
    </section>
  )
}