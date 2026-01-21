"use client";

import { useStyling } from "@/context/ContextStyling";
import { isThemeDark } from "@/libs/colors";
import React from "react";

/**
 * Escapes special characters in a string for use in a regular expression.
 */
export const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Strips HTML tags from a string.
 */
export const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
};

/**
 * Hook that provides highlighting functionality and components.
 */
const useHighlight = () => {
  const { styling } = useStyling();
  const isDark = isThemeDark(styling.theme);

  const HighlightedText = ({ text, highlight }) => {
    if (!highlight || !text) return <span>{text}</span>;

    const parts = text.split(new RegExp(`(${escapeRegExp(highlight)})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span
              key={i}
              className={`${
                isDark ? "bg-yellow-600 text-white" : "bg-yellow-200 text-black"
              } rounded-sm px-0.5`}
            >
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </span>
    );
  };

  return { HighlightedText, escapeRegExp, stripHtml };
};

export default useHighlight;
