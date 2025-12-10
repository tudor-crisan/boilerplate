import "./globals.css";
import styling from "@/config/styling.json";
import copywriting from "@/config/copywriting.json";

export const metadata = {
  title: copywriting.Metadata.title,
  description: copywriting.Metadata.description
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme={styling.theme}>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.svg" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
