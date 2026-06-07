/**
 * Lore entries keyed by hero id.
 * Each fragment unlocks one piece of the hero's story, revealed top to bottom.
 */

export const LORE = {

  lord_aldric: {
    title:  'The Hedge Lord',
    quote:  '"He never asked anyone to lift a stone he wouldn\'t lift himself." — Unknown conscript, House Aldric',
    leadership: {
      name:  'Lord\'s Efficiency',
      desc:  'Camp gathering speed increased by 150% while Lord Aldric is assigned as Camp Commander.',
      flavour: '"Not magic. Not luck. Just a man who has done this before." — Camp Quartermaster',
    },
    fragments: [
      {
        id: 'aldric_f1',
        title: 'The Mud Years',
        text: `Lord Aldric was not born to his title. He earned it the way most things worth having are earned — slowly, without glory, and with dirt under his fingernails.

He began as a hedge knight, the same as you. No house, no banner, no name anyone recognised. He slept in the same mud as the men he would one day lead and never once forgot what that felt like.`,
      },
      {
        id: 'aldric_f2',
        title: 'The Miller\'s Dispute',
        text: `He did not rise by slaying dragons or winning tournaments. He rose by being the man who remembered where the grain stores were, who settled the dispute between the miller and the blacksmith before it became a brawl, who made sure the harvest did not fail two winters running when every other lord was busy playing at politics.`,
      },
      {
        id: 'aldric_f3',
        title: 'The Harvest Winter',
        text: `The people did not follow him out of fear or obligation. They followed him because under his banner, things simply worked. Roads were repaired. Wells were dug. The camp was always ready before the enemy arrived.

When they finally gave him the title Lord, he accepted it quietly. Then he went back to work.`,
      },
      {
        id: 'aldric_f4',
        title: 'The Title',
        text: `His soldiers say the camp runs at half the effort when he walks the grounds. Not because of magic. Because he has done it before, a hundred times, from nothing — and everyone around him knows it.

He is what a hedge knight becomes if they never forget where they came from.

He is what you are working toward.`,
      },
      {
        id: 'aldric_f5',
        title: 'The Burning Pact',
        revealsHero: 'edran_ashveil',
        companionship: {
          with: 'edran_ashveil',
          name: 'Embers of the Pact',
          desc: 'Lord Aldric and Edran Ashveil fight as one. Aldric\'s heat builds 25% faster and Edran\'s fire spells deal 20% bonus damage when both are in the same party.',
          flavour: '"They never spoke of those winters. But watch them fight side by side — their fire moves like it remembers."',
        },
        text: `During his years as a hedge knight, Aldric crossed paths with a young scholar of House Valdris — an outcast mage named Edran, exiled from the Arcane Citadel for pursuing forbidden artefact research.

Edran had found something buried beneath the ruins of a nameless keep: a stone that pulsed with ancient heat. Not magical fire as the Citadel taught it — something older. Something that predated House Valdris entirely.

Edran could study it but could not wield it. Aldric, to both their surprise, could.

Nobody understood why. Aldric least of all.

Edran spent two winters teaching him to control it. Not as a weapon — as a discipline. The fire did not come from ambition or anger. It came from endurance. The longer you burn, the hotter it gets. The longer your enemy fights you, the more they are made to suffer the consequence of their own stubbornness.

Aldric never spoke of Edran after those winters. Whether they parted as friends or something happened between them, no record survives.

What survived was the fire.

Look at his gauntlets long enough in battle and you will see it — coiling around the knuckles, patient, waiting. It does not rush. Neither does he.

The ancient stone was never found again.`,
      },
    ],
  },

  helga: {
    title:  'The Golden Vow',
    quote:  '"Her armor catches the sun before the battle begins. Every soldier in the line sees it. Nobody runs." — House Aldric soldier, Second Campaign',
    fragments: [
      {
        id: 'helga_f1',
        title: 'The Armor',
        text: `Helga did not take Lord Aldric's name. This is one of those facts the histories note without comment, as if it were simply a detail, when in truth it is everything.

She was already a warrior when she met him — not by title, but by the only measure that matters in Westrun: by the number of times she had bled and stood up anyway. Her armor had been in her family for three generations. The gold filigree was not decorative. It was added by her grandmother after surviving a siege where the only two people left standing at the wall were her grandmother and a blacksmith who loved her.

The armor remembers. It has been in every battle since.`,
      },
      {
        id: 'helga_f2',
        title: 'The Disputed Valley',
        text: `When Aldric first saw her at the edge of a disputed valley, standing alone between two armed factions waiting for someone to do something stupid, he did not think "I will marry her." He thought "I understand now why neither side has moved."

They did not marry for politics. They did not marry for alliances. She told him once, years later, that she agreed because he was the first man who hadn't tried to explain strategy to her.

He has never forgotten that.`,
      },
      {
        id: 'helga_f3',
        title: 'What She Said',
        text: `Neither has anyone who has seen them fight side by side — two people who learned a long time ago that words before a battle are wasted breath. They already know where the other one is going. The soldiers say you can hear it in the silence between them.

She does not fight in his shadow. She never has. When the line breaks and soldiers look for something to hold onto, they look for the gold that catches the light. They find her there, exactly where she said she would be.`,
      },
    ],
  },

  hedge_blade: {
    title:   'The Unbroken',
    quote:   '"He doesn\'t fight like a man who wants to win. He fights like a man who has nothing left to lose — and found out that\'s not the same thing as being weak." — Unknown soldier',
    potential: {
      tier: 'Legendary',
      condition: 'Complete all Garrett fragments and discover his benefactor',
      hint: 'Someone has been watching him for a long time. They see something in those eyes that goes beyond revenge.',
    },
    fragments: [
      {
        id: 'garrett_f1',
        title: 'What He Lost',
        text: `Most men who lose everything break. The grief takes them — folds them in half, hollows them out, leaves something behind that only looks like a person.

Garrett did not break.

Not because he didn't feel it. He felt every piece of it. He still does. But somewhere in the wreckage of what happened he made a decision so quiet nobody heard it — not even him, not really.`,
      },
      {
        id: 'garrett_f2',
        title: 'The Night He Didn\'t Break',
        text: `He would not stop.

He doesn't seek glory. Glory is for men who need to be remembered. He doesn't know fear the way other soldiers do — not because he's brave, but because the thing fear usually threatens to take from you, he's already lost.`,
      },
      {
        id: 'garrett_f3',
        title: 'What Drives Him',
        text: `What drives him forward has no noble name. It isn't justice. It isn't duty.

It is the simple, immovable fact that someone is still breathing who shouldn't be.`,
      },
      {
        id: 'garrett_f4',
        title: 'The Benefactor',
        revealsHero: 'lord_aldric',
        text: `He will find them. He will keep finding them. And he will not break before he does.

That is all.`,
      },
    ],
  },

  edran_ashveil: {
    title:    'The Ashveil Scholar',
    locked:   true,
    unlockedBy: 'aldric_f5',
    quote:    '"His name was struck from the Citadel\'s records. But fire does not forget who first called it." — Unknown',
    leadership: {
      name:    'Forbidden Warmth',
      desc:    'Edran Ashveil\'s presence in the camp unlocks the Ancient Fire research plot, passively generating Ember Shards over time.',
      flavour: '"He studies the stone still. Every day. Like it has more to say."',
    },
    fragments: [
      {
        id: 'edran_f1',
        title: 'The Exile',
        text: `Edran Ashveil does not exist, according to House Valdris. His name was removed from the Arcane Citadel's records the day he left without permission, carrying research they did not sanction and questions they did not want asked.`,
      },
      {
        id: 'edran_f2',
        title: 'The Ancient Stone',
        text: `He found the stone. He could not wield it. Someone else could.`,
      },
      {
        id: 'edran_f3',
        title: 'The Two Winters',
        text: `What happened during those two winters in the ruins, only two people know. One of them leads a great house and does not speak of it. The other became a Legendary mage whose fire burns with a heat that no Citadel technique can fully explain.`,
      },
      {
        id: 'edran_f4',
        title: 'Why He Never Returned',
        text: `He never went back to House Valdris. Not because he couldn't. Because he chose something else.`,
      },
    ],
  },

}

