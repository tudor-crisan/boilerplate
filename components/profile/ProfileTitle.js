"use client";
import { useAuth } from "@/context/ContextAuth";

export default function ProfileTitle() {
  const { isLoggedIn, email, name, initials } = useAuth();

  if (isLoggedIn) {
    return (
      <div>
        <h1 className="font-extrabold text-2xl mb-1">
          Dashboard
        </h1>
        <p>
          Welcome back <span className="font-bold">"{name}"</span> with intials <span className="font-bold">"{initials}"</span>. You're logged in from <span className="font-bold">"{email}"</span>
        </p>
      </div>
    );
  }

  return null;
}