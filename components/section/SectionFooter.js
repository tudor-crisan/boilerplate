"use client";
import WrapperFooter from "@/components/wrapper/WrapperFooter";
import FooterBrand from "@/components/footer/FooterBrand";
import FooterMenu from "@/components/footer/FooterMenu";
import FooterSocial from "@/components/footer/FooterSocial";
import { useVisual } from "@/context/ContextVisual";

export default function SectionFooter() {
  const { visual } = useVisual();

  return (
    <section id="footer">
      <WrapperFooter>

        {visual.show.SectionFooter.brand && (
          <FooterBrand />
        )}

        {visual.show.SectionFooter.menus && (
          <FooterMenu />
        )}

        {visual.show.SectionFooter.socials && (
          <FooterSocial />
        )}

      </WrapperFooter>
    </section>
  );
}

