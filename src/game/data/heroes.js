import { Hero, Rarity, Faction, Affinity } from '../Hero.js'
import { SKILLS } from './skills.js'
import { ARTISAN } from './artisanSkills.js'

export const HERO_TEMPLATES = {

  // ── Hedge Knight Starters (player picks one) ────────────────────
  HEDGE_BLADE: () => new Hero({
    id: 'hedge_blade', name: 'Garrett the Unbroken',
    faction: Faction.ALDRIC, rarity: Rarity.RARE, affinity: Affinity.FORCE,
    baseHp: 16000, baseAtk: 1050, baseDef: 950, baseSpd: 82,
    critRate: 0.12, critDmg: 0.50,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
  }),

  HEDGE_MAGE: () => new Hero({
    id: 'hedge_mage', name: 'Lyra of the Crescent',
    faction: Faction.VALDRIS, rarity: Rarity.RARE, affinity: Affinity.MAGIC,
    baseHp: 11000, baseAtk: 1350, baseDef: 480, baseSpd: 102,
    critRate: 0.18, critDmg: 0.55,
    skills: [SKILLS.FIREBALL, SKILLS.SLASH],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true,
  }),

  HEDGE_WARDEN: () => new Hero({
    id: 'hedge_warden', name: 'Rowan the Wandering',
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 14000, baseAtk: 900, baseDef: 720, baseSpd: 95,
    critRate: 0.12, critDmg: 0.50,
    skills: [SKILLS.MEND, SKILLS.SLASH],
    artisanSkills: [ARTISAN.herbalism],
    isPlayer: true,
  }),

  // ── Starters ────────────────────────────────────────────────────
  SER_ROLAND: () => new Hero({
    id: 'ser_roland', name: 'Ser Roland',
    faction: Faction.ALDRIC, rarity: Rarity.EPIC, affinity: Affinity.FORCE,
    baseHp: 18000, baseAtk: 1400, baseDef: 900, baseSpd: 95,
    critRate: 0.20, critDmg: 0.60,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.WHIRLWIND, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
  }),

  SERAPHEL: () => new Hero({
    id: 'seraphel', name: 'Seraphel',
    faction: Faction.VALDRIS, rarity: Rarity.LEGENDARY, affinity: Affinity.MAGIC,
    baseHp: 14000, baseAtk: 1800, baseDef: 700, baseSpd: 105,
    critRate: 0.25, critDmg: 0.70,
    skills: [SKILLS.FIREBALL, SKILLS.BLIZZARD, SKILLS.ARCANE_SHIELD],
    artisanSkills: [ARTISAN.tailoring, ARTISAN.apothecary],
    isPlayer: true,
  }),

  MIRA: () => new Hero({
    id: 'mira', name: 'Mira of Caelwyn',
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 16000, baseAtk: 1100, baseDef: 800, baseSpd: 100,
    critRate: 0.15, critDmg: 0.50,
    skills: [SKILLS.MEND, SKILLS.MASS_HEAL, SKILLS.REVITALIZE],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true,
  }),

  VELMORN: () => new Hero({
    id: 'velmorn', name: 'Velmorn the Shadow',
    faction: Faction.MORDAINE, rarity: Rarity.EPIC, affinity: Affinity.VOID,
    baseHp: 13500, baseAtk: 1600, baseDef: 650, baseSpd: 115,
    critRate: 0.35, critDmg: 0.80,
    skills: [SKILLS.BACKSTAB, SKILLS.MULTI_STAB],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true,
  }),

  // ── Normal Portal — House Aldric (Force · Warriors) ─────────────
  ALDRIC_KNIGHT: () => new Hero({
    id: 'aldric_knight', name: 'Aldric Knight',
    faction: Faction.ALDRIC, rarity: Rarity.COMMON, affinity: Affinity.FORCE,
    baseHp: 10500, baseAtk: 700, baseDef: 520, baseSpd: 80,
    skills: [SKILLS.HEAVY_STRIKE],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
  }),

  ALDRIC_FOOTMAN: () => new Hero({
    id: 'aldric_footman', name: 'Aldric Footman',
    faction: Faction.ALDRIC, rarity: Rarity.COMMON, affinity: Affinity.FORCE,
    baseHp: 9500, baseAtk: 750, baseDef: 480, baseSpd: 78,
    skills: [SKILLS.SLASH],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
  }),

  ALDRIC_CONSCRIPT: () => new Hero({
    id: 'aldric_conscript', name: 'Aldric Conscript',
    faction: Faction.ALDRIC, rarity: Rarity.COMMON, affinity: Affinity.FORCE,
    baseHp: 9000, baseAtk: 680, baseDef: 460, baseSpd: 76,
    skills: [SKILLS.SLASH],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true,
  }),

  ALDRIC_MARKSMAN: () => new Hero({
    id: 'aldric_marksman', name: 'Aldric Marksman',
    faction: Faction.ALDRIC, rarity: Rarity.UNCOMMON, affinity: Affinity.FORCE,
    baseHp: 11000, baseAtk: 1050, baseDef: 500, baseSpd: 90,
    critRate: 0.18, critDmg: 0.55,
    skills: [SKILLS.CROSSBOW_SHOT, SKILLS.VOLLEY],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true,
  }),

  ALDRIC_SQUIRE: () => new Hero({
    id: 'aldric_squire', name: 'Aldric Squire',
    faction: Faction.ALDRIC, rarity: Rarity.UNCOMMON, affinity: Affinity.FORCE,
    baseHp: 13000, baseAtk: 950, baseDef: 650, baseSpd: 84,
    critRate: 0.12, critDmg: 0.50,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.SLASH],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
  }),

  ALDRIC_PALADIN: () => new Hero({
    id: 'aldric_paladin', name: 'Aldric Paladin',
    faction: Faction.ALDRIC, rarity: Rarity.UNCOMMON, affinity: Affinity.FORCE,
    baseHp: 13500, baseAtk: 900, baseDef: 700, baseSpd: 82,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.MEND],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true,
  }),

  SIR_HADVAR: () => new Hero({
    id: 'sir_hadvar', name: 'Sir Hadvar',
    faction: Faction.ALDRIC, rarity: Rarity.RARE, affinity: Affinity.FORCE,
    baseHp: 21000, baseAtk: 1150, baseDef: 1150, baseSpd: 88,
    critRate: 0.12, critDmg: 0.50,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
  }),

  DURWALD: () => new Hero({
    id: 'durwald', name: 'Durwald the Immovable',
    faction: Faction.ALDRIC, rarity: Rarity.RARE, affinity: Affinity.FORCE,
    baseHp: 24000, baseAtk: 950, baseDef: 1300, baseSpd: 76,
    critRate: 0.08, critDmg: 0.40,
    skills: [SKILLS.PROVOKE, SKILLS.IRON_BASTION],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
  }),

  GWENDAL: () => new Hero({
    id: 'gwendal', name: 'Gwendal Ironvow',
    faction: Faction.ALDRIC, rarity: Rarity.EPIC, affinity: Affinity.FORCE,
    baseHp: 20000, baseAtk: 1450, baseDef: 850, baseSpd: 90,
    critRate: 0.18, critDmg: 0.58,
    skills: [SKILLS.WHIRLWIND, SKILLS.PROVOKE, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
  }),

  BRENNA: () => new Hero({
    id: 'brenna', name: 'Brenna Shieldmaiden',
    faction: Faction.ALDRIC, rarity: Rarity.EPIC, affinity: Affinity.FORCE,
    baseHp: 16000, baseAtk: 1350, baseDef: 850, baseSpd: 97,
    critRate: 0.20, critDmg: 0.60,
    skills: [SKILLS.WHIRLWIND, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true,
  }),

  LORD_ALDRIC: () => new Hero({
    id: 'lord_aldric', name: 'Lord Aldric',
    faction: Faction.ALDRIC, rarity: Rarity.LEGENDARY, affinity: Affinity.FORCE,
    baseHp: 22000, baseAtk: 1700, baseDef: 1000, baseSpd: 100,
    critRate: 0.25, critDmg: 0.65,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.WHIRLWIND, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing, ARTISAN.tailoring],
    isPlayer: true,
  }),

  HELGA: () => new Hero({
    id: 'helga', name: 'Helga',
    faction: Faction.ALDRIC, rarity: Rarity.LEGENDARY, affinity: Affinity.FORCE,
    baseHp: 26000, baseAtk: 1500, baseDef: 1350, baseSpd: 92,
    critRate: 0.20, critDmg: 0.58,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.IRON_BASTION, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing, ARTISAN.apothecary],
    isPlayer: true,
  }),

  // ── Normal Portal — House Valdris (Magic · Arcane) ───────────────
  VALDRIS_SCRIBE: () => new Hero({
    id: 'valdris_scribe', name: 'Valdris Scribe',
    faction: Faction.VALDRIS, rarity: Rarity.COMMON, affinity: Affinity.MAGIC,
    baseHp: 8000, baseAtk: 750, baseDef: 380, baseSpd: 88,
    skills: [SKILLS.SLASH],
    artisanSkills: [ARTISAN.tailoring],
    isPlayer: true,
  }),

  VALDRIS_APPRENTICE: () => new Hero({
    id: 'valdris_apprentice', name: 'Valdris Apprentice',
    faction: Faction.VALDRIS, rarity: Rarity.COMMON, affinity: Affinity.MAGIC,
    baseHp: 8500, baseAtk: 820, baseDef: 400, baseSpd: 82,
    skills: [SKILLS.SLASH],
    artisanSkills: [ARTISAN.tailoring],
    isPlayer: true,
  }),

  VALDRIS_MAGISTER: () => new Hero({
    id: 'valdris_magister', name: 'Valdris Magister',
    faction: Faction.VALDRIS, rarity: Rarity.UNCOMMON, affinity: Affinity.MAGIC,
    baseHp: 11000, baseAtk: 1200, baseDef: 450, baseSpd: 96,
    critRate: 0.18, critDmg: 0.55,
    skills: [SKILLS.FIREBALL, SKILLS.SLASH],
    artisanSkills: [ARTISAN.tailoring],
    isPlayer: true,
  }),

  VALDRIS_RUNEWARD: () => new Hero({
    id: 'valdris_runeward', name: 'Valdris Runeward',
    faction: Faction.VALDRIS, rarity: Rarity.UNCOMMON, affinity: Affinity.MAGIC,
    baseHp: 12500, baseAtk: 900, baseDef: 580, baseSpd: 90,
    skills: [SKILLS.ARCANE_SHIELD, SKILLS.SLASH],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true,
  }),

  DRAVEN_SPELLBLADE: () => new Hero({
    id: 'draven_spellblade', name: 'Draven Spellblade',
    faction: Faction.VALDRIS, rarity: Rarity.RARE, affinity: Affinity.MAGIC,
    baseHp: 13000, baseAtk: 1300, baseDef: 680, baseSpd: 100,
    critRate: 0.20, critDmg: 0.58,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.FIREBALL],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
  }),

  VALDRIS_ENCHANTER: () => new Hero({
    id: 'valdris_enchanter', name: 'Valdris Enchanter',
    faction: Faction.VALDRIS, rarity: Rarity.UNCOMMON, affinity: Affinity.MAGIC,
    baseHp: 10000, baseAtk: 980, baseDef: 430, baseSpd: 94,
    critRate: 0.12, critDmg: 0.50,
    skills: [SKILLS.FIREBALL, SKILLS.ARCANE_SHIELD],
    artisanSkills: [ARTISAN.tailoring],
    isPlayer: true,
  }),

  ELARA: () => new Hero({
    id: 'elara', name: 'Elara Frostweaver',
    faction: Faction.VALDRIS, rarity: Rarity.RARE, affinity: Affinity.MAGIC,
    baseHp: 14500, baseAtk: 1350, baseDef: 720, baseSpd: 99,
    critRate: 0.20, critDmg: 0.60,
    skills: [SKILLS.BLIZZARD, SKILLS.ARCANE_SHIELD],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true,
  }),

  MIRENA: () => new Hero({
    id: 'mirena', name: 'Mirena Ashveil',
    faction: Faction.VALDRIS, rarity: Rarity.RARE, affinity: Affinity.MAGIC,
    baseHp: 12500, baseAtk: 1400, baseDef: 550, baseSpd: 103,
    critRate: 0.22, critDmg: 0.62,
    skills: [SKILLS.FIREBALL, SKILLS.DARK_WAVE],
    artisanSkills: [ARTISAN.tailoring],
    isPlayer: true,
  }),

  CAIUS: () => new Hero({
    id: 'caius', name: 'Caius Stormbinder',
    faction: Faction.VALDRIS, rarity: Rarity.EPIC, affinity: Affinity.MAGIC,
    baseHp: 13500, baseAtk: 1700, baseDef: 680, baseSpd: 108,
    critRate: 0.22, critDmg: 0.65,
    skills: [SKILLS.BLIZZARD, SKILLS.DARK_WAVE, SKILLS.ARCANE_SHIELD],
    artisanSkills: [ARTISAN.tailoring],
    isPlayer: true,
  }),

  ARCHMAGE_KELVAR: () => new Hero({
    id: 'archmage_kelvar', name: 'Archmage Kelvar',
    faction: Faction.VALDRIS, rarity: Rarity.LEGENDARY, affinity: Affinity.MAGIC,
    baseHp: 16000, baseAtk: 2000, baseDef: 750, baseSpd: 112,
    critRate: 0.28, critDmg: 0.72,
    skills: [SKILLS.BLIZZARD, SKILLS.DARK_WAVE, SKILLS.ARCANE_SHIELD],
    artisanSkills: [ARTISAN.tailoring, ARTISAN.apothecary],
    isPlayer: true,
  }),

  // ── Normal Portal — House Caelwyn (Spirit · Rangers & Healers) ──
  CAELWYN_SCOUT: () => new Hero({
    id: 'caelwyn_scout', name: 'Caelwyn Scout',
    faction: Faction.CAELWYN, rarity: Rarity.COMMON, affinity: Affinity.SPIRIT,
    baseHp: 9000, baseAtk: 820, baseDef: 400, baseSpd: 112,
    critRate: 0.15, critDmg: 0.50,
    skills: [SKILLS.BACKSTAB],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true,
  }),

  CAELWYN_TRACKER: () => new Hero({
    id: 'caelwyn_tracker', name: 'Caelwyn Tracker',
    faction: Faction.CAELWYN, rarity: Rarity.COMMON, affinity: Affinity.SPIRIT,
    baseHp: 9500, baseAtk: 780, baseDef: 410, baseSpd: 106,
    skills: [SKILLS.SLASH],
    artisanSkills: [ARTISAN.herbalism],
    isPlayer: true,
  }),

  CAELWYN_RANGER: () => new Hero({
    id: 'caelwyn_ranger', name: 'Caelwyn Ranger',
    faction: Faction.CAELWYN, rarity: Rarity.UNCOMMON, affinity: Affinity.SPIRIT,
    baseHp: 11500, baseAtk: 1100, baseDef: 520, baseSpd: 102,
    critRate: 0.25, critDmg: 0.55,
    skills: [SKILLS.BACKSTAB, SKILLS.SLASH],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true,
  }),

  CAELWYN_HERBALIST: () => new Hero({
    id: 'caelwyn_herbalist', name: 'Caelwyn Herbalist',
    faction: Faction.CAELWYN, rarity: Rarity.UNCOMMON, affinity: Affinity.SPIRIT,
    baseHp: 12000, baseAtk: 700, baseDef: 600, baseSpd: 105,
    skills: [SKILLS.MEND, SKILLS.REVITALIZE],
    artisanSkills: [ARTISAN.herbalism],
    isPlayer: true,
  }),

  CAELWYN_DRUID: () => new Hero({
    id: 'caelwyn_druid', name: 'Caelwyn Druid',
    faction: Faction.CAELWYN, rarity: Rarity.UNCOMMON, affinity: Affinity.SPIRIT,
    baseHp: 11000, baseAtk: 800, baseDef: 550, baseSpd: 98,
    skills: [SKILLS.MEND, SKILLS.MASS_HEAL],
    artisanSkills: [ARTISAN.herbalism],
    isPlayer: true,
  }),

  CAELWYN_WARDEN: () => new Hero({
    id: 'caelwyn_warden', name: 'Caelwyn Warden',
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 17000, baseAtk: 1000, baseDef: 950, baseSpd: 90,
    critRate: 0.12, critDmg: 0.50,
    skills: [SKILLS.MEND, SKILLS.REVITALIZE],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true,
  }),

  LYRETH: () => new Hero({
    id: 'lyreth', name: 'Lyreth Moondrift',
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 13000, baseAtk: 1250, baseDef: 600, baseSpd: 110,
    critRate: 0.28, critDmg: 0.60,
    skills: [SKILLS.CROSSBOW_SHOT, SKILLS.VOLLEY],
    artisanSkills: [ARTISAN.herbalism],
    isPlayer: true,
  }),

  SYLARA: () => new Hero({
    id: 'sylara', name: 'Sylara the Reviver',
    faction: Faction.CAELWYN, rarity: Rarity.EPIC, affinity: Affinity.SPIRIT,
    baseHp: 15000, baseAtk: 1200, baseDef: 800, baseSpd: 100,
    resistance: 0.35,
    skills: [SKILLS.MEND, SKILLS.MASS_HEAL, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true,
  }),

  THERON: () => new Hero({
    id: 'theron', name: 'Theron Greenmarch',
    faction: Faction.CAELWYN, rarity: Rarity.LEGENDARY, affinity: Affinity.SPIRIT,
    baseHp: 18000, baseAtk: 1350, baseDef: 900, baseSpd: 108,
    critRate: 0.20, critDmg: 0.60, resistance: 0.40,
    skills: [SKILLS.MEND, SKILLS.MASS_HEAL, SKILLS.REVITALIZE],
    artisanSkills: [ARTISAN.herbalism, ARTISAN.apothecary],
    isPlayer: true,
  }),

  // ── Void Portal — House Mordaine (Void · Shadow) ─────────────────
  MORDAINE_SHADE: () => new Hero({
    id: 'mordaine_shade', name: 'Mordaine Shade',
    faction: Faction.MORDAINE, rarity: Rarity.COMMON, affinity: Affinity.VOID,
    baseHp: 8000, baseAtk: 900, baseDef: 370, baseSpd: 122,
    critRate: 0.15, critDmg: 0.50,
    skills: [SKILLS.BACKSTAB],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true,
  }),

  MORDAINE_LURKER: () => new Hero({
    id: 'mordaine_lurker', name: 'Mordaine Lurker',
    faction: Faction.MORDAINE, rarity: Rarity.COMMON, affinity: Affinity.VOID,
    baseHp: 9000, baseAtk: 850, baseDef: 400, baseSpd: 115,
    skills: [SKILLS.SLASH],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true,
  }),

  MORDAINE_HEXBLADE: () => new Hero({
    id: 'mordaine_hexblade', name: 'Mordaine Hexblade',
    faction: Faction.MORDAINE, rarity: Rarity.UNCOMMON, affinity: Affinity.VOID,
    baseHp: 10500, baseAtk: 1050, baseDef: 490, baseSpd: 108,
    critRate: 0.18, critDmg: 0.52,
    skills: [SKILLS.SLASH, SKILLS.DARK_WAVE],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true,
  }),

  MORDAINE_INVOKER: () => new Hero({
    id: 'mordaine_invoker', name: 'Mordaine Invoker',
    faction: Faction.MORDAINE, rarity: Rarity.UNCOMMON, affinity: Affinity.VOID,
    baseHp: 10000, baseAtk: 1100, baseDef: 450, baseSpd: 104,
    skills: [SKILLS.DARK_WAVE, SKILLS.SLASH],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true,
  }),

  ZARETH: () => new Hero({
    id: 'zareth', name: 'Zareth the Hollow',
    faction: Faction.MORDAINE, rarity: Rarity.RARE, affinity: Affinity.VOID,
    baseHp: 16000, baseAtk: 1100, baseDef: 900, baseSpd: 88,
    critRate: 0.12, critDmg: 0.45, resistance: 0.25,
    skills: [SKILLS.PROVOKE, SKILLS.DARK_WAVE],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
  }),

  SERIX: () => new Hero({
    id: 'serix', name: 'Serix the Wretched',
    faction: Faction.MORDAINE, rarity: Rarity.RARE, affinity: Affinity.VOID,
    baseHp: 15000, baseAtk: 1300, baseDef: 750, baseSpd: 92,
    critRate: 0.20, critDmg: 0.60,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.CRUSH],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
  }),

  NYXARA: () => new Hero({
    id: 'nyxara', name: 'Nyxara Voidwalker',
    faction: Faction.MORDAINE, rarity: Rarity.RARE, affinity: Affinity.VOID,
    baseHp: 13000, baseAtk: 1250, baseDef: 650, baseSpd: 105,
    resistance: 0.30, accuracy: 0.10,
    skills: [SKILLS.SLASH, SKILLS.DARK_WAVE],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true,
  }),

  MORD: () => new Hero({
    id: 'mord', name: 'Mord the Forsaken',
    faction: Faction.MORDAINE, rarity: Rarity.EPIC, affinity: Affinity.VOID,
    baseHp: 13000, baseAtk: 1650, baseDef: 620, baseSpd: 118,
    critRate: 0.35, critDmg: 0.85,
    skills: [SKILLS.BACKSTAB, SKILLS.MULTI_STAB],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true,
  }),

  THALRIC: () => new Hero({
    id: 'thalric', name: 'Thalric Vaelorian',
    faction: Faction.MORDAINE, rarity: Rarity.EPIC, affinity: Affinity.VOID,
    baseHp: 22000, baseAtk: 900, baseDef: 1400, baseSpd: 82,
    critRate: 0.10, critDmg: 0.40, resistance: 0.35,
    skills: [SKILLS.PROVOKE, SKILLS.IRON_BASTION, SKILLS.SLASH],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
  }),

  GRIBZAK: () => new Hero({
    id: 'gribzak', name: 'Gribzak Gearvein',
    faction: Faction.VALDRIS, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 11500, baseAtk: 970, baseDef: 560, baseSpd: 102,
    critRate: 0.15, critDmg: 0.50,
    skills: [SKILLS.CRYSTAL_STRIKE, SKILLS.EMERGENCY_PATCH, SKILLS.SCRAP_SURGE],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
    forgeAffinities: ['vaultmetal', 'runeite'],
    quote: "If it's broken and glowing, that's just more power waiting to happen.",
    lore: "Gribzak Gearvein was not born into prestige. He began as a back-alley tinkerer beneath the floating citadels, collecting broken rune parts and cracked crystal cores that fancier artificers had thrown away. His green-crystal hammer started life as a damaged mining-core stabilizer. House Valdris scholars mocked his methods — until he repaired an overloaded crystal engine none of them dared touch. He is not the most polished artificer in Valdris. He is the one who can fix a war machine while it is exploding.",
  }),

  BORRIK: () => new Hero({
    id: 'borrik', name: 'Borrik Stormcog',
    faction: Faction.VALDRIS, rarity: Rarity.EPIC, affinity: Affinity.MAGIC,
    baseHp: 18500, baseAtk: 1500, baseDef: 950, baseSpd: 88,
    critRate: 0.20, critDmg: 0.65,
    skills: [SKILLS.SKYBREAKER_STRIKE, SKILLS.ARC_DISCHARGE, SKILLS.ARTIFICERS_SHIELD],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
    forgeAffinities: ['vaultmetal', 'runeite'],
    quote: "Skybreaker doesn't care how fancy your spell theory is.",
    lore: "Borrik Stormcog is one of the most respected master smiths ever accepted into the upper forges of House Valdris. To him, a rune is just a gear made of light, and a crystal is simply a furnace that remembers spells. His great blue hextech warhammer, Skybreaker, was forged around a refined arc-core from the upper citadels. Despite his terrifying equipment, Borrik became beloved because he is unusually warm-hearted for someone of his status. He can flatten a siege construct — then spend the evening teaching a young apprentice how to balance a crystal housing correctly.",
  }),

  ZWIERLS: () => new Hero({
    id: 'zwierls', name: 'Zwierls',
    faction: Faction.VALDRIS, rarity: Rarity.EPIC, affinity: Affinity.MAGIC,
    baseHp: 21000, baseAtk: 1400, baseDef: 1150, baseSpd: 82,
    critRate: 0.18, critDmg: 0.60,
    skills: [SKILLS.RUNIC_SMASH, SKILLS.HAMMER_ROUND, SKILLS.STONE_RESOLVE],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
    quote: 'I fight the same way I dance. Enthusiastically and without warning.',
    lore: 'Zwierls of House Valdris has three passions: his rune-hammer, a cold ale, and anyone willing to dance until sunrise. He extends this warmth to everyone he meets, enemies included — right up until the moment he does not. Those who have fought alongside him say the strangest part is not the hammer. It is the fact that he is still grinning when he swings it.',
    forgeAffinities: ['vaultmetal', 'runeite'],
  }),

  ARRI: () => new Hero({
    id: 'arri', name: 'Arri the Witch',
    faction: Faction.CAELWYN, rarity: Rarity.LEGENDARY, affinity: Affinity.SPIRIT,
    baseHp: 15500, baseAtk: 1600, baseDef: 750, baseSpd: 118,
    critRate: 0.22, critDmg: 0.65,
    skills: [SKILLS.VERDANT_HEX, SKILLS.FROM_THE_ARCHIVES, SKILLS.THE_LEDGER],
    artisanSkills: [ARTISAN.herbalism, ARTISAN.apothecary],
    isPlayer: true,
    quote: 'I remember everything. Even the things you would rather I forgot.',
    lore: 'Her library is the largest in Caelwyn. Visitors assume it is filled with ancient wisdom and forgotten spells — and they are not entirely wrong. But most of the shelves hold something more dangerous: meticulous records of every person she has ever met. What they promised. What they did instead. What they owe. Arri is generous, patient, and genuinely warm. She is also the only person in Westrun nobody has ever double-crossed twice.',
  }),

  KYVER: () => new Hero({
    id: 'kyver', name: 'Kyver',
    faction: Faction.ALDRIC, rarity: Rarity.LEGENDARY, affinity: Affinity.FORCE,
    baseHp: 17500, baseAtk: 1850, baseDef: 750, baseSpd: 112,
    critRate: 0.28, critDmg: 0.75,
    skills: [SKILLS.HONOUR_SLASH, SKILLS.THOUSAND_CUTS, SKILLS.WARLORDS_RESOLVE],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
    quote: 'For rice and honer.',
    lore: 'A wandering warlord whose wisdom arrives uninvited, usually mid-battle. Kyver has declined lordships, refused fortunes, and once ended a siege by inviting both sides to dinner. His blade is flawless. His spelling is not. Those who underestimate him tend to lose. Those who share a meal with him tend to follow him anywhere.',
  }),

  VORATH: () => new Hero({
    id: 'vorath', name: 'Vorath the Undying',
    faction: Faction.MORDAINE, rarity: Rarity.MYTHICAL, affinity: Affinity.VOID,
    baseHp: 15000, baseAtk: 1950, baseDef: 750, baseSpd: 110,
    critRate: 0.28, critDmg: 0.75,
    skills: [SKILLS.FIREBALL, SKILLS.BLIZZARD, SKILLS.DARK_WAVE],
    artisanSkills: [ARTISAN.apothecary, ARTISAN.blacksmithing],
    isPlayer: true,
  }),

  AURELAN: () => new Hero({
    id: 'aurelan', name: 'Aurelan Dawnspire',
    faction: Faction.ALDRIC, rarity: Rarity.MYTHICAL, affinity: Affinity.FORCE,
    baseHp: 22000, baseAtk: 2100, baseDef: 1000, baseSpd: 98,
    critRate: 0.30, critDmg: 0.80,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.WHIRLWIND, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing, ARTISAN.tailoring],
    isPlayer: true,
  }),

  JADE_DRAGONFORGE: () => new Hero({
    id: 'jade_dragonforge', name: 'Jade Dragonforge',
    faction: Faction.ALDRIC, rarity: Rarity.MYTHICAL, affinity: Affinity.FORCE,
    baseHp: 20000, baseAtk: 2350, baseDef: 950, baseSpd: 96,
    critRate: 0.32, critDmg: 0.85,
    skills: [SKILLS.DRAGON_LANCE, SKILLS.SEARING_DIVE, SKILLS.FORGE_WRATH],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true,
    quote: 'I did not come here to hurt you. But I will not leave until this is done.',
    lore: 'The dragon did not choose a conqueror. It chose her because she was the first person in three hundred years to offer it food before asking for anything in return. Jade Dragonforge has never started a war — but she has ended several. Her enemies remember the fire. Her allies remember that she learned every one of their names on the first day.',
  }),

  // ── Ancient tier ────────────────────────────────────────────────
  VALERIUS: () => new Hero({
    id: 'valerius', name: 'Valerius Dawnchaser',
    faction: Faction.ANCIENT_NOBLES, rarity: Rarity.ANCIENT, affinity: Affinity.ASTRAL,
    baseHp: 31000, baseAtk: 2700, baseDef: 1300, baseSpd: 118,
    critRate: 0.30, critDmg: 0.85,
    resistance: 0.45, accuracy: 0.25,
    skills: [SKILLS.STELLAR_STRIKE, SKILLS.STELLAR_RIFT, SKILLS.ASTRAL_FORM],
    artisanSkills: [ARTISAN.apothecary, ARTISAN.tailoring],
    isPlayer: true,
  }),

  VAERIC: () => new Hero({
    id: 'vaeric', name: 'Lord Vaeric Corvayne',
    faction: Faction.ANCIENT_NOBLES, rarity: Rarity.ANCIENT, affinity: Affinity.BLOOD,
    baseHp: 34000, baseAtk: 3000, baseDef: 1400, baseSpd: 108,
    critRate: 0.35, critDmg: 0.90,
    resistance: 0.50, accuracy: 0.20,
    skills: [SKILLS.SANGUINE_STRIKE, SKILLS.RAVENS_CURSE, SKILLS.DUSK_COMMUNION],
    artisanSkills: [ARTISAN.blacksmithing, ARTISAN.apothecary],
    isPlayer: true,
  }),

  // ── Training-tier enemies — very weak, for first encounter ──────
  SPARRING_DUMMY: () => new Hero({
    id: 'sparring_dummy', name: 'Sparring Dummy',
    faction: Faction.BLOODTUSK, rarity: Rarity.COMMON, affinity: Affinity.VOID,
    baseHp: 2200, baseAtk: 90, baseDef: 80, baseSpd: 50,
    skills: [SKILLS.SLASH],
    isPlayer: false,
  }),

  MILITIA_CONSCRIPT: () => new Hero({
    id: 'militia_conscript', name: 'Militia Conscript',
    faction: Faction.BLOODTUSK, rarity: Rarity.COMMON, affinity: Affinity.FORCE,
    baseHp: 3000, baseAtk: 130, baseDef: 100, baseSpd: 58,
    skills: [SKILLS.SLASH],
    isPlayer: false,
  }),

  // ── Enemy heroes — House Bloodtusk ──────────────────────────────
  BLOODTUSK_RAIDER: () => new Hero({
    id: 'bloodtusk_raider', name: 'Bloodtusk Raider',
    faction: Faction.BLOODTUSK, rarity: Rarity.COMMON, affinity: Affinity.FORCE,
    baseHp: 12000, baseAtk: 1000, baseDef: 600, baseSpd: 80,
    skills: [SKILLS.SLASH],
    isPlayer: false,
  }),

  KARG: () => new Hero({
    id: 'karg', name: 'Karg the Warlord',
    faction: Faction.BLOODTUSK, rarity: Rarity.RARE, affinity: Affinity.FORCE,
    baseHp: 20000, baseAtk: 1300, baseDef: 900, baseSpd: 88,
    skills: [SKILLS.SLASH, SKILLS.CRUSH],
    isPlayer: false,
  }),

  // ── Enemy heroes — House Ignar ───────────────────────────────────
  IGNAR_CULTIST: () => new Hero({
    id: 'ignar_cultist', name: 'Ignar Cultist',
    faction: Faction.IGNAR, rarity: Rarity.EPIC, affinity: Affinity.MAGIC,
    baseHp: 11000, baseAtk: 1500, baseDef: 600, baseSpd: 98,
    skills: [SKILLS.SLASH, SKILLS.DARK_WAVE],
    isPlayer: false,
  }),

  CARNAX: () => new Hero({
    id: 'carnax', name: 'Carnax the Destroyer',
    faction: Faction.IGNAR, rarity: Rarity.LEGENDARY, affinity: Affinity.VOID,
    baseHp: 30000, baseAtk: 1800, baseDef: 1200, baseSpd: 90,
    critRate: 0.25, critDmg: 0.65,
    skills: [SKILLS.CRUSH, SKILLS.DARK_WAVE],
    isPlayer: false,
  }),

  // ── Nightmare-tier enemies — Undead ─────────────────────────────
  SKELETON_WARRIOR: () => new Hero({
    id: 'skeleton_warrior', name: 'Skeleton Warrior',
    faction: Faction.MORDAINE, rarity: Rarity.UNCOMMON, affinity: Affinity.VOID,
    baseHp: 18000, baseAtk: 1800, baseDef: 700, baseSpd: 90,
    skills: [SKILLS.SLASH],
    isPlayer: false, enemyType: 'undead',
  }),

  ZOMBIE_BRUTE: () => new Hero({
    id: 'zombie_brute', name: 'Zombie Brute',
    faction: Faction.MORDAINE, rarity: Rarity.RARE, affinity: Affinity.VOID,
    baseHp: 32000, baseAtk: 2000, baseDef: 900, baseSpd: 65,
    skills: [SKILLS.CRUSH],
    isPlayer: false, enemyType: 'undead',
  }),

  BARROW_KNIGHT: () => new Hero({
    id: 'barrow_knight', name: 'Barrow Knight',
    faction: Faction.MORDAINE, rarity: Rarity.EPIC, affinity: Affinity.VOID,
    baseHp: 42000, baseAtk: 2400, baseDef: 1400, baseSpd: 78,
    critRate: 0.20, critDmg: 0.60,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.DARK_WAVE],
    isPlayer: false, enemyType: 'undead',
  }),

  LICH_SOVEREIGN: () => new Hero({
    id: 'lich_sovereign', name: 'Lich Sovereign',
    faction: Faction.MORDAINE, rarity: Rarity.LEGENDARY, affinity: Affinity.VOID,
    baseHp: 60000, baseAtk: 3200, baseDef: 1200, baseSpd: 105,
    critRate: 0.30, critDmg: 0.85,
    skills: [SKILLS.DARK_WAVE, SKILLS.BLIZZARD, SKILLS.CRUSH],
    isPlayer: false, enemyType: 'undead', canRevive: true,
  }),

  // ── Dev-only ────────────────────────────────────────────────────────────
  ARCHITECT: () => new Hero({
    id: 'architect', name: 'The Architect',
    faction: Faction.ANCIENT_NOBLES, rarity: Rarity.MYTHICAL, affinity: Affinity.VOID,
    baseHp: 99999, baseAtk: 9999, baseDef: 5000, baseSpd: 200,
    critRate: 0.75, critDmg: 2.0, resistance: 0.90, accuracy: 0.50,
    skills: [SKILLS.BLIZZARD, SKILLS.STELLAR_RIFT, SKILLS.ARCANE_SHIELD],
    artisanSkills: [ARTISAN.blacksmithing, ARTISAN.herbalism],
    isPlayer: true,
    quote: 'I designed this world. Every encounter, every rule, every exploit you found — I put it there.',
    lore: 'They say the world of Westrun was not discovered — it was built. The Architect exists outside the factions, outside the timeline, outside the rules that govern everyone else. No house claimed them. No dungeon was designed to stop them. When The Architect appears on the battlefield, the result is not a fight. It is a demonstration.',
  }),
}

