import Toaster from "@/components/common/Toaster";
import IconFavicon from "@/components/icon/IconFavicon";
import ShuffleCopywritings from "@/components/shuffle/ShuffleCopywritings";
import ShuffleFonts from "@/components/shuffle/ShuffleFonts";
import ShuffleLogos from "@/components/shuffle/ShuffleLogos";
import ShuffleStylings from "@/components/shuffle/ShuffleStylings";
import ShuffleThemes from "@/components/shuffle/ShuffleThemes";
import ShuffleVisuals from "@/components/shuffle/ShuffleVisuals";
import WrapperBody from "@/components/wrapper/WrapperBody";
import WrapperCopywriting from "@/components/wrapper/WrapperCopywriting";
import WrapperFont from "@/components/wrapper/WrapperFont";
import WrapperHead from "@/components/wrapper/WrapperHead";
import WrapperHtml from "@/components/wrapper/WrapperHtml";
import WrapperShuffle from "@/components/wrapper/WrapperShuffle";
import WrapperStyling from "@/components/wrapper/WrapperStyling";
import WrapperVisual from "@/components/wrapper/WrapperVisual";
import { getMetadata } from "@/libs/seo";
import WrapperAuth from "@/modules/auth/components/wrapper/WrapperAuth.server";
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
