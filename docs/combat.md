# Combat System

## Entry Points

| Source | Store | How to start |
|--------|-------|--------------|
| Campaign / Training | `useBattleStore` | `initBattle(encounterIndex, team)` |
| Dungeons | `useBattleStore` + `useDungeonStore` | Same `initBattle` with dungeon encounter object |

## Battle State Machine

`BattleState` in `src/game/BattleEngine.js`:
```
IDLE → SELECTING_SKILL ↔ SELECTING_TARGET → ANIMATING → ENEMY_TURN → (loop)
                                                                    → VICTORY
                                                                    → DEFEAT
```

Flow:
1. `initBattle` creates a `BattleEngine`, calls `startBattle()` → `nextTurn()`
2. `advanceToNextTurn()` ticks all heroes' speed-based turn meters until one reaches 100
3. If active hero is a player → `SELECTING_SKILL` (waits for UI or autoplay)
4. If active hero is an enemy → `ENEMY_TURN` → `runAI()` in `src/game/AI.js`
5. On skill execution, `_applyResult()` handles state transitions, rewards, and autoplay

## Turn Meter

Each hero advances `spd / 10` per tick. At 100, it acts and meter resets.  
Higher speed = more frequent turns. Speed stat directly controls action order.

## Skills & Targeting

`src/game/Skill.js` — `EffectType`, `TargetType`, `StatusEffect`  
- Skills have cooldowns tracked per instance
- `selectSkill(index)` → if skill needs target → `SELECTING_TARGET` → `selectTarget(target)`
- Autoplay uses `runAI()` which picks skill and target via heuristic

## Stat Multipliers & Affinity

`getAffinityMultiplier(attacker, defender)` in `Hero.js` — element matching bonus.  
Crit: `critRate` chance to apply `critDmg` multiplier.

Gear stats applied via `inventory.computeGearStats(heroKey)` → `hero.applyGear(stats, damageReduction)`.

## Victory Rewards

On `VICTORY`, `useBattleStore._applyResult()` awards:
- Gold + Diamonds from `encounter.rewards`
- XP via `usePlayerHeroStore.xpForDifficulty(difficulty)` → `addXp()`
- Ore drops via `rollOreDrops(difficulty)` → `useResourceStore.addOre()`
- Dungeon-only: component drops + node lines from `useDungeonStore.onDungeonVictory()`
- Campaign encounters: `useCampaignStore.completeEncounter(enc.id)` marks as done

Reward shown in `BattleArena.vue` → `.reward-panel` (margin-top: 20px).

## Batch Runs

`startBatchRun(n)` — runs the same encounter n times automatically, accumulates all rewards, shows summary on final run. Stopped by `stopBatch()`. Displayed via `batch-progress` in BattleArena.

## Autoplay & Speed

- `autoplay` ref — if true, enemy turns and player turns both run automatically via `runAI()`
- `battleSpeed`: 1=800ms delay, 2=400ms, 3=120ms per turn
- Both persisted to localStorage

## Encounters (Campaign)

Defined in `src/game/data/heroes.js` as `ENCOUNTERS` array.  
Fields: `id`, `name`, `difficulty` (Easy/Normal/Hard/Nightmare), `enemies[]`, `rewards`, `isTraining`, `mechanics[]`

Mechanics example: `undead_regen` — enemies recover 4% max HP each turn start.

## Dungeons (Expeditions)

`useDungeonStore` (`raid-dungeons`)  
- `explore()` costs 5 energy → generates 3 random dungeon options via `generateDungeonOptions()`
- Each dungeon has difficulty, enemy pool key, and node rewards
- `pin()` / `unpin()` to save or discard options
- On victory: awards component drops, adds lines to selected gear via `addLineToItem()`
- Enemy pools defined in `src/game/data/dungeons.js` → `DUNGEON_ENEMY_POOLS`

Difficulty enemy pools:
- Easy: 2–3 Bloodtusk Raiders, or Karg+Raider
- Medium: Karg/Ignar Cultist combos
- Hard: Ignar Cultist, Karg, Carnax combos
- Nightmare: Barrow Knight, Skeleton Warrior, Lich Sovereign, Zombie Brute

## Player Hero

`usePlayerHeroStore` — the custom hero created at game start.  
- Gains XP from all battles (amount varies by difficulty)
- Levels up → rarity upgrades at thresholds (Common → Uncommon → Rare → Epic → Legendary → Mythical)
- `buildHeroInstance()` creates a live battle Hero from stored stats
