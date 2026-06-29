# Gear Systems — Design & Implementation Status

*Last audited: 2026-06-29*
*Status icons: ✅ Built & wired | 🔴 Bug / mismatch | 🔲 Not yet implemented | 🔒 Locked design*

---

## Core Philosophy — 🔒 LOCKED

- Legendary is a state you **earn**, not a tier you craft. All gear starts Common (★0).
- Gear becomes Legendary through star upgrades — not by material alone.
- Each gear set represents a distinct playstyle, not just a stat bundle.
- Fusion sets reward players who invest in multiple artisan disciplines.
- The journey from copper to endgame should feel fast and fun early, grindy and satisfying late.

---

## Recipes — What's Built

All three armor types are fully crafted across six tiers:

### Plate (Blacksmith) — `src/game/data/recipes.js` ✅
Full 9-slot sets (weapon/shield/helm/chest/legs/boots/gloves): copper → tin → steel → darksteel → mithril → moonsilver (elven)

Weapon types per tier: Sword (ATK), Dagger (ATK + Crit Rate, `armorType: 'leather'`), Mace (ATK + DEF%), Spear (ATK + SPD)
Moonsilver is `craftDiscipline: 'elven'` — gated behind elven forge unlock.

### Leather (Leatherworking) — `src/game/data/leatherRecipes.js` ✅
5-slot sets (head/chest/legs/boots/gloves): rough (copper) → thick (tin) → hardened (steel) → shadow (darksteel) → celestial (mithril) → moonscale (moonsilver)
Daggers and bows are in `recipes.js` and `woodworkingRecipes.js` respectively.

### Cloth (Tailoring) — `src/game/data/tailoringRecipes.js` ✅
5-slot sets (head/chest/legs/boots/gloves): cotton (copper) → wool (tin) → silkweave (steel) → shadowcloth (darksteel) → starweave (mithril) → moonweave (moonsilver)
Staves are in `recipes.js`.

---

## Star Cap Per Tier

### Design spec — 🔒 LOCKED
| Tier | Max ★ | Max Rarity |
|------|-------|------------|
| Copper | ★3 | Uncommon |
| Tin | ★4 | Rare |
| Steel | ★5 | Rare |
| Darksteel | ★6 | Epic |
| Mithril | ★8 | Legendary |
| Moonsilver | ★10 | Mythical |

### Code — 🔴 MISMATCH (`src/game/data/recipes.js` line 507)
```
TIER_MAX_STARS = { copper: 4, tin: 6, steel: 6, darksteel: 6, mithril: 10, moonsilver: 10 }
```
Early tiers are too generous. Copper can reach Rare (★4), Tin/Steel can reach Epic (★6), Mithril can reach Mythical (★10).
**Fix needed:** Update to `{ copper: 3, tin: 4, steel: 5, darksteel: 6, mithril: 8, moonsilver: 10 }`.

---

## Star Gates

### ★5 and ★6 gates — ✅ Built & wired
Defined in `src/game/data/upgradeComponents.js`, enforced in `src/components/ForgeView.vue`.
- ★5: `<tier>_essence` × 1
- ★6: `<tier>_core` × 1 + Smithing Lv. 3

### ★7–10 gates — 🔲 Not defined
Structure exists in `STAR_GATES` but these stars have no extra requirement beyond bar cost.
Design intent: higher quantities of existing essence/core (TBD during balance pass).

---

## Hardcoded Rarity Bug — 🔴 All Three Files

All gear starts with `rarity` set at craft time from the recipe definition. The upgrade function (ForgeView.vue:623) only ever **increases** rarity — it never starts from Common. This means:

| Recipes | Tier | Hardcoded rarity | Correct rarity at ★0 |
|---------|------|-----------------|----------------------|
| `recipes.js` | mithril | `'Legendary'` | `'Common'` |
| `recipes.js` | moonsilver | `'Epic'` | `'Common'` |
| `leatherRecipes.js` | celestial (mithril) | `'Legendary'` | `'Common'` |
| `leatherRecipes.js` | moonscale (moonsilver) | `'Epic'` | `'Common'` |
| `tailoringRecipes.js` | starweave (mithril) | `'Legendary'` | `'Common'` |
| `tailoringRecipes.js` | moonweave (moonsilver) | `'Epic'` | `'Common'` |

All other tiers (copper→darksteel) are already correct — they start at their crafted rarity and upgrade from there.
**Fix needed:** Set all mithril and moonsilver recipe entries to `rarity: 'Common'`.

---

## Rarity-by-Stars Function — ✅ Built

