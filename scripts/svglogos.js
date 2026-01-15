
// https://lucide.dev/icons/
// Click on "Copy SVG"

// const icons = {
//   "cuboid": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cuboid-icon lucide-cuboid"><path d="m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.82a2 2 0 0 0 .88 1.66l6.05 4.07a2 2 0 0 0 2.17.05l9.95-6.12a2 2 0 0 0 .95-1.7V8.06a2 2 0 0 0-.88-1.66Z"/><path d="M10 22v-8L2.25 9.15"/><path d="m10 14 11.77-6.87"/></svg>`,
//   "": ``,
//   "": ``,
//   "": ``,
//   "": ``,
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