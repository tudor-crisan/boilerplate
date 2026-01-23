import Button from "@/components/button/Button";
import Label from "@/components/common/Label";
import Select from "@/components/select/Select";
import SvgChevronLeft from "@/components/svg/SvgChevronLeft";
import SvgChevronRight from "@/components/svg/SvgChevronRight";
import SvgPlus from "@/components/svg/SvgPlus";
import SvgTrash from "@/components/svg/SvgTrash";
import { useStyling } from "@/context/ContextStyling";
import { useEffect, useState } from "react";
import Image from "next/image"; // Optimization

export default function VideoSlideEditor({
  slide,
  index,
  totalSlides,
  onUpdate,
  onAdd,
  onDelete,
  onMove,
  onRefresh,
}) {
  const { styling } = useStyling();
  const [images, setImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);

  // Fetch images for gallery
  useEffect(() => {
    fetch("/api/video/images")
      .then((res) => res.json())
      .then((data) => {
        if (data.images) {
          setImages(data.images);
        }
      })
      .catch((err) => console.error("Failed to load images", err));
  }, []);

  if (!slide) return null;

  const handleChange = (field, value) => {
    onUpdate(index, { ...slide, [field]: value });

    // Trigger refresh for visual changes
    if ((field === "type" || field === "animation") && onRefresh) {
      setTimeout(() => onRefresh(), 100); // Small delay to allow state to propagate
    }
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

  const positionOptions = [
    { label: "Center", value: "object-center" },
    { label: "Top", value: "object-top" },
    { label: "Bottom", value: "object-bottom" },
    { label: "Left", value: "object-left" },
    { label: "Right", value: "object-right" },
    { label: "Top Left", value: "object-left-top" },
    { label: "Top Right", value: "object-right-top" },
    { label: "Bottom Left", value: "object-left-bottom" },
    { label: "Bottom Right", value: "object-right-bottom" },
  ];

  const fitOptions = [
    { label: "Cover", value: "object-cover" },
    { label: "Contain", value: "object-contain" },
    { label: "Fill", value: "object-fill" },
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
          <Label className="opacity-60 text-xs">Type</Label>
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
          <Label className="opacity-60 text-xs">
            Animation
          </Label>
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
          <Label className="opacity-60 text-xs">Title</Label>
          <input
            type="text"
            className={`input input-sm input-bordered w-full ${styling.components.input}`}
            value={slide.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        {/* Background */}
        <div className="form-control">
          <Label className="opacity-60 text-xs">
            Background
          </Label>
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
          <Label className="opacity-60 text-xs">
            Text Color
          </Label>
          <Select
            options={textOptions}
            value={slide.textColor || "text-neutral"}
            onChange={(e) => handleChange("textColor", e.target.value)}
            withNavigation={true}
            className="w-full"
          />
        </div>

        {/* Image Gallery and Settings */}
        <div className="form-control sm:col-span-2 bg-base-200/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <Label className="opacity-60 text-xs p-0">
              Slide Image
            </Label>
            <Button
              size="btn-xs"
              variant="btn-ghost"
              onClick={() => setShowGallery(!showGallery)}
            >
              {showGallery ? "Hide Gallery" : "Show Gallery"}
            </Button>
          </div>

          {/* Selected Image Preview (Small) & Remove */}
          {slide.image && !showGallery && (
            <div className="flex items-center gap-4 mb-2">
              <div className="relative w-16 h-16 rounded overflow-hidden border border-base-300">
                <Image
                  src={`/assets/video/loyalboards/${slide.image}`}
                  alt="Selected"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-xs opacity-60 truncate">
                {slide.image}
              </div>
              <Button
                size="btn-xs"
                variant="btn-error btn-outline"
                onClick={() => handleChange("image", "")}
              >
                Remove
              </Button>
            </div>
          )}

          {/* Gallery Grid */}
          {showGallery && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-base-100 rounded border border-base-300 mb-2">
               {/* Option to remove image */}
               <div
                 className={`relative aspect-square cursor-pointer rounded overflow-hidden border-2 hover:border-error flex items-center justify-center bg-base-200 text-xs font-bold opacity-60 ${!slide.image ? 'border-error' : 'border-transparent'}`}
                 onClick={() => handleChange("image", "")}
               >
                 None
               </div>
              {images.map((img) => (
                <div
                  key={img}
                  className={`relative aspect-square cursor-pointer rounded overflow-hidden border-2 hover:border-primary ${slide.image === img ? "border-primary" : "border-transparent"}`}
                  onClick={() => handleChange("image", img)}
                >
                  <Image
                    src={`/assets/video/loyalboards/${img}`}
                    alt={img}
                    fill
                    sizes="(max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
              {images.length === 0 && (
                <div className="col-span-full text-center text-xs opacity-50 py-4">
                  No images found
                </div>
              )}
            </div>
          )}

          {/* Image Settings */}
          {slide.image && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="form-control">
                <Label className="opacity-60 text-[10px] pt-0">
                  Fit
                </Label>
                <Select
                  options={fitOptions}
                  value={slide.imageFit || "object-cover"} // Default to cover
                  onChange={(e) => handleChange("imageFit", e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="form-control">
                <Label className="opacity-60 text-[10px] pt-0">
                  Position
                </Label>
                <Select
                  options={positionOptions}
                  value={slide.imagePosition || "object-center"}
                  onChange={(e) =>
                    handleChange("imagePosition", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
