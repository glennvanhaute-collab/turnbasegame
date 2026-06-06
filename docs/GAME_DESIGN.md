# Bannerlords of Westrun — Game Design Document

*Hobby project. Will release for friends when satisfied. No monetization.*

---

## Implementation Status *(updated 2026-06-06)*

### Done
- Turn-meter combat engine with affinities, crits, status effects, set bonus passives
- Hero collection, roster building, gear equipping
- Forge: copper gear only (recipes, smelting, star upgrades, orbing stub)
- Dungeons (Easy → Nightmare), dungeon victory screen
- Raids: lore browser + FF-style full-screen battle arena
  - **The Throne of Regret** — Batman, Lord of Nightmares (solo, 3 phases)
  - **The Void Heir** — Aurelian Dragonforge + Nytherax the Starless Wyrm (2 enemies, 3 phases)
  - Raids are **intentionally overtuned** — require legendary gear + substats to clear
- The Architect — dev-only god unit, auto-unlocked in DevMenu
- Settings panel with house theme selector and reset progress button
- Collab folder for lore contributions from non-technical friends

### Next priority — Gear expansion
Raids are the content goal but copper gear leaves players nowhere near raid-viable.
The unlock path that needs building:

1. **Gear recipes for all bar tiers** (tin → steel → darksteel → mithril → moonsilver/vaultmetal/runeite)
2. **Substats / discovery lines on Legendary+ gear** — the orbing system
3. **Re-tune raid difficulty** against real legendary gear stats once it exists

Everything else (gear history, deed tracking, named weapons) layers on top of this foundation.

---

## Vision

You are a hedge knight. You start with nothing — no house, no banner, no name anyone recognises. You build a camp, forge connections in the world of Westrun, and grow your roster by earning the right to tell the stories of the people who join you.

A turn-based RPG where everything is farmable, every roster tells a different story, and the game never punishes you for being clever. Inspired by old-school RPGs where gear has weight and permanence, and by the LOTR idea that swords earn names through deeds — not through stats alone.

The design philosophy comes from tabletop GMing: the goal is to make players have fun. Rules exist to serve the experience, not constrain it. If a player finds a broken combination, that's their story.

---

## Core Loop

### Free content (no energy cost)
- **Training Grounds** — on the homepage, always available, lower rewards
- **Crafting & Smelting** — fully free, the primary gear progression path
- **Exploration** — free roaming, story events, tavern encounters, unlocks forge types and lore fragments

### Energy-gated content
- **Dungeons** — cost energy, best loot, primary progression driver
- **Raids** — team content
- **Sieges** — large-scale castle assaults requiring a deep roster (more than 5 units)

The energy system gates *speed* of progression, not access to the game. You can always do something meaningful when energy is dry.

---

## Combat

- **Turn-meter system** — speed fills each hero's turn meter; first to 100 acts
- **Skill synergy** — heroes are designed around combinations, not just individual power; this is a core philosophy not yet fully visible in the current build
- **Affinity triangle** — Force beats Magic, Magic beats Spirit, Spirit beats Force (±15% damage); Void and Astral are neutral; Blood is strong vs Spirit, weak vs Force
- **Player abuse is fine** — broken combos, insane synergies, unintended interactions are the player's story. Never nerf clever play. The only edge case worth preventing is soft locks (progress becoming impossible).

---

## Gear Philosophy

Gear is permanent and meaningful. This is the core departure from modern gacha.

- **Crafted gear is better than dropped gear** — the forge is the primary power path
- **Legendary gear is irreplaceable** — once you have it, you don't discard it for the next tier
- **Gear earns history through deeds** — a legendary sword cleared through a Nightmare Dungeon gains stats from that encounter. The sword remembers
- **History belongs to the item, not the bearer** — equipping it on a different hero keeps all accumulated history
- **Named weapons** — the LOTR principle: Sting wasn't special because of its stats. It was special because of what it survived

### The Journey of a Legendary Item

Every layer comes from a different part of the game. Combat, crafting, and exploration all contribute.

```
FORGE         →  base item crafted, starts at Common
ARTISAN       →  starred up with bars (★0 → ★10), stats scale, rarity rises
ORBING        →  discovery lines added/rerolled on Legendary+
EXPLORATION   →  runes / shrine blessings / faction blessings inscribed
DEEDS         →  nightmare clears, sieges permanently add stats
NAME          →  at some threshold the item earns a name
```

