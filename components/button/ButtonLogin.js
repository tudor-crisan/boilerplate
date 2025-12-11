import Link from "next/link";
import styling from "@/config/styling.json";

export default function ButtonLogin({ isLoggedIn, extraStyle = '' }) {
  if (isLoggedIn) {
    return (
      <Link href="/dashboard" className={`${styling.shadows[0]} btn btn-primary ${extraStyle}`}>
        Go to dashboard
      </Link>
    );
  }

  return (
    <Link href="/login" className={`${styling.shadows[0]} btn btn-outline ${extraStyle}`}>
      Login
    </Link>
  );
}
