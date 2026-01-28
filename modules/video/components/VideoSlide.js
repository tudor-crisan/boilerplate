"use client";

import { useStyling } from "@/context/ContextStyling";
import { getAnimationVariants } from "@/libs/videoAnimations";
import SlideFeature from "@/modules/video/components/slides/SlideFeature";
import SlideImageOnly from "@/modules/video/components/slides/SlideImageOnly";
import SlideQuote from "@/modules/video/components/slides/SlideQuote";
import SlideSplit from "@/modules/video/components/slides/SlideSplit";
import SlideTransition from "@/modules/video/components/slides/SlideTransition";

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
