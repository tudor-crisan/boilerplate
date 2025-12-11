
// const icons = {
//     "": ``,
//     "": ``,
//     "": ``,
//     "": ``,
//     "": ``,
// }

function svgLogos() {
  const result = {};

  for (const [name, svg] of Object.entries(icons)) {
    const entry = { path: [], circle: [] };

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

    result[name] = entry;
  }

  return result;
}

console.log(JSON.stringify(svgLogos(), null, 2));