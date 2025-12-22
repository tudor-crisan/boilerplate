import Main from "@/components/common/Main";

export default function DashboardWrapper({ children }) {
  return (
    <Main className="bg-base-200">
      {children}
    </Main>
  )
}