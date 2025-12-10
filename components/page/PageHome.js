
import SectionHero from "@/components/section/SectionHero";
import SectionHeader from "@/components/section/SectionHeader";
import SectionPricing from "@/components/section/SectionPricing";
import SectionFAQ from "@/components/section/SectionFAQ";

export default function PageHome() {
  return (
    <main>
      <SectionHeader />
      <SectionHero />
      <SectionPricing />
      <SectionFAQ />
    </main>
  );
}
