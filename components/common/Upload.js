"use client";
import { useRef } from "react";
import Button from "@/components/button/Button";
import useUpload from "@/hooks/useUpload";
import { cn } from "@/libs/utils.client";
import { useStyling } from "@/context/ContextStyling";

const Upload = ({ onFileSelect, className }) => {
  const { styling } = useStyling();
  const { uploadFile, isLoading } = useUpload();
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUri = await uploadFile(file);
        if (onFileSelect) {
          onFileSelect(dataUri);
        }
      } catch (error) {
        console.error("Upload failed", error);
      }
      // Clear the value to allow re-selection of the same file
      e.target.value = "";
    }
  };

  return (
    <div className={cn(`${styling.flex.col} gap-2`, className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Button
        type="button"
        onClick={() => {
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
          }
        }}
        isLoading={isLoading}
        className="btn-neutral w-full"
      >
        {isLoading ? "Processing..." : "Choose Image"}
      </Button>
      <p className="text-xs text-center opacity-60">
        Max 2MB. formats: JPG, PNG, GIF
      </p>
    </div>
  );
};

export default Upload;