Two routes to Mythical — and a third that produces something unrepeatable:
- **Route A (Artisan):** craft → star up to ★10
- **Route B (The World):** craft → stack enough exploration blessings/deeds
- **Route C (Both):** the item with a biography. The screenshot moment.

### Exploration Additives — Runes, Shrines, Blessings

Found during exploration, not crafted or dropped from combat. Each source is **themed** to its origin.

Examples:
- **Aldric iron shrine** → force, endurance, defense stats
- **Caelwyn forest shrine** → spirit, healing, regeneration stats
- **Valdris arcane altar** → magic, crit, spell power stats
- **Mordaine void altar** → void, speed, shadow stats
- **Ancient relic** → powerful, mysterious, unique effects
- **Goblin lucky charm** → luck, gold find, discovery bonuses

**Placement is permanent and immediate.** When you find a shrine blessing, you decide which item receives it — right now. No removing it later. The item remembers.

**Exception — Herbalism bottling:** A hero with the Herbalism artisan skill can craft special bottles (via the herbalism recipe system). A bottled blessing can be stored and applied later. This costs crafting resources and time. It rewards players who invested in a herbalist without punishing those who didn't — they just have to decide in the moment, which has its own drama.

This is the **first mechanical activation of artisan skills** in camp. The herbalist isn't flavour — they change how you interact with the world.

### No cap on additives
There is no limit to how many blessings, runes, or deeds an item can accumulate. Stacking enough of them is what triggers the rarity upgrade to Mythical — the world's contribution, not the artisan's.

### Rarity threshold from additives
Each additive has a "weight." When accumulated weight crosses a threshold, the item's rarity steps up. An item that has been blessed by multiple themed shrines AND survived notable deeds crosses into Mythical through lived experience, not just bars.

*Exact weight values to be defined during balancing — do not tune prematurely.*

---

## Forge & Crafting

**The chain:** Ore → Smelting → Bars → Gear (via recipes) → Artisan upgrades → Orbing

### Forge tiers & discovery
- Basic Forge is available from the start
- Elven, Goblin, and Dwarf Forges are discovered through **luck during exploration** — not guaranteed unlocks, not quest rewards. You stumble upon them. This makes the world feel alive rather than scripted.
- Future: a **reputation system** and **specialized artisan units** may open additional forge access or unlock exclusive recipes (see Camp Infrastructure below)

### Artisan Upgrade System (the cubing mechanic)
Crafted gear starts at Common and can be starred up to Mythical. Each upgrade costs bars of the item's material tier. Stats scale with stars.

| Stars | Rarity |
|---|---|
| 0 | Common |
| 2 | Uncommon |
| 4 | Rare |
| 6 | Epic |
| 8 | Legendary |
| 10 | Mythical (max) |

### Orbing (line rerolling on Legendary/Mythical gear)
Inspired by MapleStory cubing. Three orb types crafted from dungeon-dropped materials:

- **Simple Orb** (Ashen Fragments) — random reroll of all discovery lines
- **Magnificent Orb** (Ember Shards) — biased reroll, 40% chance each line rolls prime range
- **Astral Orb** (Void Crystals + Ember Shard) — rolls new lines in secret, shows old vs new side by side, player chooses which to keep. Orb consumed either way.

### Crafting Disciplines

Four crafting disciplines, each producing a distinct armor type that feeds into the set bonus system:

| Discipline | Armor Type | Produces |
|---|---|---|
| Blacksmithing | Plate | Plate armor (all 5 armor slots) + metal weapons (sword, axe, mace, spear) + shields |
| Leatherworking | Leather | Leather armor (all 5 armor slots) + daggers |
| Tailoring | Cloth | Cloth armor (all 5 armor slots) + off-hand tomes/focuses |
| Woodworking | — | Bows (leather affinity), staves + wands (cloth affinity) |

Woodworking is a production skill, not a set identity. A bow counts toward the leather set bonus; a staff/wand counts toward the cloth set bonus. This means a ranger with full leather armor + bow hits 6 leather pieces naturally.

### Armor Type Set Bonuses

Wearing X pieces of the same armor type grants escalating bonuses. Piece count includes all 7 gear slots — armor slots (head/chest/legs/boots/gloves) plus weapons and shields that match the armor type.

