import { motion } from "framer-motion";
import Title from "@/components/common/Title";
import Image from "next/image";
import { resolveImagePath } from "@/libs/videoUtils";

export default function SlideSplit({ slide, variantProps, isVertical }) {
  return (
    <div
      className={`w-full h-full relative overflow-hidden font-sans transition-all duration-700 ${slide.bg} ${slide.textColor} flex ${isVertical ? "flex-col" : "flex-row"}`}
    >
      <div
        className={`flex-1 flex flex-col justify-center p-8 sm:p-16 z-10 ${isVertical ? "order-2 h-1/2" : "h-full"}`}
      >
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Title
            tag="h1"
            className={`${isVertical ? "text-2xl sm:text-4xl" : "text-3xl sm:text-5xl md:text-6xl"} font-bold mb-6`}
          >
            {slide.title}
          </Title>
          {slide.subtitle && (
            <Title
              tag="h2"
              className="text-lg sm:text-xl opacity-80 leading-relaxed"
            >
              {slide.subtitle}
            </Title>
          )}
        </motion.div>
      </div>
      <div
        className={`flex-1 relative ${isVertical ? "order-1 h-1/2" : "h-full"}`}
      >
        {slide.image && (
          <motion.div
            className="w-full h-full relative"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={resolveImagePath(slide.image)}
              alt="Split Image"
              fill
              className={`${slide.imageFit || "object-cover"} ${slide.imagePosition || "object-center"}`}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
