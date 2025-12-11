import "./globals.css";
import styling from "@/config/styling.json";
import copywriting from "@/config/copywriting.json";
import FontWrapper from "@/components/base/FontWrapper";
import ShuffleLogos from "@/components/shuffle/ShuffleLogos";
import ShuffleFonts from "@/components/shuffle/ShuffleFonts";
import ShuffleThemes from "@/components/shuffle/ShuffleThemes";

export const metadata = {
  title: copywriting.Metadata.title,
  description: copywriting.Metadata.description
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme={styling.theme}
      className="scroll-smooth"
    >
      <head>
        <link
          rel="icon"
          type={styling.favicon.type}
          sizes={styling.favicon.sizes}
          href={styling.favicon.href}
        />
      </head>
      <body className={styling.general.body}>
        <FontWrapper>
          {children}
        </FontWrapper>
        <ShuffleLogos />
        <ShuffleFonts />
        <ShuffleThemes />
      </body>
    </html>
  );
}
