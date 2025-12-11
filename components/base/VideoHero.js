import styling from "@/config/styling.json";
import { Suspense } from 'react'

export default async function VideoHero() {
  return (
    <Suspense fallback={<p>&nbsp;</p>}>
      <div className={styling.SectionHero.video.wrapper}>
        <video
          controls
          aria-label={styling.SectionHero.video.alt}
          width={styling.SectionHero.video.width}
          height={styling.SectionHero.video.height}
          className={`${styling.roundness[1]} ${styling.shadows[1]} ${styling.SectionHero.video.style}`}
        >
          <source src={styling.SectionHero.video.path} type="video/mp4" />
        </video>
      </div>

    </Suspense>
  )
}