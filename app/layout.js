import "@/app/globals.css";
import WrapperHtml from "@/components/wrapper/WrapperHtml";
import WrapperHead from "@/components/wrapper/WrapperHead";
import WrapperBody from "@/components/wrapper/WrapperBody";
import WrapperStyling from "@/components/wrapper/WrapperStyling";
import WrapperAuth from "@/components/wrapper/WrapperAuth.server";
import WrapperCopywriting from "@/components/wrapper/WrapperCopywriting";
import WrapperVisual from "@/components/wrapper/WrapperVisual";
import WrapperFont from "@/components/wrapper/WrapperFont";
import WrapperShuffle from "@/components/wrapper/WrapperShuffle";
import Toaster from "@/components/common/Toaster";
import ShuffleLogos from "@/components/shuffle/ShuffleLogos";
import ShuffleFonts from "@/components/shuffle/ShuffleFonts";
import ShuffleThemes from "@/components/shuffle/ShuffleThemes";
import ShuffleCopywritings from "@/components/shuffle/ShuffleCopywritings";
import ShuffleStylings from "@/components/shuffle/ShuffleStylings";
import ShuffleVisuals from "@/components/shuffle/ShuffleVisuals";
import IconFavicon from "@/components/icon/IconFavicon";
import { Analytics } from "@vercel/analytics/next"
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata("home");

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

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
                {process.env.MONGO_DB ? (
                  <WrapperAuth>
                    {children}
                  </WrapperAuth>
                ) : children}
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
            <Toaster />
            <Analytics />
          </WrapperBody>
        </WrapperHtml>
      </WrapperVisual>
    </WrapperStyling >
  );
}
