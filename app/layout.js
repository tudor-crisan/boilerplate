import WrapperAuth from "@/modules/auth/components/wrapper/WrapperAuth.server";
import Toaster from "@/modules/general/components/common/Toaster";
import IconFavicon from "@/modules/general/components/icon/IconFavicon";
import ShuffleCopywritings from "@/modules/general/components/shuffle/ShuffleCopywritings";
import ShuffleFonts from "@/modules/general/components/shuffle/ShuffleFonts";
import ShuffleLogos from "@/modules/general/components/shuffle/ShuffleLogos";
import ShuffleStylings from "@/modules/general/components/shuffle/ShuffleStylings";
import ShuffleThemes from "@/modules/general/components/shuffle/ShuffleThemes";
import ShuffleVisuals from "@/modules/general/components/shuffle/ShuffleVisuals";
import WrapperBody from "@/modules/general/components/wrapper/WrapperBody";
import WrapperCopywriting from "@/modules/general/components/wrapper/WrapperCopywriting";
import WrapperFont from "@/modules/general/components/wrapper/WrapperFont";
import WrapperHead from "@/modules/general/components/wrapper/WrapperHead";
import WrapperHtml from "@/modules/general/components/wrapper/WrapperHtml";
import WrapperShuffle from "@/modules/general/components/wrapper/WrapperShuffle";
import WrapperStyling from "@/modules/general/components/wrapper/WrapperStyling";
import WrapperVisual from "@/modules/general/components/wrapper/WrapperVisual";
import { getMetadata } from "@/modules/general/libs/seo";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";

export const metadata = {
  ...getMetadata("home"),
  metadataBase: new URL(
    `https://${process.env.NEXT_PUBLIC_DOMAIN_NAME || "localhost:3000"}`,
  ),
};

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
                  <WrapperAuth>{children}</WrapperAuth>
                ) : (
                  children
                )}
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
            <Toaster isGlobal={true} />
            {process.env.NODE_ENV !== "development" && <Analytics />}
          </WrapperBody>
        </WrapperHtml>
      </WrapperVisual>
    </WrapperStyling>
  );
}
