"use client";
import { useStyling } from "@/context/ContextStyling";
import ButtonCopy from "@/components/button/ButtonCopy";

export default function InputCopy({ value }) {
  const { styling } = useStyling();
  return (
    <div className={`${styling.roundness[0]} ${styling.shadows[0]} bg-base-100 text-sm px-4 py-2.5 flex items-center max-w-96`}>
      <p className="truncate">
        {value}
      </p>
      <ButtonCopy copyText={value} />
    </div>
  )
}