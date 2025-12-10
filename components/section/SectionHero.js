import copywriting from "@/config/copywriting.json";
import ButtonLogin from "@/components/button/ButtonLogin";
import styling from "@/config/styling.json";

export default function SectionHero() {
  return (
    <section className={`${styling.section.wrapper} ${styling.section.spacing} text-center space-y-6`}>
      <h1 className={`${styling.SectionHero.headline}`}>
        {copywriting.SectionHero.headline}
      </h1>
      <p className={`${styling.SectionHero.paragraph}`}>
        {copywriting.SectionHero.paragraph}
      </p>
      <div>
        <ButtonLogin
          isLoggedIn={true}
        />
      </div>
    </section>
  );
}
