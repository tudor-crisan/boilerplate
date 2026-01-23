"use client";

import Title from "@/components/common/Title";
import { useStyling } from "@/context/ContextStyling";
import Image from "next/image";
import { motion } from "framer-motion";

export default function VideoSlide({ slide, isVertical }) {
  const { styling } = useStyling();
  const animation = slide.animation || "fade";

  const getTextSize = (size) => {
    if (isVertical) {
      if (size === "title") return "text-5xl";
      if (size === "subtitle") return "text-2xl";
      return "text-sm";
    }
    if (size === "title") return "text-7xl";
    if (size === "subtitle") return "text-4xl";
    return "text-lg";
  };

  const getVariants = (type) => {
    switch (type) {
      case "zoom":
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.2, opacity: 0 },
        };
      case "slide-left":
        return {
          initial: { x: 100, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -100, opacity: 0 },
        };
      case "slide-right":
        return {
          initial: { x: -100, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 100, opacity: 0 },
        };
      case "slide-up":
        return {
          initial: { y: 100, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -100, opacity: 0 },
        };
      case "flip":
        return {
          initial: { rotateY: 90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
          exit: { rotateY: -90, opacity: 0 },
        };
      case "rotate":
        return {
          initial: { rotate: -180, scale: 0, opacity: 0 },
          animate: {
            rotate: 0,
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 200 },
          },
          exit: { rotate: 180, scale: 0, opacity: 0 },
        };
      case "bounce":
        return {
          initial: { y: 50, opacity: 0 },
          animate: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 20 },
          },
          exit: { y: -50, opacity: 0 },
        };
      default: // fade
        return {
          initial: { scale: 0.95, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  const variants = getVariants(animation);

  // Render Quote Slide
  if (slide.type === "quote") {
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
           <Title tag="h1" className={`${isVertical ? "text-4xl" : "text-6xl"} font-serif italic mb-6 leading-tight`}>
             {slide.title}
           </Title>
           {slide.subtitle && (
             <Title tag="h2" className="text-xl sm:text-2xl font-medium opacity-80 uppercase tracking-widest mt-8">
               — {slide.subtitle}
             </Title>
           )}
        </motion.div>
        {/* Background Texture/Image for Quote */}
        {slide.image && (
           <div className="absolute inset-0 z-0 opacity-20">
             <Image src={slide.image.startsWith("http") || slide.image.startsWith("/") ? slide.image : `/assets/video/loyalboards/${slide.image}`} alt="bg" fill className="object-cover" />
           </div>
        )}
      </div>
    );
  }

  // Render Split Slide
  if (slide.type === "split") {
    return (
      <div className={`w-full h-full relative overflow-hidden font-sans transition-all duration-700 ${slide.bg} ${slide.textColor} flex ${isVertical ? "flex-col" : "flex-row"}`}>
        <div className={`flex-1 flex flex-col justify-center p-8 sm:p-16 z-10 ${isVertical ? "order-2 h-1/2" : "h-full"}`}>
            <motion.div
               initial={{ x: -50, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: -50, opacity: 0 }}
               transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Title tag="h1" className={`${isVertical ? "text-4xl" : "text-6xl"} font-bold mb-6`}>
                {slide.title}
              </Title>
              {slide.subtitle && (
                <Title tag="h2" className="text-lg sm:text-xl opacity-80 leading-relaxed">
                  {slide.subtitle}
                </Title>
              )}
            </motion.div>
        </div>
        <div className={`flex-1 relative ${isVertical ? "order-1 h-1/2" : "h-full"}`}>
           {slide.image && (
             <motion.div 
               className="w-full h-full relative"
               initial={{ scale: 1.1, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.8 }}
             >
                <Image 
                  src={slide.image.startsWith("http") || slide.image.startsWith("/") ? slide.image : `/assets/video/loyalboards/${slide.image}`} 
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
  
  // Render Image Only Slide
  if (slide.type === "image-only") {
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
                  src={slide.image.startsWith("http") || slide.image.startsWith("/") ? slide.image : `/assets/video/loyalboards/${slide.image}`} 
                  alt="Full Image" 
                  fill 
                  className={`${slide.imageFit || "object-cover"} ${slide.imagePosition || "object-center"}`} 
                />
                
                {(slide.title || slide.subtitle) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 pb-16 pt-24 text-white text-center">
                      {slide.title && <h1 className="text-4xl font-bold mb-2 drop-shadow-md">{slide.title}</h1>}
                      {slide.subtitle && <p className="text-xl opacity-90 drop-shadow-sm">{slide.subtitle}</p>}
                  </div>
                )}
             </motion.div>
           )}
        </div>
      );
  }

  // Default / Feature / Title Slide
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
            className={`${getTextSize("title")} mb-4 drop-shadow-lg font-black tracking-tight whitespace-pre-wrap`}
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
              className={`${getTextSize("subtitle")} font-medium opacity-80 max-w-2xl mx-auto`}
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
                ${isVertical ? "w-full aspect-9/16 max-h-[55vh]" : "max-w-4xl w-full h-[55vh]"}
            `}
        >
          <Image
            src={
              slide.image.startsWith("http") || slide.image.startsWith("/")
                ? slide.image
                : `/assets/video/loyalboards/${slide.image}`
            }
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

      {/* Transition Slide Specifics */}
      {slide.type === "transition" && slide.images && (
        <div
          className={`relative w-full ${isVertical ? "h-[50vh] mt-12" : "h-[40vh] max-w-4xl mt-24"} flex items-center justify-center`}
        >
          <motion.div
            className={`absolute inset-0 z-10 origin-bottom-left overflow-hidden border border-white/10 w-3/4 h-3/4 top-0 left-0 ${styling.components.image} ${styling.components.card}`}
            initial={{ x: "-50%", opacity: 0, rotate: -8 }}
            animate={{
              x: isVertical ? "0%" : "-15%",
              y: "25%",
              opacity: 1,
              rotate: -8,
            }}
            transition={{ duration: 1, type: "spring" }}
          >
            <Image
              src={slide.images[0]}
              alt="Display 1"
              fill
              className="object-cover object-top"
            />
          </motion.div>

          <motion.div
            className={`absolute inset-0 z-20 origin-bottom-right overflow-hidden border border-white/10 w-3/4 h-3/4 bottom-0 right-0 ${styling.components.image} ${styling.components.card}`}
            initial={{ x: "50%", opacity: 0, rotate: 8 }}
            animate={{
              x: isVertical ? "0%" : "15%",
              y: "5%",
              opacity: 1,
              rotate: 8,
            }}
            transition={{ duration: 1, delay: 0.4, type: "spring" }}
          >
            <Image
              src={slide.images[1]}
              alt="Display 2"
              fill
              className="object-cover object-top"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