Thresholds stack — hitting 4-piece also gives the 2-piece bonus.

| Set | 2-piece | 4-piece | 6-piece (flat) | 6-piece (passive, future) |
|---|---|---|---|---|
| **Plate** | +8% DEF | +12% HP | +5% DEF, +8% HP | On being hit below 30% HP: gain a shield equal to 10% max HP (once per battle) |
| **Leather** | +8% SPD | +10% Crit Rate | +8% ATK | First action each battle deals 25% bonus damage |
| **Cloth** | +12% ATK | +10% Crit DMG | +8% HP | AOE skills deal 15% increased damage |

The 6-piece passive effects are stubbed in `setBonus.js` (`SET_PASSIVE_6`). The combat store will check for them when battle hooks are implemented — flat stats apply now, passives fire later.

**Set bonus is not a lock.** Players can mix armor types freely. If you want +8% SPD from 2 leather pieces alongside plate armor, that's valid. The system rewards commitment without punishing experimentation.

### Forge Affinity (implemented)

Heroes can have `forgeAffinities: ['vaultmetal', 'runeite']` on their template — a list of item tiers that grant them a bonus when equipped. Each matching piece gives **+6% ATK and +6% DEF**.

```
Zwierls: forgeAffinities: ['vaultmetal', 'runeite']
→ Goblin Forge (vaultmetal) and Dwarf Forge (runeite) gear each grant +6% ATK/DEF
→ Full 7-piece dwarven/goblin kit = +42% ATK and DEF on top of base stats
```

**How it works:** `computeGearStats` calls `HERO_TEMPLATES[heroKey]()` to read `forgeAffinities`, counts matching `item.tier` values in the loadout, and applies `count × 0.06` to `atkPct` and `defPct`. The equipment view shows the active count and bonus.

**Adding forge affinity to a hero:** Add `forgeAffinities: ['tier_id']` to their template. Tier IDs: `copper`, `tin`, `steel`, `darksteel`, `mithril`, `moonsilver` (Elven), `vaultmetal` (Goblin), `runeite` (Dwarf).

**Design intent:** Creates a progression loop — unlock the special forge encounter → craft that forge's gear → equip it on the hero with matching affinity → they get noticeably stronger. Rewards thematic builds without hard-locking.

### Hero Gear Affinity (future layer)

Individual heroes can have `gearAffinity` bonuses that trigger from specific equipment — separate from set bonuses and forge affinity, defined on the hero template:

```
Lirien: +10% ATK when main hand is a bow
Iron Blade: +8% DEF when wearing full plate (all 5 armor slots)
Ember Sage: +15% skill damage when staff equipped
```

Design target: `computeGearStats` reads `gearAffinity` from the hero template and applies matching conditions. No hard locks — just bonus rewards for thematic builds.

### Progression Balance Target

| Milestone | What achieves it |
|---|---|
| Clear Easy Dungeon (first time) | ★2 weapon + 2-piece plate set bonus |
| Farm Easy Dungeons reliably | ★4 + 4-piece set |
| Enter Medium Dungeons | Full 6-piece set + star gates (★5/★6) |

### Economy Loop — nothing is wasted
Unused resources can be sold for gold. Gold buys things across the game. The design intent: everything you farm, everything you hoard, will eventually have a use. No dead-end resources.

*"Sell resources for gold" mechanic: do not implement until reward rates and drop tables are tuned. Touching it earlier means rebalancing twice.*

---

## Camp Infrastructure — Roster Beyond Combat

Heroes are not just battle units. They are **camp assets**. Who you have in your roster affects what your camp can do.

Heroes carry `artisanSkills` — currently assigned but not yet mechanically active. These are the foundation of this system:

| Artisan Skill | Camp Role |
|---|---|
| Blacksmithing | Forge capability, recipe access, smithing speed |
| Apothecary | Potion crafting, healing consumables |
| Herbalism | Resource gathering, rare ingredient discovery |
| Leatherworking | Leather gear, light armour recipes |
| Tailoring | Cloth gear, robes, mage equipment |

**The design intent:** having Ser Roland (blacksmithing) in your camp means your forge works better or unlocks things it otherwise can't do. The *who* in your roster matters outside of battle. Roster as camp infrastructure, not just battle team — consistent with the hedge knight camp-building premise.

