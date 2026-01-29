"use client";
import Main from "@/modules/general/components/common/Main";
import { useVisual } from "@/modules/general/context/ContextVisual";
import sections from "@/modules/general/lists/sections";

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
