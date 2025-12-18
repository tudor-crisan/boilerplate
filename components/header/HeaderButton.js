import ButtonLogin from "@/components/button/ButtonLogin";

export default function HeaderButton() {
  return (
    <div>
      <ButtonLogin
        className="btn-outline btn-sm sm:btn-md"
        loggedInText="Dashboard"
        loggedOutText="Login"
      />
    </div>
  )
}
