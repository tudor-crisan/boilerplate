
import SectionHero from "@/components/section/SectionHero";
import SectionTop from "@/components/section/SectionTop";
import SectionPricing from "@/components/section/SectionPricing";
import SectionFAQ from "@/components/section/SectionFAQ";

export default function PageHome() {
  return (
    <main>
      <SectionTop />
      <SectionHero />
      <SectionPricing />
      <SectionFAQ />
    </main>
  );
}