`rarityForStars(stars)` in `recipes.js:494`:
```
★0 = Common | ★2 = Uncommon | ★4 = Rare | ★6 = Epic | ★8 = Legendary | ★10 = Mythical
```
`STAR_BAR_COST = [0, 1, 1, 2, 2, 3, 3, 5, 7, 9, 12]` — bar cost to upgrade to each star.
`starMultiplier(stars)` — stat multiplier at a given star count (+5%/star for ★1–4, +8%/star for ★5–6, +6%/star for ★7–10).

---

## Pure Set Bonuses — `src/game/data/setBonus.js`

### Flat bonuses — ✅ Defined (wired in collection/combat stores)
```
plate:   2pc +8% DEF | 4pc +12% HP | 6pc +5% DEF +8% HP
leather: 2pc +8% SPD | 4pc +10% Crit Rate | 6pc +8% ATK
cloth:   2pc +12% ATK | 4pc +10% Crit DMG | 6pc +8% HP
```

### 6pc passives — 🔴 Stubs only, not wired in BattleEngine
Code stubs (`SET_PASSIVE_6`):
- plate: `steadfast` — "When HP drops below 30%, gain a shield equal to 10% max HP (once per battle)."
- leather: `opener` — "First action each battle deals 25% bonus damage."
- cloth: `aoe_amplify` — "Skills that hit all enemies deal 15% increased damage."

**Design conflict — leather passive:**
- Code has: `opener` (first action +25% damage) — offensive
- Design doc says: `Shroud` (untargetable turn 1) — defensive/evasive
These are different identities. **Decision needed** before implementing.

---

## Set Identities — 🔒 LOCKED (design)

### Plate — "The Last Stand"
Immovable wall. You don't dodge — you endure.
6pc passive **Steadfast**: When HP drops below 30%, gain a shield equal to 10% max HP (once per battle).

### Leather — "The Ghost"
Strike first, disappear.
6pc passive **Shroud**: At battle start, become untargetable for 1 turn. *(code currently has 'opener' — see conflict above)*

### Cloth — "The Storm"
Glass cannon. Fragile, devastating, lights up the whole field.
6pc passive **AOE Amplify**: Skills that hit all enemies deal +15% increased damage.

---

## Fusion Sets — `src/components/FusionWorkshopView.vue`

### UI — ✅ Built (placeholder data)
Three ateliers with per-atelier backgrounds (Arcane/Shadow Loom/Iron Tannery), recipe lists, stat display, artisan requirement display.

### Crafting backend — 🔲 Not implemented
No material consumption, no artisan level checks, no gear instance creation. Craft button shows "Coming Soon".

### Set bonuses — 🔲 Not in setBonus.js

| Atelier | Requires | 6pc passive |
|---------|----------|-------------|
| Arcane Atelier (cloth+plate) | Blacksmithing + Tailoring | Arcane Charge: 3 hits → next skill +50% damage |
| Shadow Loom (leather+cloth) | Leatherworking + Tailoring | Phase Strike: on dodge, next skill +40% damage |
| Iron Tannery (leather+plate) | Blacksmithing + Leatherworking | Iron Reflex: % evade; on evade, next attack +25% ATK |

**Hero champion gap:** No hero currently has the artisan combos for Shadow Loom (Leatherworking + Tailoring) or Iron Tannery (Blacksmithing + Leatherworking). Only Arcane Atelier has natural champions (Lord Aldric, Aurelan Dawnspire, Hilda).

---

## Special Discipline Sets — 🔲 Not implemented

Three forge unlocks (elven/goblin/dwarf) discovered through exploration rewards.

| Discipline | Material | Armor type | Identity |
|------------|----------|------------|----------|
| Elven | Moonsilver+ | TBD by user | Ancient, precise, moonlit |
| Goblin | Vaultmetal | TBD by user | Steampunk, buff-enhancing — **Overclock** |
| Dwarf | Runeite | TBD by user | Runic, immovable, retaliatory |

### Goblin / Vaultmetal — "Overclock" — 🔒 Concept locked, 🔲 not implemented
- 2pc: Each active buff on self → +8% ATK (stacks)
- 4pc: Buffs you cast last 1 additional turn
- 6pc passive **Steam Surge**: Turn after using a buff skill, next damaging skill +35% damage
- Addresses basic-attack-spam-clears-raids problem — buffs become the dominant loop

### Elven / Moonsilver+ — 🔲 TBD
- Identity: grace, precision, moonlit evasion
- Set bonuses: TBD

### Dwarf / Runeite — 🔲 TBD
- Identity: runic retaliator, slow but devastating counter-puncher
- 6pc passive idea — Rune Retaliation: when hit above X% max HP, next attack deals massive bonus damage

