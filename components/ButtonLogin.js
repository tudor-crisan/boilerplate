import Link from "next/link";

const ButtonLogin = ({ isLoggedIn, name }) => {
  if (isLoggedIn) {
    return <Link href="/dashboard">Welcome back {name}</Link>;
  }

  return <Link href="/login">Login</Link>;
}

export default ButtonLogin;