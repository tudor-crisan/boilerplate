"use client";
import { useStyling } from "@/context/ContextStyling";
import { useVisual } from "@/context/ContextVisual";
import { Suspense } from "react";

export default function HeroVideo() {
  const { styling } = useStyling();
  const { visual } = useVisual();
  return (
    <Suspense fallback={<p>&nbsp;</p>}>
      <div className={visual.HeroVideo.container}>
        <video
          controls
          aria-label={visual.HeroVideo.video.arialabel}
          width={visual.HeroVideo.video.width}
          height={visual.HeroVideo.video.height}
          className={`${styling.components.card_featured} ${visual.HeroVideo.video.classname}`}
        >
          <source
            src={visual.HeroVideo.source.src}
            type={visual.HeroVideo.source.type}
          />
        </video>
      </div>
    </Suspense>
  );
}
