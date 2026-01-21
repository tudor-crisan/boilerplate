"use client";
import HeroButton from "@/components/hero/HeroButton";
import HeroImage from "@/components/hero/HeroImage";
import HeroVideo from "@/components/hero/HeroVideo";
import SectionHeading from "@/components/section/SectionHeading";
import SectionWrapper from "@/components/section/SectionWrapper";
import { useCopywriting } from "@/context/ContextCopywriting";
import { useStyling } from "@/context/ContextStyling";
import { useVisual } from "@/context/ContextVisual";
import { cn } from "@/libs/utils.client";

export default function SectionHero() {
  const { visual } = useVisual();
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();

  const showHero = visual.show.SectionHero;

  return (
    <SectionWrapper
      id="hero"
      containerClassName={cn(styling.SectionHero.container)}
    >
      <div className={cn(showHero.button ? "space-y-6" : "space-y-3")}>
        <SectionHeading
          headline={showHero.headline ? copywriting.SectionHero.headline : null}
          paragraph={
            showHero.paragraph ? copywriting.SectionHero.paragraph : null
          }
          align={styling.SectionHero.textalign}
          headlineClassName={styling.SectionHero.headline}
          paragraphClassName={styling.SectionHero.paragraph}
        />
        {showHero.button && (
          <div className={cn(styling.SectionHero.textalign, "w-full")}>
            <HeroButton />
          </div>
        )}
      </div>
      {(showHero.image || showHero.video) && (
        <div className="max-w-sm mx-auto pl-0 sm:pl-6">
          {showHero.image && <HeroImage />}
          {showHero.video && <HeroVideo />}
        </div>
      )}
    </SectionWrapper>
  );
}
