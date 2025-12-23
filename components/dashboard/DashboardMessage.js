"use client";
import { useAuth } from "@/context/ContextAuth";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";

export default function DashboardMessage() {
  const { isLoggedIn, email, name, initials } = useAuth();

  if (isLoggedIn) {
    return (
      <div className="space-y-2">
        <Title>
          Dashboard
        </Title>
        <Paragraph>
          Welcome back <span className="font-bold">&quot;{name}&quot;</span> with intials <span className="font-bold">&quot;{initials}&quot;</span>. You&apos;re logged in from <span className="font-bold">&quot;{email}&quot;</span>
        </Paragraph>
      </div>
    );
  }

  return null;
}