import "./globals.css";
import WrapperHtml from "@/components/wrapper/WrapperHtml";
import WrapperHead from "@/components/wrapper/WrapperHead";
import WrapperBody from "@/components/wrapper/WrapperBody";
import WrapperStyling from "@/components/wrapper/WrapperStyling";
import WrapperCopywriting from "@/components/wrapper/WrapperCopywriting";
import WrapperVisual from "@/components/wrapper/WrapperVisual";
import WrapperFont from "@/components/wrapper/WrapperFont";
import WrapperShuffle from "@/components/wrapper/WrapperShuffle";
import ShuffleLogos from "@/components/shuffle/ShuffleLogos";
import ShuffleFonts from "@/components/shuffle/ShuffleFonts";
import ShuffleThemes from "@/components/shuffle/ShuffleThemes";
import ShuffleCopywritings from "@/components/shuffle/ShuffleCopywritings";
import ShuffleStylings from "@/components/shuffle/ShuffleStylings";
import ShuffleVisuals from "@/components/shuffle/ShuffleVisuals";
import IconFavicon from "@/components/icon/IconFavicon";
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata();
export default function RootLayout({ children }) {
  return (
    <WrapperStyling>
      <WrapperVisual>
        <WrapperHtml>
          <WrapperHead>
            <IconFavicon />
          </WrapperHead>
          <WrapperBody>
            <WrapperCopywriting>
              <WrapperFont>
                {children}
              </WrapperFont>
            </WrapperCopywriting>
            <WrapperShuffle>
              <ShuffleLogos />
              <ShuffleFonts />
              <ShuffleThemes />
              <ShuffleCopywritings />
              <ShuffleStylings />
              <ShuffleVisuals />
            </WrapperShuffle>
          </WrapperBody>
        </WrapperHtml>
      </WrapperVisual>
    </WrapperStyling >
  );
}
