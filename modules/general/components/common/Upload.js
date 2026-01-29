"use client";
import Button from "@/modules/general/components/button/Button";
import Paragraph from "@/modules/general/components/common/Paragraph";
import { useStyling } from "@/modules/general/context/ContextStyling";
import useUpload from "@/modules/general/hooks/useUpload";
import { defaultSetting } from "@/modules/general/libs/defaults";
import { cn } from "@/modules/general/libs/utils.client";
import { useRef } from "react";

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
        console.warn("Upload failed", error);
      }
      // Clear the value to allow re-selection of the same file
      e.target.value = "";
    }
  };

  return (
    <div className={cn(`${styling.flex.col} gap-2 text-center`, className)}>
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
        className="mx-auto max-w-xs"
      >
        {isLoading ? "Processing..." : "Choose Image"}
      </Button>
      <Paragraph>
        Max {defaultSetting.forms.general.config.maxUploadSize.label}. formats:
        JPG, PNG, GIF
      </Paragraph>
    </div>
  );
};

export default Upload;
