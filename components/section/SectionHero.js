import copywriting from "@/config/copywriting.json";
import ButtonLogin from "@/components/button/ButtonLogin";

export default function SectionHero({ children }) {
  const { headline, paragraph } = copywriting.SectionHero;

  return (
    <section className="text-center py-32 px-8">
      <h1 className="text-4xl font-extrabold leading-none capitalize mb-6">
        {headline}
      </h1>
      <p className="opacity-90 mb-10">
        {paragraph}
      </p>
      <ButtonLogin
        isLoggedIn={true}
      />
    </section>
  );
}
