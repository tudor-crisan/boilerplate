"use client";
import Button from "@/components/button/Button";
import InputRange from "@/components/input/InputRange";
import { useStyling } from "@/context/ContextStyling";
import { getCroppedImg } from "@/libs/image";
import { useCallback,useState } from "react";
import Cropper from "react-easy-crop";

const ImageCropper = ({ imageSrc, onCropComplete, onCancel, aspect = 1 }) => {
  const { styling } = useStyling();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom);
  }, []);

  const onRotationChange = useCallback((rotation) => {
    setRotation(rotation);
  }, []);

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${styling.flex.col} bg-base-100`}>
      <div className="relative flex-1 bg-black">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspect}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onRotationChange={onRotationChange}
          onCropComplete={onCropCompleteCallback}
        />
      </div>

      <div className={`p-4 ${styling.flex.col} gap-4 bg-base-100`}>
        <div className="w-full max-w-xs mx-auto space-y-4">
          <div className={`${styling.flex.items_center} gap-4`}>
            <span className="text-sm font-medium w-12 text-right">Zoom</span>
            <InputRange
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              ariaLabel="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              color="primary"
              className="flex-1"
            />
          </div>
          <div className={`${styling.flex.items_center} gap-4`}>
            <span className="text-sm font-medium w-12 text-right">Rotate</span>
            <InputRange
              value={rotation}
              min={0}
              max={360}
              step={1}
              ariaLabel="Rotation"
              onChange={(e) => setRotation(Number(e.target.value))}
              color="secondary"
              className="flex-1"
            />
          </div>
        </div>

        <div className={`${styling.flex.center} gap-2`}>
          <Button
            type="button"
            className="btn-ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            isLoading={isLoading}
          >
            Crop & Upload
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
