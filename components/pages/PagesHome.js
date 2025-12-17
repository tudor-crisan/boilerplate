"use client";
import { useVisual } from "@/context/ContextVisual";
import components from "@/lists/components";

export default function PageHome() {
  const { visual } = useVisual();
  return (
    <main>
      {visual.homepage.sections.map((key, index) => {
        const Component = components.sections[key];
        return Component ? <Component key={index} /> : null;
      })}
    </main>
  );
}
