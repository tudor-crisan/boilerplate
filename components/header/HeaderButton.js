import ButtonLogin from "@/components/button/ButtonLogin";

export default function HeaderButton() {
  return (
    <div>
      <ButtonLogin
        loggedInText="Dashboard"
        loggedOutText="Login"
      />
    </div>
  )
}
