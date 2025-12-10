import copywriting from "@/config/copywriting.json";
import ButtonLogin from "@/components/button/ButtonLogin";
import styling from "@/config/styling.json";
import Image from "next/image";
import demoImage from "@/public/images/demo.jpg";

export default function SectionHero() {
  return (
    <section className={`${styling.section.wrapper} ${styling.section.spacing}`}>
      <div className="flex flex-col sm:flex-row sm:items-center space-y-6">
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
        {styling.SectionHero.hasDemoImage && (
          <div className="max-w-sm mx-auto pl-0 sm:pl-6">
            <Image
              src={demoImage}
              alt="Demo Image"
              className="rounded-2xl shadow-md w-180"
            />
          </div>
        )}
      </div>
    </section>
  );
}
