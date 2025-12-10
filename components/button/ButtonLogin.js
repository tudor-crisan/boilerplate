import Link from "next/link";

export default function ButtonLogin({ isLoggedIn, extraStyle = '' }) {
  if (isLoggedIn) {
    return (
      <Link href="/dashboard" className={`btn btn-primary ${extraStyle}`}>
        Go to dashboard
      </Link>
    );
  }

  return (
    <Link href="/login" className="btn btn-outline">
      Login
    </Link>
  );
}
