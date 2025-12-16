"use client";
import { useCopywriting } from "@/context/ContextCopywriting";
import HeroImage from "@/components/hero/HeroImage";
import HeroVideo from "@/components/hero/HeroVideo";
import HeroButton from "@/components/hero/HeroButton";
import { useStyling } from "@/context/ContextStyling";
import { useVisual } from "@/context/ContextVisual";

export default function SectionHero() {
  const { visual } = useVisual();
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();
  return (
    <section id="hero" className={`${styling.general.container} ${styling.general.spacing}`}>
      <div className="flex flex-col sm:flex-row sm:items-start space-y-12">
        <div className="space-y-6">
          <div className="space-y-3">
            {visual.show.SectionHero.headline && (
              <h1 className={`${styling.SectionHero.headline} ${styling.SectionHero.textalign}`}>
                {copywriting.SectionHero.headline}
              </h1>
            )}
            {visual.show.SectionHero.paragraph && (
              <p className={`${styling.SectionHero.paragraph} ${styling.SectionHero.textalign}`}>
                {copywriting.SectionHero.paragraph}
              </p>
            )}
          </div>
          <div className={`${styling.SectionHero.textalign} w-full`}>
            {visual.show.SectionHero.button && (
              <HeroButton />
            )}
          </div>
        </div>
        <div className="max-w-sm mx-auto pl-0 sm:pl-6">
          {visual.show.SectionHero.image && (
            <HeroImage />
          )}
          {visual.show.SectionHero.video && (
            <HeroVideo />
          )}
        </div>
      </div>
    </section>
  );
}
