import { defaultStyling } from "@/modules/general/libs/defaults";
import { fontMap } from "@/modules/general/lists/fonts";
import themes from "@/modules/general/lists/themes";
import { useCallback, useEffect, useRef } from "react";

export function useBoardRandomizer({ handleChange, getVal }) {
  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const handleShuffle = useCallback(() => {
    const config = getVal("randomizer", {
      theme: true,
      font: true,
      styling: true,
    });

    // Start with current appearance or default styling if empty
    let newAppearance = getVal(
      "appearance",
      JSON.parse(JSON.stringify(defaultStyling)),
    );

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
      if (!newAppearance.components)
        newAppearance.components = JSON.parse(
          JSON.stringify(defaultStyling.components),
        );
      if (!newAppearance.pricing)
        newAppearance.pricing = JSON.parse(
          JSON.stringify(defaultStyling.pricing),
        );
      if (!newAppearance.blog)
        newAppearance.blog = JSON.parse(JSON.stringify(defaultStyling.blog));

      const newComponents = { ...newAppearance.components };
      const newPricing = { ...newAppearance.pricing };
      const newBlog = { ...newAppearance.blog };

      const replaceRadius = (str) =>
        str.replace(/rounded-(none|md|full|lg|xl|2xl|3xl|sm)/g, "").trim() +
        " " +
        randomRadius;

      Object.keys(newComponents).forEach((key) => {
        if (
          typeof newComponents[key] === "string" &&
          newComponents[key].includes("rounded")
        ) {
          newComponents[key] = replaceRadius(newComponents[key]);
        }
      });

      Object.keys(newPricing).forEach((key) => {
        if (
          typeof newPricing[key] === "string" &&
          newPricing[key].includes("rounded")
        ) {
          newPricing[key] = replaceRadius(newPricing[key]);
        }
      });

      Object.keys(newBlog).forEach((key) => {
        if (
          typeof newBlog[key] === "string" &&
          newBlog[key].includes("rounded")
        ) {
          newBlog[key] = replaceRadius(newBlog[key]);
        }
      });

      newAppearance.components = newComponents;
      newAppearance.pricing = newPricing;
      newAppearance.blog = newBlog;
    }

    handleChange("appearance", newAppearance);
  }, [handleChange, getVal]);

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
