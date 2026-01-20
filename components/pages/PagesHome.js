"use client";
import Main from "@/components/common/Main";
import { useVisual } from "@/context/ContextVisual";
import sections from "@/lists/sections";

export default function PageHome() {
  const { visual } = useVisual();
  return (
    <Main className="bg-base-100">
      {visual.homepage.sections.map((key, index) => {
        const Component = sections[key];
        return Component ? <Component key={index} /> : null;
      })}
    </Main>
  );
}
