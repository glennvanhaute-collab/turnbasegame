/**
 * DLC: Westrun Overrun
 * Design document — concepts and systems planned for the first expansion.
 * Not yet implemented. This file is a living design reference.
 */

export const DLC_DESIGN = {

  title:    'Westrun Overrun',
  trigger:  'Unlock Valerius Dawnchaser (Ancient · Astral)',

  premise: `
    The four houses of Westrun have spent generations competing, sieging, and politicking.
    Then Valerius Dawnchaser arrives — Ancient, Astral, outside every faction — and the message is clear:
    whatever is coming doesn't care about your political games.

    The threat originates from beyond the known world, tied to a lost ancient civilisation
    whose magical barriers, knowledge and crystals have been scattered across time and space.
    Remnants of that civilisation have been hiding in plain sight the entire game:
    Edran's ancient fire stone, the Void Sanctum built between worlds,
    Lord Vaeric's centuries-long sleep — all connected.

    Valerius has spent his existence chasing fragments of that lost knowledge. Hence: Dawnchaser.
    He arrives in Westrun because he knows what is coming, and he knows Westrun is next.
  `,

  narrative_pivot: `
    Everything the player built — the sieges, the rivalries, the faction tensions —
    suddenly feels small. The four houses that were enemies are now just people trying to survive.
    The Void faction the player learned to understand is not the threat.
    They never were.

    The real threat makes House Mordaine look like a misunderstanding.
  `,

  // ── Key Characters ─────────────────────────────────────────────

  characters: {

    valerius_dawnchaser: {
      role:    'DLC Unlock Trigger & Mentor',
      desc:    `Ancient · Astral. Has been watching Westrun long enough to know when to step in.
               Carries knowledge of the Astral Forge and the lost civilisation's barrier magic.
               Does not align with any house. Answers only to what is coming.`,
      arrival: `Valerius does not announce himself. He simply appears in your camp one morning.
               He walks past your Legendaries, past your Mythicals, past everyone with a title.
               He stops at the blacksmith.
               "You. You'll do."`,
    },

    camp_blacksmith: {
      role:    'The Unexpected Legendary — Astral Forgemaster',
      rarity_start:  'Common',
      rarity_end:    'Legendary',
      name_placeholder: 'TBD (Jef is on the table)',
      desc:    `Has been quietly working the camp forge since the beginning.
               No faction allegiance. No political agenda. Uncorrupted hands.
               Valerius doesn't need a master craftsman — he needs someone willing
               to learn something that shouldn't exist anymore.
               The Legendaries had too many assumptions. The blacksmith had none.`,
      arc:     `The common unit nobody looked at twice becomes the most important person in Westrun.
               Not because of power — because of openness.
               Ascends to Legendary Astral Forgemaster upon completing the Astral Forge questline.`,
    },

  },

  // ── New Systems ─────────────────────────────────────────────────

  systems: {

    defense_mechanic: {
      name: 'Territory Defense',
      desc: `While your main team pushes DLC campaign zones, random attacks hit your territories.
             Your bench units — the ones running camp plots — become your last line of defense.
             A second team composition matters for the first time.
             The 15 "useless" units are now defending House Caelwyn's eastern gate.`,
    },

    astral_forge: {
      name:      'Astral Forge',
      unlocked_by: 'Valerius Dawnchaser + camp blacksmith ascension',
      desc:      `A completely separate crafting tier. Not an upgrade to the regular Forge — a different wall entirely.
                 Materials do not drop from Westrun dungeons.
                 They are carried by the invading threat itself — enemies drop what you need to fight them.
                 The threat is funding its own counter.`,
      materials: `Astral Crystals — remnants of the lost civilisation, present in the world the entire time
                 but unrecognised. Found in DLC zones and dropped by invasion enemies.`,
      output:    `Gear that does things the regular Forge cannot roll.
                 Not necessarily more powerful — differently powerful.
                 Opens a new dimension of itemisation rather than raising the existing ceiling.`,
    },

    barrier_magic: {
      name: 'Ancient Barrier System',
      desc: `Magical barriers from the lost civilisation, forgotten over time.
             The knowledge didn't die — it fell out of reach.
             Valerius teaches the player how to use the recovered crystals to rebuild them.
             Protects camp plots and territories during invasion events.
             Upgradeable through the Astral Forge.`,
    },

  },

  // ── Design Notes ────────────────────────────────────────────────

  alliances: {

    iron_and_void: {
      houses:  ['House Aldric', 'House Mordaine'],
      name:    'The Unlikely Banner',
      desc:    `The soldier who never forgot the mud and the outcasts who were driven into it.
               They don't need a speech. They don't need a ceremony.
               Aldric looks at what House Mordaine actually is — not what the stories say —
               and sees the same thing he saw in Garrett's eyes.
               People who kept going when the world told them to stop.
               The Void units don't trust easily. But they recognise when someone sees them clearly.
               This alliance doesn't form through politics. It forms through that recognition.`,
      unlocks: 'Combined force/void combat synergies. Mordaine units gain access to Aldric camp infrastructure. Aldric units gain access to Void resource nodes.',
    },

    memory_and_knowledge: {
      houses:  ['House Caelwyn', 'House Valdris'],
      name:    'The Library of the High Wizards',
      desc:    `House Valdris has held fragments of the lost civilisation for generations.
               Scrolls, artefacts, incomplete theorems about barrier magic and astral materials.
               They could read the words but not hear what the words were saying.
               House Caelwyn doesn't read ancient history. They *are* ancient history.
               Every grove, every root system, every stone in their territory holds living memory
               of what existed before Westrun had a name.
               Together they can finally interpret what Valdris collected and what Caelwyn remembers.
               The Library of the High Wizards becomes the first place in Westrun
               where the lost civilisation's knowledge is fully reconstructed.
               Edran's fire stone was not an anomaly. It was a catalogue entry.`,
      unlocks: 'Access to the Library — a new lore discovery system that accelerates codex fragment collection. Caelwyn and Valdris units gain shared research bonuses. Barrier magic upgrades become available earlier.',
    },

  },

  mythical_dungeons: {
    name:       'Mythical Dungeons',
    upgrade_of: 'Nightmare Dungeons',
    trigger:    'DLC 1 or DLC 2 active',
    desc:       `Nightmare dungeons don't just scale harder in the DLC — they transform.
                The Ancient Nobles have descended into the deepest zones.
                What was once the hardest content in Westrun is now their waiting room.`,

    lore_dungeon_warning: {
      name:    'Lore Dungeon Gate',
      desc:    `Before entering a Mythical Dungeon flagged as lore-specific,
               the player receives a warning screen:

               "This dungeon is tied to events in the Codex.
                Your team composition may affect what unfolds inside.
                Are you certain you don't want to adjust your party?"

               [ Adjust Team ]   [ Enter Anyway ]

               If the player opens the Codex from this screen,
               relevant entries glow faintly with a contextual hint —
               not a spoiler, just a thread to pull.
               The hint never names a unit directly.
               It speaks in the language of the lore itself.

               Example hint for Edran's entry:
               "His fire has been here before."

               The player who did the reading connects the dots.
               The player who didn't gets a clean fight with no special dialogue.
               Both experiences are complete. Only one gets the full story.`,
    },

    soul_weapon_encounter: {
      name:    'The Recognition',
      trigger: 'Fighting an Ancient Noble with Edran Ashveil in your party',
      dialogue: `"You dare use my own weapon against me?"`,
      meaning: `The ancient fire stone Edran found in the ruins was never lost.
               It was left there deliberately, or taken from its owner long ago.
               The Ancient Noble recognises it instantly — not the stone itself,
               but what it does in the hands of someone wielding it.
               Edran didn't discover a relic. He found a Soul Weapon.
               And without knowing it, he spent two winters teaching Lord Aldric
               to wield something that belonged to one of the oldest beings in existence.
               The reason Aldric could hold it when Edran couldn't?
               The same reason Valerius chose the blacksmith over the Legendaries.
               Uncorrupted hands. No assumptions. Just willingness.`,
    },

    soul_weapons: {
      name:    'Soul Weapons',
      unlocked_by: 'Defeating an Ancient Noble in a Mythical Dungeon',
      desc:    `Soul Weapons are not gear. They do not have stats.
               They cannot be compared on a spreadsheet or optimised through the forge.
               They exist in a different dimension of power entirely.

               A Soul Weapon binds to a unit and enhances every skill that unit possesses.
               Not by adding damage. By changing what the skill *does*.
               A basic slash becomes something with intent behind it.
               A heal doesn't just restore HP — it removes something that shouldn't be there.
               A void ability stops pretending to be darkness and becomes the real thing.

               The longer a unit carries their Soul Weapon the deeper the bond grows.
               There is no upgrade path. There is no crafting recipe.
               You earn them by facing what should not be beatable
               and walking out the other side.`,
      star_progression: {
        desc: `Soul Weapons grow through repeated Mythical Dungeon clears, codex completion
               and companionship bonds — not gold or materials.
               Only one Soul Weapon can be actively starred-up at a time.
               The bond requires focus. You are telling one unit's story at a time.`,
        stars: [
          '1 ★ — Base enhancement. The skill does what it always did, with more intent behind it.',
          '2 ★ — A secondary effect awakens. Subtle but present.',
          '3 ★ — The skill evolves in behaviour, not just magnitude.',
          '4 ★ — Team-wide implications begin to emerge.',
          '5 ★ — The skill becomes something that cannot be replicated by gear alone.',
        ],
      },

      support_example: {
        unit:   'Barrier / Shield supports',
        why:    `Raw damage scaling on attack units makes Soul Weapons feel incremental.
                On a support unit that adds barriers — the enhancement becomes game-breaking
                in the best possible way. The bigger the enemy hits, the harder they punish themselves.`,
        soul_weapon_bonus: 'Adds bounce back to shield skills — reflect 75% of absorbed damage back to the attacker.',
        implication: `Against Ancient Nobles who hit like freight trains:
                     they are literally destroying themselves on your barrier.
                     A defensive skill becomes a baited trap.
                     You don't block the hit. You invite it.`,
        five_star_note: `At 5 stars a barrier cannot be broken in one hit.
                        It must be chipped. In the dual DLC two-front war scenario
                        a 5 star barrier support is the difference between surviving and not.`,
      },

      design_note: `Soul Weapons are a pure skill enhancement system with zero stat inflation.
                   They make your existing kit feel different, not numerically superior.
                   This preserves balance while giving endgame players a meaningful new layer.
                   Every Ancient Noble drops a Soul Weapon specific to their identity —
                   the player who understands the lore will know which unit it belongs to
                   before the tooltip even loads.`,
    },

  },

  design_notes: [
    'Valerius arriving recontextualises the entire base game in hindsight.',
    'The Void faction arc pays off here — they are not the enemy, they are potential allies.',
    'Garrett\'s revenge arc and Aldric\'s leadership both matter in the defense meta.',
    'Companionship bonds unlocked in the base game carry bonus weight in DLC defense teams.',
    'The blacksmith ascension should feel earned — players who assigned them to the forge early get narrative payoff.',
    'Astral materials should never drop in base game zones — the separation must be clean.',
    'The lost civilisation backstory connects: Edran\'s fire stone, Void Sanctum, Vaeric\'s sleep.',
    'Valerius knows things about every Ancient unit that the player doesn\'t yet.',
  ],

}

