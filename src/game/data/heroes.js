import { Hero, Rarity, Faction, Affinity } from '../Hero.js'
import { Skill, SkillEffect, EffectType, TargetType } from '../Skill.js'
import { SKILLS } from './skills.js'
import { ARTISAN } from './artisanSkills.js'

const VOID_SMITE = new Skill({
  id: 'void_smite',
  name: 'Void Smite',
  description: 'A basic void strike dealing 400% ATK damage.',
  cooldown: 0,
  targetType: TargetType.SINGLE_ENEMY,
  effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 4.0 })],
})

export const HERO_TEMPLATES = {

  // ── Hedge Knight Starters (player picks one) ────────────────────
  HEDGE_BLADE: () => new Hero({
    id: 'hedge_blade', name: 'Garrett the Unbroken',
    faction: Faction.ALDRIC, rarity: Rarity.RARE, affinity: Affinity.FORCE,
    baseHp: 16000, baseAtk: 1050, baseDef: 950, baseSpd: 82,
    critRate: 0.12, critDmg: 0.50,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'warrior', weaponType: 'sword',
  }),

  HEDGE_MAGE: () => new Hero({
    id: 'hedge_mage', name: 'Lyra of the Crescent',
    faction: Faction.VALDRIS, rarity: Rarity.RARE, affinity: Affinity.MAGIC,
    baseHp: 11000, baseAtk: 1350, baseDef: 480, baseSpd: 102,
    critRate: 0.18, critDmg: 0.55,
    skills: [SKILLS.FIREBALL, SKILLS.SLASH],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true, role: 'mage', weaponType: 'wand',
  }),

  HEDGE_WARDEN: () => new Hero({
    id: 'hedge_warden', name: 'Rowan the Wandering',
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 14000, baseAtk: 900, baseDef: 720, baseSpd: 95,
    critRate: 0.12, critDmg: 0.50,
    skills: [SKILLS.MEND, SKILLS.SLASH],
    artisanSkills: [ARTISAN.herbalism],
    isPlayer: true, role: 'healer', weaponType: 'staff',
  }),

  // ── Starters ────────────────────────────────────────────────────
  SER_ROLAND: () => new Hero({
    id: 'ser_roland', name: 'Ser Roland',
    faction: Faction.ALDRIC, rarity: Rarity.EPIC, affinity: Affinity.FORCE,
    baseHp: 18000, baseAtk: 1400, baseDef: 900, baseSpd: 95,
    critRate: 0.20, critDmg: 0.60,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.WHIRLWIND, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'warrior', weaponType: 'sword',
  }),

  SERAPHEL: () => new Hero({
    id: 'seraphel', name: 'Seraphel',
    faction: Faction.VALDRIS, rarity: Rarity.LEGENDARY, affinity: Affinity.MAGIC,
    baseHp: 14000, baseAtk: 1800, baseDef: 700, baseSpd: 105,
    critRate: 0.25, critDmg: 0.70,
    skills: [SKILLS.FIREBALL, SKILLS.BLIZZARD, SKILLS.ARCANE_SHIELD],
    artisanSkills: [ARTISAN.tailoring, ARTISAN.apothecary],
    isPlayer: true, role: 'mage', weaponType: 'wand',
  }),

  MIRA: () => new Hero({
    id: 'mira', name: 'Mira of Caelwyn',
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 16000, baseAtk: 1100, baseDef: 800, baseSpd: 100,
    critRate: 0.15, critDmg: 0.50,
    skills: [SKILLS.MEND, SKILLS.MASS_HEAL, SKILLS.REVITALIZE],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true, role: 'healer', weaponType: 'staff',
  }),

  VELMORN: () => new Hero({
    id: 'velmorn', name: 'Velmorn the Shadow',
    faction: Faction.MORDAINE, rarity: Rarity.EPIC, affinity: Affinity.VOID,
    baseHp: 13500, baseAtk: 1600, baseDef: 650, baseSpd: 115,
    critRate: 0.35, critDmg: 0.80,
    skills: [SKILLS.BACKSTAB, SKILLS.MULTI_STAB],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true, role: 'ranger', weaponType: 'dagger',
  }),

  // ── Normal Portal — House Aldric (Force · Warriors) ─────────────
  SIR_HADVAR: () => new Hero({
    id: 'sir_hadvar', name: 'Sir Hadvar',
    faction: Faction.ALDRIC, rarity: Rarity.RARE, affinity: Affinity.FORCE,
    baseHp: 21000, baseAtk: 1150, baseDef: 1150, baseSpd: 88,
    critRate: 0.12, critDmg: 0.50,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'tank', weaponType: 'sword',
  }),

  DURWALD: () => new Hero({
    id: 'durwald', name: 'Durwald the Immovable',
    faction: Faction.ALDRIC, rarity: Rarity.RARE, affinity: Affinity.FORCE,
    baseHp: 24000, baseAtk: 950, baseDef: 1300, baseSpd: 76,
    critRate: 0.08, critDmg: 0.40,
    skills: [SKILLS.PROVOKE, SKILLS.IRON_BASTION],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'tank', weaponType: 'warhammer',
  }),

  ALDRIC_MARKSMAN: () => new Hero({
    id: 'aldric_marksman', name: 'Aldric Marksman',
    faction: Faction.ALDRIC, rarity: Rarity.RARE, affinity: Affinity.FORCE,
    baseHp: 15000, baseAtk: 1200, baseDef: 600, baseSpd: 96,
    critRate: 0.22, critDmg: 0.58,
    skills: [SKILLS.CROSSBOW_SHOT, SKILLS.VOLLEY],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true, role: 'ranger', weaponType: 'bow',
  }),

  GWENDAL: () => new Hero({
    id: 'gwendal', name: 'Gwendal Ironvow',
    faction: Faction.ALDRIC, rarity: Rarity.EPIC, affinity: Affinity.FORCE,
    baseHp: 20000, baseAtk: 1450, baseDef: 850, baseSpd: 90,
    critRate: 0.18, critDmg: 0.58,
    skills: [SKILLS.WHIRLWIND, SKILLS.PROVOKE, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'warrior', weaponType: 'greatsword',
  }),

  BRENNA: () => new Hero({
    id: 'brenna', name: 'Brenna Shieldmaiden',
    faction: Faction.ALDRIC, rarity: Rarity.EPIC, affinity: Affinity.FORCE,
    baseHp: 16000, baseAtk: 1350, baseDef: 850, baseSpd: 97,
    critRate: 0.20, critDmg: 0.60,
    skills: [SKILLS.WHIRLWIND, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true, role: 'warrior', weaponType: 'shield',
  }),

  LORD_ALDRIC: () => new Hero({
    id: 'lord_aldric', name: 'Lord Aldric',
    faction: Faction.ALDRIC, rarity: Rarity.MYTHICAL, affinity: Affinity.FORCE,
    baseHp: 22000, baseAtk: 1700, baseDef: 1000, baseSpd: 100,
    critRate: 0.25, critDmg: 0.65,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.WHIRLWIND, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing, ARTISAN.tailoring],
    isPlayer: true, role: 'warrior', weaponType: 'warhammer',
  }),

  HELGA: () => new Hero({
    id: 'helga', name: 'Helga',
    faction: Faction.ALDRIC, rarity: Rarity.LEGENDARY, affinity: Affinity.FORCE,
    baseHp: 26000, baseAtk: 1500, baseDef: 1350, baseSpd: 92,
    critRate: 0.20, critDmg: 0.58,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.IRON_BASTION, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing, ARTISAN.apothecary],
    isPlayer: true, role: 'tank', weaponType: 'mace',
  }),

  // ── Normal Portal — House Valdris (Magic · Arcane) ───────────────
  DRAVEN_SPELLBLADE: () => new Hero({
    id: 'draven_spellblade', name: 'Draven Spellblade',
    faction: Faction.VALDRIS, rarity: Rarity.RARE, affinity: Affinity.MAGIC,
    baseHp: 13000, baseAtk: 1300, baseDef: 680, baseSpd: 100,
    critRate: 0.20, critDmg: 0.58,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.FIREBALL],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'mage', weaponType: 'sword',
  }),

  ELARA: () => new Hero({
    id: 'elara', name: 'Elara Frostweaver',
    faction: Faction.VALDRIS, rarity: Rarity.RARE, affinity: Affinity.MAGIC,
    baseHp: 14500, baseAtk: 1350, baseDef: 720, baseSpd: 99,
    critRate: 0.20, critDmg: 0.60,
    skills: [SKILLS.BLIZZARD, SKILLS.ARCANE_SHIELD],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true, role: 'mage', weaponType: 'staff',
  }),

  MIRENA: () => new Hero({
    id: 'mirena', name: 'Mirena Ashveil',
    faction: Faction.VALDRIS, rarity: Rarity.RARE, affinity: Affinity.MAGIC,
    baseHp: 12500, baseAtk: 1400, baseDef: 550, baseSpd: 103,
    critRate: 0.22, critDmg: 0.62,
    skills: [SKILLS.FIREBALL, SKILLS.DARK_WAVE],
    artisanSkills: [ARTISAN.tailoring],
    isPlayer: true, role: 'mage', weaponType: 'wand',
  }),

  CAIUS: () => new Hero({
    id: 'caius', name: 'Caius Stormbinder',
    faction: Faction.VALDRIS, rarity: Rarity.EPIC, affinity: Affinity.MAGIC,
    baseHp: 13500, baseAtk: 1700, baseDef: 680, baseSpd: 108,
    critRate: 0.22, critDmg: 0.65,
    skills: [SKILLS.BLIZZARD, SKILLS.DARK_WAVE, SKILLS.ARCANE_SHIELD],
    artisanSkills: [ARTISAN.tailoring],
    isPlayer: true, role: 'mage', weaponType: 'staff',
  }),

  ARCHMAGE_KELVAR: () => new Hero({
    id: 'archmage_kelvar', name: 'Archmage Kelvar',
    faction: Faction.VALDRIS, rarity: Rarity.LEGENDARY, affinity: Affinity.MAGIC,
    baseHp: 16000, baseAtk: 2000, baseDef: 750, baseSpd: 112,
    critRate: 0.28, critDmg: 0.72,
    skills: [SKILLS.BLIZZARD, SKILLS.DARK_WAVE, SKILLS.ARCANE_SHIELD],
    artisanSkills: [ARTISAN.tailoring, ARTISAN.apothecary],
    isPlayer: true, role: 'mage', weaponType: 'staff',
  }),

  // ── Normal Portal — House Caelwyn (Spirit · Rangers & Healers) ──
  CAELWYN_WARDEN: () => new Hero({
    id: 'caelwyn_warden', name: 'Caelwyn Warden',
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 17000, baseAtk: 1000, baseDef: 950, baseSpd: 90,
    critRate: 0.12, critDmg: 0.50,
    skills: [SKILLS.MEND, SKILLS.REVITALIZE],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true, role: 'healer', weaponType: 'staff',
  }),

  LYRETH: () => new Hero({
    id: 'lyreth', name: 'Lyreth Moondrift',
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 13000, baseAtk: 1250, baseDef: 600, baseSpd: 110,
    critRate: 0.28, critDmg: 0.60,
    skills: [SKILLS.CROSSBOW_SHOT, SKILLS.VOLLEY],
    artisanSkills: [ARTISAN.herbalism],
    isPlayer: true, role: 'ranger', weaponType: 'bow',
  }),

  CAELWYN_HERBALIST: () => new Hero({
    id: 'caelwyn_herbalist', name: 'Caelwyn Herbalist',
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 16000, baseAtk: 850, baseDef: 750, baseSpd: 106,
    skills: [SKILLS.MEND, SKILLS.REVITALIZE],
    artisanSkills: [ARTISAN.herbalism],
    isPlayer: true, role: 'healer', weaponType: 'staff',
  }),

  SYLARA: () => new Hero({
    id: 'sylara', name: 'Sylara the Reviver',
    faction: Faction.CAELWYN, rarity: Rarity.EPIC, affinity: Affinity.SPIRIT,
    baseHp: 15000, baseAtk: 1200, baseDef: 800, baseSpd: 100,
    resistance: 0.35,
    skills: [SKILLS.MEND, SKILLS.MASS_HEAL, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true, role: 'healer', weaponType: 'wand',
  }),

  THERON: () => new Hero({
    id: 'theron', name: 'Theron Greenmarch',
    faction: Faction.CAELWYN, rarity: Rarity.LEGENDARY, affinity: Affinity.SPIRIT,
    baseHp: 18000, baseAtk: 1350, baseDef: 900, baseSpd: 108,
    critRate: 0.20, critDmg: 0.60, resistance: 0.40,
    skills: [SKILLS.MEND, SKILLS.MASS_HEAL, SKILLS.REVITALIZE],
    artisanSkills: [ARTISAN.herbalism, ARTISAN.apothecary],
    isPlayer: true, role: 'healer', weaponType: 'staff',
  }),

  // ── Void Portal — House Mordaine (Void · Shadow) ─────────────────
  ZARETH: () => new Hero({
    id: 'zareth', name: 'Zareth the Hollow',
    faction: Faction.MORDAINE, rarity: Rarity.RARE, affinity: Affinity.VOID,
    baseHp: 16000, baseAtk: 1100, baseDef: 900, baseSpd: 88,
    critRate: 0.12, critDmg: 0.45, resistance: 0.25,
    skills: [SKILLS.PROVOKE, SKILLS.DARK_WAVE],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'tank', weaponType: 'warhammer',
  }),

  SERIX: () => new Hero({
    id: 'serix', name: 'Serix the Wretched',
    faction: Faction.MORDAINE, rarity: Rarity.RARE, affinity: Affinity.VOID,
    baseHp: 15000, baseAtk: 1300, baseDef: 750, baseSpd: 92,
    critRate: 0.20, critDmg: 0.60,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.CRUSH],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'warrior', weaponType: 'greatsword',
  }),

  NYXARA: () => new Hero({
    id: 'nyxara', name: 'Nyxara Voidwalker',
    faction: Faction.MORDAINE, rarity: Rarity.RARE, affinity: Affinity.VOID,
    baseHp: 13000, baseAtk: 1250, baseDef: 650, baseSpd: 105,
    resistance: 0.30, accuracy: 0.10,
    skills: [SKILLS.SLASH, SKILLS.DARK_WAVE],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true, role: 'debuffer', weaponType: 'dagger',
  }),

  MORD: () => new Hero({
    id: 'mord', name: 'Mord the Forsaken',
    faction: Faction.MORDAINE, rarity: Rarity.EPIC, affinity: Affinity.VOID,
    baseHp: 13000, baseAtk: 1650, baseDef: 620, baseSpd: 118,
    critRate: 0.35, critDmg: 0.85,
    skills: [SKILLS.BACKSTAB, SKILLS.MULTI_STAB],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true, role: 'ranger', weaponType: 'crossbow',
  }),

  THALRIC: () => new Hero({
    id: 'thalric', name: 'Thalric Vaelorian',
    faction: Faction.MORDAINE, rarity: Rarity.EPIC, affinity: Affinity.VOID,
    baseHp: 22000, baseAtk: 900, baseDef: 1400, baseSpd: 82,
    critRate: 0.10, critDmg: 0.40, resistance: 0.35,
    skills: [SKILLS.PROVOKE, SKILLS.IRON_BASTION, SKILLS.SLASH],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'tank', weaponType: 'sword',
  }),

  GRIBZAK: () => new Hero({
    id: 'gribzak', name: 'Gribzak Gearvein',
    faction: Faction.VALDRIS, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 11500, baseAtk: 970, baseDef: 560, baseSpd: 102,
    critRate: 0.15, critDmg: 0.50,
    skills: [SKILLS.CRYSTAL_STRIKE, SKILLS.EMERGENCY_PATCH, SKILLS.SCRAP_SURGE],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'mage', weaponType: 'wand',
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
    isPlayer: true, role: 'warrior', weaponType: 'warhammer',
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
    isPlayer: true, role: 'warrior', weaponType: 'warhammer',
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
    isPlayer: true, role: 'debuffer', weaponType: 'wand',
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
    isPlayer: true, role: 'warrior', weaponType: 'sword',
    quote: 'For rice and honer.',
    lore: `Nobody knows where Kyver came from. He has been asked many times, and the answer changes: a fishing village, a burned monastery, the road between two places he cannot name. He always says it with the same solemn nod, so it is unclear whether he is being honest or whether he has been answering this question long enough that it no longer matters.

What is known: he is very good at war. Not the aggressive kind. The precise kind — the kind that ends things before they become expensive. He reads a battlefield the way a river reads a hillside, finding the one channel everything wants to flow down, and simply being there first.

He has been offered three lordships. He declined all of them, once in the middle of accepting the second. He has refused fortunes, rejected titles, and once ended a six-week siege by inviting both sides to dinner. The meal was rice, salted fish, and vegetables chopped badly by soldiers who didn't know which side they were afraid of more. By morning, the besiegers had agreed to leave. He had written the peace treaty himself, which nobody questioned, though his spelling suggested he had learned to read from someone who had also learned to read from someone, many generations removed from anyone who knew how it was supposed to look.

He carries a blade that has never chipped. His letters have never been correct. He considers neither of these things problems.

Kyver says honour is like rice: plain until you need it, terrible when it's absent, and best when shared. He says this unprompted. He says it mid-battle sometimes, which opponents have described as disorienting.

Those who underestimate him tend to lose. Those who share a meal with him tend to follow him anywhere — not because he demands it, but because whatever he is walking toward, he always seems to know which road to take, and he always brings enough for everyone.

His battle cry is four words. The spelling is his own. He has never once questioned it.`,
  }),

  VORATH: () => new Hero({
    id: 'vorath', name: 'Vorath the Undying',
    faction: Faction.MORDAINE, rarity: Rarity.MYTHICAL, affinity: Affinity.VOID,
    baseHp: 15000, baseAtk: 1950, baseDef: 750, baseSpd: 110,
    critRate: 0.28, critDmg: 0.75,
    skills: [SKILLS.FIREBALL, SKILLS.BLIZZARD, SKILLS.DARK_WAVE],
    artisanSkills: [ARTISAN.apothecary, ARTISAN.blacksmithing],
    isPlayer: true, role: 'mage', weaponType: 'staff',
  }),

  AURELAN: () => new Hero({
    id: 'aurelan', name: 'Aurelan Dawnspire',
    faction: Faction.ALDRIC, rarity: Rarity.MYTHICAL, affinity: Affinity.FORCE,
    baseHp: 22000, baseAtk: 2100, baseDef: 1000, baseSpd: 98,
    critRate: 0.30, critDmg: 0.80,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.WHIRLWIND, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing, ARTISAN.tailoring],
    isPlayer: true, role: 'warrior', weaponType: 'greatsword',
  }),

  JADE_DRAGONFORGE: () => new Hero({
    id: 'jade_dragonforge', name: 'Jade Dragonforge',
    faction: Faction.ALDRIC, rarity: Rarity.MYTHICAL, affinity: Affinity.FORCE,
    baseHp: 20000, baseAtk: 2350, baseDef: 950, baseSpd: 96,
    critRate: 0.32, critDmg: 0.85,
    skills: [SKILLS.DRAGON_LANCE, SKILLS.SEARING_DIVE, SKILLS.FORGE_WRATH],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'warrior', weaponType: 'greatsword',
    quote: 'I did not come here to hurt you. But I will not leave until this is done.',
    lore: 'The dragon did not choose a conqueror. It chose her because she was the first person in three hundred years to offer it food before asking for anything in return. Jade Dragonforge has never started a war — but she has ended several. Her enemies remember the fire. Her allies remember that she learned every one of their names on the first day.',
  }),

  ARCHMAGE_VALDRIS: () => new Hero({
    id: 'archmage_valdris', name: 'Archmage Valdris',
    faction: Faction.VALDRIS, rarity: Rarity.MYTHICAL, affinity: Affinity.MAGIC,
    baseHp: 16000, baseAtk: 2400, baseDef: 650, baseSpd: 118,
    critRate: 0.32, critDmg: 0.88,
    skills: [SKILLS.ARCANE_LANCE, SKILLS.THEORY_OF_RUIN, SKILLS.TEMPORAL_SEAL, SKILLS.THE_ABSOLUTE],
    artisanSkills: [ARTISAN.apothecary, ARTISAN.leatherworking],
    isPlayer: true, role: 'mage', weaponType: 'staff',
    quote: 'I did not study magic to feel wonder. I studied it until wonder ran out of places to hide.',
    lore: `No one remembers who built the first tower. The records do not begin there. They begin with Valdris.

He arrived at the unfinished spire carrying no title, only a sealed notebook and a list of corrections to work that had been accepted as truth for two centuries. The senior mages debated whether to let him in. He had already solved the third lock before they reached a decision.

Within a decade the tower bore his name — not by decree but by habit. Scholars began calling their work "Valdris-verified" when it had withstood his scrutiny, and "Valdris-burned" when it had not. He did not cultivate followers. He cultivated precision. The students who flourished under him were the ones who could say "I was wrong" faster than they said "I was right."

His armour was designed by the tower's finest enchanters: layered arcanite and spell-woven silk, each plate inscribed with a theorem. Not for protection — theorems do not stop blades. For reminder. He wore his work. He went to war the way he went to every argument: with the full weight of what he knew and the willingness to be the last one standing.

When he speaks in battle, he does not threaten. He explains what is about to happen. He has never been wrong.`,
  }),

  LORD_CAELWYN: () => new Hero({
    id: 'lord_caelwyn', name: 'Lord Caelwyn',
    faction: Faction.CAELWYN, rarity: Rarity.MYTHICAL, affinity: Affinity.SPIRIT,
    baseHp: 21000, baseAtk: 1950, baseDef: 1050, baseSpd: 106,
    critRate: 0.28, critDmg: 0.72,
    skills: [SKILLS.MOONLIT_SEVERANCE, SKILLS.MARBLE_DECREE, SKILLS.OATH_OF_THE_WHITE_GROVE, SKILLS.LETHARIEL_ASCENDANT],
    artisanSkills: [ARTISAN.herbalism, ARTISAN.apothecary],
    isPlayer: true, role: 'champion', weaponType: 'sword',
    quote: 'The grove remembers what crowns forget.',
    lore: `Long before Caelwyn was a house, it was a vow. Lord Caelwyn was the one who made it.

He did not arrive with an army or a crown. He planted a white bough before the oldest tree in the grove, laid his blade across his palms, and swore that no hand under his guidance would take from the land without first vowing to protect it. The elders mocked him for speaking law before he held power. The forest flowered in winter.

His armour was wrought from moon-pale living stone and sanctified gold, veined with emerald sigils that bound him to the heart of the grove. His blade was not forged for war alone — but to sever corruption from what is sacred. He offered peace once. Mercy twice. Judgement only when both were rejected.

When the wars ended, he refused all monuments. He ordered sanctuaries rebuilt, rivers cleansed, and enemy graves tended with the same care as those of his own. He wrote the Marble Accord: that beauty without duty is vanity, that power without mercy is blight, that no ruler of Caelwyn may claim the house while forgetting the grove.

The oldest texts do not say Lord Caelwyn died. They say only that when peace returned, he walked into the inner sanctum of the White Grove and became still as the marble pillars around him.

He returns, it is said, when the house forgets its vow. Not to reclaim a throne. To measure whether those who bear his name are still worthy of it.`,
  }),

  LORD_MORDAINE: () => new Hero({
    id: 'lord_mordaine', name: 'Lord Mordaine',
    faction: Faction.MORDAINE, rarity: Rarity.MYTHICAL, affinity: Affinity.VOID,
    baseHp: 18000, baseAtk: 2250, baseDef: 750, baseSpd: 114,
    critRate: 0.30, critDmg: 0.82,
    skills: [SKILLS.BLOOD_DRAIN, SKILLS.CRIMSON_EDICT, SKILLS.SHADOW_DOMINION, SKILLS.THE_VOID_RECEIVES],
    artisanSkills: [ARTISAN.apothecary, ARTISAN.tailoring],
    isPlayer: true, role: 'mage', weaponType: 'staff',
    quote: 'You mistake what I do for cruelty. I simply let the void show you what was already true.',
    lore: `Before Mordaine was a house, it was a question. Lord Mordaine was the one who asked it — and did not flinch when the void answered.

He did not enter the void seeking power. He entered it seeking clarity. What he found there was not darkness but precision: the void strips everything that is performed, everything that is hoped for, everything that is pretended, until only what is true remains. He saw himself clearly. He saw others even more clearly. He has never been deceived since.

The house he built is one of patience, not conquest. They do not rush to war. They wait until the truth of a conflict has been established, and then they act with the economy of certainty. Their enemies rarely understand what is happening until it is already finished. This is, Lord Mordaine has noted, precisely the point.

His power is not theatrical. The red light that crackles at his hands is not fire, though it burns. It is the void made visible — a breach in the careful surface of reality through which cold accuracy flows. He does not raise his voice. He does not make threats. He simply tells you what is going to happen, and then it does.

He has offered clemency three times in his life. He still remembers their names. He remembers everything the void shows him, and the void has shown him a great deal.

Those who serve House Mordaine say the most unsettling thing about him is not the power, or the silence, or the way he always seems to know. It is that he is, by all accounts, unfailingly polite. He is courteous to servants. He thanks people for their time. He listens, fully, to arguments he has already disproven. He makes excellent tea.

He simply also does not stop.`,
  }),

  // ── Normal Portal — House Ignar (Force · Raiders) ───────────────
  ARNE_FROSTBOUND: () => new Hero({
    id: 'arne_frostbound', name: 'Arne Frostbound',
    faction: Faction.IGNAR, rarity: Rarity.EPIC, affinity: Affinity.FORCE,
    baseHp: 16500, baseAtk: 1600, baseDef: 750, baseSpd: 95,
    critRate: 0.24, critDmg: 0.68,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.WHIRLWIND, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true, role: 'warrior', weaponType: 'greatsword',
    quote: 'I have taken kingdoms. She was the only thing I could not take — so I had to earn her instead.',
    lore: 'Arne Frostbound earned his title on the northern shores, where the ice never fully leaves the ground and mercy is considered a tactical error. As Jarl, he led his warband across twelve territories, each won through force of arms and sheer refusal to stop. He expected the same of Hilda. What he found instead was the one opponent who made him rethink his methods entirely — not because she was stronger, though she was, but because she simply did not care how many lands he had taken. She only asked what he planned to do with them. He has been trying to answer that question ever since.',
  }),

  HILDA_SHIELDMAIDEN: () => new Hero({
    id: 'hilda_shieldmaiden', name: 'Hilda the Shieldmaiden',
    faction: Faction.IGNAR, rarity: Rarity.EPIC, affinity: Affinity.FORCE,
    baseHp: 20500, baseAtk: 1100, baseDef: 1150, baseSpd: 87,
    critRate: 0.12, critDmg: 0.45,
    skills: [SKILLS.PROVOKE, SKILLS.IRON_BASTION, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing, ARTISAN.tailoring, ARTISAN.apothecary, ARTISAN.herbalism],
    isPlayer: true, role: 'tank', weaponType: 'shield',
    quote: 'He fights to conquer. I fight so that the people behind me never have to.',
    lore: 'Hilda did not become a shieldmaiden because she was told to. She became one because nobody else was doing it well enough. Born in a raided village on the western edge of Ignar territory, she rebuilt it herself, trained its defenders herself, and held it against three separate incursions before anyone in Ignar command even knew her name. When Arne came with his warband, she met him at the gate alone. He expected a battle. What he got was a negotiation — and he lost. She has never let him forget it, and he has never wanted to.',
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
    isPlayer: true, role: 'mage', weaponType: 'staff',
  }),

  VAERIC: () => new Hero({
    id: 'vaeric', name: 'Lord Vaeric Corvayne',
    faction: Faction.ANCIENT_NOBLES, rarity: Rarity.ANCIENT, affinity: Affinity.BLOOD,
    baseHp: 34000, baseAtk: 3000, baseDef: 1400, baseSpd: 108,
    critRate: 0.35, critDmg: 0.90,
    resistance: 0.50, accuracy: 0.20,
    skills: [SKILLS.SANGUINE_STRIKE, SKILLS.RAVENS_CURSE, SKILLS.DUSK_COMMUNION],
    artisanSkills: [ARTISAN.blacksmithing, ARTISAN.apothecary],
    isPlayer: true, role: 'debuffer', weaponType: 'staff',
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

  BLOODRAIDER_TUSK: () => new Hero({
    id: 'bloodraider_tusk', name: 'Bloodraider Tusk',
    faction: Faction.BLOODTUSK, rarity: Rarity.UNCOMMON, affinity: Affinity.FORCE,
    baseHp: 16000, baseAtk: 1200, baseDef: 750, baseSpd: 84,
    skills: [SKILLS.SLASH, SKILLS.CRUSH],
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
    skills: [VOID_SMITE, SKILLS.BLIZZARD, SKILLS.ARCANE_SHIELD],
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
  // ── Rare ─────────────────────────────────────────────────────────
  { key: 'DURWALD',             rarity: 'Rare' },
  { key: 'SIR_HADVAR',          rarity: 'Rare' },
  { key: 'ALDRIC_MARKSMAN',     rarity: 'Rare' },
  { key: 'DRAVEN_SPELLBLADE',   rarity: 'Rare' },
  { key: 'ELARA',               rarity: 'Rare' },
  { key: 'MIRENA',              rarity: 'Rare' },
  { key: 'CAELWYN_WARDEN',      rarity: 'Rare' },
  { key: 'LYRETH',              rarity: 'Rare' },
  { key: 'CAELWYN_HERBALIST',   rarity: 'Rare' },
  { key: 'MIRA',                rarity: 'Rare' },
  { key: 'ZARETH',              rarity: 'Rare' },
  { key: 'SERIX',               rarity: 'Rare' },
  { key: 'NYXARA',              rarity: 'Rare' },
  { key: 'GRIBZAK',             rarity: 'Rare' },
  // ── Epic ─────────────────────────────────────────────────────────
  { key: 'ARNE_FROSTBOUND',     rarity: 'Epic' },
  { key: 'HILDA_SHIELDMAIDEN',  rarity: 'Epic' },
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
  // LORD_ALDRIC is reputation-gated — unlocked via House Aldric at Exalted standing
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
  // LORD_CAELWYN is reputation-gated — unlocked via House Caelwyn at Exalted standing
  // LORD_ALDRIC is reputation-gated — unlocked via House Aldric at Exalted standing
  // ARCHMAGE_VALDRIS is reputation-gated — unlocked via House Valdris at Exalted standing
  // LORD_MORDAINE is reputation-gated — unlocked via House Mordaine at Exalted standing
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
