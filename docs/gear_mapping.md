# Gear & Set Mapping

*Use this to decide which heroes belong to which sets and which disciplines own which armor type.*
*Numbers marked (TBD) = structure locked, values balanced later.*

---

## Artisan Disciplines → What They Produce

| Discipline | Produces | Armor type |
|------------|----------|------------|
| **Blacksmithing** | Plate armor, swords, maces, spears, shields | `plate` |
| **Leatherworking** | Leather armor, daggers | `leather` |
| **Woodworking** | Bows (count as `leather`) | `leather` |
| **Tailoring** | Cloth armor, staves | `cloth` |
| **Apothecary** | Potions / consumables | *(no gear)* |
| **Herbalism** | Herbs / ingredients | *(no gear)* |

> **Gap to note:** Heroes with only Apothecary or Herbalism have no natural gear affinity — they wear whatever the player can craft. Worth deciding if these heroes get a special affinity or a passive bonus with a specific set.

---

## Pure Set Tiers & Stat Focus

### Plate — Blacksmithing
*Set bonus: 2pc +8% DEF / 4pc +12% HP / 6pc +5%DEF+8%HP / 6pc passive: Steadfast*

| Tier | Name | Max ★ | Max Rarity | Stat focus |
|------|------|--------|------------|------------|
| Copper | Copper gear | ★3 | Uncommon | Low DEF, low HP — starter |
| Tin | Tin gear | ★4 | Rare | DEF |
| Steel | Steel gear | ★5 | Rare | DEF + HP |
| Darksteel | Darksteel gear | ★6 | Epic | DEF + HP + some ATK |
| Mithril | Mithril gear | ★8 | Legendary | Heavy DEF, HP, ATK |
| Moonsilver | Elven gear | ★10 | Mythical | Peak DEF+HP, SPD bonus on legs |

Weapons (plate): Swords (ATK + Crit DMG), Maces (ATK + DEF%), Spears (ATK + SPD)

---

### Leather — Leatherworking + Woodworking
*Set bonus: 2pc +8% SPD / 4pc +10% Crit Rate / 6pc +8% ATK / 6pc passive: Shroud (untargetable turn 1)*

| Tier | Name | Max ★ | Max Rarity | Stat focus |
|------|------|--------|------------|------------|
| Copper | Rough gear | ★3 | Uncommon | SPD, low DEF |
| Tin | Thick gear | ★4 | Rare | SPD + ATK |
| Steel | Hardened gear | ★5 | Rare | SPD + Crit Rate |
| Darksteel | Shadow gear | ★6 | Epic | SPD + Crit Rate + Dodge% |
| Mithril | Celestial / Starwarden | ★8 | Legendary | Crit Rate + Crit DMG + Dodge% |
| Moonsilver | Moonscale | ★10 | Mythical | Peak SPD + Crit + Dodge% |

Weapons (leather): Daggers (ATK + Crit Rate), Bows (ATK + SPD)

> **Dodge%** — substat that appears from Darksteel tier upwards on leather gear. Full miss chance, not damage reduction.

---

### Cloth — Tailoring
*Set bonus: 2pc +12% ATK / 4pc +10% Crit DMG / 6pc +8% HP / 6pc passive: AOE Amplify (+15% AOE damage)*

| Tier | Name | Max ★ | Max Rarity | Stat focus |
|------|------|--------|------------|------------|
| Copper | Cotton gear | ★3 | Uncommon | ATK, very low DEF |
| Tin | Wool gear | ★4 | Rare | ATK |
| Steel | Silk gear | ★5 | Rare | ATK + Crit DMG |
| Darksteel | Shadowcloth | ★6 | Epic | ATK + Crit DMG + SPD |
| Mithril | Starweave | ★8 | Legendary | ATK + Crit DMG + Crit Rate |
| Moonsilver | Moonweave | ★10 | Mythical | Peak ATK + Crit — glass cannon ceiling |

Weapons (cloth): Staves (ATK + Crit DMG or ATK + SPD)

---

## Fusion Sets — Fusion Workshop

*Gate: Both artisans at required level. Available from start. Tiers: Steel / Mithril / Moonsilver only.*

### Arcane Atelier — Cloth + Plate
**Requires: Blacksmithing + Tailoring**
*Fantasy: Enchanted warrior. Mage in steel. DEF feeds into spell power.*

