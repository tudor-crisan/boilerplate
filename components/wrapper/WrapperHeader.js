"use client";
import { useStyling } from "@/context/ContextStyling";
import { useVisual } from "@/context/ContextVisual";

export default function WrapperHeader({ children }) {
  const { styling } = useStyling();
  const { visual } = useVisual();

  const { menu, button } = visual.show.SectionHeader;
  const flexClassName = styling.flex[(!menu && !button) ? 'center' : 'between'];

  return (
    <div className={`${styling.general.container} ${flexClassName} ${styling.components.header}`}>
      {children}
    </div>
  )
}