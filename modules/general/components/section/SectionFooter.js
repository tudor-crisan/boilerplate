"use client";
import FooterBrand from "@/modules/general/components/footer/FooterBrand";
import FooterMenu from "@/modules/general/components/footer/FooterMenu";
import FooterSocial from "@/modules/general/components/footer/FooterSocial";
import WrapperFooter from "@/modules/general/components/wrapper/WrapperFooter";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { useVisual } from "@/modules/general/context/ContextVisual";
import { cn } from "@/modules/general/libs/utils.client";

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
