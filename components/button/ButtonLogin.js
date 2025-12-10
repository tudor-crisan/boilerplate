import Link from "next/link";

export default function ButtonLogin({ isLoggedIn }) {
  if (isLoggedIn) {
    return (
      <Link href="/dashboard" className="btn btn-primary">
        Go to dashboard
      </Link>
    );
  }

  return <Link href="/login">Login</Link>;
}
