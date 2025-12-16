"use client";
import { useAuth } from "@/context/ContextAuth";

export default function ProfileTitle() {
  const { isLoggedIn, email, name, initials } = useAuth();

  if (isLoggedIn) {
    return (
      <p>
        Welcome back <span className="font-bold">"{name}"</span> with intials <span className="font-bold">"{initials}"</span>. You're logged in from <span className="font-bold">"{email}"</span>
      </p>
    );
  }

  return null;
}