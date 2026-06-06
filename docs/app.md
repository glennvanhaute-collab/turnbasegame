# App Architecture

## Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Pinia** stores — one per domain, all persisted to localStorage
- **Vite** build
- **PixiJS** for combat sprite rendering (`PixiCombatStage.vue`)

## Root: App.vue

Owns all top-level state and navigation. Key refs:
```js
view          // active route: 'campaign' | 'summon' | 'gear' | 'dungeon' | 'realm'
showCollection  // Teleport modal
showBlacksmith  // Teleport modal
showMarket      // Teleport modal
showBattle      // replaces campaign view
showShop        // diamond shop modal
showCodex       // codex modal
```

**`navigate(newView)`** — closes ALL panels then sets `view`. Every nav button and logo click goes through this. Do not call `view.value = x` directly.

**`closeAllPanels()`** — sets all `show*` refs to false. Called by `navigate()` and `handleEscape`.

Escape key closes panels in priority order. Clicking outside a panel backdrop also closes it.

## Views (routes)

| `view` value | Component | Description |
|---|---|---|
| `campaign` | `HomeView.vue` | Training grounds map + Encampment panel |
| `summon` | `SummonView.vue` (or similar) | Hero recruitment |
| `gear` | `EquipmentView.vue` + `ForgeView.vue` | Arsenal — inventory + star upgrades |
| `dungeon` | `DungeonView.vue` | Expedition browser |
| `realm` | `RealmView.vue` | Realm/lore/progression |

Battle replaces the campaign view: `showBattle = true` renders `BattleArena.vue` over `HomeView`.

## Panels (Teleport modals)

All panels use the same pattern — Teleport to body, Transition fade, backdrop click to close:
| Panel | Trigger | Component |
|---|---|---|
| Collection | HomeView `open-collection` emit | `CollectionView.vue` |
| Blacksmith | HomeView `open-blacksmith` emit | `BlacksmithView.vue` |
| Market | HomeView `open-market` emit | `MarketView.vue` |
| Diamond Shop | Currency display click | `DiamondShopModal.vue` |
| Codex | Nav codex button | inline |

## HomeView / Encampment Panel

`HomeView.vue` has two distinct areas:
1. **Training map** — zone buttons, sidebar encounter list, encounter detail card
2. **Encampment panel** (bottom-right, AoE2 style) — buttons: Collection, Blacksmith, Market, Codex, (others locked)

HomeView emits: `open-collection`, `open-blacksmith`, `open-market`, `start-battle`.  
App.vue listens and toggles the corresponding `show*` ref.

## Component Structure

```
App.vue
├── HeroCreationView (if !playerHero.isCreated)
├── header (nav + currency display)
│   └── currency-display (⚡ energy, 🪙 gold, 💎 diamonds)
├── HomeView (view === 'campaign' && !showBattle)
├── BattleArena (showBattle)
│   ├── PixiCombatStage
│   ├── SkillPanel
│   └── BattleLog
├── [other views per route]
└── [Teleport modals]
    ├── CollectionView
    ├── BlacksmithView
    ├── MarketView
    └── DiamondShopModal
```

## Stores Overview

| Store | localStorage key | Purpose |
|---|---|---|
| `useCurrencyStore` | `player-currency` | Gold, diamonds |
| `useResourceStore` | `raid-resources` | Ores, bars, smithingXp, forgeLevel, components |
| `useInventoryStore` | `raid-inventory` | Gear instances, loadouts, sell logic |
| `useBattleStore` | (none — session) | Battle state machine, rewards |
| `useCampaignStore` | `raid-campaign` | Completed encounter IDs |
| `useCollectionStore` | (memory) | Hero roster, team selection |
| `useSmeltingStore` | `raid-smelting` | Active smelt job (real-time timer) |
| `useDungeonStore` | `raid-dungeons` | Dungeon options, pinned dungeons |
| `useCampStore` | `raid-camp` | Buildings, passive gold tick |
| `useEnergyStore` | (auto) | Energy regen (1 per 3 min) |
| `usePlayerHeroStore` | (auto) | Custom player hero, XP, level |
| `useForgeStore` | (auto) | Orbs and forge materials (separate from blacksmith) |
| `useSummonStore` | (auto) | Summon/gacha state |
| `useArtisanStore` | `raid-artisan` | Artisan skill XP per hero + assigned forge smith |
| `useSettingsStore` | `bow-theme` | House theme (CSS variable overrides) |

## Periodic Ticks (App.vue onMounted)

```js
setInterval(() => smelting.tick(), 1000)  // awards smelted bars
setInterval(() => camp.tick(addGold), 60000)  // passive gold
// energy regen handled internally by useEnergyStore
```

`camp.catchUp()` called on mount to award offline passive gold.

## Persistence Pattern

Every store saves its own slice to localStorage on `watch(..., { deep: true })` or explicit `persist()`. No central save/load — each store is self-contained. No serialization of Vue reactivity — plain objects stored.

