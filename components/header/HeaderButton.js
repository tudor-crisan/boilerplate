import ButtonLogin from "@/components/button/ButtonLogin";

export default function HeaderButton({ className = "" }) {
  return (
    <div className={className}>
      <ButtonLogin
        className="btn-outline"
        loggedInText="Dashboard"
        loggedOutText="Login"
      />
    </div>
  )
}