/**
 * DLC 2: Blood Sacrifice
 * Unlocked by: completing Lord Vaeric Corvayne's full lore codex.
 */
export const DLC_BLOOD_SACRIFICE = {

  title:   'Blood Sacrifice',
  trigger: 'Full codex completion of Lord Vaeric Corvayne',

  premise: `
    Lord Vaeric's awakening doesn't just restore one Ancient Noble.
    It restores the memory of what they were.

    There were others. A council of Ancient Nobles who watched over Westrun
    from above — not as rulers, not as gods, but as custodians who considered
    the houses of Westrun their personal responsibility.
    They meddled. They corrected. They descended when things fell below their standard.
    Then they disappeared. Nobody knows why. Not even Vaeric.

    Now something has called them back.
    And Westrun is not what they left behind.
  `,

  mechanical_impact: `
    The moment the DLC triggers, every dungeon in the base game scales up one full difficulty tier.
    Easy becomes Medium. Medium becomes Hard. Hard becomes Nightmare.
    Nightmare becomes something that doesn't have a name yet.

    The Ancient Nobles are not attacking Westrun.
    They are simply present — and their presence warps the world around them.
    The dungeons feel their eyes. The enemies feel the pressure. Everything gets harder
    because the stakes just became real.

    Your camp, your gear, your bench units, your companionship bonds —
    everything you built in the base game is now the floor, not the ceiling.
  `,

  narrative_pivot: `
    Lord Vaeric is not the enemy.
    He is the only one who remembers what the Ancient Nobles actually were —
    and he is not sure the others who are returning share his restraint.

    He has been asleep. They have been somewhere else.
    What changes a person — or whatever they are — in that kind of absence,
    he cannot say.

    He sides with the player. Not out of loyalty to Westrun.
    Out of the quiet conviction that what is coming deserves to be challenged
    by something worth challenging it.
  `,

  characters: {

    lord_vaeric: {
      role: 'Reluctant Guide',
      desc: `The only Ancient Noble who chose Westrun over whatever the others chose.
             He doesn't explain why. He doesn't explain much.
             But he stands between the player and what's descending,
             and that says everything his silence won't.`,
    },

    the_returning: {
      role: 'The Threat',
      desc: `Ancient Nobles who left Westrun for reasons unknown and are now back.
             They do not see the player as an enemy. They barely see the player at all.
             That indifference is more terrifying than hostility.
             You are not being attacked. You are being corrected.`,
    },

  },

  dual_unlock: {
    name: 'The Breaking Point',
    trigger: 'Both DLC 1 and DLC 2 active simultaneously',
    desc: `If the player unlocks both DLCs at the same time — or triggers the second
           before stabilising the first — Westrun enters a state of total war.

           Two front war:
           - All dungeons and raids scaled up a full difficulty tier (Blood Sacrifice)
           - Random camp invasions firing continuously (Westrun Overrun)
           - Bench units defending territories while main team is mid-dungeon
           - Materials needed to forge better gear locked behind harder content
           - The Astral Forge needs the blacksmith who needs protection he can't survive alone
           - Every system the player built — or neglected — is exposed simultaneously

           This is not a punishment. It is a revelation.
           Players who built deep benches, unlocked companionship bonds, assigned
           leadership roles and maintained a real second team — they struggle but survive.
           Players who built one superteam and ignored everything else hit a wall
           that cannot be brute-forced. They have to rebuild. Rethink. Go back.

           The dual unlock is the endgame test the entire base game was secretly preparing for.
           It doesn't ask "how strong is your best team?"
           It asks "how deep is your roster, how well do you know your units,
           and did you ever bother to learn why Vorath was misunderstood?"

           The answer to that last question matters more than any gear score.`,
  },

  design_notes: [
    'DLC 1 (Westrun Overrun) and DLC 2 (Blood Sacrifice) can run simultaneously — two threats, one world.',
    'Valerius knows about the Ancient Nobles. He has been running from their attention for a long time.',
    'The difficulty spike should feel seismic — players must revisit and rebuild strategies.',
    'Blood Sacrifice materials drop exclusively from Ancient Noble encounters.',
    'A third forge tier is possible here — but only hinted at, not confirmed yet.',
    'Vaeric\'s lore fragments hint at the returning nobles long before DLC 2 triggers.',
    'The player\'s blacksmith Forgemaster (DLC 1) becomes critical here — Astral gear is the minimum entry point.',
    'Vorath and Aurelan\'s rivalry gets recontextualised again — were they always being watched?',
  ],

}
