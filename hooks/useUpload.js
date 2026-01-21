"use client";
import { toast } from "@/libs/toast";
import { useState } from "react";

export default function useUpload() {
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = async (file) => {
    setIsLoading(true);

    return new Promise((resolve, reject) => {
      // Basic validation
      if (!file) {
        setIsLoading(false);
        return reject("No file selected");
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        setIsLoading(false);
        return reject("Invalid file type");
      }

      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error("File size must be less than 2MB");
        setIsLoading(false);
        return reject("File too large");
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        setIsLoading(false);
        resolve(reader.result); // Returns Data URI
      };

      reader.onerror = () => {
        setIsLoading(false);
        toast.error("Something went wrong reading the file");
        reject("Read error");
      };

      reader.readAsDataURL(file);
    });
  };

  return {
    uploadFile,
    isLoading,
  };
}
