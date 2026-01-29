"use client";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { useVisual } from "@/modules/general/context/ContextVisual";
import { Suspense } from "react";

export default function HeroVideo() {
  const { styling } = useStyling();
  const { visual } = useVisual();
  return (
    <Suspense fallback={<p>&nbsp;</p>}>
      <div className={visual.HeroVideo.container}>
        <video
          controls
          playsInline
          poster={visual.HeroVideo.source.poster}
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