| Piece count | Bonus (TBD values) |
|-------------|-------------------|
| 2pc | +DEF%, +ATK% |
| 4pc | DEF% also adds to skill damage (scaling) |
| 6pc flat | TBD |
| 6pc passive | *Arcane Charge* — taking a hit builds a stack; at 3 stacks next skill +50% damage |

---

### Shadow Loom — Leather + Cloth
**Requires: Leatherworking + Tailoring**
*Fantasy: Spellblade. Fast magical striker. On dodge/Shroud, empower next skill.*

| Piece count | Bonus (TBD values) |
|-------------|-------------------|
| 2pc | +SPD%, +Crit Rate |
| 4pc | +Crit DMG, +ATK% |
| 6pc flat | TBD |
| 6pc passive | *Phase Strike* — on dodge or Shroud proc, next skill deals +40% bonus damage |

---

### Iron Tannery — Leather + Plate
**Requires: Blacksmithing + Leatherworking**
*Fantasy: Armored predator. Tank who punishes. Dodge that scales with DEF.*

| Piece count | Bonus (TBD values) |
|-------------|-------------------|
| 2pc | +DEF%, +SPD |
| 4pc | +HP%, +Crit Rate |
| 6pc flat | TBD |
| 6pc passive | *Iron Reflex* — % chance to fully evade; on evade, next attack +25% ATK |

---

## Special Discipline Sets — TBD MAPPING

*Three forge unlock tiers — discovered via rare exploration. Each owns one armor type (mapping TBD by user).*

### Goblin / Vaultmetal — "Overclock"
*Fantasy: Steampunk, buff-enhancing. Rewards buff → attack loop.*
- **2pc:** Each active buff on self +8% ATK (stacks)
- **4pc:** Buffs you cast last 1 additional turn
- **6pc flat:** TBD
- **6pc passive — Steam Surge:** Turn after using a buff skill, next damaging skill +35% damage
- **Armor type:** → **USER TO ASSIGN**

### Elven / Moonsilver+ — TBD name
*Fantasy: Ancient, precise, moonlit. Swift and magical.*
- Set bonuses: TBD
- **Armor type:** → **USER TO ASSIGN**

### Dwarf / Runeite — TBD name
*Fantasy: Runic, immovable, retaliatory counter-puncher.*
- Set bonuses: TBD
- **6pc passive idea — Rune Retaliation:** When hit above X% max HP, next attack massive bonus damage
- **Armor type:** → **USER TO ASSIGN**

---

## Hero Roster — Gear Affinity Mapping

> **Two separate axes — do not conflate them:**
> - **Gear type** = what they *wear* — derived from class role, determines which stat profile suits them.
> - **Artisan skills** = what they can *craft* — discipline level feeds XP bonus or cost discount.
> A blacksmith warrior can absolutely wear leather if their kit favours speed over DEF.

*"Natural set" column is for you to fill in once you decide which named set fits the hero.*
*Fusion candidates are flagged — their artisan combo already matches a workshop.*

---

### Warriors
| Hero | Rarity | Gear type | Artisan skills | Natural set |
|------|--------|-----------|---------------|-------------|
| Garrett the Unbroken | Rare | Plate | Blacksmithing | |
| Ser Roland | Epic | Plate | Blacksmithing | |
| Gwendal Ironvow | Epic | Plate | Blacksmithing | |
| Brenna Shieldmaiden | Epic | Plate | Leatherworking | |
| Lord Aldric | Legendary | Plate | Blacksmithing + Tailoring | ★ Arcane Atelier candidate |
| Kyver | Legendary | **Leather** | Blacksmithing | *(striker — SPD + Crit + Dodge)* |
| Serix the Wretched | Epic | **Leather** | Blacksmithing | *(dark berserker feel)* |
| Borrik Stormcog | Epic | Plate | Blacksmithing | *(Vaultmetal/Goblin candidate)* |
| Zwierls | Legendary | Plate | Blacksmithing | |
| Aurelan Dawnspire | Epic | Plate | Blacksmithing + Tailoring | ★ Arcane Atelier candidate |
| Jade Dragonforge | Legendary | Plate | Blacksmithing | |
| Arne Frostbound | Epic | **Leather** | Leatherworking | *(ranger-adjacent warrior)* |

---