export const STARTER_KEYS = ['SER_ROLAND', 'SERAPHEL', 'MIRA', 'VELMORN']
export const HEDGE_KNIGHT_CHOICES = ['HEDGE_BLADE', 'HEDGE_MAGE', 'HEDGE_WARDEN']

// Single recruit pool — all champions, void-touched and otherwise
export const RECRUIT_POOL = [
  // ── Common ───────────────────────────────────────────────────────
  { key: 'ALDRIC_CONSCRIPT',    rarity: 'Common' },
  { key: 'ALDRIC_KNIGHT',       rarity: 'Common' },
  { key: 'ALDRIC_FOOTMAN',      rarity: 'Common' },
  { key: 'VALDRIS_SCRIBE',      rarity: 'Common' },
  { key: 'VALDRIS_APPRENTICE',  rarity: 'Common' },
  { key: 'CAELWYN_SCOUT',       rarity: 'Common' },
  { key: 'CAELWYN_TRACKER',     rarity: 'Common' },
  { key: 'MORDAINE_SHADE',      rarity: 'Common' },
  { key: 'MORDAINE_LURKER',     rarity: 'Common' },
  // ── Uncommon ─────────────────────────────────────────────────────
  { key: 'ALDRIC_PALADIN',      rarity: 'Uncommon' },
  { key: 'ALDRIC_MARKSMAN',     rarity: 'Uncommon' },
  { key: 'ALDRIC_SQUIRE',       rarity: 'Uncommon' },
  { key: 'VALDRIS_ENCHANTER',   rarity: 'Uncommon' },
  { key: 'VALDRIS_MAGISTER',    rarity: 'Uncommon' },
  { key: 'VALDRIS_RUNEWARD',    rarity: 'Uncommon' },
  { key: 'CAELWYN_RANGER',      rarity: 'Uncommon' },
  { key: 'CAELWYN_HERBALIST',   rarity: 'Uncommon' },
  { key: 'CAELWYN_DRUID',       rarity: 'Uncommon' },
  { key: 'MORDAINE_HEXBLADE',   rarity: 'Uncommon' },
  { key: 'MORDAINE_INVOKER',    rarity: 'Uncommon' },
  // ── Rare ─────────────────────────────────────────────────────────
  { key: 'DURWALD',             rarity: 'Rare' },
  { key: 'SIR_HADVAR',          rarity: 'Rare' },
  { key: 'DRAVEN_SPELLBLADE',   rarity: 'Rare' },
  { key: 'ELARA',               rarity: 'Rare' },
  { key: 'MIRENA',              rarity: 'Rare' },
  { key: 'CAELWYN_WARDEN',      rarity: 'Rare' },
  { key: 'LYRETH',              rarity: 'Rare' },
  { key: 'MIRA',                rarity: 'Rare' },
  { key: 'ZARETH',              rarity: 'Rare' },
  { key: 'SERIX',               rarity: 'Rare' },
  { key: 'NYXARA',              rarity: 'Rare' },
  { key: 'GRIBZAK',             rarity: 'Rare' },
  // ── Epic ─────────────────────────────────────────────────────────
  { key: 'GWENDAL',             rarity: 'Epic' },
  { key: 'BRENNA',              rarity: 'Epic' },
  { key: 'CAIUS',               rarity: 'Epic' },
  { key: 'SYLARA',              rarity: 'Epic' },
  { key: 'SER_ROLAND',          rarity: 'Epic' },
  { key: 'VELMORN',             rarity: 'Epic' },
  { key: 'MORD',                rarity: 'Epic' },
  { key: 'THALRIC',             rarity: 'Epic' },
  { key: 'BORRIK',              rarity: 'Epic' },
  // ── Legendary ────────────────────────────────────────────────────
  { key: 'LORD_ALDRIC',         rarity: 'Legendary' },
  { key: 'HELGA',               rarity: 'Legendary' },
  { key: 'ARCHMAGE_KELVAR',     rarity: 'Legendary' },
  { key: 'THERON',              rarity: 'Legendary' },
  { key: 'SERAPHEL',            rarity: 'Legendary' },
  { key: 'KYVER',               rarity: 'Legendary' },
  { key: 'ARRI',                rarity: 'Legendary' },
  { key: 'ZWIERLS',             rarity: 'Epic' },
  // ── Mythical ─────────────────────────────────────────────────────
  { key: 'AURELAN',             rarity: 'Mythical' },
  { key: 'VORATH',              rarity: 'Mythical' },
  { key: 'JADE_DRAGONFORGE',    rarity: 'Mythical' },
  // ── Ancient ──────────────────────────────────────────────────────
  { key: 'VAERIC',              rarity: 'Ancient' },
  { key: 'VALERIUS',            rarity: 'Ancient' },
]

