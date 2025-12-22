import ButtonLogin from "@/components/button/ButtonLogin";

export default function HeaderButton() {
  return (
    <div>
      <ButtonLogin
        className="btn-outline"
        loggedInText="Dashboard"
        loggedOutText="Login"
      />
    </div>
  )
}
