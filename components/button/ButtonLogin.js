"use client";
import Link from "next/link";
import { useStyling } from "@/components/base/StylingContext";

export default function ButtonLogin({ isLoggedIn, extraStyle = '' }) {
  const { styling } = useStyling();
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
