import Title from "@/modules/general/components/common/Title";
import { getTextSizeClasses, resolveImagePath } from "@/modules/general/libs/videoUtils";
import Image from "next/image";
import { motion } from "framer-motion";

export default function SlideFeature({
  slide,
  variants,
  isVertical,
  styling,
  animation,
}) {
  return (
    <div
      className={`w-full h-full relative overflow-hidden font-sans transition-all duration-700 ${slide.bg} ${slide.textColor} flex flex-col items-center justify-center p-8`}
    >
      {/* Background Decorative Element */}
      <motion.div
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Title & Subtitle */}
      <div
        className={`z-10 text-center ${isVertical ? "mb-10" : "mb-8"} relative`}
      >
        <motion.div
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{ duration: 0.6 }}
        >
          <Title
            tag="h1"
            className={`${getTextSizeClasses("title", isVertical)} mb-4 drop-shadow-lg font-black tracking-tight whitespace-pre-wrap`}
          >
            {slide.title}
          </Title>
        </motion.div>

        {slide.subtitle && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Title
              tag="h2"
              className={`${getTextSizeClasses("subtitle", isVertical)} font-medium opacity-80 max-w-2xl mx-auto`}
            >
              {slide.subtitle}
            </Title>
          </motion.div>
        )}
      </div>

      {/* Media Content */}
      {slide.image && (
        <motion.div
          key={slide.image}
          initial={
            animation === "zoom" ? { scale: 0.5, opacity: 0 } : variants.initial
          }
          animate={
            animation === "zoom" ? { scale: 1, opacity: 1 } : variants.animate
          }
          exit={variants.exit}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`relative overflow-hidden ${styling.components.image} ${styling.components.card} border-4 border-white/10
                ${isVertical ? "w-full aspect-9/16 max-h-[55%]" : "max-w-4xl w-full h-[55%]"}
            `}
        >
          <Image
            src={resolveImagePath(slide.image)}
            alt={slide.title || "Slide Image"}
            fill
            className={`
              ${slide.imageFit || "object-cover"} 
              ${slide.imagePosition || "object-center"}
            `}
            priority
          />
          {/* Subtle overlay */}
          {(!slide.imageFit || slide.imageFit === "object-cover") && (
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
          )}
        </motion.div>
      )}
    </div>
  );
}
