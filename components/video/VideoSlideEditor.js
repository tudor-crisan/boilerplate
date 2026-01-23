import Button from "@/components/button/Button";
import ImageCropper from "@/components/common/ImageCropper";
import Label from "@/components/common/Label";
import Loading from "@/components/common/Loading";
import Modal from "@/components/common/Modal";
import Paragraph from "@/components/common/Paragraph";
import Tooltip from "@/components/common/Tooltip";
import Upload from "@/components/common/Upload";
import Input from "@/components/input/Input";
import Select from "@/components/select/Select";
import SvgChevronLeft from "@/components/svg/SvgChevronLeft";
import SvgChevronRight from "@/components/svg/SvgChevronRight";
import SvgPlus from "@/components/svg/SvgPlus";
import SvgTrash from "@/components/svg/SvgTrash";
import { useStyling } from "@/context/ContextStyling";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function VideoSlideEditor({
  slide,
  index,
  totalSlides,
  slides,
  onUpdate,
  onAdd,
  onDelete,
  onMove,
  onSelect,
  onRefresh,
}) {
  const { styling } = useStyling();
  const [images, setImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  // Cropper State
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  const fetchImages = () => {
    fetch("/api/video/images")
      .then((res) => res.json())
      .then((data) => {
        if (data.images) {
          setImages(data.images);
        }
      })
      .catch((err) => console.error("Failed to load images", err));
  };

  // Fetch images for gallery on mount
  useEffect(() => {
    fetchImages();
  }, []);

  if (!slide) return null;

  const handleChange = (field, value) => {
    onUpdate(index, { ...slide, [field]: value });

    // Trigger refresh for visual changes
    if ((field === "type" || field === "animation") && onRefresh) {
      setTimeout(() => onRefresh(), 100);
    }
  };

  // Triggered when file is selected from Upload component
  const handleFileSelect = (dataUri) => {
    setTempImage(dataUri);
    setShowCropper(true);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImage(null);
  };

  // Triggered after cropping is confirmed
  const handleCropComplete = async (croppedImageBlob) => {
    setShowCropper(false);
    setTempImage(null);
    setIsUploading(true);

    try {
      // croppedImageBlob is a Blob/File object (or dataURL depending on implementation,
      // but ImageCropper usually returns a Blob or DataURL.
      // Check ImageCropper usage: onCropComplete(croppedImage) -> getCroppedImg returns Blob/DataURL?
      // Looking at ImageCropper: onCropComplete(croppedImage) where croppedImage comes from `getCroppedImg`.
      // Usually getCroppedImg returns a blob URL or base64.
      // Let's assume it returns a base64 or blob. If base64, convert to blob.

      let blob = croppedImageBlob;
      if (typeof croppedImageBlob === "string") {
        const res = await fetch(croppedImageBlob);
        blob = await res.blob();
      }

      const file = new File([blob], `upload_${Date.now()}.png`, {
        type: "image/png",
      });

      const formData = new FormData();
      formData.append("file", file);

      const apiRes = await fetch("/api/video/images", {
        method: "POST",
        body: formData,
      });
      const data = await apiRes.json();

      if (data.success) {
        fetchImages(); // Refresh list
        handleChange("image", data.filename); // Auto select uploaded image
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteRequest = (e, filename) => {
    e.stopPropagation();
    setImageToDelete(filename);
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;

    try {
      const res = await fetch("/api/video/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: imageToDelete }),
      });
      if (res.ok) {
        fetchImages();
        if (slide.image === imageToDelete) handleChange("image", "");
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setImageToDelete(null);
    }
  };

  // Options for Selects
  const typeOptions = [
    { label: "Title", value: "title" },
    { label: "Feature", value: "feature" },
    { label: "Quote", value: "quote" },
    { label: "Split (Img/Text)", value: "split" },
    { label: "Image Only", value: "image-only" },
    { label: "End", value: "end" },
  ];

  const animationOptions = [
    { label: "Fade", value: "fade" },
    { label: "Zoom", value: "zoom" },
    { label: "Slide Left", value: "slide-left" },
    { label: "Slide Right", value: "slide-right" },
    { label: "Slide Up", value: "slide-up" },
    { label: "Bounce", value: "bounce" },
    { label: "Rotate", value: "rotate" },
    { label: "Flip", value: "flip" },
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
    <>
      <div
        className={`p-4 bg-base-100 rounded-lg border border-base-300 shadow-sm ${styling.components.card}`}
      >
        {/* Slide Navigator */}
        <div className="mb-6 overflow-x-auto pb-4 border-b border-base-200">
          <div className="flex gap-2">
            {slides &&
              slides.map((s, i) => (
                <div
                  key={s.id || i}
                  onClick={() => onSelect && onSelect(i)}
                  className={`
                 relative shrink-0 w-24 h-16 rounded border-2 cursor-pointer overflow-hidden transition-all hover:scale-105
                 ${i === index ? "border-primary ring-2 ring-primary/30" : "border-base-300 opacity-70 hover:opacity-100"}
               `}
                >
                  <div
                    className={`w-full h-full ${s.bg || "bg-neutral"} flex items-center justify-center p-1`}
                  >
                    {s.image ? (
                      <Image
                        src={
                          s.image.startsWith("http") || s.image.startsWith("/")
                            ? s.image
                            : `/assets/video/loyalboards/${s.image}`
                        }
                        alt="thumb"
                        fill
                        className="object-cover opacity-50"
                      />
                    ) : null}
                    <span className="relative z-10 text-[8px] font-bold truncate max-w-full px-1 bg-black/50 text-white rounded">
                      {i + 1}. {s.title || s.type}
                    </span>
                  </div>
                </div>
              ))}
            <button
              onClick={onAdd}
              className="shrink-0 w-16 h-16 rounded border-2 border-dashed border-base-300 flex items-center justify-center text-base-content/50 hover:bg-base-200 hover:text-primary transition-colors"
            >
              <SvgPlus className="w-6 h-6" />
            </button>
          </div>
        </div>

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
            <Label className="opacity-60 text-xs">Animation</Label>
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
            <Input
              type="text"
              className="input-sm w-full"
              value={slide.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          {/* Background */}
          <div className="form-control">
            <Label className="opacity-60 text-xs">Background</Label>
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
            <Label className="opacity-60 text-xs">Text Color</Label>
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
              <Label className="opacity-60 text-xs p-0">Slide Image</Label>
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
                    src={
                      slide.image.startsWith("http") ||
                      slide.image.startsWith("/")
                        ? slide.image
                        : `/assets/video/loyalboards/${slide.image}`
                    }
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
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-base-100 rounded border border-base-300 mb-2">
                  {/* Option to remove image */}
                  <div
                    className={`relative aspect-square cursor-pointer rounded overflow-hidden border-2 hover:border-error flex items-center justify-center bg-base-200 text-xs font-bold opacity-60 ${!slide.image ? "border-error" : "border-transparent"}`}
                    onClick={() => handleChange("image", "")}
                  >
                    None
                  </div>
                  {images.map((img) => (
                    <div
                      key={img}
                      className={`relative group aspect-square cursor-pointer rounded overflow-hidden border-2 hover:border-primary ${slide.image === img ? "border-primary" : "border-transparent"}`}
                      onClick={() => handleChange("image", img)}
                    >
                      <Image
                        src={`/assets/video/loyalboards/${img}`}
                        alt={img}
                        fill
                        sizes="(max-width: 768px) 33vw, 25vw"
                        className="object-cover"
                      />
                      {/* Delete overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Tooltip text="Delete Image">
                          <button
                            className="btn btn-xs btn-circle btn-error text-white"
                            onClick={(e) => handleDeleteRequest(e, img)}
                          >
                            <SvgTrash className="w-3 h-3" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                  {images.length === 0 && (
                    <div className="col-span-full text-center text-xs opacity-50 py-4">
                      No images found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Image Settings */}
            {slide.image && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="form-control">
                  <Label className="opacity-60 text-[10px] pt-0">Fit</Label>
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

            {/* Upload Button */}
            {showGallery && (
              <div className="flex flex-col items-center justify-center mt-4 pt-2 border-t border-base-content/5 gap-2">
                <Upload
                  onFileSelect={handleFileSelect}
                  className="w-full max-w-xs"
                />
                {isUploading && <Loading className="w-4 h-4 text-primary" />}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isModalOpen={!!imageToDelete}
        onClose={() => setImageToDelete(null)}
        title="Confirm Deletion"
        contentClassName="p-0! pb-2!"
        actions={
          <>
            <Button
              className="btn-ghost"
              onClick={() => setImageToDelete(null)}
            >
              Cancel
            </Button>
            <Button variant="btn-error btn-outline" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <Paragraph className={`${styling.general.element} text-center`}>
          Are you sure you want to delete <b>{imageToDelete}</b>? This action
          cannot be undone.
        </Paragraph>
      </Modal>

      {/* Image Cropper */}
      {showCropper && tempImage && (
        <ImageCropper
          imageSrc={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspect={16 / 9} // Default to video aspect, or make it dynamic if needed
        />
      )}
    </>
  );
}
