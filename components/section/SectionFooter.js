"use client";
import FooterBrand from "@/components/footer/FooterBrand";
import FooterMenu from "@/components/footer/FooterMenu";
import FooterSocial from "@/components/footer/FooterSocial";
import WrapperFooter from "@/components/wrapper/WrapperFooter";
import { useStyling } from "@/context/ContextStyling";
import { useVisual } from "@/context/ContextVisual";
import { cn } from "@/libs/utils.client";

export default function SectionFooter() {
  const { styling } = useStyling();
  const { visual } = useVisual();

  const showFooter = visual.show.SectionFooter;

  return (
    <section id="footer" className={cn(styling.SectionFooter.section)}>
      <WrapperFooter>
        {showFooter.brand && <FooterBrand />}
        {showFooter.menus && <FooterMenu />}
        {showFooter.socials && <FooterSocial />}
      </WrapperFooter>
    </section>
  );
}
