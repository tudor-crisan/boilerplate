import styling from "@/config/styling.json";
import SectionHero from "@/components/section/SectionHero";
import SectionHeader from "@/components/section/SectionHeader";
import SectionPricing from "@/components/section/SectionPricing";
import SectionFAQ from "@/components/section/SectionFAQ";

const COMPONENT_MAP = {
  "SectionHeader": SectionHeader,
  "SectionHero": SectionHero,
  "SectionPricing": SectionPricing,
  "SectionFAQ": SectionFAQ
};

export default function PageHome() {
  return (
    <main>
      {styling.homepage.sections.map((key, index) => {
        const Component = COMPONENT_MAP[key];
        return Component ? <Component key={index} /> : null;
      })}
    </main>
  );
}