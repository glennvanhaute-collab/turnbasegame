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
├── ui/             UI chrome (logo, nav bg, anvil, etc.)
└── units/          hero portrait sprites (legendary/, etc.)
```

## Key Patterns

- **Dynamic background via v-bind CSS**: `background-image: v-bind("'url(' + bgRef + ')'")`
- **Rarity color classes**: `.common`, `.uncommon`, `.rare`, `.epic`, `.legendary`, `.mythical` — used on cards, badges, chips across all components
- **Gear slot icons**: defined locally in each component as `SLOT_ICONS` / `GEAR_ICONS` map
- **`createItemInstance(recipe)`** in `Gear.js` — always used to create owned gear; attaches `fitsSlot()` method
