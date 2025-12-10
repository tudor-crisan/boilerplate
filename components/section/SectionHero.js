import copywriting from "@/config/copywriting.json";

export default function SectionHero({ children }) {
  const { headline, paragraph } = copywriting.SectionHero;

  return (
    <main>
      <section className="text-center py-32 px-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold leading-none capitalize mb-6">
          {headline}
        </h1>
        <p className="opacity-90 mb-10">
          {paragraph}
        </p>
        <div>{children}</div>
      </section>
    </main>
  );
}
