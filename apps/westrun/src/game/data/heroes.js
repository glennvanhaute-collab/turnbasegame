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
    archetype: { role: 'Warrior', name: 'Hedge Knight', desc: 'A rough fighter still finding his footing. Hits hard, plans later.', tags: ['Physical Damage', 'Self-Buff'] },
  }),

  HEDGE_MAGE: () => new Hero({
    id: 'hedge_mage', name: 'Lyra of the Crescent',
    faction: Faction.VALDRIS, rarity: Rarity.RARE, affinity: Affinity.MAGIC,
    baseHp: 11000, baseAtk: 1350, baseDef: 480, baseSpd: 102,
    critRate: 0.18, critDmg: 0.55,
    skills: [SKILLS.FIREBALL, SKILLS.SLASH],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true, role: 'mage', weaponType: 'wand',
    archetype: { role: 'Mage', name: 'Hedge Mage', desc: 'Raw arcane talent without refinement. Burns first, thinks second.', tags: ['Single Target', 'Burn'] },
  }),

  HEDGE_WARDEN: () => new Hero({
    id: 'hedge_warden', name: 'Rowan the Wandering',
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 14000, baseAtk: 900, baseDef: 720, baseSpd: 95,
    critRate: 0.12, critDmg: 0.50,
    skills: [SKILLS.MEND, SKILLS.SLASH],
    artisanSkills: [ARTISAN.herbalism],
    isPlayer: true, role: 'healer', weaponType: 'staff',
    archetype: { role: 'Healer', name: 'Hedge Warden', desc: 'A wandering mender. Keeps allies alive while still learning the craft.', tags: ['Single Heal', 'Physical Damage'] },
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
    archetype: { role: 'Warrior', name: 'Battle Leader', desc: 'Anchors the frontline while lifting his allies. The steady hand in any engagement.', tags: ['AOE Damage', 'Team ATK Buff'] },
  }),

  SERAPHEL: () => new Hero({
    id: 'seraphel', name: 'Seraphel',
    faction: Faction.VALDRIS, rarity: Rarity.LEGENDARY, affinity: Affinity.MAGIC,
    baseHp: 14000, baseAtk: 1800, baseDef: 700, baseSpd: 105,
    critRate: 0.25, critDmg: 0.70,
    skills: [SKILLS.FIREBALL, SKILLS.BLIZZARD, SKILLS.ARCANE_SHIELD],
    artisanSkills: [ARTISAN.tailoring, ARTISAN.apothecary],
    isPlayer: true, role: 'mage', weaponType: 'wand',
    archetype: { role: 'Mage', name: 'Frost Mage', desc: 'Dominates the battlefield through AOE freeze and arcane shielding. Slows enemy formations to a halt.', tags: ['AOE Damage', 'Freeze', 'Party Shield'] },
  }),

  MIRA: () => new Hero({
    id: 'mira', name: 'Mira of Caelwyn',
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 16000, baseAtk: 1100, baseDef: 800, baseSpd: 100,
    critRate: 0.15, critDmg: 0.50,
    skills: [SKILLS.MEND, SKILLS.MASS_HEAL, SKILLS.REVITALIZE],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true, role: 'healer', weaponType: 'staff',
    archetype: { role: 'Healer', name: 'Battle Healer', desc: 'A complete healing package. Emergency single saves, mass restores, and sustained regeneration.', tags: ['Single Heal', 'AOE Heal', 'Continuous Heal'] },
  }),

  VELMORN: () => new Hero({
    id: 'velmorn', name: 'Velmorn the Shadow',
    faction: Faction.MORDAINE, rarity: Rarity.EPIC, affinity: Affinity.VOID,
    baseHp: 13500, baseAtk: 1600, baseDef: 650, baseSpd: 115,
    critRate: 0.35, critDmg: 0.80,
    skills: [SKILLS.BACKSTAB, SKILLS.MULTI_STAB],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true, role: 'ranger', weaponType: 'dagger',
    archetype: { role: 'Ranger', name: 'Shadow Ranger', desc: 'Fast and lethal. Poisons targets and strikes them repeatedly before they can react.', tags: ['Poison', 'Multi-Hit', 'High Crit'] },
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
    archetype: { role: 'Tank', name: 'Iron Knight', desc: 'Forces enemies to focus him while buffing his own offensive output.', tags: ['Physical Damage', 'ATK Buff', 'Endurance'] },
  }),

  DURWALD: () => new Hero({
    id: 'durwald', name: 'Durwald the Immovable',
    faction: Faction.ALDRIC, rarity: Rarity.RARE, affinity: Affinity.FORCE,
    baseHp: 24000, baseAtk: 950, baseDef: 1300, baseSpd: 76,
    critRate: 0.08, critDmg: 0.40,
    skills: [SKILLS.PROVOKE, SKILLS.IRON_BASTION],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'tank', weaponType: 'warhammer',
    archetype: { role: 'Tank', name: 'Vanguard', desc: 'The immovable object. Draws all fire and becomes harder to kill the longer he stands.', tags: ['Provoke', 'High DEF', 'DEF Buff'] },
  }),

  ALDRIC_MARKSMAN: () => new Hero({
    id: 'aldric_marksman', name: 'Aldric Marksman',
    faction: Faction.ALDRIC, rarity: Rarity.RARE, affinity: Affinity.FORCE,
    baseHp: 15000, baseAtk: 1200, baseDef: 600, baseSpd: 96,
    critRate: 0.22, critDmg: 0.58,
    skills: [SKILLS.CROSSBOW_SHOT, SKILLS.VOLLEY],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true, role: 'ranger', weaponType: 'bow',
    archetype: { role: 'Ranger', name: 'Crossbowman', desc: 'Precise ranged pressure. Picks off single targets or punishes grouped enemies with volleys.', tags: ['Single Target', 'AOE', 'Physical Damage'] },
  }),

  GWENDAL: () => new Hero({
    id: 'gwendal', name: 'Gwendal Ironvow',
    faction: Faction.ALDRIC, rarity: Rarity.EPIC, affinity: Affinity.FORCE,
    baseHp: 20000, baseAtk: 1450, baseDef: 850, baseSpd: 90,
    critRate: 0.18, critDmg: 0.58,
    skills: [SKILLS.WHIRLWIND, SKILLS.PROVOKE, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'warrior', weaponType: 'greatsword',
    archetype: { role: 'Warrior', name: 'Ironvow Fighter', desc: 'A versatile frontliner who can both sweep enemy lines and hold the front when needed.', tags: ['AOE Damage', 'Provoke', 'ATK Buff'] },
  }),

  BRENNA: () => new Hero({
    id: 'brenna', name: 'Brenna Shieldmaiden',
    faction: Faction.ALDRIC, rarity: Rarity.EPIC, affinity: Affinity.FORCE,
    baseHp: 16000, baseAtk: 1350, baseDef: 850, baseSpd: 97,
    critRate: 0.20, critDmg: 0.60,
    skills: [SKILLS.WHIRLWIND, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true, role: 'warrior', weaponType: 'shield',
    archetype: { role: 'Warrior', name: 'Shieldmaiden', desc: 'Aggressive and self-reliant. Sweeps the enemy line while building momentum for a killing blow.', tags: ['AOE Damage', 'Self-Buff'] },
  }),

  LORD_ALDRIC: () => new Hero({
    id: 'lord_aldric', name: 'Lord Aldric',
    faction: Faction.ALDRIC, rarity: Rarity.MYTHICAL, affinity: Affinity.FORCE,
    baseHp: 22000, baseAtk: 1700, baseDef: 1000, baseSpd: 100,
    critRate: 0.25, critDmg: 0.65,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.WHIRLWIND, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing, ARTISAN.tailoring],
    isPlayer: true, role: 'warrior', weaponType: 'warhammer',
    archetype: { role: 'Warrior', name: 'Warlord', desc: 'The iron fist of House Aldric. Raw force backed by relentless offensive pressure on every front.', tags: ['Single Target', 'AOE Damage', 'ATK Buff'] },
  }),

  // ── House Aegira — sworn to Valdris ─────────────────────────────
  MARINA_AEGIRA: () => new Hero({
    id: 'marina_aegira', name: 'Marina of Aegira',
    faction: Faction.AEGIRA, rarity: Rarity.EPIC, affinity: Affinity.MAGIC,
    baseHp: 14200, baseAtk: 1620, baseDef: 640, baseSpd: 101,
    critRate: 0.26, critDmg: 0.62,
    skills: [SKILLS.BLIZZARD, SKILLS.ARCANE_LANCE, SKILLS.ARCANE_SHIELD],
    artisanSkills: [ARTISAN.herbalism],
    isPlayer: true, role: 'mage', weaponType: 'staff',
    archetype: { role: 'Mage', name: 'Tide-Oracle', desc: 'Calls the sea up the beach and the storm down onto it. Speaks first and explains afterwards, if at all.', tags: ['AOE Damage', 'Single Target', 'Shield'] },
    quote: 'Valdris says the gods finished speaking. Valdris has never stood in the water at night.',
    lore: 'Aegira takes its oracles the way other houses take taxes — from whoever the tide picks, whether or not she wanted the work. Marina was fifteen and mending nets when the water started answering her, and the septons of the Salt Colonnade had her in a colonnade robe before the week was out. She has been formally correct with her liege ever since and privately unmoved by them: Valdris doctrine holds that revelation is finished and written down, and Marina has read the books, and knows what is not in them. She carries a trident because the first thing the sea ever gave her was a fisherman\'s tool, and she has never seen the argument for a better one.',
  }),

  GLENNIOS_AEGIRA: () => new Hero({
    id: 'glennios_aegira', name: 'Glennios of Aegira',
    faction: Faction.AEGIRA, rarity: Rarity.EPIC, affinity: Affinity.MAGIC,
    baseHp: 19600, baseAtk: 1180, baseDef: 1120, baseSpd: 89,
    critRate: 0.14, critDmg: 0.48,
    skills: [SKILLS.PROVOKE, SKILLS.IRON_BASTION, SKILLS.ARCANE_SHIELD],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'tank', weaponType: 'spear',
    archetype: { role: 'Tank', name: 'Tide-Shield', desc: 'A colonnade hoplite who treats a shield wall as architecture. Nothing gets past him twice.', tags: ['Provoke', 'DEF Buff', 'Shield'] },
    quote: 'She reads the water. I stand in front of whatever it tells her is coming.',
    lore: 'The Salt Colonnade raises spearmen the way it raises columns — slowly, in ranks, and to outlast the people who ordered them. Glennios came up through the harbour levies and never left the front rank, which in Aegira is less a rank than a vocation. He has no opinion on the oracles and no patience for the argument about them; he was handed a shield, told where the line was, and has been standing on it since. When Marina began speaking for the tide, the septons assigned her a guard and Glennios volunteered before the sentence was finished. He has never explained why, and nobody in the Colonnade has been rude enough to ask.',
  }),

  // ── The Crown — House Hartvane ──────────────────────────────────
  KING_HARTVANE: () => new Hero({
    id: 'king_hartvane', name: 'Kingurt Hartvane',
    faction: Faction.HARTVANE, rarity: Rarity.LEGENDARY, affinity: Affinity.FORCE,
    baseHp: 24500, baseAtk: 1780, baseDef: 1020, baseSpd: 92,
    critRate: 0.28, critDmg: 0.72,
    skills: [SKILLS.HAMMER_ROUND, SKILLS.WARLORDS_RESOLVE, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'warrior', weaponType: 'warhammer',
    archetype: { role: 'Warrior', name: 'Crowned Hammer', desc: 'The seat of Westrun swung like a weapon. Ends fights early and apologises to no one afterwards.', tags: ['Single Target', 'ATK Buff', 'Execute'] },
    quote: 'A crown is not an argument. It is what happens after the argument.',
    lore: 'Hartvane kings are not raised to rule so much as raised to finish things, and Kingurt finished the last war personally, on foot, in the rain, with the hammer he still carries. The septons crowned him in gold and scripture and he has been faintly impatient with both ever since. He knows the four houses call him a blunt instrument. He also knows he is the only man in two centuries to end a war rather than inherit one, and he has never felt the need to say so.',
  }),

  // ── House Roswaine — sworn to Caelwyn ───────────────────────────
  SER_ROSWAINE: () => new Hero({
    id: 'ser_roswaine', name: 'Ser Aldan Roswaine',
    faction: Faction.ROSWAINE, rarity: Rarity.LEGENDARY, affinity: Affinity.SPIRIT,
    baseHp: 19800, baseAtk: 1420, baseDef: 1180, baseSpd: 104,
    critRate: 0.22, critDmg: 0.58,
    skills: [SKILLS.PROVOKE, SKILLS.OATH_OF_THE_WHITE_GROVE, SKILLS.FORTIFY],
    artisanSkills: [ARTISAN.tailoring, ARTISAN.herbalism],
    isPlayer: true, role: 'tank', weaponType: 'sword',
    archetype: { role: 'Tank', name: 'Rose Knight', desc: 'Courtly steel. Holds the line beautifully, and makes certain the right people are watching.', tags: ['Provoke', 'DEF Buff', 'Team Heal'] },
    quote: 'My house has never lost a war. We have simply never been impolite enough to start one.',
    lore: 'The Rosemarch feeds four houses and arms almost none of them, which Roswaine has always considered the more durable arrangement. Aldan was raised on harvest ledgers and wedding contracts before he was handed a sword, and he is better with the first two. He is also genuinely, inconveniently brave — a fact his family finds charming and his liege at Caelwyn finds slightly alarming, since a Roswaine who fights is a Roswaine who might be seen to lose.',
  }),

  HELGA: () => new Hero({
    id: 'helga', name: 'Helga',
    faction: Faction.ALDRIC, rarity: Rarity.LEGENDARY, affinity: Affinity.FORCE,
    baseHp: 26000, baseAtk: 1500, baseDef: 1350, baseSpd: 92,
    critRate: 0.20, critDmg: 0.58,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.IRON_BASTION, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing, ARTISAN.apothecary],
    isPlayer: true, role: 'tank', weaponType: 'mace',
    archetype: { role: 'Tank', name: 'Iron Bulwark', desc: 'A legendary warrior who absorbs damage and grows stronger the longer the fight lasts.', tags: ['Provoke', 'DEF Buff', 'ATK Buff'] },
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
    archetype: { role: 'Warrior', name: 'Spellblade', desc: 'A martial mage who combines precise sword strikes with arcane fire. Neither soldier nor scholar — both.', tags: ['Single Target', 'Burn', 'Physical Damage'] },
  }),

  ELARA: () => new Hero({
    id: 'elara', name: 'Elara Frostweaver',
    faction: Faction.VALDRIS, rarity: Rarity.RARE, affinity: Affinity.MAGIC,
    baseHp: 14500, baseAtk: 1350, baseDef: 720, baseSpd: 99,
    critRate: 0.20, critDmg: 0.60,
    skills: [SKILLS.BLIZZARD, SKILLS.ARCANE_SHIELD],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true, role: 'mage', weaponType: 'staff',
    archetype: { role: 'Mage', name: 'Frost Weaver', desc: 'A crowd control specialist. Freezes enemy formations and shields the team from retaliation.', tags: ['Freeze', 'AOE Damage', 'Party Shield'] },
  }),

  MIRENA: () => new Hero({
    id: 'mirena', name: 'Mirena Ashveil',
    faction: Faction.VALDRIS, rarity: Rarity.RARE, affinity: Affinity.MAGIC,
    baseHp: 12500, baseAtk: 1400, baseDef: 550, baseSpd: 103,
    critRate: 0.22, critDmg: 0.62,
    skills: [SKILLS.FIREBALL, SKILLS.DARK_WAVE],
    artisanSkills: [ARTISAN.tailoring],
    isPlayer: true, role: 'mage', weaponType: 'wand',
    archetype: { role: 'Mage', name: 'Void Mage', desc: 'Combines burning damage with weaken debuffs to soften enemies for the rest of the team.', tags: ['AOE Damage', 'Weaken', 'Burn'] },
  }),

  CAIUS: () => new Hero({
    id: 'caius', name: 'Caius Stormbinder',
    faction: Faction.VALDRIS, rarity: Rarity.EPIC, affinity: Affinity.MAGIC,
    baseHp: 13500, baseAtk: 1700, baseDef: 680, baseSpd: 108,
    critRate: 0.22, critDmg: 0.65,
    skills: [SKILLS.BLIZZARD, SKILLS.DARK_WAVE, SKILLS.ARCANE_SHIELD],
    artisanSkills: [ARTISAN.tailoring],
    isPlayer: true, role: 'mage', weaponType: 'staff',
    archetype: { role: 'Mage', name: 'Storm Binder', desc: 'An offensive mage who hammers enemies with elemental forces while shielding his allies from harm.', tags: ['AOE Damage', 'Freeze', 'Weaken', 'Party Shield'] },
  }),

  ARCHMAGE_KELVAR: () => new Hero({
    id: 'archmage_kelvar', name: 'Archmage Kelvar',
    faction: Faction.VALDRIS, rarity: Rarity.LEGENDARY, affinity: Affinity.MAGIC,
    baseHp: 16000, baseAtk: 2000, baseDef: 750, baseSpd: 112,
    critRate: 0.28, critDmg: 0.72,
    skills: [SKILLS.BLIZZARD, SKILLS.DARK_WAVE, SKILLS.ARCANE_SHIELD],
    artisanSkills: [ARTISAN.tailoring, ARTISAN.apothecary],
    isPlayer: true, role: 'mage', weaponType: 'staff',
    archetype: { role: 'Mage', name: 'Archmage', desc: 'Peak arcane offensive power. Weakens and freezes entire formations without mercy.', tags: ['AOE Damage', 'Freeze', 'Weaken', 'Party Shield'] },
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
    archetype: { role: 'Healer', name: 'Grove Warden', desc: 'Steady healing support anchored in Caelwyn tradition. Single mends and sustained regeneration.', tags: ['Single Heal', 'Continuous Heal'] },
  }),

  LYRETH: () => new Hero({
    id: 'lyreth', name: 'Lyreth Moondrift',
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 13000, baseAtk: 1250, baseDef: 600, baseSpd: 110,
    critRate: 0.28, critDmg: 0.60,
    skills: [SKILLS.CROSSBOW_SHOT, SKILLS.VOLLEY],
    artisanSkills: [ARTISAN.herbalism],
    isPlayer: true, role: 'ranger', weaponType: 'bow',
    archetype: { role: 'Ranger', name: 'Moondrift Archer', desc: 'A fast ranger who applies consistent ranged pressure. Goes early, hits often.', tags: ['Single Target', 'AOE', 'High SPD'] },
  }),

  CAELWYN_HERBALIST: () => new Hero({
    id: 'caelwyn_herbalist', name: 'Caelwyn Herbalist',
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 16000, baseAtk: 850, baseDef: 750, baseSpd: 106,
    skills: [SKILLS.MEND, SKILLS.REVITALIZE],
    artisanSkills: [ARTISAN.herbalism],
    isPlayer: true, role: 'healer', weaponType: 'staff',
    archetype: { role: 'Healer', name: 'Herbalist', desc: 'A quiet field healer who keeps allies standing with steady, patient care.', tags: ['Single Heal', 'Continuous Heal'] },
  }),

  ARENDIAL: () => new Hero({
    id: 'arendial', name: 'Arendial',
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 12500, baseAtk: 1200, baseDef: 620, baseSpd: 114,
    critRate: 0.22, critDmg: 0.58,
    skills: [SKILLS.CROSSBOW_SHOT, SKILLS.VOLLEY],
    artisanSkills: [ARTISAN.herbalism],
    isPlayer: true, role: 'ranger', weaponType: 'bow',
    archetype: { role: 'Ranger', name: 'Grove Archer', desc: 'Combines precise single shots with volley fire to wear down enemy formations from range.', tags: ['Single Target', 'AOE', 'High SPD'] },
  }),

  THRANDYL: () => new Hero({
    id: 'thrandyl', name: 'Thrandyl',
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 15500, baseAtk: 950, baseDef: 820, baseSpd: 98,
    critRate: 0.12, critDmg: 0.50,
    skills: [SKILLS.MEND, SKILLS.REVITALIZE],
    artisanSkills: [ARTISAN.herbalism],
    isPlayer: true, role: 'healer', weaponType: 'staff',
    archetype: { role: 'Healer', name: 'Grove Keeper', desc: 'A gentle but reliable healer. Tends the wounded with patience and restores hope turn by turn.', tags: ['Single Heal', 'Continuous Heal'] },
  }),

  GORUNDAL: () => new Hero({
    id: 'gorundal', name: 'Gorundal',
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 19000, baseAtk: 880, baseDef: 1100, baseSpd: 84,
    critRate: 0.10, critDmg: 0.45,
    skills: [SKILLS.PROVOKE, SKILLS.FORTIFY],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true, role: 'tank', weaponType: 'sword',
    archetype: { role: 'Tank', name: 'Grove Shield', desc: 'A spirit-touched guardian who absorbs punishment and fortifies his position turn after turn.', tags: ['Provoke', 'DEF Buff', 'Endurance'] },
  }),

  EILISTRA: () => new Hero({
    id: 'eilistra', name: 'Eilistra',
    faction: Faction.CAELWYN, rarity: Rarity.EPIC, affinity: Affinity.SPIRIT,
    baseHp: 13500, baseAtk: 1450, baseDef: 680, baseSpd: 116,
    critRate: 0.24, critDmg: 0.65,
    skills: [SKILLS.CROSSBOW_SHOT, SKILLS.VOLLEY, SKILLS.REVITALIZE],
    artisanSkills: [ARTISAN.herbalism],
    isPlayer: true, role: 'ranger', weaponType: 'bow',
    archetype: { role: 'Ranger', name: 'Shadow Archer', desc: 'A versatile archer who deals ranged damage and patches allies mid-battle. Offence and sustain in one.', tags: ['Single Target', 'AOE', 'Healing Support'] },
  }),

  ERON: () => new Hero({
    id: 'eron', name: 'Eron',
    faction: Faction.CAELWYN, rarity: Rarity.EPIC, affinity: Affinity.SPIRIT,
    baseHp: 14500, baseAtk: 1350, baseDef: 760, baseSpd: 106,
    critRate: 0.18, critDmg: 0.60,
    skills: [SKILLS.VERDANT_HEX, SKILLS.RAVENS_CURSE, SKILLS.REVITALIZE],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true, role: 'debuffer', weaponType: 'wand',
    archetype: { role: 'Debuffer', name: 'Poison Debuffer', desc: 'Corrupts enemies with poison while reducing their offensive power. Also sustains allies when needed.', tags: ['Poison', 'ATK Shred', 'Healing Support'] },
  }),

  SYLARA: () => new Hero({
    id: 'sylara', name: 'Sylara the Reviver',
    faction: Faction.CAELWYN, rarity: Rarity.EPIC, affinity: Affinity.SPIRIT,
    baseHp: 15000, baseAtk: 1200, baseDef: 800, baseSpd: 100,
    resistance: 0.35,
    skills: [SKILLS.MEND, SKILLS.MASS_HEAL, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.apothecary],
    isPlayer: true, role: 'healer', weaponType: 'wand',
    archetype: { role: 'Healer', name: 'Battle Medic', desc: 'A combat healer who keeps allies fighting and lifts the whole team when the battle turns against them.', tags: ['Single Heal', 'AOE Heal', 'ATK Buff'] },
  }),

  THERON: () => new Hero({
    id: 'theron', name: 'Theron Greenmarch',
    faction: Faction.CAELWYN, rarity: Rarity.LEGENDARY, affinity: Affinity.SPIRIT,
    baseHp: 18000, baseAtk: 1350, baseDef: 900, baseSpd: 108,
    critRate: 0.20, critDmg: 0.60, resistance: 0.40,
    skills: [SKILLS.MEND, SKILLS.MASS_HEAL, SKILLS.REVITALIZE],
    artisanSkills: [ARTISAN.herbalism, ARTISAN.apothecary],
    isPlayer: true, role: 'healer', weaponType: 'staff',
    archetype: { role: 'Healer', name: 'Legendary Healer', desc: 'The pinnacle of Caelwyn healing. Master of sustained party restoration across every situation.', tags: ['Single Heal', 'AOE Heal', 'Continuous Heal'] },
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
    archetype: { role: 'Tank', name: 'Hollow Guard', desc: 'A void-touched tank who absorbs punishment and disrupts enemies with dark energy.', tags: ['Provoke', 'AOE Debuff', 'Void Resistance'] },
  }),

  SERIX: () => new Hero({
    id: 'serix', name: 'Serix the Wretched',
    faction: Faction.MORDAINE, rarity: Rarity.RARE, affinity: Affinity.VOID,
    baseHp: 15000, baseAtk: 1300, baseDef: 750, baseSpd: 92,
    critRate: 0.20, critDmg: 0.60,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.CRUSH],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'warrior', weaponType: 'greatsword',
    archetype: { role: 'Warrior', name: 'Forsaken Blade', desc: 'A heavy-hitting void warrior who overpowers enemies through sheer relentless force.', tags: ['Single Target', 'High Damage', 'Physical Damage'] },
  }),

  NYXARA: () => new Hero({
    id: 'nyxara', name: 'Nyxara Voidwalker',
    faction: Faction.MORDAINE, rarity: Rarity.RARE, affinity: Affinity.VOID,
    baseHp: 13000, baseAtk: 1250, baseDef: 650, baseSpd: 105,
    resistance: 0.30, accuracy: 0.10,
    skills: [SKILLS.SLASH, SKILLS.DARK_WAVE],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true, role: 'debuffer', weaponType: 'dagger',
    archetype: { role: 'Debuffer', name: 'Void Walker', desc: 'Slips through shadows to weaken enemies with void corruption. Reduces their power before they can act.', tags: ['Weaken', 'ATK Debuff', 'Physical Damage'] },
  }),

  MORD: () => new Hero({
    id: 'mord', name: 'Mord the Forsaken',
    faction: Faction.MORDAINE, rarity: Rarity.EPIC, affinity: Affinity.VOID,
    baseHp: 13000, baseAtk: 1650, baseDef: 620, baseSpd: 118,
    critRate: 0.35, critDmg: 0.85,
    skills: [SKILLS.BACKSTAB, SKILLS.MULTI_STAB],
    artisanSkills: [ARTISAN.leatherworking],
    isPlayer: true, role: 'ranger', weaponType: 'crossbow',
    archetype: { role: 'Ranger', name: 'Void Stalker', desc: 'A high-crit assassin who poisons targets and shreds them with rapid multi-hit strikes.', tags: ['Poison', 'Multi-Hit', 'High Crit'] },
  }),

  THALRIC: () => new Hero({
    id: 'thalric', name: 'Thalric Vaelorian',
    faction: Faction.MORDAINE, rarity: Rarity.EPIC, affinity: Affinity.VOID,
    baseHp: 22000, baseAtk: 900, baseDef: 1400, baseSpd: 82,
    critRate: 0.10, critDmg: 0.40, resistance: 0.35,
    skills: [SKILLS.PROVOKE, SKILLS.IRON_BASTION, SKILLS.SLASH],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'tank', weaponType: 'sword',
    archetype: { role: 'Tank', name: 'Void Bulwark', desc: 'An immovable void shield who draws all fire and fortifies his position against anything.', tags: ['Provoke', 'High DEF', 'DEF Buff'] },
  }),

  GRIBZAK: () => new Hero({
    id: 'gribzak', name: 'Gribzak Gearvein',
    faction: Faction.VALDRIS, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 11500, baseAtk: 970, baseDef: 560, baseSpd: 102,
    critRate: 0.15, critDmg: 0.50,
    skills: [SKILLS.CRYSTAL_STRIKE, SKILLS.EMERGENCY_PATCH, SKILLS.SCRAP_SURGE],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'mage', weaponType: 'wand',
    archetype: { role: 'Support Mage', name: 'Crystal Artificer', desc: 'A hybrid who deals damage while patching allies mid-battle. Debuffs enemy ATK as a bonus.', tags: ['Single Target', 'Ally Heal + DEF', 'ATK Debuff'] },
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
    archetype: { role: 'Warrior', name: 'Arcane Warlord', desc: 'A hammer-wielding battle mage who hits everything and then shields his allies. Damage and protection in one.', tags: ['Single Target', 'AOE Stun', 'Party DEF Shield'] },
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
    archetype: { role: 'Warrior', name: 'Runic Brawler', desc: 'Hits everything enthusiastically. Stuns enemy lines and becomes harder to kill the longer the fight lasts.', tags: ['Single Target', 'AOE Stun', 'Self-Sustain'] },
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
    archetype: { role: 'Debuffer', name: 'The Witch', desc: 'Corrupts everything. Strips ATK, DEF, and SPD simultaneously from the entire enemy formation.', tags: ['DEF Shred', 'ATK Shred', 'Speed Control', 'AOE Debuff'] },
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
    archetype: { role: 'Warrior', name: 'Blade Master', desc: 'Self-reliant precision fighter. Builds momentum through self-buffs, then sweeps the field or picks apart a single target.', tags: ['Single Target', 'AOE Damage', 'ATK + SPD Buff'] },
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
    archetype: { role: 'Mage', name: 'Undying Mage', desc: 'A void-touched mage of immense power who burns and freezes enemy formations with ruthless efficiency.', tags: ['AOE Damage', 'Burn', 'Freeze', 'Weaken'] },
  }),

  AURELAN: () => new Hero({
    id: 'aurelan', name: 'Aurelan Dawnspire',
    faction: Faction.ALDRIC, rarity: Rarity.MYTHICAL, affinity: Affinity.FORCE,
    baseHp: 22000, baseAtk: 2100, baseDef: 1000, baseSpd: 98,
    critRate: 0.30, critDmg: 0.80,
    skills: [SKILLS.HEAVY_STRIKE, SKILLS.WHIRLWIND, SKILLS.BATTLE_CRY],
    artisanSkills: [ARTISAN.blacksmithing, ARTISAN.tailoring],
    isPlayer: true, role: 'warrior', weaponType: 'greatsword',
    archetype: { role: 'Warrior', name: 'Dawn Champion', desc: 'A mythical warrior of raw offensive might. Sweeps entire formations while buffing allies for a decisive push.', tags: ['Single Target', 'AOE Damage', 'ATK Buff'] },
  }),

  JADE_DRAGONFORGE: () => new Hero({
    id: 'jade_dragonforge', name: 'Jade Dragonforge',
    faction: Faction.ALDRIC, rarity: Rarity.MYTHICAL, affinity: Affinity.FORCE,
    baseHp: 20000, baseAtk: 2350, baseDef: 950, baseSpd: 96,
    critRate: 0.32, critDmg: 0.85,
    skills: [SKILLS.DRAGON_LANCE, SKILLS.SEARING_DIVE, SKILLS.FORGE_WRATH],
    artisanSkills: [ARTISAN.blacksmithing],
    isPlayer: true, role: 'warrior', weaponType: 'greatsword',
    archetype: { role: 'Warrior', name: 'Dragon Warrior', desc: 'Her dragon amplifies everything. Burns entire formations while she fortifies herself for a devastating single kill.', tags: ['Single Target', 'AOE Burn', 'Self-Sustain'] },
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
    archetype: { role: 'Mage', name: 'The Absolute', desc: 'Unmatched single-target obliteration. Weakens, stuns, and then ends the target with a finality that leaves no argument.', tags: ['Single Target Burst', 'Stun', 'Weaken', 'ATK Shred'] },
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
    archetype: { role: 'Champion', name: 'First Lord', desc: 'The anchor of the White Grove. Shreds defences, shields allies, and passes final judgment when the moment demands it.', tags: ['DEF Shred', 'Party Shield + Heal', 'AOE Debuff', 'Execute'] },
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
    archetype: { role: 'Champion', name: 'Blood Arbiter', desc: 'Every strike drains. Every decree weakens. He sustains himself entirely on what he takes from others.', tags: ['Vampiric Sustain', 'ATK Shred', 'Weaken', 'Poison Execute'] },
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
    archetype: { role: 'Warrior', name: 'Frost Jarl', desc: 'A relentless raider who leads every charge with unrelenting force. Takes no prisoners, asks no questions.', tags: ['AOE Damage', 'Single Target', 'ATK Buff'] },
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
    archetype: { role: 'Tank', name: 'Shield Wall', desc: 'A defensive warrior who holds the line for those behind her. Taunts, fortifies, and lifts her allies.', tags: ['Provoke', 'DEF Buff', 'ATK Buff'] },
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
    archetype: { role: 'Mage', name: 'Astral Mage', desc: 'An ancient cosmic force who shreds enemy defences and controls the battle\'s tempo through speed and immunity.', tags: ['DEF Shred', 'Speed Boost', 'Immunity', 'AOE Damage'] },
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
    archetype: { role: 'Debuffer', name: 'Blood Ancient', desc: 'An ancient vampire lord who drains enemy ATK and retreats into shadow to recover. Patient and relentless.', tags: ['ATK Shred', 'Self-Sustain', 'Immunity'] },
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
  { key: 'ARENDIAL',            rarity: 'Rare' },
  { key: 'THRANDYL',            rarity: 'Rare' },
  { key: 'GORUNDAL',            rarity: 'Rare' },
  { key: 'ZARETH',              rarity: 'Rare' },
  { key: 'SERIX',               rarity: 'Rare' },
  { key: 'NYXARA',              rarity: 'Rare' },
  { key: 'GRIBZAK',             rarity: 'Rare' },
  // ── Epic ─────────────────────────────────────────────────────────
  { key: 'EILISTRA',            rarity: 'Epic' },
  { key: 'ERON',                rarity: 'Epic' },
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
  { key: 'MARINA_AEGIRA',       rarity: 'Epic' },
  { key: 'GLENNIOS_AEGIRA',     rarity: 'Epic' },
  // ── Legendary ────────────────────────────────────────────────────
  // LORD_ALDRIC is reputation-gated — unlocked via House Aldric at Exalted standing
  { key: 'HELGA',               rarity: 'Legendary' },
  { key: 'ARCHMAGE_KELVAR',     rarity: 'Legendary' },
  { key: 'THERON',              rarity: 'Legendary' },
  { key: 'SERAPHEL',            rarity: 'Legendary' },
  { key: 'KYVER',               rarity: 'Legendary' },
  { key: 'ARRI',                rarity: 'Legendary' },
  { key: 'SER_ROSWAINE',        rarity: 'Legendary' },
  // KING_HARTVANE is deliberately absent — you do not pull a crowned king out of a
  // portal. He rides with you or he does not. Gate condition still to be decided.
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