`attachMethod()` in `useInventoryStore` re-attaches `fitsSlot()` after JSON parse (methods don't survive serialization).

## Asset Organization

```
src/assets/
├── backgrounds/    scene backgrounds (campaign map, blacksmith, market-bg, etc.)
├── forges/         forge images (forge_01–04, elven_forge, goblin_forge, dwarven_forge)
├── gear/           gear item images + frames (elven/, frames/)
├── ui/             UI chrome (logo, nav bg, anvil, icons_1.png, icons_2.png)
└── units/          hero portrait sprites (legendary/, epic/, rare/, etc.)
```

## Icon System

Sprite sheet based. Two sheets in `src/assets/ui/`:
- `icons_1.png` — 8×4 grid: nav icons (row 0), ores (row 1), bars (row 2), gear slots (row 3)
- `icons_2.png` — 8×3 grid: currency/UI (row 0), affinities (row 1), artisan skills (row 2)

Usage:
```vue
import GameIcon from '@/components/ui/GameIcon.vue'
<GameIcon icon="copper_bar" :size="20" />
<GameIcon icon="helmet" :size="28" />
```

All icon names defined in `src/game/data/spritesheet.js` → `ICONS`. Helpers: `barIcon(tierId)`, `oreIcon(tierId)`, `SLOT_TO_ICON`, `AFFINITY_ICON`, `ARTISAN_SKILL_ICON`.

Adding a new sheet: add the PNG, add entries to `spritesheet.js`, register in `GameIcon.vue`. See `docs/GAME_DESIGN.md` § Icon System for the exact steps and ChatGPT prompt template.

## Hero Template Anatomy

Each hero in `src/game/data/heroes.js` is a factory function `() => new Hero({...})`. Fields:

```js
{
  id, name,
  faction,          // Faction.ALDRIC | VALDRIS | CAELWYN | MORDAINE | BLOODTUSK
  rarity,           // Rarity enum
  affinity,         // Affinity enum (Force/Magic/Spirit/Void/Blood/Astral)
  baseHp, baseAtk, baseDef, baseSpd,
  critRate, critDmg, resistance,
  skills,           // array of SKILLS.* refs from skills.js
  artisanSkills,    // array of ARTISAN.* from artisanSkills.js (1 slot for Rare/Epic, 2 for Legendary+)
  isPlayer,         // true = can be the progression unit / soul-bound
  forgeAffinities,  // optional — ['vaultmetal', 'runeite'] — see economy.md
  quote,            // optional short quote shown on portrait card
  lore,             // optional multi-sentence biography shown in HeroDetailModal
}
```

`quote` and `lore` are displayed in `HeroDetailModal.vue`:
- Quote: shown under the portrait with italics
- Lore: shown in the Biography section tab

**Faction backgrounds** (`src/assets/lore/`): `Aldric.png`, `Valdris.png`, etc. — used as thematic backdrop in `HeroDetailModal` keyed by `hero.faction`.

**Artisan skills** defined in `src/game/data/artisanSkills.js` → `ARTISAN` object. Each has `id`, `name`, `icon` (emoji), `color`, `desc`. `ARTISAN_SLOTS` defines how many skills a rarity tier can hold.

## Theme System

`useSettingsStore` (`bow-theme` localStorage key) — 7 faction themes defined in `THEMES` constant. `applyTheme(id)` writes CSS variables to `:root`:
- `--gold`, `--gold-bright`, `--gold-dim`, `--gold-faint`, `--border-gold`

Themes: `default` (Westrun), `aldric`, `valdris`, `caelwyn`, `mordaine`, `bloodtusk`, `ignar`

Settings cog opens `SettingsPanel.vue` from `App.vue`.

## Artisan Skill System

`useArtisanStore` (`raid-artisan`) — tracks artisan skill XP/level per hero:
- `skillData`: `{ [heroKey]: { [skillId]: { level, xp } } }`
- `addSkillXp(heroKey, skillId, amount)` — levels up: XP cost = `level × 100`
- `assignedForgeSmithKey` — which hero is assigned to the forge
- `smithSpeedMultiplier(heroKey)` — `1 + 0.05 + level × 0.03` (flat +5%, +3% per blacksmithing level)

Assigned forge smith speeds up smelting. Artisan XP awarded through use (smelting, crafting).

## Key Patterns

- **Dynamic background via v-bind CSS**: `background-image: v-bind("'url(' + bgRef + ')'")`
- **Rarity color classes**: `.common`, `.uncommon`, `.rare`, `.epic`, `.legendary`, `.mythical` — used on cards, badges, chips across all components
- **Gear slot icons**: defined locally in each component as `SLOT_ICONS` / `GEAR_ICONS` map
- **`createItemInstance(recipe)`** in `Gear.js` — always used to create owned gear; attaches `fitsSlot()` method
