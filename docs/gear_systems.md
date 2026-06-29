# Gear Systems Design

*Living document — brainstorm in progress. TBD = not yet decided. Do not implement until marked LOCKED.*

---

## Core Philosophy

- Legendary is a state you **earn**, not a tier you craft. All gear starts Common (★0).
- Gear becomes Legendary through star upgrades — not by material alone.
- Each gear set should represent a distinct playstyle, not just a stat bundle.
- Fusion sets reward players who invest in multiple artisan disciplines.
- The journey from copper to endgame should feel fast and fun early, grindy and satisfying late.

---

## Star Cap Per Tier — LOCKED

Each material tier has a ceiling. You cannot grind copper to Mythical.

| Tier | Max Stars | Max Rarity | Feel |
|------|-----------|------------|------|
| Copper | ★3 | Uncommon | Starter, disposable — upgrade a little, move on |
| Tin | ★4 | Rare | Early progression |
| Steel | ★5 | Rare | Mid game |
| Darksteel | ★6 | Epic | Late mid game |
| Mithril | ★8 | Legendary | Pre-raid grind — first time you feel powerful |
| Moonsilver / Moonscale / Moonweave | ★10 | Mythical | Endgame base — fully invested pure sets |
| Special disciplines (elven/goblin/dwarf) | ★10 | Mythical | Ultimate endgame — requires forge unlock |

**Implication:** Remove hardcoded `rarity: 'Legendary'` from all mithril recipes. Rarity is always determined by star count.

---

## Star Gates — LOCKED (structure), TBD (values)

Gates exist at ★5 (essence) and ★6 (core). Gates ★7–10 use higher quantities of the same materials.

| Star | Gate material | Qty (TBD — balance later) |
|------|---------------|--------------------------|
| ★5 | `<tier>_essence` × 1 | — |
| ★6 | `<tier>_core` × 1 + smithing lvl 3 | — |
| ★7 | `<tier>_essence` × 2 | TBD |
| ★8 | `<tier>_core` × 2 | TBD (Legendary gate) |
| ★9 | `<tier>_essence` × 3 | TBD |
| ★10 | `<tier>_core` × 3 | TBD (Mythical gate) |

**Mithril and moonsilver essences/cores drop from raids** — this makes raids the gateway to pushing mithril gear to Legendary, not just optional content.

---

## Pure Set Identities — LOCKED

### Plate — "The Last Stand"
- **2pc:** +8% DEF
- **4pc:** +12% HP
- **6pc flat:** +5% DEF, +8% HP
- **6pc passive — Steadfast:** When HP drops below 30%, gain a shield equal to 10% max HP (once per battle).
- **Fantasy:** The immovable wall. You don't dodge — you endure.

### Leather — "The Ghost"
- **2pc:** +8% SPD
- **4pc:** +10% Crit Rate
- **6pc flat:** +8% ATK
- **6pc passive — Shroud:** At battle start, become untargetable for 1 turn. Enemies cannot select this hero.
- **Fantasy:** Strike first, disappear. Inspired by PoE2's evasion — dodge should feel impactful, not like a small % rounding error.
- **Note:** Dodge as a substat on leather gear (% chance to fully evade a hit) — TBD system below.

### Cloth — "The Storm"
- **2pc:** +12% ATK
- **4pc:** +10% Crit DMG
- **6pc flat:** +8% HP
- **6pc passive — AOE Amplify:** Skills that hit all enemies deal +15% increased damage.
- **Fantasy:** Glass cannon. Fragile, devastating, lights up the whole field.

---

## Fusion Sets — LOCKED (concept), TBD (stats + passives)

**Gate:** Requires BOTH artisan disciplines to be levelled. Available from the start of the game — not a post-endgame tier. The gate is artisan investment, not content progression.

**Design intent:** Fusion sets reward players who think long-term about what they farm. A player who splits investment between two disciplines unlocks something with a unique identity that neither pure set has.

### Cloth + Plate — "Arcane Knight"
- **Requires:** Blacksmithing + Tailoring
- **Fantasy:** The enchanted warrior. Magic woven into steel. A mage who wears a greatsword. DEF that feeds into spell power.
- **2pc:** TBD
- **4pc:** TBD
- **6pc passive — TBD:** Something like: taking a hit builds Arcane Charge; at 3 stacks, next skill deals +50% damage.

### Leather + Cloth — "Shadowweave"
- **Requires:** Leatherworking + Tailoring
- **Fantasy:** The spellblade. Fast and magical. On dodge/shroud, empower next skill.
- **2pc:** TBD
- **4pc:** TBD
- **6pc passive — Phase Strike (TBD):** On dodge or Shroud proc, next skill deals bonus damage.

### Leather + Plate — "Ironveil"
- **Requires:** Blacksmithing + Leatherworking
- **Fantasy:** The armored predator. A tank who punishes attackers. Dodge that scales with DEF.
- **2pc:** TBD
- **4pc:** TBD
- **6pc passive — Iron Reflex (TBD):** Chance to fully evade a hit; on evade, next attack gains ATK bonus.

