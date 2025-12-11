"use client";
import { useCopywriting } from "@/components/context/ContextCopywriting";
import ButtonLogin from "@/components/button/ButtonLogin";
import HeroImage from "@/components/hero/HeroImage";
import HeroVideo from "@/components/hero/HeroVideo";
import { useStyling } from "@/components/context/ContextStyling";

export default function SectionHero() {
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();
  return (
    <section className={`${styling.general.wrapper} ${styling.general.spacing}`}>
      <div className="flex flex-col sm:flex-row sm:items-start space-y-12">
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className={`${styling.SectionHero.headline} ${styling.SectionHero.positioning}`}>
              {copywriting.SectionHero.headline}
            </h1>
            <p className={`${styling.SectionHero.paragraph} ${styling.SectionHero.positioning}`}>
              {copywriting.SectionHero.paragraph}
            </p>
          </div>
          <div className={`${styling.SectionHero.positioning} w-full`}>
            <ButtonLogin
              isLoggedIn={true}
            />
          </div>
        </div>

        <div className="max-w-sm mx-auto pl-0 sm:pl-6">
          {styling.SectionHero.image.showImage && (
            <HeroImage />
          )}
          {styling.SectionHero.video.showVideo && (
            <HeroVideo />
          )}
        </div>

      </div>
    </section>
  );
}
