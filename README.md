# Turnbase

A monorepo of turn-based RPGs. Each universe is a standalone app with its own
build, assets and save data.

| Universe | What it is | Play |
|---|---|---|
| **Bannerlords of Westrun** | Medieval fantasy gacha RPG — houses, forges, raids, sieges | [/westrun/](https://glennvanhaute-collab.github.io/turnbasegame/westrun/) |
| **Yamato no Kuni** | Sengoku-flavoured realm with the painted-field battle system | [/yamato/](https://glennvanhaute-collab.github.io/turnbasegame/yamato/) |
| **Mythos Dominion: Favor the Gods** | Four pantheons contend; earn favor, summon their champions | [/mythos/](https://glennvanhaute-collab.github.io/turnbasegame/mythos/) |

## Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Pinia** — state management
- **PixiJS** — combat animations
- **GSAP** — UI animations
- **Vite** — build tooling

## Getting Started

npm workspaces — one install at the root covers every app.

```bash
npm install

npm run dev:westrun     # or dev:yamato / dev:mythos
npm run build           # builds all apps
npm run build:westrun   # or build:yamato / build:mythos
```

## Project Structure

```
apps/
  westrun/      Bannerlords of Westrun  →  /turnbasegame/westrun/
  yamato/       Yamato no Kuni          →  /turnbasegame/yamato/
  mythos/       Mythos Dominion         →  /turnbasegame/mythos/
packages/
  fx/           @turnbase/fx — shared canvas combat FX (useCanvasFx)
docs/           Design documents and planning notes
```

Each app follows the same internal shape:

```
apps/<universe>/
  index.html
  vite.config.js    base: /turnbasegame/<universe>/
  public/           assets served as-is (skips the Vite pipeline)
  src/
    main.js
    App.vue
    components/
    stores/         Pinia stores
    game/           engine + data
```

Apps are fully standalone — there is no shared router between universes. They
deploy under one origin, so browser save data lives side by side without
colliding (each store owns its own localStorage keys).

## Game Systems

- **Turn meter combat** — speed-based turn order, skill cooldowns, crit/affinity system
- **Affinities** — Force / Magic / Spirit triangle + neutral Void and Astral
- **Factions** — House Aldric, Valdris, Caelwyn, Mordaine, Bloodtusk, Ignar, Ancient Nobles
- **Forge** — ore smelting → bars → gear crafting via recipes
- **Dungeons / Raids / Sieges / Exploration** — multiple content modes
- **Summon portal** — hero recruitment with rarity tiers (Common → Ancient)
- **Codex** — in-game lore journal
