import fonts from "@/modules/general/lists/fonts";

export default function ThemeScript() {
  const fontClasses = {};
  Object.keys(fonts).forEach((key) => {
    if (fonts[key]?.className) {
      fontClasses[key] = fonts[key].className;
    }
  });

  const fontClassesJson = JSON.stringify(fontClasses);

  const script = `
    (function() {
      try {
        const saved = localStorage.getItem('styling-config');
        if (saved) {
          const config = JSON.parse(saved);
          const html = document.documentElement;
          
          if (config.theme) {
            html.setAttribute('data-theme', config.theme);
          }
          
          if (config.font) {
            const fontClasses = ${fontClassesJson};
            const fontClass = fontClasses[config.font];
            if (fontClass) {
              html.classList.add(fontClass);
            }
          }
        }
      } catch (e) {
        console.error('Theme script error', e);
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
