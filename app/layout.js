import "./globals.css";
import styling from "@/config/styling.json";
import copywriting from "@/config/copywriting.json";
import fonts from "@/libs/fonts.js";
import ThemeShuffler from "@/components/dynamic/ThemeShuffler";

export const metadata = {
  title: copywriting.Metadata.title,
  description: copywriting.Metadata.description
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme={styling.theme}
      className={`${fonts[styling.font].className} scroll-smooth`}
    >
      <head>
        <link rel="icon" type="image/png" sizes={styling.favicon.sizes} href={styling.favicon.path} />
      </head>
      <body className="select-none">
        {children}
        <ThemeShuffler />
      </body>
    </html>
  );
}
