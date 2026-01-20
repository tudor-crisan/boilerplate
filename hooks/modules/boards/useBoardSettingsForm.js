import { defaultStyling } from "@/libs/defaults";
import { useCallback, useMemo } from "react";

// Helper to safely get nested values
const getNestedValue = (obj, path, defaultValue) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export function useBoardSettingsForm({ settings, onChange }) {

  const handleChange = useCallback((path, value) => {
    const newSettings = JSON.parse(JSON.stringify(settings));
    const parts = path.split('.');
    let current = newSettings;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    onChange(newSettings);
  }, [settings, onChange]);

  const getVal = useCallback((path, fallback) => {
    const val = getNestedValue(settings, path);
    return val !== undefined ? val : fallback;
  }, [settings]);

  // Preview styling: merge global styling with board specific appearance settings
  const previewStyling = useMemo(() => {
    const appearance = getNestedValue(settings, "appearance", {});
    if (!appearance || Object.keys(appearance).length === 0) return defaultStyling;

    return {
      ...defaultStyling,
      ...appearance,
      components: { ...defaultStyling.components, ...appearance.components },
      pricing: { ...defaultStyling.pricing, ...appearance.pricing },
    };
  }, [settings]);

  return {
    handleChange,
    getVal,
    previewStyling
  };
}
