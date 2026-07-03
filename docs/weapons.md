# The Weapon Forge — Design Document

> *"Armor protects the body. A weapon defines the soul."*

---

## Philosophy

Armor is deliberate and quiet — you grind set bonuses, you fill slots, you move on. Weapons are something else entirely. A weapon is chosen. It is named. It is forged once and carried forever, growing with its bearer across every raid and siege. The more you invest in it, the harder it is to let the hero go.

The Weapon Forge is a sacred, separate location — not part of the Artisan Quarter. It is its own world: grand, lore-heavy, unhurried. The background reflects that: a cathedral-scale hall where weapons line the walls like relics, where every forge strike is an act of meaning.

---

## Weapon Types

Nine types. Each locked to a hero at creation — you cannot change it, only deepen it.

| Type | Hands | Theme | Archetype fit |
|---|---|---|---|
| **Sword** | 1H | Balanced, disciplined | Warriors, knights |
| **Greatsword** | 2H | Raw reach, momentum | Heavy warriors, champions |
| **Mace** | 1H | Blunt brute force, bone-breaking | Fighters, berserkers |
| **War Hammer** | 2H | Sacred weight, paladin justice | Paladins, holy warriors |
| **Dagger** | 1H | Speed, precision, shadow | Rangers, assassins |
| **Bow** | Ranged | Distance + off-hand dagger | Rangers (see note below) |
| **Crossbow** | Ranged | Mechanical, slower, harder hits | Marksmen |
| **Staff** | 2H | Channeled magic, flow | Mages, healers |
| **Wand** | 1H | Precision casting | Sorcerers, debuffers |

### The Bow Exception
A hero who carries a bow also carries a **shortsword or dagger** as their off-hand — not a separate forge item, but a built-in part of the bow weapon identity. Mechanically it means they have a fallback melee option and the bow's lore can reference both. Visually/flavor: the ranger is not helpless up close.

---

## Forge System — Tiers

Each weapon evolves through **6 tiers**. You forge a weapon once (naming it, choosing its type), then upgrade it. The weapon never disappears — only grows.

### Tier Names (universal, across all weapon types)

| Tier | Name | Feel |
|---|---|---|
| I | **First Light** | Raw, unrefined — a beginning |
| II | **Tempered** | Sharpened, proven in early battle |
| III | **Bound** | Materials woven together, the weapon gains identity |
| IV | **Hallowed** | Imbued with power, recognized as exceptional |
| V | **Ascendant** | Legendary-level, feared by enemies |
| VI | **Eternal** | The final form — a relic of the world |

### Resource Requirements (per tier)

Resources always combine **at least two material types** — the multi-discipline intent from the original concept.

| Tier | Primary | Secondary | Tertiary (optional) |
|---|---|---|---|
| I | 3× Iron Bars | 1× Leather Scraps | — |
| II | 5× Steel Bars | 2× Leather Scraps | 1× Wood Plank |
| III | 4× Darksteel Bars | 2× Thick Hide | 2× Wood Plank |
| IV | 5× Mithril Bars | 3× Shadow Hide | 1× Arcane Crystal |
| V | 4× Moonsilver Bars | 2× Void Essence | 2× Arcane Crystal |
| VI | 3× Starcite | 3× Ancient Leather | 3× Void Core |

*Secondary/tertiary materials vary slightly by weapon type — a staff needs more wood, a bow needs sinew and less metal, a dagger skips heavy forging for refined ore.*

---

## Stat Growth

Weapons scale with tier in a meaningful way. Tiers I–III feel like "my weapon", tiers IV–VI feel like "a legend."

Each weapon type grows different primary stats:

- **Sword / Greatsword / Dagger**: ATK, Crit Rate
- **Mace**: ATK, DEF (hits that hurt and shake the target)
- **War Hammer**: ATK, SPD reduction to target (slow and heavy)
- **Bow / Crossbow**: ATK, Crit DMG
- **Staff**: ATK (spell power), accuracy
- **Wand**: ATK (spell power), Crit Rate

---

## The Chronicle — Right Panel

Every time you upgrade a weapon, a **lore entry** is added to its Chronicle. The Chronicle lives in the right panel of the Forge view — a scrollable log of the weapon's history.

Each entry includes:
- The tier name and a timestamp (in-game era, not real time)
- A generated lore paragraph tied to the weapon type + tier combination
- The stat line at that tier

### Example Chronicle — "Ashfang" (Greatsword, hero: Velmorn)

> **Tier I — First Light**
> *"The blade was smelted from raw iron in the quiet hours before dawn. It had no name yet — only weight. Velmorn carried it to his first battle and brought it back wet."*
> ATK +380

> **Tier II — Tempered**
> *"The edge was reground after the siege of Caelwyn. A strip of shadowhide was wound around the hilt — the balance shifted. It no longer felt borrowed."*
> ATK +540 · Crit Rate +4%

> **Tier III — Bound**
> *"A crosspiece of darkwood was riveted through the pommel. The smith said nothing, but touched the blade with two fingers before handing it back. It had a reputation now."*
> ATK +720 · Crit Rate +7%

