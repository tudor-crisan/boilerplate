import GeneralMain from "@/components/general/GeneralMain";

export default function DashboardWrapper({ children }) {
  return (
    <GeneralMain className="bg-base-200">
      {children}
    </GeneralMain>
  )
}