### Reputation System (future)
A system for building standing with factions, settlements, or artisan guilds in the world. Reputation could:
- Unlock forge tiers or exclusive recipes
- Open recruitment of specialized artisan units who aren't fighters but transform camp capability
- Gate certain exploration events or story beats

*This connects to the DLC lore-recruitment vision — reputation as another form of lore investment.*

---

## The Progression Unit

The player's created hedge knight is not just a character — it is the mechanical heartbeat of the entire game.

**How it works:**
- Your hedge knight levels up by clearing content (XP scales with dungeon difficulty)
- Its rarity tier unlocks at level thresholds, gating what heroes you can recruit:

| Level | Rarity unlocked |
|---|---|
| 1 | Rare |
| 26 | Epic |
| 61 | Legendary |
| 101 | Mythical |

- You cannot recruit heroes of higher rarity than your current tier
- This prevents power jumps and keeps the world feeling earned

**Soul Bind — upgrading a recruited hero to progression unit:**
If you become attached to a recruited hero's skillset and identity, you can soul bind them — they become your progression unit and level with you instead of the starting hedge knight. The `levelMultiplier` system (up to 2.5× base stats) is the mechanic behind this.

*Implementation status: progression unit leveling ✅ fully wired. Recruitment ceiling ✅ enforced in summon store + surfaced in UI (locked rarities shown with next unlock level). XP scales with level (200 + level × 100) so Mythical requires real effort to reach. Soul bind upgrade 🔧 partially in place (levelMultiplier exists, full UI/transfer logic pending).*

---

## Hero Roster & Recruitment

### Current system
Standard probability-based summon portal with rarity tiers (Common → Ancient) and faction pools.

