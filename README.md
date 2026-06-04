# Bannerlords of Westrun

A turn-based gacha RPG set in the medieval fantasy world of Westrun.

## Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Pinia** — state management
- **PixiJS** — combat animations
- **GSAP** — UI animations
- **Vite** — build tooling

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  components/   Vue UI components
  game/         Core game logic (BattleEngine, Hero, Skill, Gear, AI)
  game/data/    Static data — heroes, skills, gear, dungeons, lore
  stores/       Pinia stores (one per domain)
  assets/       Images, audio
docs/           Design documents and planning notes
```

## Game Systems

- **Turn meter combat** — speed-based turn order, skill cooldowns, crit/affinity system
- **Affinities** — Force / Magic / Spirit triangle + neutral Void and Astral
- **Factions** — House Aldric, Valdris, Caelwyn, Mordaine, Bloodtusk, Ignar, Ancient Nobles
- **Forge** — ore smelting → bars → gear crafting via recipes
- **Dungeons / Raids / Sieges / Exploration** — multiple content modes
- **Summon portal** — hero recruitment with rarity tiers (Common → Ancient)
- **Codex** — in-game lore journal