The lore entries are **per weapon-type × tier**, not player-authored — but they feel personal because the hero's name and weapon name are woven in.

---

## Starter Weapons — The Four Chosen

The four starters are a special case. Regardless of their technical rarity, the player *chose* them — that choice is the soulbinding event. Starter weapons are treated identically to Legendary weapons: permanently bound, never swappable, part of the hero's identity before the Chronicle even begins.

Each starter arrives with a named weapon at Tier I, a Chronicle entry already written, and a weapon type locked to their class.

| Hero | Weapon Name | Type | Voice of the Chronicle |
|---|---|---|---|
| **Ser Roland** | *Oathkeeper* | Sword (1H) | Honor, discipline, the weight of the vow taken before the first battle |
| **Seraphel** | *The Weaving* | Wand | The three schools — fire, ice, arcane — and the cost of wielding all three |
| **Mira of Caelwyn** | *Caelwyn's Hymn* | Staff | Life poured outward, the river that keeps others afloat, the healer's quiet exhaustion |
| **Velmorn the Shadow** | *Whisper* | Dagger | Silence, the void between strikes, a name nobody says aloud |

The player sees this weapon Chronicle entry the first time they open the Forge for that starter — an immediate signal that this hero already has a history, and that history is about to grow.

---

## Unique Weapons — Legendary+ Heroes

Heroes of Legendary rarity and above arrive with their **signature weapon** already conceived. Their weapon type is locked, and when first forged it receives a unique name prefix and a unique Tier I chronicle entry written specifically for that hero.

| Hero | Weapon | Type | Unique trait |
|---|---|---|---|
| **Kyver** | Moonwhisper | Katana (reskinned Sword) | Chronicle entries reference his silence, his duality |
| **Lord Aldric** | The Ashfist | Flame Gauntlet (reskinned Mace) | Fire-imbued, chronicle references the weight of command |
| **Seraphel** | The Weaving | Wand | Each entry references a different spell she mastered |
| **Hilda Shieldmaiden** | Ironvow | War Hammer | Chronicle doubles as her oath — each tier is a new vow |

Unique weapons use the same upgrade system and resources. The difference is in the chronicle text and the weapon's visual identity/name.

---

## UI Layout

```
[ WEAPON FORGE ]

Left panel                 Center panel               Right panel
──────────────             ──────────────             ──────────────
Hero list with             Weapon overview:           The Chronicle:
weapon indicator           - Name (editable           - Scrollable log
                             on creation)             - One entry per
Filter:                    - Type icon                  tier completed
○ 1-Handed                 - Current tier             - Stat snapshot
○ 2-Handed                   progress bar               per entry
○ Ranged                   - Current stats            - Hero name woven
○ Staff/Wand               - Next tier costs            into the text
                           - [ FORGE ] button         - Auto-generated,
"View Weapon" also                                      flavor-rich
accessible from            On first forge:
each hero's                - Choose weapon type
character sheet            - Name your weapon
```

---

## Soulbinding Effect

Weapons are the primary **soulbinding vector** in the game. The more tiers you sink into a weapon, the more emotionally costly it is to lose or replace the hero.

- At Tier III+, the hero profile shows a **"Weapon Bound"** tag
- At Tier V+, the hero portrait gets a subtle **weapon-aura** visual effect (future feature)
- Legendary/Mythical heroes arrive pre-named, which accelerates the bond

This is intentional design. You will not want to retire a hero who carries a Tier V weapon named by you, whose Chronicle you built entry by entry.

---

## Integration Notes

- **Equipment view**: Weapons removed from the standard gear picker. The main-hand / off-hand slots on the character sheet are replaced with a single **"Weapon"** entry that opens the Forge view for that hero.
- **Combat stats**: Weapon stats feed into the hero's ATK/CritRate/CritDmg the same way equipped gear does — they just come from the Forge record instead of an inventory instance.
- **Resources**: Leather Scraps and Wood Planks (currently secondary materials) become meaningful here — not just Blacksmith byproducts.
- **Artisan assignment**: The Weapon Forge needs an assigned Blacksmith for metal tiers (I–III) and a Blacksmith + one secondary artisan for higher tiers (IV–VI). The dual-slot system from Fusion Workshop applies naturally.

---

## Decisions

### Weapon ownership model
- **Non-legendary heroes**: weapons are interchangeable. You can craft multiple weapons and swap them between heroes of the same type. This enables roster flexibility — swap an Epic to counter different content.
- **Legendary+ heroes**: their weapon is permanently bound. It was forged for them. It carries their name in the Chronicle. There is no swap. This is intentional and permanent.

### Nice-to-have (post gear+weapon progression tuning)
- **Tier VI passive**: each weapon type unlocks a unique combat passive at Eternal tier (e.g. Sword → execute chance, War Hammer → armor shatter, Bow → counter-shot on dodge). Design the passives per type before implementing.
- **Bow off-hand mechanic**: rangers with a bow also have access to a melee skill option (using their off-hand dagger/shortsword). Keep as flavor until skills phase.

---

## Build Priority

> **Gear progression and weapon progression must be fully designed and tuned before touching unit skills.**
> The weapon forge is the next major build target after current gear systems are stable.
