"use client";
import { useStyling } from "@/components/context/ContextStyling";
import { useVisual } from "@/components/context/ContextVisual";
import { Suspense } from 'react'

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
          className={`${styling.roundness[1]} ${styling.shadows[1]} ${visual.HeroVideo.video.classname}`}
        >
          <source src={visual.HeroVideo.source.src} type={visual.HeroVideo.source.type} />
        </video>
      </div>
    </Suspense>
  )
}