### DLC vision — Lore-based recruitment
The full recruitment vision is planned as a DLC layer, not the base game:
- Exploration events, tavern encounters, and story beats mention character names
- Encountering a name in the world boosts that character's pull rate
- Some characters are entirely hidden until discovered through lore (e.g. Edran Ashveil does not exist in the game until Aldric's fragment `aldric_f5` is unlocked)
- The Void Gate: Mordaine units cannot be recruited until the player has invested enough lore understanding them — not a progression wall, the story working

The philosophy: you are not buying a squad. You are earning the right to tell their story.

### Sieges
When your roster grows large, Training Grounds and Dungeons are not enough. Sieges are castle-scale content that require deploying more than 5 units — the natural outlet for a deep roster.

---

## Factions

| House | Affinity | Identity |
|---|---|---|
| House Aldric | Force | Warriors, iron, endurance |
| House Valdris | Magic | Scholars, arcane, surgical |
| House Caelwyn | Spirit | Nature, memory, healers |
| House Mordaine | Void | Shadow, corruption, assassins |
| House Bloodtusk | Blood | Vampiric, life-drain |
| House Ignar | — | TBD |
| Ancient Nobles | — | Late-game, locked behind deep progression |

---

## The Codex

The codex is a living document — part lore reader, part personal adventure log.

### Lore layer
- Hero entries with quotes, body text, and unlockable fragments
- Fragments unlock through dungeon clears, exploration, and companionship
- Some fragments reveal new heroes entirely
- Some fragments unlock **companionship bonds** — passive synergies between two heroes who share history (e.g. Lord Aldric + Edran Ashveil)
- Designed for lore players but intended to intrigue even players who don't seek it out — the hook is always present, never forced

### Adventure log layer (future)
- Player-generated entries from meaningful moments: a legendary crafted, a dungeon cleared, a named weapon earned
- "I forged the Moonsilver Blade on day 47. It survived the Nightmare Rift. Velmorn carried it into the siege of Caelwyn."
- These are the screenshot moments — the things players send to friends

### Edwyn the Advisor
An in-game narrator and curator. He is the DM voice — the bridge between discovery and explanation. The game is designed so that curious players discover things naturally, but Edwyn ensures no one is ever genuinely lost. Currently implemented with a typewriter text effect.

The design tension he solves: the game has deep, interlocking systems that reward exploration and reading. Not every player will do that. Edwyn exists so that *both* types of player — the one who reads everything and the one who just wants to fight — can find their footing. He explains just enough, never too much. The rest is yours to find.

---

## DLC / Future Systems (do not implement prematurely)

- **Lore-based recruitment rates** (see Hero Roster section)
- **Soul Weapons** — bind to a unit, enhance skill behaviour (not raw stats), star up through dungeon clears and codex completion
- **Artifacts** — faction-bound equipment slot that defines meta role, not raw power
- **House-locked dungeons** — faction-specific content that strongly suggests the right team without hard-locking
- **Faction bonuses + cross-faction resonance** — reward faction loyalty without punishing mixed rosters
- **PvP** — speed management and strip meta, barrier/reflect compositions
- **Adventure log** — player-authored codex entries from in-game events
- **Reputation system** — faction/guild standing that unlocks forge tiers, recipes, and artisan units
- **Specialized artisan units** — non-combat roster members who transform camp capability

---

## Design Principles

1. **Everything is farmable.** No hard paywalls, no FOMO, no expiring banners.
2. **Your roster is your biography.** Two players at the same level should have completely different stories.
3. **Gear has gravity.** It is earned, it remembers, it is not replaced by the next tier.
4. **The world reveals itself.** Lore is discovered, not dumped. Characters don't exist until you find them.
5. **Be a good DM.** Make players have fun. Don't punish clever play. Don't set rules that feel like walls.
6. **Build the skeleton first.** All systems know each other exist before any system is polished.
7. **Nothing is wasted.** Every resource, every unit, every piece of gear has a use somewhere in the system.
8. **Discovery and explanation coexist.** The world rewards the curious. Edwyn protects the lost.

---

## Icon System

Icons are served from PNG spritesheets in `src/assets/ui/`. Each sheet is numbered (`icons_1.png`, `icons_2.png`, ...) so additional sheets can be added without renaming.

### Current sheets

**icons_1.png** — 8 columns × 4 rows, source 1774×887px

| Row | Contents |
|---|---|
| 0 | Navigation: collection, market, blacksmith (cols 0–2); cols 3–7 reserved |
| 1 | Ores: copper → runite (8 tiers, left to right) |
| 2 | Bars: copper → runite (same order as ores) |
| 3 | Gear slots: sword, dagger, shield, helmet, chest, legs, boots, gloves |

### How to use

```vue
import GameIcon from '@/components/ui/GameIcon.vue'

<GameIcon icon="copper_bar" :size="20" />
<GameIcon icon="helmet" :size="28" />
```

The component accepts any icon name from `ICONS` in `src/game/data/spritesheet.js`. The `:size` prop is the display size in px — the component scales the sheet automatically, so source resolution is irrelevant.

Helper functions in `spritesheet.js`:
- `barIcon(tierId)` → `"${tierId}_bar"` — use with resource tier IDs
- `oreIcon(tierId)` → `"${tierId}_ore"` — same
- `SLOT_TO_ICON[slotKey]` — maps GearSlot values to slot icon names

### Currently wired
- BlacksmithView: smelt buttons, ore/bar conversion row, forge recipe list slot icons, stockpile
- GearSlotCard: filled and empty slot icons
- HomeView encampment panel: Collection, Market, Blacksmith buttons
- HeroDetailModal: equipped gear slot icons

### Current sheets
| File | Size | Grid | Contents |
|---|---|---|---|
| `icons_1.png` | 1774×887 | 8×4 | Nav, ores, bars, gear slots |
| `icons_2.png` | 2048×768 | 8×3 | Currency/UI, affinities, artisan skills |

### Adding a new sheet

**Step 1 — Generate with ChatGPT using this exact prompt template:**

```
Create a pixel art RPG sprite sheet on a single black background.
8 columns × [N] rows, each icon in a 64×64 pixel cell with a small
dark border separating cells. Total image: 512×[N*64] pixels.

Style: dark fantasy RPG item icons, Runescape / old-school MMORPG
aesthetic, clean linework, warm highlights, muted earthy palette
with strong accent colors. Match the style of icons_1.png exactly.

Row 0: [icon name]: [description], [icon name]: [description], ...
Row 1: ...
[remaining rows, mark empty cells as "leave black/empty"]

Do not add any labels or text. Icons must be visually distinct and
readable at small size. Consistent lighting from top-left on all icons.
```

**Step 2 — Drop the file as `src/assets/ui/icons_[N].png`**

**Step 3 — Add to `spritesheet.js`:**
```js
export const SHEET_[N]_ROWS = [rows]
const ICONS_[N] = {
  icon_name: pos(col, row, N),
  ...
}
// Merge into ICONS: export const ICONS = { ...ICONS_1, ...ICONS_2, ...ICONS_N }
```

**Step 4 — Register in `GameIcon.vue`:**
```js
import sheetNUrl from '../../assets/ui/icons_N.png'
const SHEET_ROWS = { 1: SHEET_1_ROWS, 2: SHEET_2_ROWS, N: SHEET_N_ROWS }
const SHEET_URLS = { 1: sheet1Url, 2: sheet2Url, N: sheetNUrl }
```

## Tech Stack

| | |
|---|---|
| Framework | Vue 3 (Composition API) |
| State | Pinia — 16 stores, intentionally no backend |
| Combat animation | PixiJS |
| UI animation | GSAP |
| Build | Vite |

*Backend is a future concern. Pinia is the in-memory game state for now — a deliberate choice.*

---

## Implementation Status Snapshot
*(as of June 2026 — update when systems are completed)*

| System | Status |
|---|---|
| Battle engine (turn meter, skills, affinity, status effects) | ✅ Complete |
| Battle as modal overlay (Escape to close) | ✅ Complete |
| Battle log collapsible (default closed) | ✅ Complete |
| Battle speed & auto-battle persisted across sessions | ✅ Complete |
| Dungeon battles auto-play on entry | ✅ Complete |
| Hero templates & faction data | ✅ Complete |
| Portrait auto-discovery (drop PNG in rarity folder) | ✅ Complete |
| Smelting (real-time, offline catch-up) | ✅ Complete |
| Forge / Artisan upgrade / Orbing | ✅ Complete |
| Ancient Forge node (works on any gear rarity) | ✅ Complete |
| Forge tier discovery flags (elven/goblin/dwarf) | 🔧 Flags exist, not yet set by exploration |
| Progression unit leveling & XP | ✅ Complete |
| XP scaling (200 + level × 100 per level — not flat) | ✅ Complete |
| Recruitment ceiling enforcement in summon store + UI | ✅ Complete |
| Summon rates: Rare 88% / Epic 9% / Legendary 2.5% / Mythical 0.5% | ✅ Complete |
| All recruitable heroes promoted to Rare base tier (no Common/Uncommon pulls) | ✅ Complete |
| Currency (gold/diamonds) persistence across sessions | ✅ Complete |
| Save file export / import (game keys only) | ✅ Complete |
| GitHub Pages deployment (Actions workflow) | ✅ Complete |
| Training Grounds redesign (tab bar + sidebar by difficulty) | ✅ Complete |
| Dungeon component drops (Copper/Tin Essence) displayed on victory | ✅ Complete |
| Soul Bind upgrade flow | 🔧 Multiplier exists, UI/transfer logic pending |
| Artisan skills activating camp bonuses | ❌ Assigned to heroes, not yet mechanically active |
| Codex lore structure | ✅ Structure complete, content being written offline |
| Edwyn advisor + typewriter effect | ✅ Complete |
| Sell resources for gold | ❌ Do not build until rewards are balanced |
| Exploration additive system (runes/shrines/blessings) | ❌ Designed, not yet built |
| Herbalism bottling of blessings | ❌ Depends on exploration additives |
| Additive rarity threshold (world route to Mythical) | ❌ Depends on exploration additives |
| Armor type system (ArmorType, WEAPON_ARMOR_TYPE on all recipes) | ✅ Complete |
| Set bonus data (plate/leather/cloth, 2/4/6 thresholds) | ✅ Complete |
| Set bonus counting + flat stat application in computeGearStats | ✅ Complete |
| Set passive 6-piece effects (steadfast / opener / aoe_amplify) | 🔧 Stubbed in setBonus.js, combat hooks pending |
| Hero gear affinity bonuses (e.g. +ATK when bow equipped) | ❌ Designed, not yet built |
| Leatherworking crafting discipline | ❌ Designed, not yet built |
| Tailoring crafting discipline | ❌ Designed, not yet built |
| Woodworking crafting discipline (bow, staff, wand) | ❌ Designed, not yet built |
| Copper full set complete (sword, dagger, shield, helmet, chest, legplates, greaves, gauntlets) | ✅ Complete |
| Elven set armorType tagged as plate | ✅ Complete |
| Gear history / deed inscriptions / named weapons | ❌ Future work |
| Reputation system | ❌ Future / DLC |
| Lore-based recruitment | ❌ DLC |
