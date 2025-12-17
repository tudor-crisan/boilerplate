import ProfileTitle from "@/components/profile/ProfileTitle";

export default function DashboardSectionMain({ children }) {
  return (
    <section className="max-w-5xl mx-auto px-5 py-6">
      <ProfileTitle />
      <div className="my-6">
        {children}
      </div>
    </section>
  )
}