import "./globals.css";

import HtmlWrapper from "@/components/base/HtmlWrapper";
import HeadWrapper from "@/components/base/HeadWrapper";
import BodyWrapper from "@/components/base/BodyWrapper";
import StylingWrapper from "@/components/base/StylingWrapper";
import CopywritingWrapper from "@/components/base/CopywritingWrapper";
import FontWrapper from "@/components/base/FontWrapper";
import ShuffleLogos from "@/components/shuffle/ShuffleLogos";
import ShuffleFonts from "@/components/shuffle/ShuffleFonts";
import ShuffleThemes from "@/components/shuffle/ShuffleThemes";
import ShuffleCopywritings from "@/components/shuffle/ShuffleCopywritings";
import FavIcon from "@/components/base/FavIcon";
import ShuffleStylings from "@/components/shuffle/ShuffleStylings";
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata();

export default function RootLayout({ children }) {
  return (
    <StylingWrapper>
      <HtmlWrapper>
        <HeadWrapper>
          <FavIcon />
        </HeadWrapper>
        <BodyWrapper>
          <CopywritingWrapper>
            <FontWrapper>
              {children}
            </FontWrapper>
          </CopywritingWrapper>
          <ShuffleLogos />
          <ShuffleFonts />
          <ShuffleThemes />
          <ShuffleCopywritings />
          <ShuffleStylings />
        </BodyWrapper>
      </HtmlWrapper>
    </StylingWrapper >
  );
}
