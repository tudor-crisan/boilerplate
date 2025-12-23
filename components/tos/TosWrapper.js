"use client";
import TosHeader from "@/components/tos/TosHeader";
import Main from "@/components/common/Main";

export default function TosWrapper({ children }) {
  return (
    <Main className="bg-base-100">
      <TosHeader />
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-8">
        {children}
      </div>
    </Main>
  );
}