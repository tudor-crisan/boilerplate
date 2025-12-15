"use client";
import { useCopywriting } from "@/components/context/ContextCopywriting";
import ButtonLogin from "@/components/button/ButtonLogin";
import HeroImage from "@/components/hero/HeroImage";
import HeroVideo from "@/components/hero/HeroVideo";
import { useStyling } from "@/components/context/ContextStyling";
import { useVisual } from "@/components/context/ContextVisual";

export default function SectionHero() {
  const { styling } = useStyling();
  const { visual } = useVisual();
  const { copywriting } = useCopywriting();
  return (
    <section className={`${styling.general.container} ${styling.general.spacing}`}>
      <div className="flex flex-col sm:flex-row sm:items-start space-y-12">
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className={`${styling.SectionHero.headline} ${styling.SectionHero.textalign}`}>
              {copywriting.SectionHero.headline}
            </h1>
            <p className={`${styling.SectionHero.paragraph} ${styling.SectionHero.textalign}`}>
              {copywriting.SectionHero.paragraph}
            </p>
          </div>
          <div className={`${styling.SectionHero.textalign} w-full`}>
            <ButtonLogin
              isLoggedIn={true}
            />
          </div>
        </div>

        <div className="max-w-sm mx-auto pl-0 sm:pl-6">
          {visual.HeroImage.show && (
            <HeroImage />
          )}
          {visual.HeroVideo.show && (
            <HeroVideo />
          )}
        </div>

      </div>
    </section>
  );
}
