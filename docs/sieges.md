# Sieges — Design Document

*Discussed and decided 2026-06-25. Capture of lore, structure, and mechanic direction before implementation.*

---

## The Role of the Player

Your warband is **factionless**. No house banner, no sworn loyalty, no land.

The four great houses have kept an uneasy peace since the Throne of Regret fell. When one house overreaches, the others cannot move against them directly without triggering full-scale war. So they call you. Deniable. Effective. Outside the politics.

You are not a conqueror. You are a corrective force.

This is what separates sieges from raids: raids are about surviving something ancient and monstrous. Sieges are about correcting something human and political — before it becomes monstrous.

---

## The Four Houses

Each house has a distinct identity and a **recurring sin** — something they keep sliding back into. You never solve them permanently. You correct them. They stabilize. Then months later, they do it again, worse.

None of them are purely evil. That's the point.

### House Valdris
*"House Valdris sends no soldiers. They send knowledge. Which is worse."*

**Identity:** Scholars, arcane researchers, cold pragmatists. They believe understanding the void is categorically different from being consumed by it.

**Recurring sin:** Void experimentation. They keep pushing further than the other houses can accept. Every siege event against Valdris is them having gone one step further than last time — a portal opened, a scholar who didn't come back, a tower sealed from the outside.

**Siege feel:** Dangerous, escalating. You're racing to stop something before it finishes.

---

### House Aldric
**Identity:** Military honour culture. Disciplined, hierarchical, genuinely convinced they're protecting something.

**Recurring sin:** Territorial expansion that slowly becomes indistinguishable from conquest. They march past boundary stones, invoke old treaties, absorb smaller territories under the claim of "securing the borders." No grand evil plan — just appetite dressed as duty.

**Siege feel:** Straight military confrontation. Their defences are organised, their soldiers disciplined. The most straightforward siege to understand, the hardest to underestimate.

---

### House Caelwyn
**Identity:** Wardens of the wilds. Beast tamers, nature practitioners, coven magic. Their power comes from things older than the other houses want to think about.

**Recurring sin:** Two problems, often tangled together:
1. **Taming what shouldn't be tamed** — dangerous creatures, cursed land, pacts with things that don't stay negotiated with.
2. **Witch mutiny** — the covens within Caelwyn have their own power structures. The house leadership experiments with dark rites, and eventually the witches stop answering to the house and start answering to something else.

Caelwyn siege events aren't always the house leadership's fault. Sometimes the house itself quietly wants you to go in.

**Siege feel:** Unpredictable, almost horror-adjacent. What you're fighting might not be Caelwyn soldiers. It might be what Caelwyn let loose.

---

### House Mordaine
**Identity:** Old money, old grudges, privateers behind noble titles.

**Recurring sin:** They don't need void magic or armies. They quietly strangle trade routes, invoke century-old treaties nobody else remembers, raid under privateer flags so it's technically not war. Ancient history that never healed — the kind of grudge that outlives the people who started it. Similar energy to Aldric in that it's grounded and political, not supernatural.

**Siege feel:** Morally murky. The transgression is rarely clean. You might be disrupting a blockade rather than storming walls. The most "Game of Thrones" of the four.

---

## Event Structure — Rotating Faction Sieges

Rather than a persistent conquest map, sieges run as **rotating faction events**. One house is active at a time. Their strongholds open, you siege them, you collect faction-specific rewards. When the timer closes, that house goes dormant and the next rotates in.

**Why rotation instead of a campaign map:**
- A campaign map gets "finished." Rotating events don't.
- Each event has a specific narrative transgression — it feels like a story beat, not just a timer.
- House Valdris can come back harder next time. The sin recurs. That's the lore.

### Each event has:
- A **specific transgression** (written as a brief dispatch — 2-3 sentences of what they did this time)
- **3–5 stronghold tiers** of increasing difficulty within the event
- **Faction-exclusive loot** tied to the house's identity (see below)
- A **time window** (exact duration TBD during balancing — likely 5–7 days)

### Faction reward flavour (direction, not final):
| House | Reward identity |
|-------|----------------|
| Valdris | Arcane components, magic-boosting gear, void-touched materials |
| Aldric | Heavy armour materials, iron/steel, warrior gear |
| Caelwyn | Exotic hides, beast-derived components, nature/spirit gear |
| Mordaine | Gold, rare trade goods, rogue/speed gear |

---

## The Siege Mechanic — Commanders and Armies

*This is the novel mechanic. Confirmed direction, implementation details TBD.*

In a siege, your heroes don't fight alone — **each hero commands a unit stack beneath them.**

Examples:
- Zordain leads 80 Iron Soldiers — a shield wall that soaks damage
- Lyra commands 60 Siege Archers — chip damage every turn
- A warrior leads a Battering Ram crew — escalating damage to the gate

The hero's stats **amplify the unit stack**:
- ATK → unit damage output
- DEF → unit casualty rate under fire
- SPD → when the unit acts in the turn order

### Two-phase siege battle

**Phase 1 — Breach**
Your army vs their defensive garrison. Unit stacks clash. If their garrison isn't broken quickly, the walls whittle your troops before you reach the boss. Bring the right unit composition or pay for it in casualties.

**Phase 2 — Commander**
Garrison is broken. The gate is down. Classic FF-style hero combat against the siege commander — the human (or not-so-human) responsible for the transgression.

### On each hero's turn, choose:
- Use the hero's own skill (as normal)
- **Command troops** — the unit stack acts: attacks, holds formation, sets up a position

---

## Resource Sink — Unit Replenishment

Units die in sieges. After every siege, casualties need replacing. This is the **ongoing resource drain** the game needed.

Direction for unit costs (not final — to be balanced):
| Unit type | Primary materials |
|-----------|------------------|
| Infantry (Iron Soldiers) | Iron bars + steel ore |
| Archers | Planks (bows) + bowstrings + fibers |
| Siege equipment (Battering Ram, Ballista) | Planks + steel bars |
| Beast riders (Caelwyn-style) | Exotic hides + leather |

This means 109,000 pine planks is an army of archers. The siege system consumes what the idle system produces.

---

## What's Not Decided Yet

- Exact turn order for unit stacks (parallel track vs hero extension vs passive phase)
- Whether units are recruited per-hero or pooled
- Timer length for faction events
- Whether there's a meta-narrative arc across all four houses
- Exact reward structure and loot tables per faction
- Whether the Throne of Regret raid eventually connects to a "final siege" storyline

---

## Connection to Existing Systems

- **Camp buildings** — Breachwright's Yard already exists and unlocks siege tiers. Siege Forge unlocks siege gear. These slot directly into the siege structure.
- **Resource stores** — planks, ores, bars all feed unit replenishment
- **Lumber Hall** — built to sink plank stockpiles; retroactively makes sense as "building the army's archer corps"
- **Exploration shrines** — Aldric/Caelwyn/Valdris/Mordaine shrine blessings could be earned by completing that house's siege events
- **Gear deeds** — sieges are the planned source of deed bonuses on legendary gear
