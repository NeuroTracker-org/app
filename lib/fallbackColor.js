// util/fallbackColor.js
/**
 * Mélange une couleur hex/rgb avec un fond (par défaut noir) en alpha
 * @param {string} color - ex: "#fa2059" ou "rgb(255,0,0)"
 * @param {number} alpha - entre 0 et 1
 * @param {string} background - couleur de fond (ex: "#101319")
 * @returns {string} rgb(r,g,b)
 */
export function blendColor(color, alpha = 0.5, background = "#101319") {
  const parseRgb = (c) => {
    if (c.startsWith("#")) {
      const bigint = parseInt(c.slice(1), 16);
      if (c.length === 7) {
        return [
          (bigint >> 16) & 255,
          (bigint >> 8) & 255,
          bigint & 255,
        ];
      }
    }
    if (c.startsWith("rgb")) {
      return c.match(/\d+/g).map(Number);
    }
    return [0, 0, 0];
  };

  const [r1, g1, b1] = parseRgb(color);
  const [r2, g2, b2] = parseRgb(background);

  const r = Math.round(r1 * alpha + r2 * (1 - alpha));
  const g = Math.round(g1 * alpha + g2 * (1 - alpha));
  const b = Math.round(b1 * alpha + b2 * (1 - alpha));

  return `rgb(${r},${g},${b})`;
}
