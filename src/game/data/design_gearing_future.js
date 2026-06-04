/**
 * Future Enhancements — Gearing & Progression Systems
 * Design document for planned systems beyond the current forge/orb implementation.
 * Not yet implemented. Living design reference.
 */

export const GEARING_FUTURE = {

  // ── Soul Weapons ────────────────────────────────────────────────

  soul_weapons: {
    name: 'Soul Weapons',
    unlocked_by: 'Defeating an Ancient Noble in a Mythical Dungeon (DLC)',
    premise: `Soul Weapons are not gear. They have no stats.
              They bind to a unit and enhance what their skills fundamentally do.
              Not bigger numbers — different behaviour.
              A defensive skill becomes a trap. A heal removes something that shouldn't be there.
              A void ability stops pretending and becomes the real thing.`,

    star_progression: {
      desc: `Starred up through Mythical Dungeon clears, codex completion and companionship bonds.
             Only one Soul Weapon can be actively starred-up at a time.
             You are telling one unit's story at a time — not optimising a spreadsheet.`,
      stars: [
        '1 ★ — Base enhancement. The skill does what it always did, with more intent.',
        '2 ★ — A secondary effect awakens.',
        '3 ★ — The skill evolves in behaviour, not just magnitude.',
        '4 ★ — Team-wide implications begin to emerge.',
        '5 ★ — Becomes something gear alone cannot replicate.',
      ],
    },

    key_insight: `Raw damage scaling makes Soul Weapons feel incremental on attack units.
                 On a barrier or support unit they become game-breaking in the best way.
                 The meta discovery — putting a Soul Weapon on a support instead of a damage dealer —
                 is the moment players feel like geniuses.`,

    flagship_bonus: {
      name:  'Bounce Back',
      desc:  'Adds reflect to all shield skills — 75% of absorbed damage returned to the attacker.',
      implication: `Against Ancient Nobles who hit like freight trains they destroy themselves on your barrier.
                   You don't block the hit. You invite it.
                   At 5 stars a barrier cannot be broken in a single hit — it must be chipped.`,
    },
  },

  // ── Artifacts ───────────────────────────────────────────────────

  artifacts: {
    name: 'Artifacts',
    premise: `A dedicated equipment slot separate from gear and Soul Weapons.
              Artifacts define how a unit interacts with the meta — not their raw power.
              Same unit, different artifact, completely different PVP role.
              Artifacts are house-bound. A unit can only equip artifacts from their own faction.
              Brenna Shieldmaiden doesn't carry a spellbook.
              She carries something forged, worn and earned through violence.`,

    house_artifacts: {

      aldric: {
        theme:    'Iron, fire, endurance — forged, not gifted',
        examples: [
          { name: 'Iron Vanguard',       desc: 'Negates reflect damage entirely. Aldric brute force compositions answer the barrier meta without changing their identity.' },
          { name: 'War Banner Fragment', desc: 'The first banner ever raised under Aldric colours. Increases team morale — adjacent units gain passive damage reduction.' },
          { name: 'Shieldwall Fragment', desc: 'A piece of the first wall House Aldric ever built. Carried into every battle. Barrier skills remember what they were built for.' },
          { name: 'Siege Chain',         desc: 'Reduces enemy speed when Aldric units are struck. The longer the fight the slower they become.' },
        ],
      },

      valdris: {
        theme:    'Knowledge, arcane focus — surgical and precise',
        examples: [
          { name: 'Runic Seal',      desc: 'Dispels one buff from the target before a skill lands. No reflect if there is no barrier.' },
          { name: 'Spell Mirror',    desc: 'A fraction of magic damage dealt is stored. Released as a burst when the mirror is full.' },
          { name: 'Arcane Lens',     desc: 'Reveals hidden buffs and debuffs on enemies. Counters compositions built around invisible effects.' },
          { name: 'Codex Fragment',  desc: 'Each codex entry unlocked increases this artifact\'s potency. Knowledge is power, literally.' },
        ],
      },

      caelwyn: {
        theme:    'Nature, memory, endurance of living things',
        examples: [
          { name: 'Grove Totem',      desc: 'Doubles reflect damage on barrier skills. Caelwyn wants to be hit. The grove remembers every blow.' },
          { name: 'Root-Bound Shield', desc: 'Barrier regenerates a portion of itself each turn if not fully broken. Must be chipped to destruction.' },
          { name: 'Memory Bark',      desc: 'Absorbs one debuff per battle, converting it into a heal over time. Ancient trees have survived worse.' },
          { name: 'Ancient Seed',     desc: 'On unit death, plants a seed. After two turns a new barrier springs on the nearest ally.' },
        ],
      },

      mordaine: {
        theme:    'Void, shadow, corruption — turn strength into weakness',
        examples: [
          { name: 'Void Anchor',     desc: 'Corrupts enemy barriers on contact — converts reflect damage into damage-over-time on the shielder instead.' },
          { name: 'Soul Chain',      desc: 'Binds attacker and target HP together for two turns. Damage dealt is split both ways.' },
          { name: 'Rift Fragment',   desc: 'Teleports the unit to the back of the turn order but next action ignores all barriers.' },
          { name: 'Curse Binding',   desc: 'Applies a stacking curse each time the unit is hit. At three stacks the attacker is silenced.' },
        ],
      },

    },

    pvp_meta_note: `Each house has a valid answer to the barrier/reflect meta:
                   Aldric  — negate it.
                   Valdris — strip it before swinging.
                   Caelwyn — embrace it, build to be hit.
                   Mordaine — corrupt it, turn their strength against them.
                   No house is locked out. No house plays identically.`,
  },

  // ── House-Locked Content ─────────────────────────────────────────

  house_content: {
    name: 'House-Locked Dungeons & Expeditions',
    premise: `Content designed around specific faction units.
              You can bring the wrong faction — if you are overlevelled,
              your Soul Weapons are deep enough, or your artifacts are maxed,
              you can nuke through it. The game doesn't stop you.
              It just makes you earn the disrespect.
              Bring the right house and it is hard but fair.
              Bring the wrong house and you'd better be broken.`,

    dungeons: [
      {
        name:     'Aldric\'s Iron Gauntlet',
        faction:  'House Aldric',
        mechanic: 'Reflect damage everywhere. Barrier mechanics punish magic users. Sustained physical pressure rewarded.',
        reward:   'Iron Covenant artifacts — gauntlets, war banners, siege chains.',
      },
      {
        name:     'Valdris Arcane Labyrinth',
        faction:  'House Valdris',
        mechanic: 'Enemies resist physical damage completely. Burst magic and dispel compositions thrive.',
        reward:   'Arcane Codex artifacts — runic seals, spell mirrors, arcane lenses.',
      },
      {
        name:     'Caelwyn\'s Ancient Grove',
        faction:  'House Caelwyn',
        mechanic: 'Enemies regenerate every turn. Pure burst compositions get outlasted. Sustained damage and healers required.',
        reward:   'Grove Totem artifacts — root shields, memory bark, ancient seeds.',
      },
      {
        name:     'Mordaine\'s Void Rift',
        faction:  'House Mordaine',
        mechanic: 'Corrupts non-void skills progressively the longer the fight goes. Fast void compositions thrive. Slow tanky teams dissolve.',
        reward:   'Void artifacts — soul anchors, rift fragments, curse bindings.',
      },
    ],

    progression_loop: `You need Aldric units to farm Aldric artifacts.
                      Aldric artifacts make your Aldric units stronger.
                      Stronger Aldric units push deeper Aldric content.
                      Deeper content drops rarer Aldric relics.
                      Four parallel endgame progression lanes running simultaneously.
                      Players naturally specialise. Knowledge gets traded.
                      Faction builds get compared. Community forms around identity, not tier lists.`,

    design_note: `Like Expedition de Grâce — content that strongly suggests the right approach
                 without hard-locking you out. The reward for bringing the right faction
                 is a fair fight. The reward for nuking through with the wrong faction
                 is the satisfaction of doing something you weren't supposed to be able to do.
                 Both are valid. Only one scales into the late game.`,
  },

  // ── PVP Implications ─────────────────────────────────────────────

  pvp: {
    name: 'PVP — Speed Management & Strip Meta',
    premise: `Barrier reflect at 75% means attackers need to strip buffs before swinging.
              Strip skills need to move fast.
              Speed management becomes the PVP meta.
              Turn order matters more than raw attack.
              Going first means nothing if your stripper moves before your own tank has a shield up.`,

    compositions: [
      { name: 'Strip First',    desc: 'Valdris-led. Dispel the barrier, then detonate. Clean and surgical.' },
      { name: 'Bait',          desc: 'Built to look weak. Barrier reflects wipe the attacker\'s front line when they commit.' },
      { name: 'Negate Brute',  desc: 'Aldric Iron Vanguard artifact. No reflect tax. Pure sustained damage.' },
      { name: 'Corrupt',       desc: 'Mordaine. Turn the barrier into a liability for the unit wearing it.' },
      { name: 'Double Reflect', desc: 'Caelwyn Grove Totem. Suicidal against strippers. Devastating against anyone else.' },
    ],

    note: `The player who learned speed management from Nightmare raids
           doesn't need a PVP tutorial. They already speak the language.
           Raid design and PVP design share the same grammar.`,
  },

  // ── Recruitment System ───────────────────────────────────────────

  recruitment: {
    name: 'Lore-Based Recruitment',

    philosophy: `Recruitment should not be based on gold.
                You are not buying a squad. You are earning the right to tell their story.
                A unit doesn't join because you paid them.
                They join because you understand enough of the world to deserve their presence.
                Lord Aldric doesn't swear to just anyone with gold.
                But someone who knows what Westrun actually is?
                That's a different conversation.
                The currency of recruitment is knowledge. It is lore points.`,

    lore_points: {
      sources: [
        'Exploration travelers — bards, merchants, wandering soldiers',
        'Dungeon clears — the deeper you go the more you learn',
        'Codex fragment unlocks',
        'Siege victories — you learn a house by fighting them',
        'Companionship bond discoveries',
      ],
      tension: `Lore points spent on recruitment cannot be spent unlocking deeper codex entries.
               The choice between summoning now and understanding more first
               is a choice with personality behind it.
               Rushing recruitment means missing context.
               Patience means arriving with the full picture.`,
    },

    progression_summon: {
      desc: `Inspired by Raid\'s progression summon system.
             The more lore points invested in a specific faction
             the higher the pull rates for that faction\'s units.
             You are not chasing a banner.
             You are following a story and the story brings people to you.`,
      example: `Reading Caelwyn codex fragments → Caelwyn units appear more frequently.
               Understanding House Mordaine\'s true history → Void unit rates increase.
               The game rewards the curious with the units that match their curiosity.`,
    },

    void_gate: `You cannot recruit Mordaine units until you have spent enough lore
               understanding them. The game will not let you call them
               until you have earned the perspective to see them clearly.
               That is not a progression wall. That is the story working.
               By the time a Void unit joins your roster
               you already know why they are here.
               They are not a pull. They are a conclusion.`,

    core_feeling: `Every squad is a biography.
                  The units you have tell the story of what you chose to understand.
                  Two players at the same level with completely different rosters
                  because they followed completely different stories.
                  No meta can map that. No tier list can rank it.
                  It is yours.`,
  },

  // ── Faction Bonuses ──────────────────────────────────────────────

  faction_bonuses: {
    name: 'Faction Bonuses & Cross-Faction Resonance',

    philosophy: `The game begins by asking you to recruit YOUR squad.
                Not the meta squad. Not the optimal squad.
                The units that spoke to you — the ones whose lore you read,
                whose design you liked, whose story made you want to see more.
                Faction bonuses reward that loyalty without punishing diversity.
                No player should be forced into a meta.
                Every composition should feel like a valid personal expression.
                Like the Picto system in Claire Obscure Expedition 33 —
                the reward isn't following the optimal path,
                it's discovering YOUR path works better than anyone expected.`,

    base_bonuses: {
      desc: 'Running multiple units of the same faction grants passive bonuses to the whole team.',
      tiers: [
        '2 units of same faction — minor passive (e.g. +5% ATK for Aldric, +5% barrier strength for Caelwyn)',
        '3 units — moderate passive + a faction-specific effect unlocks',
        '4 units — strong passive + faction identity skill available',
        '5 units — full faction bonus, maximum effect, faction aura visible in battle',
      ],
    },

    cross_faction_resonance: {
      name: 'Resonance Artifacts',
      desc: `Artifacts that allow one faction\'s bonus to bleed into allied units of a different faction.
             Not a full transfer — a bridge. An echo of the bond between houses.`,

      example: {
        setup:   '3 House Aldric units, 2 House Mordaine units',
        artifact: 'Faction Resonance artifact equipped on one Aldric unit',
        result:  `The two Void units inherit a portion of the Aldric faction bonus.
                 The Aldric core amplifies. The Void units gain something they shouldn't have.
                 The composition becomes something no tier list predicted.`,
        flavour: 'The Unlikely Banner alliance made real on the battlefield.',
      },

      design_intent: `This prevents the meta from ever fully resolving.
                     Pure 5-faction comps are powerful but predictable.
                     Bridge compositions are unpredictable and deeply personal.
                     Player A runs 5 Aldric. Player B runs 3 Aldric + 2 Void with a resonance artifact.
                     Neither is wrong. Both are dangerous. Only one surprises people.`,
    },

    no_reward_unjustified: `Every unit has a faction. Every faction has bonuses.
                           Every bonus can be bridged, amplified or redirected through artifacts.
                           A unit that feels weak in isolation becomes a lynchpin in the right composition.
                           A bad unit for player A is a game changer for player B.
                           The Rare nobody wanted becomes the bridge that makes everything click.
                           Tier lists can map raw stats. They cannot map this.
                           Communities discover it together. That is the point.`,
  },

}
