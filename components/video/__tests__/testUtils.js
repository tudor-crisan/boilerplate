import { ContextStyling } from "@/context/ContextStyling";
import { defaultStyling } from "@/libs/defaults";
import React from "react";

export const StylingProviderMock = ({ children, styling = defaultStyling }) => {
  return (
    <ContextStyling.Provider value={{ styling }}>
      {children}
    </ContextStyling.Provider>
  );
};