---

## Special Discipline Sets — TBD

Three forge unlocks discovered through rare exploration rewards. Each represents a culture with a unique gear identity and is tied to **one armor type**.

| Discipline | Material | Armor type | Culture identity |
|------------|----------|------------|-----------------|
| Elven | Moonsilver+ | TBD | Ancient, precise, magical |
| Goblin | Vaultmetal | TBD | Steampunk, buff-enhancing, overclock |
| Dwarf | Runeite | TBD | Runic, immovable, retaliatory |

### Goblin / Vaultmetal — "Overclock" — LOCKED (concept), TBD (stats)
- **Identity:** Enhances buffs. Completely underrepresented in games. The set rewards heroes who use buff skills — turning a "wasted" buff turn into an investment.
- **2pc:** Each active buff on self increases ATK by 8% (stacks per buff)
- **4pc:** Buffs you cast last 1 additional turn
- **6pc passive — Steam Surge:** The turn after you use a buff skill, your next damaging skill deals +35% bonus damage.
- **Note:** Also addresses the combat balance problem where basic attack spam clears raids more effectively than using buff skills. Vaultmetal makes the buff → attack loop dominant.

### Elven / Moonsilver — TBD
- **Armor type:** TBD (swift + magical suggests leather or cloth)
- **Identity:** Grace, precision, moonlit evasion
- **Set bonuses:** TBD

### Dwarf / Runeite — TBD
- **Armor type:** TBD (runic tank suggests plate)
- **Identity:** Runic retaliator — slow, devastating counter-puncher
- **6pc passive idea — Rune Retaliation:** When hit above X% max HP, next attack deals massive bonus damage
- **Set bonuses:** TBD

---

## Dodge / Evasion System — TBD

Inspired by Path of Exile 2 — dodge should feel impactful, not a rounding error.

- **Dodge** as a substat on leather gear — % chance to fully evade a hit (complete miss, no damage)
- Distinct from DEF (reduces damage) — dodge is binary: you either take the hit or you don't
- Leather 6pc Shroud guarantees dodge for turn 1 — the stat extends that feeling throughout a fight
- Interaction with Shadowweave fusion passive: on dodge, empower next skill
- **TBD:** Dodge cap, how AI handles high-dodge heroes, whether enemies can have accuracy stats

---

## Ore / Component Drop Sources — LOCKED (structure), TBD (exact rates)

| Material | Ore source | Essence/Core source |
|----------|-----------|---------------------|
| Copper | Campaign / Training (Easy) | Dungeons Hard |
| Tin | Campaign / Training (Normal) | Dungeons Hard–Nightmare |
| Steel | Campaign / Dungeons (Medium) | Dungeons Nightmare |
| Darksteel | Dungeons Hard | TBD — possibly Nightmare dungeons or siege |
| Mithril | Dungeons Nightmare | **Raids** |
| Moonsilver | **Raids** | **Raids** |

---

## Raid Gear — LOCKED (Regret set), TBD (Void Heir set)

Raid gear is pre-built Legendary — it drops as Legendary, does not follow the star cap system. These are exceptional items from exceptional content.

### Regalia of Regret (Throne of Regret) — LOCKED
- Full 7-piece Legendary plate set
- Stats ~50% above moonsilver Epic equivalents
- Named set bonus: `regret` — 2pc: +15% Raid DMG / +10% Siege DMG; 4pc: +20% ATK / +20% Crit DMG; 6pc: +15% Raid DMG
- 6pc passive — Throne Judgment: First skill each turn surges with void energy, +50% bonus damage

### Void Heir Set (The Void Heir) — TBD
- Theme: void, eclipse, cosmic annihilation
- Set identity TBD — probably cloth/caster-focused to contrast Regret's plate identity
- Stats, set bonuses, passive: TBD

---

## Substats — TBD (post-progression)

Legendary+ gear rolls secondary stats. Raid gear has substats by default.

Ideas:
- Stats: Crit Rate, Crit DMG, HP%, ATK%, DEF%, SPD, Dodge%, Resistance
- Leather gear substats lean toward Dodge%, SPD, Crit Rate
- Plate gear substats lean toward HP%, DEF%, Resistance
- Cloth gear substats lean toward ATK%, Crit DMG, SPD

Inspired loosely by RSL substat hunting, but **not gated by stat thresholds** — TBD whether to add any gate mechanic.

---

## Hero Roles → Gear Affinities — TBD

Map each hero to their natural set affinity. To be done once full set list is locked.

---

## Open Questions

1. Which armor type does each special discipline own? (Elven → cloth? Goblin → leather? Dwarf → plate?)
2. Fusion set stats and passives (2pc/4pc/6pc for all three)
3. Dodge stat: cap, AI behaviour, accuracy counter-stat?
4. Void Heir gear set identity
5. Darksteel essence/core source (raids? hard content? siege?)
6. Do fusion sets use a mixed piece count (e.g. 3 plate + 3 cloth = 6pc bonus) or do fusion pieces count as both types?
