import "./globals.css";
import styling from "@/config/styling.json";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme={styling.theme.default}>
      <body>
        {children}
      </body>
    </html>
  );
}
