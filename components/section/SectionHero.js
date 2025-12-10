import copywriting from "@/config/copywriting.json";
import ButtonLogin from "@/components/button/ButtonLogin";
import styling from "@/config/styling.json";

export default function SectionHero() {
  return (
    <section className={`${styling.section.wrapper} ${styling.section.spacing} text-center`}>
      <h1 className={`${styling.headline.styling} mb-6`}>
        {copywriting.SectionHero.headline}
      </h1>
      <p className="opacity-90 mb-10">
        {copywriting.SectionHero.paragraph}
      </p>
      <ButtonLogin
        isLoggedIn={true}
      />
    </section>
  );
}
