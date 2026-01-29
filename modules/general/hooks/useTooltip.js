"use client";
import { useState } from "react";

export default function useTooltip() {
  const [isVisible, setIsVisible] = useState(false);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  return {
    isVisible,
    show,
    hide,
  };
}
