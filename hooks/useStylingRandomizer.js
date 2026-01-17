import { useState, useCallback, useEffect } from "react";
import themes from "@/lists/themes";
import { fontMap } from "@/lists/fonts";

export function useStylingRandomizer({ setStyling }) {
  // Shuffle Configuration
  const [shuffleConfig, setShuffleConfig] = useState({
    theme: true,
    font: true,
    styling: true,
    auto: false
  });

  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const handleShuffle = useCallback(() => {
    setStyling((prev) => {
      const newStyling = { ...prev };

      if (shuffleConfig.theme) {
        newStyling.theme = getRandomItem(themes);
      }

      if (shuffleConfig.font) {
        const fontsKeys = Object.keys(fontMap);
        newStyling.font = getRandomItem(fontsKeys);
      }

      if (shuffleConfig.styling) {
        const radiusOptions = ["rounded-none", "rounded-md"];
        const randomRadius = getRandomItem(radiusOptions);

        const newComponents = { ...newStyling.components };
        const newPricing = { ...newStyling.blog }; newBlog
        const newBlog = { ...newStyling.blog };

        // Replace any rounded class with new radius
        const replaceRadius = (str) =>
          str.replace(/rounded-(none|md|full|lg|xl|2xl|3xl|sm)/g, "").trim() + " " + randomRadius;

        Object.keys(newComponents).forEach((key) => {
          if (typeof newComponents[key] === "string" && newComponents[key].includes("rounded")) {
            newComponents[key] = replaceRadius(newComponents[key]);
          }
        });

        Object.keys(newPricing).forEach((key) => {
          if (typeof newPricing[key] === "string" && newPricing[key].includes("rounded")) {
            newPricing[key] = replaceRadius(newPricing[key]);
          }
        });

        Object.keys(newBlog).forEach((key) => {
          if (typeof newBlog[key] === "string" && newBlog[key].includes("rounded")) {
            newBlog[key] = replaceRadius(newBlog[key]);
          }
        });

        newStyling.components = newComponents;
        newStyling.pricing = newPricing;
        newStyling.blog = newBlog;
      }

      return newStyling;
    });
  }, [shuffleConfig, setStyling]);

  useEffect(() => {
    let interval;
    if (shuffleConfig.auto) {
      handleShuffle(); // Shuffle immediately on enable
      interval = setInterval(handleShuffle, 3000); // Shuffle every 3 seconds
    }
    return () => clearInterval(interval);
  }, [shuffleConfig.auto, handleShuffle]);

  return {
    shuffleConfig,
    setShuffleConfig,
    handleShuffle
  };
}
