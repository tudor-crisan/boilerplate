"use client";
import { useAuth } from "@/context/ContextAuth";

export default function DashboardMessage() {
  const { isLoggedIn, email, name, initials } = useAuth();

  if (isLoggedIn) {
    return (
      <div>
        <h1 className="font-extrabold text-2xl mb-1">
          Dashboard
        </h1>
        <p>
          Welcome back <span className="font-bold">&quot;{name}&quot;</span> with intials <span className="font-bold">&quot;{initials}&quot;</span>. You&apos;re logged in from <span className="font-bold">&quot;{email}&quot;</span>
        </p>
      </div>
    );
  }

  return null;
}