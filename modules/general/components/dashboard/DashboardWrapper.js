import Main from "@/modules/general/components/common/Main";

export default function DashboardWrapper({ className = "", children }) {
  return <Main className={`bg-base-200 ${className}`}>{children}</Main>;
}