// Keep exports for any code that still references them
export const NORMAL_POOL = RECRUIT_POOL
export const VOID_POOL   = RECRUIT_POOL

// Training Grounds encounters — free to repeat, drop ores only (no gold/diamonds).
// Gold is exclusively earned through energy-gated dungeon content.
export const ENCOUNTERS = [
  {
    id: 'encounter_1',
    name: 'The Sparring Yard',
    difficulty: 'Easy',
    isTraining: true,
    enemies: [HERO_TEMPLATES.SPARRING_DUMMY],
    rewards: { gold: 0, diamonds: 0 },
  },
  {
    id: 'encounter_2',
    name: 'Conscript Skirmish',
    difficulty: 'Easy',
    isTraining: true,
    enemies: [HERO_TEMPLATES.MILITIA_CONSCRIPT, HERO_TEMPLATES.SPARRING_DUMMY],
    rewards: { gold: 0, diamonds: 0 },
  },
  {
    id: 'encounter_3',
    name: 'Border Skirmish',
    difficulty: 'Normal',
    isTraining: true,
    enemies: [HERO_TEMPLATES.BLOODTUSK_RAIDER, HERO_TEMPLATES.BLOODTUSK_RAIDER],
    rewards: { gold: 0, diamonds: 0 },
  },
  {
    id: 'encounter_4',
    name: "Karg's Ambush",
    difficulty: 'Hard',
    isTraining: true,
    enemies: [HERO_TEMPLATES.KARG, HERO_TEMPLATES.BLOODTUSK_RAIDER, HERO_TEMPLATES.BLOODTUSK_RAIDER],
    rewards: { gold: 0, diamonds: 0 },
  },
  {
    id: 'encounter_5',
    name: "Ignar's Vanguard",
    difficulty: 'Hard',
    isTraining: true,
    enemies: [HERO_TEMPLATES.IGNAR_CULTIST, HERO_TEMPLATES.BLOODTUSK_RAIDER, HERO_TEMPLATES.KARG],
    rewards: { gold: 0, diamonds: 0 },
  },
  {
    id: 'encounter_6',
    name: 'The Barrow King Rises',
    difficulty: 'Nightmare',
    isTraining: true,
    enemies: [HERO_TEMPLATES.LICH_SOVEREIGN, HERO_TEMPLATES.BARROW_KNIGHT, HERO_TEMPLATES.SKELETON_WARRIOR],
    rewards: { gold: 0, diamonds: 0 },
  },
]