---

## Dodge / Evasion System — 🔲 Not implemented

Inspired by Path of Exile 2 — dodge feels impactful, not a rounding error.

- Dodge% as a substat on leather gear (Darksteel tier and above) — full miss chance, binary
- Distinct from DEF (which reduces damage)
- Leather 6pc Shroud guarantees dodge turn 1 — the substat extends that feeling
- Interaction with Shadow Loom fusion passive: on dodge, empower next skill
- TBD: dodge cap, how AI handles high-dodge heroes, accuracy counter-stat

---

## Drop Sources — Structure locked, quantities TBD

| Material | Ore source | Essence source | Core source |
|----------|-----------|----------------|-------------|
| Copper | Campaign / Training Easy | Dungeons Hard (12%) ✅ | *(TBD)* |
| Tin | Campaign / Training Normal | Dungeons Hard (12%) / Nightmare (15%) ✅ | *(TBD)* |
| Steel | Campaign / Dungeons Medium | Dungeons Nightmare (10%) ✅ | *(TBD)* |
| Darksteel | Dungeons Hard | 🔲 Not defined | 🔲 Not defined |
| Mithril | Dungeons Nightmare | 🔲 Not defined | 🔲 Not defined |
| Moonsilver | **Raids** ✅ | **Raids** (always 1-2) ✅ | **Raids** (30% chance) ✅ |

**Gap:** Steel core, darksteel essence/core, mithril essence/core have no drop source assigned.
Design intent: darksteel from Nightmare dungeons or siege; mithril from raids.

---

## Raid Gear — `src/game/data/setBonus.js` + `raidGear.js`

### Regalia of Regret (Throne of Regret) — ✅ Built
Full 7-piece Legendary plate set. Named set bonuses in `NAMED_SET_BONUSES.regret`.
- 2pc: +15% Raid DMG, +10% Siege DMG
- 4pc: +20% ATK, +20% Crit DMG
- 6pc: additional +15% Raid DMG
- 6pc passive **Throne Judgment**: First skill each turn deals +50% bonus damage.
Drops from `rollThroneGear()` in `raidEncounters.js`.

### Void Heir Set — 🔲 Not designed or implemented
Theme: void, eclipse, cosmic annihilation. Likely cloth/caster-focused (contrast with Regret's plate identity).

---

## Substats — 🔲 Not implemented

Legendary+ gear to roll secondary stats. Raid gear gets substats by default.

- Leather substats lean toward: Dodge%, SPD, Crit Rate
- Plate substats lean toward: HP%, DEF%, Resistance
- Cloth substats lean toward: ATK%, Crit DMG, SPD

---

## Hero Gear Affinity — See `docs/gear_mapping.md`

Gear type is determined by **class role**, not artisan skill.
Artisan skill determines crafting bonus (XP/cost discount), not what the hero should wear.

---

## Implementation Priority (suggested order)

1. **🔴 Fix hardcoded rarities** — mithril/moonsilver recipes start at `'Common'`, not `'Legendary'`/`'Epic'`
2. **🔴 Fix TIER_MAX_STARS** — update to design spec values
3. **🔲 Leather 6pc decision** — choose between `Shroud` (design) vs `opener` (code stub), then wire all 3 in BattleEngine
4. **🔲 ★7-10 gates** — define quantities during balance pass
5. **🔲 Darksteel/mithril drop sources** — wire essence/core drops into dungeon and siege reward tables
6. **🔲 Fusion crafting backend** — material checks, artisan level gates, gear instance creation
7. **🔲 Goblin/Vaultmetal Overclock** — add to setBonus.js, wire Steam Surge in BattleEngine
8. **🔲 Dodge% stat** — add to leather substats, wire evasion roll in BattleEngine
9. **🔲 Void Heir gear set** — design and implement
10. **🔲 Substats system** — substat rolling on Legendary+ gear and raid drops
11. **🔲 Elven/Dwarf special sets** — design then implement

---

## Open Questions

1. **Leather 6pc passive**: Shroud (design intent) or opener (current stub)?
2. **Special discipline armor types**: which of Elven/Goblin/Dwarf owns plate/leather/cloth?
3. **Fusion piece counting**: does 3 plate + 3 cloth = 6pc Arcane bonus, or do fusion pieces count as a third type?
4. **Dodge cap**: what's the max dodge % a hero can reach? Does accuracy exist as a counter-stat?
5. **Void Heir set identity**: cloth/caster theme confirmed? Stats and passives?
6. **Darksteel essence/core source**: Nightmare dungeons, siege, or something else?
7. **★7-10 gate quantities**: to be defined during balance pass
