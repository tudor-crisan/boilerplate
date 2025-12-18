"use client";
import { useVisual } from "@/context/ContextVisual";
import sections from "@/lists/sections";

export default function PageHome() {
  const { visual } = useVisual();
  return (
    <main>
      {visual.homepage.sections.map((key, index) => {
        const Component = sections[key];
        return Component ? <Component key={index} /> : null;
      })}
    </main>
  );
}
