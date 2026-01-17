"use client";
import Select from "@/components/select/Select";
import InputButton from "@/components/input/InputButton";
import Label from "@/components/common/Label";
import Grid from "@/components/common/Grid";
import themes from "@/lists/themes";
import { fontMap } from "@/lists/fonts";

export default function SettingsAppearance({ styling, onChange, isLoading }) {
  if (!styling) return null;

  const handleValidation = (value) => {
    // Ensure value is safe string without scripts or dangerous chars
    return value.replace(/[<>]/g, "");
  };

  const updateStyling = (key, value) => {
    const safeValue = handleValidation(value);
    const newStyling = { ...styling };
    if (key === "theme") newStyling.theme = safeValue;
    if (key === "font") newStyling.font = safeValue;
    onChange(newStyling);
  };

  const updateRadius = (radius) => {
    const safeRadius = handleValidation(radius);
    const newComponents = { ...styling.components };
    const newPricing = { ...styling.pricing };
    const newBlog = { ...styling.blog };

    // Replace any rounded class with new radius
    const replaceRadius = (str) =>
      str.replace(/rounded-(none|md|full|lg|xl|2xl|3xl|sm)/g, "").trim() + " " + safeRadius;

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

    onChange({
      ...styling,
      components: newComponents,
      pricing: newPricing,
      blog: newBlog,
    });
  };

  // Determine current radius from a sample component (e.g., input)
  const currentRadius = styling.components?.input?.split(" ").find((c) => c.startsWith("rounded-")) || "rounded-md";

  return (
    <Grid>
      <div className="space-y-1">
        <Label>Theme</Label>
        <Select
          className="w-full capitalize"
          value={styling.theme || themes[0]}
          onChange={(e) => updateStyling("theme", e.target.value)}
          options={themes}
          withNavigation={true}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-1">
        <Label>Font</Label>
        <Select
          className="w-full"
          value={styling.font || Object.keys(fontMap)[0]}
          onChange={(e) => updateStyling("font", e.target.value)}
          options={Object.entries(fontMap).map(([key, name]) => ({ label: name, value: key }))}
          withNavigation={true}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label>Styling</Label>
        <InputButton
          options={[
            { label: "Square", value: "rounded-none" },
            { label: "Rounded", value: "rounded-md" },
          ]}
          value={currentRadius}
          onChange={updateRadius}
          disabled={isLoading}
        />
      </div>
    </Grid>
  );
}