### Tanks
| Hero | Rarity | Gear type | Artisan skills | Natural set |
|------|--------|-----------|---------------|-------------|
| Sir Hadvar | Rare | Plate | Blacksmithing | |
| Durwald the Immovable | Rare | Plate | Blacksmithing | *(Dwarf/Runeite candidate)* |
| Zareth the Hollow | Epic | Plate | Blacksmithing | |
| Thalric Vaelorian | Legendary | Plate | Blacksmithing | |
| Helga | Legendary | Plate | Blacksmithing + Apothecary | |
| Hilda the Shieldmaiden | Epic | Plate | Blacksmithing + Tailoring + Apothecary + Herbalism | ★ Arcane Atelier candidate |

---

### Mages
| Hero | Rarity | Gear type | Artisan skills | Natural set |
|------|--------|-----------|---------------|-------------|
| Lyra of the Crescent | Rare | Cloth | *(no gear artisan)* | |
| Seraphel | Legendary | Cloth | Tailoring + Apothecary | |
| Draven Spellblade | Rare | **Cloth** | Blacksmithing | ★ Arcane Atelier candidate *(needs Tailoring)* |
| Elara Frostweaver | Rare | Cloth | *(no gear artisan)* | |
| Mirena Ashveil | Rare | Cloth | Tailoring | |
| Caius Stormbinder | Epic | Cloth | Tailoring | |
| Archmage Kelvar | Legendary | Cloth | Tailoring + Apothecary | |
| Vorath the Undying | Mythical | Cloth | Apothecary + Blacksmithing | |
| Gribzak Gearvein | Epic | Cloth | Blacksmithing | *(Vaultmetal natural — buff-enhancing mage)* |
| Valerius Dawnchaser | Legendary | Cloth | Apothecary + Tailoring | |

---

### Rangers
| Hero | Rarity | Gear type | Artisan skills | Natural set |
|------|--------|-----------|---------------|-------------|
| Aldric Marksman | Rare | Leather | Leatherworking | |
| Velmorn the Shadow | Epic | Leather | Leatherworking | |
| Lyreth Moondrift | Rare | Leather | *(no gear artisan)* | *(Elven/Moonsilver candidate)* |
| Mord the Forsaken | Epic | Leather | Leatherworking | |

---

### Healers
| Hero | Rarity | Gear type | Artisan skills | Natural set |
|------|--------|-----------|---------------|-------------|
| Rowan the Wandering | Rare | Cloth | *(no gear artisan)* | |
| Mira of Caelwyn | Rare | Cloth | *(no gear artisan)* | |
| Caelwyn Warden | Rare | **Leather** | Leatherworking | *(active warden, outdoors — SPD suits)* |
| Caelwyn Herbalist | Rare | Cloth | *(no gear artisan)* | |
| Sylara the Reviver | Epic | Cloth | *(no gear artisan)* | |
| Theron Greenmarch | Legendary | Cloth | *(no gear artisan)* | |

---

### Debuffers
| Hero | Rarity | Gear type | Artisan skills | Natural set |
|------|--------|-----------|---------------|-------------|
| Nyxara Voidwalker | Epic | Leather | Leatherworking | *(shadow archetype — Shroud fits perfectly)* |
| Arri the Witch | Epic | Cloth | *(no gear artisan)* | |
| Vaeric Corvayne | Legendary | **Leather** | Blacksmithing + Apothecary | *(dark noble debuffer — speed + poison)* |

---

## Notes

- **Artisan gap — no hero currently has Leatherworking + Tailoring** (Shadow Loom) or **Leatherworking + Blacksmithing** (Iron Tannery) as their combo. These fusion workshops have no natural hero champion yet — worth designing one, or giving an existing hero a second artisan skill.
- **Apothecary/Herbalism-only heroes** (Lyra, Elara, Lyreth, Rowan, Mira, Arri, Theron…) have no crafting affinity — treat them as flexible: stronger in any set they're fully built into, but no discount/bonus. Could give them a passive bonus with one set as flavour.
- **Bolded gear types** are the "surprising" picks — heroes whose artisan skill and gear type don't match. These are worth double-checking against each hero's actual kit and playstyle.
- **Draven Spellblade** wears cloth for the ATK/Crit stats, but his blacksmithing means he can self-craft plate if you want the Arcane Atelier hybrid — he's the poster child for that fusion.
- **Gribzak Gearvein** (goblin mage + blacksmithing) is the natural Vaultmetal test case — buff-loop identity matches the Overclock passive perfectly.
