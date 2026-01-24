"use client";

import SlideFeature from "@/components/modules/video/slides/SlideFeature";
import SlideImageOnly from "@/components/modules/video/slides/SlideImageOnly";
import SlideQuote from "@/components/modules/video/slides/SlideQuote";
import SlideSplit from "@/components/modules/video/slides/SlideSplit";
import SlideTransition from "@/components/modules/video/slides/SlideTransition";
import { useStyling } from "@/context/ContextStyling";
import { getAnimationVariants } from "@/libs/videoAnimations";

export default function VideoSlide({ slide, isVertical }) {
  const { styling } = useStyling();
  const animation = slide.animation || "fade";
  const variants = getAnimationVariants(animation);

  // Render Quote Slide
  if (slide.type === "quote") {
    return (
      <SlideQuote slide={slide} variants={variants} isVertical={isVertical} />
    );
  }

  // Render Split Slide
  if (slide.type === "split") {
    return (
      <SlideSplit slide={slide} variants={variants} isVertical={isVertical} />
    );
  }

  // Render Image Only Slide
  if (slide.type === "image-only") {
    return <SlideImageOnly slide={slide} />;
  }

  // Transition Slide Specifics
  if (slide.type === "transition") {
    return (
      <div
        className={`w-full h-full relative overflow-hidden font-sans transition-all duration-700 ${slide.bg} ${slide.textColor} flex flex-col items-center justify-center p-8`}
      >
        <SlideTransition
          isVertical={isVertical}
          styling={styling}
          slide={slide}
        />
      </div>
    );
  }

  // Default / Feature / Title Slide
  return (
    <SlideFeature
      slide={slide}
      variants={variants}
      isVertical={isVertical}
      styling={styling}
      animation={animation}
    />
  );
}