// Bond lore — keyed by bond id. Shown in the bond reveal modal and Codex Lore tab.
export const BOND_LORE = {
  iron_vow: {
    name:        'The Iron Vow',
    subtitle:    'Lord Aldric · Helga',
    quote:       '"They don\'t need signals. They don\'t need orders. You put them on the same line and the battle just... resolves." — House Aldric commander',
    body: `Nobody witnessed the vow. That is the point.

There was no ceremony, no witness, no record written in the hall. They were standing at the edge of a field after a skirmish that had gone longer than it should have, and Aldric said something nobody else heard, and Helga said something back, and that was the whole of it.

What is known is what changed afterward. The camp noticed it before the soldiers did. The way they moved through it — separately, differently — but always with an awareness of where the other one was. Not looking. Not checking. Just knowing.

In battle it is something else entirely.

He takes the line that needs holding. She takes the line that needs breaking. They never discuss it beforehand. They have been doing this long enough that the conversation already happened, years ago, somewhere in all the fights they survived before they found each other.

The soldiers say if you watch carefully, you can catch the moment before the charge when they glance at each other. Just once. Just long enough.

Then they go.

The armor she wears was her grandmother's. The fire in his gauntlets has no name. Between them, somehow, both of those things make more sense together than they ever did apart.

They have never lost a battle they fought side by side.

This may be coincidence. The soldiers do not believe it is.`,
  },
}
