"use client";

import Button from "@/components/button/Button";
import Select from "@/components/select/Select";
import SvgChevronLeft from "@/components/svg/SvgChevronLeft";
import SvgChevronRight from "@/components/svg/SvgChevronRight";
import SvgPlus from "@/components/svg/SvgPlus";
import SvgTrash from "@/components/svg/SvgTrash";
import { useStyling } from "@/context/ContextStyling";

export default function VideoSlideEditor({
  slide,
  index,
  totalSlides,
  onUpdate,
  onAdd,
  onDelete,
  onMove,
}) {
  const { styling } = useStyling();

  if (!slide) return null;

  const handleChange = (field, value) => {
    onUpdate(index, { ...slide, [field]: value });
  };

  // Options for Selects
  const typeOptions = [
    { label: "Title", value: "title" },
    { label: "Feature", value: "feature" },
    { label: "End", value: "end" },
  ];

  const animationOptions = [
    { label: "Fade", value: "fade" },
    { label: "Zoom", value: "zoom" },
    { label: "Slide Left", value: "slide-left" },
    { label: "Slide Right", value: "slide-right" },
    { label: "Bounce", value: "bounce" },
  ];

  const bgOptions = [
    { label: "Neutral", value: "bg-neutral" },
    { label: "Base 100", value: "bg-base-100" },
    { label: "Primary", value: "bg-primary" },
    { label: "Secondary", value: "bg-secondary" },
    { label: "Accent", value: "bg-accent" },
  ];

  const textOptions = [
    { label: "Neutral Content", value: "text-neutral-content" },
    { label: "Base Content", value: "text-base-content" },
    { label: "Primary", value: "text-primary" },
    { label: "Primary Content", value: "text-primary-content" },
    { label: "Secondary", value: "text-secondary" },
    { label: "Secondary Content", value: "text-secondary-content" },
    { label: "Accent", value: "text-accent" },
    { label: "Accent Content", value: "text-accent-content" },
    { label: "White", value: "text-white" },
    { label: "Neutral", value: "text-neutral" },
  ];

  return (
    <div
      className={`p-4 bg-base-100 rounded-lg border border-base-300 shadow-sm ${styling.components.card}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold opacity-70">Edit Slide {index + 1}</h3>
        <div className="flex gap-1">
          <Button
            size="btn-xs"
            variant="btn-ghost"
            onClick={() => onMove(index, index - 1)}
            disabled={index <= 0}
            title="Move Left"
          >
            <SvgChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="btn-xs"
            variant="btn-ghost"
            onClick={() => onMove(index, index + 1)}
            disabled={index >= totalSlides - 1}
            title="Move Right"
          >
            <SvgChevronRight className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-base-300 mx-1" />
          <Button
            size="btn-xs"
            variant="btn-error"
            onClick={() => onDelete(index)}
            disabled={totalSlides <= 1}
            title="Delete Slide"
          >
            <SvgTrash className="w-4 h-4" />
          </Button>
          <Button
            size="btn-xs"
            variant="btn-success"
            onClick={onAdd}
            title="Add New Slide"
          >
            <SvgPlus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Type */}
        <div className="form-control">
          <label className="label text-xs font-bold opacity-60">Type</label>
          <Select
            options={typeOptions}
            value={slide.type || "feature"}
            onChange={(e) => handleChange("type", e.target.value)}
            withNavigation={true}
            className="w-full"
          />
        </div>

        {/* Animation */}
        <div className="form-control">
          <label className="label text-xs font-bold opacity-60">
            Animation
          </label>
          <Select
            options={animationOptions}
            value={slide.animation || "fade"}
            onChange={(e) => handleChange("animation", e.target.value)}
            withNavigation={true}
            className="w-full"
          />
        </div>

        {/* Title */}
        <div className="form-control sm:col-span-2">
          <label className="label text-xs font-bold opacity-60">Title</label>
          <input
            type="text"
            className={`input input-sm input-bordered w-full ${styling.components.input}`}
            value={slide.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        {/* Voiceover Text */}
        <div className="form-control sm:col-span-2">
          <label className="label text-xs font-bold opacity-60">
            Voiceover Script
          </label>
          <textarea
            className={`textarea textarea-sm textarea-bordered w-full h-20 ${styling.components.input}`}
            value={slide.voiceover || ""}
            onChange={(e) => handleChange("voiceover", e.target.value)}
          />
        </div>

        {/* Background */}
        <div className="form-control">
          <label className="label text-xs font-bold opacity-60">
            Background
          </label>
          <Select
            options={bgOptions}
            value={slide.bg || "bg-base-100"}
            onChange={(e) => handleChange("bg", e.target.value)}
            withNavigation={true}
            className="w-full"
          />
        </div>

        {/* Text Color */}
        <div className="form-control">
          <label className="label text-xs font-bold opacity-60">
            Text Color
          </label>
          <Select
            options={textOptions}
            value={slide.textColor || "text-neutral"}
            onChange={(e) => handleChange("textColor", e.target.value)}
            withNavigation={true}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
