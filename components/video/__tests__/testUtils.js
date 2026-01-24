import React from "react";
import { ContextStyling } from "@/context/ContextStyling";
import { defaultStyling } from "@/libs/defaults";

export const StylingProviderMock = ({ children, styling = defaultStyling }) => {
  return (
    <ContextStyling.Provider value={{ styling }}>
      {children}
    </ContextStyling.Provider>
  );
};
