import "./globals.css";
import styling from "@/config/styling.json";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme={styling.defaultTheme}>
      <body>
        {children}
      </body>
    </html>
  );
}
