import { useRef, useEffect, useCallback } from "react";
import themes from "@/lists/themes";
import { fontMap } from "@/lists/fonts";
import { defaultStyling } from "@/libs/defaults";

export function useBoardRandomizer({ settings, handleChange, getVal }) {
  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const handleShuffle = useCallback(() => {
    const config = getVal("randomizer", { theme: true, font: true, styling: true });

    // Start with current appearance or default styling if empty
    let newAppearance = getVal("appearance", JSON.parse(JSON.stringify(defaultStyling)));

    if (config.theme !== false) {
      newAppearance.theme = getRandomItem(themes);
    }

    if (config.font !== false) {
      const fontsKeys = Object.keys(fontMap);
      newAppearance.font = getRandomItem(fontsKeys);
    }

    if (config.styling !== false) {
      const radiusOptions = ["rounded-none", "rounded-md"];
      const randomRadius = getRandomItem(radiusOptions);

      // Ensure objects exist
      if (!newAppearance.components) newAppearance.components = JSON.parse(JSON.stringify(defaultStyling.components));
      if (!newAppearance.pricing) newAppearance.pricing = JSON.parse(JSON.stringify(defaultStyling.pricing));

      const newComponents = { ...newAppearance.components };
      const newPricing = { ...newAppearance.pricing };

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

      newAppearance.components = newComponents;
      newAppearance.pricing = newPricing;
    }

    handleChange("appearance", newAppearance);
  }, [settings, handleChange, getVal]);

  // Auto Shuffle Effect
  const randomizerConfig = getVal("randomizer", {});
  const isAutoShuffle = randomizerConfig.auto === true;

  const handleShuffleRef = useRef(handleShuffle);

  useEffect(() => {
    handleShuffleRef.current = handleShuffle;
  }, [handleShuffle]);

  useEffect(() => {
    if (!isAutoShuffle) return;

    // Initial shuffle
    handleShuffleRef.current();

    const id = setInterval(() => {
      handleShuffleRef.current();
    }, 3000);

    return () => clearInterval(id);
  }, [isAutoShuffle]);

  return { handleShuffle };
}
