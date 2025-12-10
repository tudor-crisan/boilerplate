import copywriting from "@/config/copywriting.json";
import ButtonLogin from "@/components/button/ButtonLogin";
import ImageHero from "@/components/base/ImageHero";
import VideoHero from "@/components/base/VideoHero";
import styling from "@/config/styling.json";

export default function SectionHero() {
  return (
    <section className={`${styling.section.wrapper} ${styling.section.spacing}`}>
      <div className="flex flex-col sm:flex-row sm:items-start space-y-12">
        <div className="space-y-6">
          <h1 className={`${styling.SectionHero.headline}`}>
            {copywriting.SectionHero.headline}
          </h1>
          <p className={`${styling.SectionHero.paragraph}`}>
            {copywriting.SectionHero.paragraph}
          </p>
          <div className={styling.SectionHero.button}>
            <ButtonLogin
              isLoggedIn={true}
            />
          </div>
        </div>

        <div className="max-w-sm mx-auto pl-0 sm:pl-6">
          {styling.SectionHero.image.showImage && (
            <ImageHero />
          )}
          {styling.SectionHero.video.showVideo && (
            <VideoHero />
          )}
        </div>

      </div>
    </section>
  );
}
