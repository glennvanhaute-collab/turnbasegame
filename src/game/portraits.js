// Auto-discovers every PNG/JPG under assets/units/**/{rarity}/hero-name.png
// Naming convention: hero name, lowercase, spaces → dashes  (e.g. brenna-shieldmaiden.png)
// To add a new portrait just drop the file in the right rarity folder — no code change needed.

const _modulesPng = import.meta.glob('../assets/units/**/*.png', { eager: true })
const _modulesJpg = import.meta.glob('../assets/units/**/*.jpg', { eager: true })
const _modules = { ..._modulesPng, ..._modulesJpg }

// Build lookup: 'brenna-shieldmaiden' → url
const _byFilename = {}
for (const [path, mod] of Object.entries(_modules)) {
  const filename = path.split('/').pop().replace(/\.(png|jpg)$/i, '').toLowerCase()
  _byFilename[filename] = mod.default
}

/**
 * Returns the portrait URL for a hero object, or null if none is found.
 * Lookup order:
 *   1. hero.name → lowercase, spaces to dashes  ('Brenna Shieldmaiden' → 'brenna-shieldmaiden')
 *   2. hero.id   → underscores to dashes         ('lord_aldric' → 'lord-aldric')
 */
export function getPortrait(hero) {
  if (!hero) return null
  const nameKey = hero.name?.toLowerCase().replace(/\s+/g, '-')
  if (nameKey && _byFilename[nameKey]) return _byFilename[nameKey]
  const idKey = hero.id?.replace(/_/g, '-')
  return _byFilename[idKey] ?? null
}

/** Expose the raw map so components can iterate if needed */
export const PORTRAIT_MAP = _byFilename
