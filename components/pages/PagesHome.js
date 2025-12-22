"use client";
import { useVisual } from "@/context/ContextVisual";
import sections from "@/lists/sections";
import GeneralMain from "@/components/general/GeneralMain";

export default function PageHome() {
  const { visual } = useVisual();
  return (
    <GeneralMain className="bg-base-100">
      {visual.homepage.sections.map((key, index) => {
        const Component = sections[key];
        return Component ? <Component key={index} /> : null;
      })}
    </GeneralMain>
  );
}
