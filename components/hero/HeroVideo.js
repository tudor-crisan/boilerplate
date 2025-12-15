"use client";
import { useStyling } from "@/components/context/ContextStyling";
import { Suspense } from 'react'

export default function HeroVideo() {
  const { styling } = useStyling();
  return (
    <Suspense fallback={<p>&nbsp;</p>}>
      <div className={styling.SectionHero.HeroVideo.container}>
        <video
          controls
          aria-label={styling.SectionHero.HeroVideo.video.arialabel}
          width={styling.SectionHero.HeroVideo.video.width}
          height={styling.SectionHero.HeroVideo.video.height}
          className={`${styling.roundness[1]} ${styling.shadows[1]} ${styling.SectionHero.HeroVideo.video.classname}`}
        >
          <source src={styling.SectionHero.HeroVideo.source.src} type={styling.SectionHero.HeroVideo.source.type} />
        </video>
      </div>
    </Suspense>
  )
}