"use client";
import { useVisual } from "@/context/ContextVisual";
import sections from "@/lists/sections";
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata();
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
