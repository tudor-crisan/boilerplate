"use client";

import { useEffect, useState } from "react";
import Button from "@/components/button/Button";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

// Script Data
const slides = [
  {
    id: 1,
    type: "title",
    title: "Feedback made simple.",
    voiceover:
      "Building a great product is hard. Knowing what your users want shouldn't be.",
    bg: "bg-neutral-900",
    textColor: "text-white",
  },
  {
    id: 2,
    type: "split",
    title: "Stop guessing.",
    subtitle: "Start listening.",
    voiceover:
      "Stop guessing features. Start building what actually matters with LoyalBoards.",
    image: "/assets/help/loyalboards/public_board_view.png",
    bg: "bg-white",
    textColor: "text-neutral-900",
  },
  {
    id: 3,
    type: "transition",
    title: "Launch in 5 minutes.",
    subtitle: "No passwords. Just magic.",
    voiceover:
      "Launch your feedback board in under five minutes. No passwords to forget—just secure Magic Links.",
    images: [
      "/assets/help/loyalboards/login_screen.png",
      "/assets/help/loyalboards/dashboard_overview.png",
    ],
    bg: "bg-blue-50",
    textColor: "text-blue-900",
  },
  {
    id: 4,
    type: "feature",
    title: "Frictionless Feedback.",
    subtitle: "10x Engagement.",
    voiceover:
      "Remove the friction. Your users vote and comment instantly. No sign-ups required.",
    image: "/assets/help/loyalboards/analytics_detail.png", // Or a specific closeup if available, using analytics for now
    bg: "bg-indigo-900",
    textColor: "text-white",
  },
  {
    id: 5,
    type: "feature",
    title: "Your Brand.",
    subtitle: "Your Rules.",
    voiceover:
      "Customize everything. Dark mode, brand colors, custom domains. Make it your own.",
    image: "/assets/help/loyalboards/board_edit_appearance.png",
    bg: "bg-purple-100",
    textColor: "text-purple-900",
  },
  {
    id: 6,
    type: "feature",
    title: "Stay in the loop.",
    subtitle: "Weekly Digests.",
    voiceover:
      "Get weekly digests delivered to your inbox. Keep your finger on the pulse of your community.",
    image: "/assets/help/loyalboards/board_weekly_digest.png",
    bg: "bg-green-50",
    textColor: "text-green-900",
  },
  {
    id: 7,
    type: "end",
    title: "LoyalBoards",
    subtitle: "Build better. Together.",
    voiceover:
      "Turn feedback into your unfair advantage. LoyalBoards. Build better, together.",
    bg: "bg-neutral-900",
    textColor: "text-white",
  },
];

export default function VideoPromo() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide((curr) => curr + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide((curr) => curr - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const slide = slides[currentSlide];

  return (
    <div
      className={`h-screen w-full relative overflow-hidden font-sans transition-colors duration-500 ${slide.bg} ${slide.textColor}`}
    >
      {/* Slide Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full flex flex-col items-center justify-center p-12"
        >
          {/* Text Content */}
          <div className="z-10 text-center mb-8">
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-7xl font-extrabold tracking-tight mb-4 drop-shadow-sm"
            >
              {slide.title}
            </motion.h1>
            {slide.subtitle && (
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-4xl font-light opacity-90"
              >
                {slide.subtitle}
              </motion.h2>
            )}
          </div>

          {/* Media Content */}
          {slide.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-5xl w-full h-[60vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover object-top"
              />
            </motion.div>
          )}

          {/* Special Case: Transition Slide (Login -> Dashboard) */}
          {slide.type === "transition" && slide.images && (
            <div className="relative h-[50vh] w-full max-w-4xl flex items-center justify-center">
              <motion.div
                className="absolute inset-0 z-10 origin-bottom-left shadow-2xl rounded-xl overflow-hidden border-2 border-slate-200"
                initial={{ x: "-50%", opacity: 0, rotate: -5 }}
                animate={{ x: "-20%", opacity: 1, rotate: -5 }}
                transition={{ duration: 1 }}
              >
                <Image
                  src={slide.images[0]}
                  alt="Display"
                  fill
                  className="object-cover object-top-left"
                />
              </motion.div>

              <motion.div
                className="absolute inset-0 z-20 origin-bottom-right shadow-2xl rounded-xl overflow-hidden border-2 border-slate-200"
                initial={{ x: "50%", opacity: 0, rotate: 5 }}
                animate={{ x: "20%", opacity: 1, rotate: 5 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <Image
                  src={slide.images[1]}
                  alt="Display"
                  fill
                  className="object-cover object-top-left"
                />
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Voiceover Prompt (Hidden in production/recording if desired, keeping for cue) */}
      <div className="absolute bottom-4 left-0 right-0 text-center opacity-50 text-sm font-mono pointer-events-none">
        <p className="max-w-3xl mx-auto bg-black/10 backdrop-blur-md p-2 rounded text-current">
          VO: &ldquo;{slide.voiceover}&ldquo;
        </p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        <Button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          variant="btn-ghost bg-black/20 hover:bg-black/30 text-current rounded"
        >
          Prev
        </Button>
        <Button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          variant="btn-ghost bg-black/20 hover:bg-black/30 text-current rounded"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
