
// https://lucide.dev/icons/
// Click on "Copy SVG"

// const icons = {
//     "monitor": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-monitor-smartphone-icon lucide-monitor-smartphone"><path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8"/><path d="M10 19v-3.96 3.15"/><path d="M7 19h5"/><rect width="6" height="10" x="16" y="12" rx="2"/></svg>`,
//     "": ``,
//     "": ``,
//     "": ``,
//     "": ``,
// }

function svgLogos() {
  const result = {};

  for (const [name, svg] of Object.entries(icons)) {
    const entry = { path: [], circle: [], rect: [] };

    // --- Extract <path> d attributes ---
    const pathMatches = [...svg.matchAll(/<path\b[^>]*>/g)];
    for (const match of pathMatches) {
      const d = match[0].match(/d="([^"]*)"/)?.[1];
      if (d) entry.path.push(d);
    }

    // --- Extract <circle> attributes ---
    const circleMatches = [...svg.matchAll(/<circle\b[^>]*>/g)];
    for (const match of circleMatches) {
      const tag = match[0];
      const cx = tag.match(/cx="([^"]*)"/)?.[1] ?? null;
      const cy = tag.match(/cy="([^"]*)"/)?.[1] ?? null;
      const r = tag.match(/r="([^"]*)"/)?.[1] ?? null;

      entry.circle.push([cx, cy, r]);
    }

    // --- Extract <rect> attributes ---
    const rectMatches = [...svg.matchAll(/<rect\b[^>]*>/g)];
    for (const match of rectMatches) {
      const tag = match[0];

      const x = tag.match(/x="([^"]*)"/)?.[1] ?? null;
      const y = tag.match(/y="([^"]*)"/)?.[1] ?? null;
      const width = tag.match(/width="([^"]*)"/)?.[1] ?? null;
      const height = tag.match(/height="([^"]*)"/)?.[1] ?? null;
      const rx = tag.match(/rx="([^"]*)"/)?.[1] ?? null;

      entry.rect.push([x, y, width, height, rx]);
    }

    result[name] = entry;
  }

  return result;
}

console.log(JSON.stringify(svgLogos(), null, 2));