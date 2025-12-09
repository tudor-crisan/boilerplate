import Link from "next/link";

export default function ButtonLogin({ isLoggedIn, name }) {
  if (isLoggedIn) {
    return <Link href="/dashboard">Welcome back {name}</Link>;
  }

  return <Link href="/login">Login</Link>;
}
