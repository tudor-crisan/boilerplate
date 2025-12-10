import styling from "@/config/styling.json";
import { Suspense } from 'react'

export default async function VideoHero() {
  const { path, alt, width, height, wrapper, style } = styling.SectionHero.video
  return (
    <Suspense fallback={<p>&nbsp;</p>}>
      <div className={wrapper}>
        <video
          controls
          autoPlay
          aria-label={alt}
          width={width}
          height={height}
          className={style}
        >
          <source src={path} type="video/mp4" />
        </video>
      </div>

    </Suspense>
  )
}