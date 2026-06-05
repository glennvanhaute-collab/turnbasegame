# Economy System

## Currencies

| Currency | Store | Key | Starting value |
|----------|-------|-----|----------------|
| Gold | `useCurrencyStore` | `player-currency` | 1000 |
| Diamonds | `useCurrencyStore` | `player-currency` | 150 |

`spendGold` / `spendDiamonds` return false if insufficient. Both persist immediately on every mutation.

## Passive Gold Income

`useCampStore` (`raid-camp`) — buildings produce gold/min:
- Encampment lvl 1: 5g/min (always active)
- Market lvl 0: 12g/min per level (not yet upgradeable in UI)
- `goldPerMin` = sum of all `building.goldPerMin * building.level` where `level > 0`

App.vue calls `camp.tick(addGold)` every 60s and `camp.catchUp(addGold)` on mount for offline progress.

## Resources (Ores, Bars, Components)

`useResourceStore` (`raid-resources`)

**Ores** — mined from battles via `rollOreDrops(difficulty)` in `src/game/data/ores.js`:
| Difficulty | Drops |
|------------|-------|
| Easy | 65% → copper ×1–3 |
| Normal/Medium | 70% copper ×1–2, 40% tin ×1 |
| Hard | 75% tin ×1–2, 35% steel ×1 |
| Nightmare | 80% steel ×1–2, 22% darksteel ×1, 3% mithril ×1 |

**Bars** — smelted from ore in Blacksmith. `useSmeltingStore` (`raid-smelting`) runs as a real-time job:
- One active job at a time; ore is removed upfront, bars awarded per tick
- `cancelSmelt()` refunds remaining ore
- App.vue calls `smelting.tick()` every second

Bar recipes (`src/game/data/bars.js`):
| Bar | Ore | Cost | Forge level | Smelt time |
|-----|-----|------|-------------|------------|
| Copper | copper | 2 | 0 | 6s |
| Tin | tin | 2 | 0 | 10s |
| Steel | steel | 3 | 1 | 18s |
| Darksteel | darksteel | 3 | 2 | 30s |
| Mithril | mithril | 4 | 3 | 50s |
| Moonsilver | mithril | 2 | 4 (Elven unlock) | 80s |
| Vaultmetal | darksteel | 3 | 5 (Goblin unlock) | 55s |
| Runeite | mithril | 3 | 6 (Dwarf unlock) | 65s |

Forge level 0–3 unlocked via Codex progression. Levels 4–6 (Elven/Goblin/Dwarf) unlocked via rare encounter reward. Hidden in UI until unlocked — `isSpecialForgeUnlocked(level)` in BlacksmithView.

**Upgrade Components** — dropped from dungeons only, never crafted:
- `copper_essence`, `copper_core`, `tin_essence`, `tin_core`, etc.
- Used at star gates ★5 (essence ×1) and ★6 (core ×1, requires smithing lvl 3)
- Defined in `src/game/data/upgradeComponents.js`

## Crafting & Upgrading Gear

Recipes in `src/game/data/recipes.js`:
- Each recipe has `tier`, `barCost` (e.g. `{ copper: 3 }`), `slot`, `baseStats`
- Crafting removes bars from `resources.bars` and adds an instance to `useInventoryStore`
- Items start at ★0 (Common) and can be upgraded to ★10 (Mythical)

**Star upgrade costs** (`STAR_BAR_COST` in recipes.js):
- Index = target star: `[0, 1, 2, 3, 4, 5, 7, 9, 12, 15, 20]`
- Cumulative bars: 0★=0, 4★=10, 10★=78 bars beyond the craft cost
- Rarity gates: Common=0★, Uncommon=2★, Rare=4★, Epic=6★, Legendary=8★, Mythical=10★
- Star gates: ★5 requires `<tier>_essence`, ★6 requires `<tier>_core` + smithing lvl 3

Smithing XP: awarded per bar smelted (`bar.xp × 0.5`) and per item forged (`XP_PER_TIER[tier]`). Level = `floor(xp / 100) + 1`.

## Sell Prices (Market)

`calcSellPrice(item)` in `useInventoryStore.js`:
```
sellPrice = (craftBars + upgradeBars) × TIER_BAR_GOLD[item.tier]
```
- `craftBars` = sum of `recipe.barCost` values
- `upgradeBars` = cumulative sum of `STAR_BAR_COST[1..stars]`
- `TIER_BAR_GOLD`: copper=50, tin=120, steel=250, darksteel=500, mithril=900, moonsilver=1500, vaultmetal=1200, runeite=1800

Example: 4★ copper sword (3 craft + 10 upgrade = 13 bars × 50) = **650g**

Equipped items are hidden from the Market. Sell All works per rarity filter.

## Energy

`useEnergyStore` — regenerates 1 energy per 3 minutes. Used by dungeon exploration (`EXPLORE_COST = 5`). Max energy tracked separately.
