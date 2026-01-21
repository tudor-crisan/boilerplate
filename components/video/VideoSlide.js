"use client";

import Title from "@/components/common/Title";
import Image from "next/image";
import { motion } from "framer-motion";

export default function VideoSlide({ slide, isVertical }) {
  // Configurable transition/animation constants could go here

  const getTextSize = (size) => {
    // Adjust text sizes based on isVertical format
    if (isVertical) {
      if (size === "title") return "text-6xl";
      if (size === "subtitle") return "text-3xl";
      return "text-base";
    }
    // Default 16:9
    if (size === "title") return "text-7xl";
    if (size === "subtitle") return "text-4xl";
    return "text-lg";
  };

  return (
    <div
      className={`w-full h-full relative overflow-hidden font-sans transition-colors duration-500 ${slide.bg} ${slide.textColor} flex flex-col items-center justify-center p-8`}
    >
      {/* Title & Subtitle */}
      <div
        className={`z-10 text-center ${isVertical ? "mb-12" : "mb-8"} relative`}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title
            tag="h1"
            className={`${getTextSize("title")} mb-4 drop-shadow-sm whitespace-pre-wrap`}
          >
            {slide.title}
          </Title>
        </motion.div>
        {slide.subtitle && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Title
              tag="h2"
              className={`${getTextSize("subtitle")} font-light opacity-90`}
            >
              {slide.subtitle}
            </Title>
          </motion.div>
        )}
      </div>

      {/* Media Content */}
      {slide.image && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.2 }}
          className={`relative rounded-2xl overflow-hidden shadow-md border-4 border-white/20
                ${isVertical ? "w-full aspect-9/16 max-h-[60vh]" : "max-w-5xl w-full h-[60vh]"}
            `}
        >
          <Image
            src={slide.image}
            alt={slide.title || "Slide Image"}
            fill
            className="object-cover object-top"
          />
        </motion.div>
      )}

      {/* Transition Slide Specifics */}
      {slide.type === "transition" && slide.images && (
        <div
          className={`relative w-full ${isVertical ? "h-[50vh]" : "h-[50vh] max-w-4xl"} flex items-center justify-center`}
        >
          <motion.div
            className="absolute inset-0 z-10 origin-bottom-left shadow-md rounded-xl overflow-hidden border-2 border-slate-200 w-3/4 h-3/4 top-0 left-0"
            initial={{ x: "-50%", opacity: 0, rotate: -5 }}
            animate={{ x: isVertical ? "0%" : "-20%", opacity: 1, rotate: -5 }}
            transition={{ duration: 1 }}
          >
            <Image
              src={slide.images[0]}
              alt="Display 1"
              fill
              className="object-cover object-top-left"
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 z-20 origin-bottom-right shadow-md rounded-xl overflow-hidden border-2 border-slate-200 w-3/4 h-3/4 bottom-0 right-0"
            initial={{ x: "50%", opacity: 0, rotate: 5 }}
            animate={{ x: isVertical ? "0%" : "20%", opacity: 1, rotate: 5 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Image
              src={slide.images[1]}
              alt="Display 2"
              fill
              className="object-cover object-top-left"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
