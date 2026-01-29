import { resolveImagePath } from "@/modules/general/libs/videoUtils";
import Image from "next/image";
import { motion } from "framer-motion";

export default function SlideImageOnly({ slide }) {
  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      {slide.image && (
        <motion.div
          className="w-full h-full relative"
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={resolveImagePath(slide.image)}
            alt="Full Image"
            fill
            className={`${slide.imageFit || "object-cover"} ${slide.imagePosition || "object-center"}`}
          />

          {(slide.title || slide.subtitle) && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 pb-16 pt-24 text-white text-center">
              {slide.title && (
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 drop-shadow-md">
                  {slide.title}
                </h1>
              )}
              {slide.subtitle && (
                <p className="text-sm sm:text-lg md:text-xl opacity-90 drop-shadow-sm">
                  {slide.subtitle}
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
