import Title from "@/components/common/Title";
import { resolveImagePath } from "@/libs/videoUtils";
import Image from "next/image";
import { motion } from "framer-motion";

export default function SlideQuote({ slide, variants, isVertical }) {
  return (
    <div
      className={`w-full h-full relative overflow-hidden font-sans transition-all duration-700 ${slide.bg} ${slide.textColor} flex flex-col items-center justify-center p-12`}
    >
      <motion.div
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center z-10"
      >
        <span className="text-6xl sm:text-8xl opacity-20 block mb-4">“</span>
        <Title
          tag="h1"
          className={`${isVertical ? "text-2xl sm:text-4xl" : "text-3xl sm:text-5xl md:text-6xl"} font-serif italic mb-6 leading-tight`}
        >
          {slide.title}
        </Title>
        {slide.subtitle && (
          <Title
            tag="h2"
            className="text-sm sm:text-xl lg:text-2xl font-medium opacity-80 uppercase tracking-widest mt-8"
          >
            — {slide.subtitle}
          </Title>
        )}
      </motion.div>
      {slide.image && (
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src={resolveImagePath(slide.image)}
            alt="bg"
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
