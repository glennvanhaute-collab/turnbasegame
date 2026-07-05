/**
 * Lore entries keyed by hero id.
 * Each fragment unlocks one piece of the hero's story, revealed top to bottom.
 */

export const LORE = {

  lord_aldric: {
    title:  'The Hedge Lord',
    quote:  '"He never asked anyone to lift a stone he wouldn\'t lift himself." â€” Unknown conscript, House Aldric',
    leadership: {
      name:  'Lord\'s Efficiency',
      desc:  'Camp gathering speed increased by 150% while Lord Aldric is assigned as Camp Commander.',
      flavour: '"Not magic. Not luck. Just a man who has done this before." â€” Camp Quartermaster',
    },
    fragments: [
      {
        id: 'aldric_f1',
        title: 'The Mud Years',
        text: `Lord Aldric was not born to his title. He earned it the way most things worth having are earned â€” slowly, without glory, and with dirt under his fingernails.

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
        text: `His soldiers say the camp runs at half the effort when he walks the grounds. Not because of magic. Because he has done it before, a hundred times, from nothing â€” and everyone around him knows it.

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
          flavour: '"They never spoke of those winters. But watch them fight side by side â€” their fire moves like it remembers."',
        },
        text: `During his years as a hedge knight, Aldric crossed paths with a young scholar of House Valdris â€” an outcast mage named Edran, exiled from the Arcane Citadel for pursuing forbidden artefact research.

Edran had found something buried beneath the ruins of a nameless keep: a stone that pulsed with ancient heat. Not magical fire as the Citadel taught it â€” something older. Something that predated House Valdris entirely.

Edran could study it but could not wield it. Aldric, to both their surprise, could.

Nobody understood why. Aldric least of all.

Edran spent two winters teaching him to control it. Not as a weapon â€” as a discipline. The fire did not come from ambition or anger. It came from endurance. The longer you burn, the hotter it gets. The longer your enemy fights you, the more they are made to suffer the consequence of their own stubbornness.

Aldric never spoke of Edran after those winters. Whether they parted as friends or something happened between them, no record survives.

What survived was the fire.

Look at his gauntlets long enough in battle and you will see it â€” coiling around the knuckles, patient, waiting. It does not rush. Neither does he.

The ancient stone was never found again.`,
      },
    ],
  },

  helga: {
    title:  'The Golden Vow',
    quote:  '"Her armor catches the sun before the battle begins. Every soldier in the line sees it. Nobody runs." â€” House Aldric soldier, Second Campaign',
    fragments: [
      {
        id: 'helga_f1',
        title: 'The Armor',
        text: `Helga did not take Lord Aldric's name. This is one of those facts the histories note without comment, as if it were simply a detail, when in truth it is everything.

She was already a warrior when she met him â€” not by title, but by the only measure that matters in Westrun: by the number of times she had bled and stood up anyway. Her armor had been in her family for three generations. The gold filigree was not decorative. It was added by her grandmother after surviving a siege where the only two people left standing at the wall were her grandmother and a blacksmith who loved her.

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
        text: `Neither has anyone who has seen them fight side by side â€” two people who learned a long time ago that words before a battle are wasted breath. They already know where the other one is going. The soldiers say you can hear it in the silence between them.

She does not fight in his shadow. She never has. When the line breaks and soldiers look for something to hold onto, they look for the gold that catches the light. They find her there, exactly where she said she would be.`,
      },
    ],
  },

  hedge_blade: {
    title:   'The Unbroken',
    quote:   '"He doesn\'t fight like a man who wants to win. He fights like a man who has nothing left to lose â€” and found out that\'s not the same thing as being weak." â€” Unknown soldier',
    potential: {
      tier: 'Legendary',
      condition: 'Complete all Garrett fragments and discover his benefactor',
      hint: 'Someone has been watching him for a long time. They see something in those eyes that goes beyond revenge.',
    },
    fragments: [
      {
        id: 'garrett_f1',
        title: 'What He Lost',
        text: `Most men who lose everything break. The grief takes them â€” folds them in half, hollows them out, leaves something behind that only looks like a person.

Garrett did not break.

Not because he didn't feel it. He felt every piece of it. He still does. But somewhere in the wreckage of what happened he made a decision so quiet nobody heard it â€” not even him, not really.`,
      },
      {
        id: 'garrett_f2',
        title: 'The Night He Didn\'t Break',
        text: `He would not stop.

He doesn't seek glory. Glory is for men who need to be remembered. He doesn't know fear the way other soldiers do â€” not because he's brave, but because the thing fear usually threatens to take from you, he's already lost.`,
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
    quote:    '"His name was struck from the Citadel\'s records. But fire does not forget who first called it." â€” Unknown',
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


  // â”€â”€ Generated lore additions â€” all remaining HERO_TEMPLATES â”€â”€â”€â”€â”€
  hedge_mage: {
    title:  'The Crescent Flame',
    quote:  '"She learned early that fire is not loud. The dangerous kind listens first." â€” Valdris field tutor',
    fragments: [
      {
        id: 'lyra_f1',
        title: 'The Girl Under the Moon',
        text: `Lyra of the Crescent was born during a moonless week, which the old women of her village considered unlucky and the Valdris recruiters considered interesting.

Her first spell did not arrive as a burst of flame. It came as a pale crescent of light floating above her palm, quiet and patient. The tutors told her to make it brighter. Lyra asked why. That was the first argument she ever won.`,
      },
      {
        id: 'lyra_f2',
        title: 'The Lesson She Refused',
        text: `The Arcane Citadel teaches young mages to shape power into categories: fire, frost, shield, ruin. Lyra disliked categories almost immediately.

She studied the edge between things instead. Flame that behaved like moonlight. Cutting light that warmed instead of burned. She was not the strongest novice in her year, but she was the one the instructors watched with the most concern.`,
      },
      {
        id: 'lyra_f3',
        title: 'The Crescent Path',
        text: `When she left Valdris halls to walk as a hedge mage, many assumed she had failed her training. Lyra never corrected them.

Failure would have been easier to understand. The truth was that she wanted to see what magic became when it was forced to solve real problems: wet firewood, frightened soldiers, wounds that needed cauterising before dawn.

The crescent above her hand has grown sharper since then.`,
      },
    ],
  },

  hedge_warden: {
    title:  'The Wandering Green',
    quote:  '"He talks to trees like they are old soldiers. The uncomfortable part is that sometimes they seem to answer." â€” Road guard',
    fragments: [
      {
        id: 'rowan_f1',
        title: 'The Road Without a Map',
        text: `Rowan the Wandering never stayed in one grove long enough to be claimed by it. Caelwyn elders dislike that sort of thing. Trees have roots for a reason, they told him.

Rowan listened respectfully, packed his satchel, and left before dawn.

He said the forest did not end at the sacred boundary stones. It followed rivers, crept through ruined walls, cracked roads apart, and waited in places where men forgot to look down.`,
      },
      {
        id: 'rowan_f2',
        title: 'The Wounded Stag',
        text: `The first life Rowan saved was not human. It was a stag caught in a hunter's wire, half-mad with pain and ready to kill anything that came close.

Rowan came close anyway.

By morning the stag was gone, the wire was cut, and Rowan had a scar across one forearm that never faded. He kept the wire twisted around his staff as a reminder that mercy often has teeth.`,
      },
      {
        id: 'rowan_f3',
        title: 'The Warden Who Left',
        text: `Caelwyn wardens are meant to guard a place. Rowan guards the path between places.

He knows which streams turn bitter after rain, which abandoned shrines still remember prayers, which flowers bloom only where soldiers are buried. He is not lost, whatever the maps say.

The green has many doors. Rowan has spent his life learning how to knock.`,
      },
    ],
  },

  ser_roland: {
    title:  'The Banner Knight',
    quote:  '"Roland makes ordinary men stand straighter. That is more dangerous than most magic." â€” House Aldric captain',
    fragments: [
      {
        id: 'roland_f1',
        title: 'The Clean Shield',
        text: `Ser Roland was not born brave. He was born orderly.

As a boy he polished old shields in his father's yard until they reflected the clouds. He hated rust, hated slack straps, hated the idea that a life might be lost because someone could not be bothered to prepare properly.

The first shield he carried into battle was not ornate. It was clean.`,
      },
      {
        id: 'roland_f2',
        title: 'The Broken Advance',
        text: `During the Broken Advance, Roland's unit was ordered to retreat three times. The messengers kept dying before the command could reach him.

So Roland did what Aldric knights are expected to do when nobody is left to tell them the correct answer. He held the line, counted his wounded, and moved forward one shield-length at a time.

By dusk, the enemy believed reinforcements had arrived. They had not. It was only Roland refusing to behave like a defeated man.`,
      },
      {
        id: 'roland_f3',
        title: 'The Name Ser',
        text: `Roland accepted his knighthood with the solemn expression of someone being handed more work.

He trains recruits to raise their shields before they raise their voices. He speaks rarely in council, but when he does, even louder men tend to listen.

His banner is not feared because it promises victory. It is feared because everyone knows Roland will still be standing under it when victory becomes difficult.`,
      },
    ],
  },

  seraphel: {
    title:  'The Star-Crowned Flame',
    quote:  '"She does not cast spells. She opens doors and decides what is allowed through." â€” Archmage Kelvar',
    fragments: [
      {
        id: 'seraphel_f1',
        title: 'The Child Who Saw Lines',
        text: `Seraphel grew up seeing lines in the air that nobody else could name.

Threads of heat. Curves of frost. Thin silver paths where a spell wanted to travel before it existed. Her tutors called it prodigy. Seraphel called it noise.

The first time she drew one of those lines with her finger, every candle in the Citadel burned blue for three days.`,
      },
      {
        id: 'seraphel_f2',
        title: 'The Shield of Glass',
        text: `Valdris mages often chase power until it ruins them. Seraphel learned restraint before ambition.

Her arcane shields are almost beautiful: thin, glasslike, impossible things that catch a blade one breath before it reaches flesh. Students ask how she calculates them so quickly.

She tells them she does not calculate. She listens for the shape of harm, then puts a wall where it wants to be.`,
      },
      {
        id: 'seraphel_f3',
        title: 'The Crown Nobody Gave Her',
        text: `No formal crown rests on Seraphel's brow, but other mages lower their voices when she enters the room.

She never demanded obedience. She simply became the person everyone looked toward when the spellwork became too old, too strange, or too hungry for lesser hands.

The stars above Valdris do not shine brighter for her. They are merely easier to see when she is near.`,
      },
    ],
  },

  mira: {
    title:  'The Gentle Hand',
    quote:  '"When Mira says you will live, even death seems embarrassed to argue." â€” Wounded spearman',
    fragments: [
      {
        id: 'mira_f1',
        title: 'The Quiet Apprentice',
        text: `Mira of Caelwyn began as the sort of apprentice people forgot was in the room.

She was quiet, careful, and always two steps behind the senior healers with clean water before anyone asked for it. Some mistook this for timidity.

Then winter fever came through the western camps, and Mira stayed awake for four nights marking which herbs worked, which prayers comforted, and which old remedies were only stories wearing respectable clothes.`,
      },
      {
        id: 'mira_f2',
        title: 'The First Mass Grave',
        text: `Mira learned healing beside a mass grave. That is the part she does not put in songs.

After the battle, there were too many wounded and not enough hands. She stopped asking permission. She sorted the dying from the savable, closed the eyes of men she could not help, and dragged the living back one by one.

By dawn, the elder healer found her shaking beside a row of survivors. Mira apologised for disobeying orders. The elder only handed her another bandage.`,
      },
      {
        id: 'mira_f3',
        title: 'The Name They Whisper',
        text: `Soldiers do not cheer when Mira arrives. They go quiet.

They make room. They hold still. They believe.

Mira has never claimed to defeat death. She only steals moments from it, enough for a body to remember it was meant to keep breathing. In Caelwyn, that is considered a miracle. Mira considers it work.`,
      },
    ],
  },

  genesis: {
    title:  'The First Wound',
    quote:  '"Genesis does not remember the first night. That is not reassuring." — Mordaine night-warden',
    fragments: [
      {
        id: 'genesis_f1',
        title: 'The Name in the Margin',
        text: `There is a name that appears in the oldest Mordaine records — before the house took its shape, before the pacts were sealed and the shadow found direction. The name is Genesis. It appears once, in a margin, in a script that predates the current Mordaine tongue.

Scholars who have tried to translate it use words like initiation and rupture and, in one case, the moment before the wound understands itself.

The person who carries that name now is either the original — which Mordaine healers consider biologically improbable and metaphysically concerning — or someone who found the name and chose to carry it, which Mordaine philosophers consider worse.`,
      },
      {
        id: 'genesis_f2',
        title: 'The Arrival',
        text: `Genesis arrived in the Mordaine holdings without announcement, without papers, without the debt that usually precedes Mordaine loyalty.

The gatewarden who let them in cannot explain why. The captain who gave them quarters has no memory of the conversation. The records show a name, a bunk assignment, and nothing else.

Three clerks have independently reviewed the intake ledger. All three agree the handwriting in Genesis's entry is not the captain's. None of them can identify whose it is. One of them stopped looking.`,
      },
      {
        id: 'genesis_f3',
        title: 'The Question',
        text: `Genesis has not sought rank. They have not asked for coin. When the house moves, Genesis moves with it. When the house requires something that cannot be asked of ordinary soldiers, Genesis is already there.

Lord Mordaine has been asked, twice, whether Genesis serves him.

He said, the first time, that the question was backwards.

He did not answer the second time.`,
      },
    ],
  },

  velmorn: {
    title:  'The Shadow Between Bells',
    quote:  '"If Velmorn wanted you dead, you would first notice him in the afterlife." â€” Mordaine fence',
    fragments: [
      {
        id: 'velmorn_f1',
        title: 'The Alley Bell',
        text: `Velmorn the Shadow was raised in a district where the watch bell rang for murders, fires, and tax collectors.

As a child he learned the rhythm of that bell better than any hymn. One ring meant hide. Two meant run. Three meant someone important had died and the alleys would be watched until dawn.

Velmorn survived by being forgettable, then by being useful, then by becoming the reason the bell rang.`,
      },
      {
        id: 'velmorn_f2',
        title: 'The Knife Lesson',
        text: `Mordaine does not train assassins in bright halls. It trains them in debt, hunger, silence, and locked doors.

Velmorn's first teacher gave him a dull knife and told him to steal a better one. His second teacher tried to kill him for succeeding too quickly.

He kept both knives. One for work. One for remembering.`,
      },
      {
        id: 'velmorn_f3',
        title: 'The Man Not Seen',
        text: `Velmorn does not enjoy killing. Enjoyment makes men careless.

He prefers perfect work: no alarm, no speech, no heroic struggle. Only a shadow crossing the wrong wall and a tyrant failing to wake.

People say he serves House Mordaine. Velmorn says very little. The difference is probably important.`,
      },
    ],
  },

  sir_hadvar: {
    title:  'The Gateholder',
    quote:  '"Hadvar is not fast. Gates are not fast either. Try moving one." â€” Aldric quartermaster',
    fragments: [
      {
        id: 'hadvar_f1',
        title: 'The Gate Oath',
        text: `Sir Hadvar earned his place at the old south gate, not in tournament lists or noble halls.

The gate was rotten. The hinges were bent. The men posted there were the sort commanders sent when they expected nothing important to happen.

Hadvar inspected the wood, repaired the bracing, and made every man swear the same oath: if the gate falls, it falls on us first.`,
      },
      {
        id: 'hadvar_f2',
        title: 'The Morning Assault',
        text: `The assault came before sunrise, as cowardly things often do.

Hadvar's line did not have enough archers, oil, or sleep. What it had was a repaired gate, a commander who had counted every plank, and soldiers too ashamed to run while he stood in front of them.

By noon the attackers had broken three rams against the entrance. Hadvar was still there, bleeding through one boot and asking for a hammer.`,
      },
      {
        id: 'hadvar_f3',
        title: 'The Reliable Man',
        text: `House Aldric values heroes. It survives because of reliable men.

Hadvar is the one sent where the wall is old, the morale is thin, and the enemy thinks numbers will be enough. He does not inspire speeches. He inspires preparations.

When he says a position will hold, commanders stop worrying about that position.`,
      },
    ],
  },

  durwald: {
    title:  'The Immovable',
    quote:  '"I have seen mountains with less patience." â€” Brenna Shieldmaiden',
    fragments: [
      {
        id: 'durwald_f1',
        title: 'The Stone Boy',
        text: `Durwald was a large child, then a larger apprentice, then a soldier so broad that smiths complained about making armor for him.

He was not quick with lessons, songs, or jokes. He was quick with his hands when someone smaller was being hurt.

The village boys called him Stoneback until the day he stood between them and a wounded mule for an entire afternoon. After that, they called him Durwald.`,
      },
      {
        id: 'durwald_f2',
        title: 'The Bridge That Stayed',
        text: `During the Red Ford retreat, Durwald was ordered to delay the enemy at a narrow bridge.

Delay became hold. Hold became survive. Survive became legend.

Men ran past him carrying the wounded. Wagons broke wheels. Horses screamed. Through all of it, Durwald stood in the rain with his shield planted before him, taking blows that would have ended smaller stories.`,
      },
      {
        id: 'durwald_f3',
        title: 'The Bastion Habit',
        text: `Durwald dislikes being called brave. He says brave men have to choose.

He simply puts himself where the danger is going and refuses to be moved. There is no philosophy in it, no poetry, no secret vow.

Only a shield, a stubborn heart, and the quiet certainty that someone has to stand there.`,
      },
    ],
  },

  aldric_marksman: {
    title:  'The Hundred-Pace Eye',
    quote:  '"He does not pray before firing. He already did the work." â€” Aldric bowyer',
    fragments: [
      {
        id: 'aldric_marksman_f1',
        title: 'The Bad Bow',
        text: `The first bow issued to the Aldric Marksman was warped, understrung, and older than the recruit carrying it.

He complained once. Then he learned how to shoot it anyway.

By the end of his first season he could tell whether rain would pull a bolt low by the smell of the air. By the end of his second, the quartermaster started giving him better weapons out of embarrassment.`,
      },
      {
        id: 'aldric_marksman_f2',
        title: 'The Crow Count',
        text: `At Crowfield Ridge, enemy scouts began dropping before horns sounded.

One at ninety paces. One at a hundred and twelve. One through a gap in a broken palisade that three officers swore no man could see through.

The marksman never confirmed the numbers later. He was busy counting recovered bolts and arguing that half of them could still be used.`,
      },
      {
        id: 'aldric_marksman_f3',
        title: 'The Practical Distance',
        text: `Aldric soldiers like clean charges and shield walls. The marksman prefers not letting the enemy arrive.

He is not cruel. He simply believes distance is a gift, and wasting gifts is poor discipline.

When battle begins, he finds the drummer, the banner hand, the mage with the expensive robes. Then he solves the problem before it becomes brave.`,
      },
    ],
  },

  gwendal: {
    title:  'The Iron Vow',
    quote:  '"Gwendal does not shout to be heard. He shouts because battle is hard of hearing." â€” House Aldric veteran',
    fragments: [
      {
        id: 'gwendal_f1',
        title: 'The Young Hammer',
        text: `Gwendal Ironvow was apprenticed to a battlefield smith before he was old enough to shave.

He learned that armor tells the truth. A dent on the left shoulder means a man turns too slowly. A crack near the ribs means fear made him twist. A clean blade in a filthy camp means someone cares about surviving.

Gwendal began fixing men by fixing their gear first.`,
      },
      {
        id: 'gwendal_f2',
        title: 'The Vow in Iron',
        text: `His vow was made over an anvil after a failed defence left three villages burned.

Gwendal heated a strip of broken mail, folded it into his gauntlet, and swore that no line under his command would break from neglect again.

Since then he has inspected buckles before feasts, shields before prayers, and courage before praise. His soldiers complain constantly. They also live.`,
      },
      {
        id: 'gwendal_f3',
        title: 'The Voice in the Line',
        text: `When Gwendal charges, he sounds like a forge learning to speak.

His battle cry is not elegant. It is instruction, warning, insult, and promise hammered into one noise. Recruits find their feet when they hear it. Veterans grin.

The enemy usually hears it only once.`,
      },
    ],
  },

  brenna: {
    title:  'The Shieldmaiden of the Red Field',
    quote:  '"Brenna does not ask whether fear is present. She asks whether it has permission to lead." â€” Aldric shield-sister',
    fragments: [
      {
        id: 'brenna_f1',
        title: 'The Girl With the Borrowed Shield',
        text: `Brenna's first shield was borrowed from a dead man because nobody had thought to make one small enough for her.

She carried it anyway.

The shield dragged in the mud when she walked and covered almost all of her when she knelt. The instructors laughed until she learned to use its weight against them. After that they mostly laughed from the ground.`,
      },
      {
        id: 'brenna_f2',
        title: 'The Red Field',
        text: `Her name spread after the Red Field, where the left flank collapsed under cavalry pressure and sensible soldiers began retreating.

Brenna did not. She stepped into the gap, slammed her shield into the earth, and called every runner by name until shame dragged them back into formation.

By the time reinforcements arrived, the field was red, the line was ugly, and Brenna was still arguing that she could keep fighting.`,
      },
      {
        id: 'brenna_f3',
        title: 'The Fierce One',
        text: `Stories call her fierce as if that explains her.

Fierce is only what strangers see. Her soldiers know the rest: the woman who checks boot straps, remembers who has children, and notices when a joke is being used to hide terror.

Brenna protects loudly because the world hurts quietly.`,
      },
    ],
  },

  draven_spellblade: {
    title:  'The Burning Edge',
    quote:  '"Half knight, half mage, fully impossible to schedule." â€” Valdris drill master',
    fragments: [
      {
        id: 'draven_f1',
        title: 'The Wrong Classroom',
        text: `Draven Spellblade was born to a minor sword family and sent to Valdris when his blade caught fire during a fencing lesson.

His parents called it a blessing. His instructor called it property damage.

At the Citadel, Draven learned that mages disliked swordsmen and swordsmen disliked mages. This made him feel immediately at home, since both groups agreed he was doing something wrong.`,
      },
      {
        id: 'draven_f2',
        title: 'The Heat in Steel',
        text: `Draven does not cast fire so much as invite it into motion.

A spell sits badly in his hands until it has an edge to follow. Steel gives it direction. Flame gives the steel intent. Together they make something Valdris theory can explain only after the duel is already over.

Many instructors tried to correct him. Most eventually settled for standing farther away.`,
      },
      {
        id: 'draven_f3',
        title: 'The Duelist Problem',
        text: `Draven is useful in precisely the way councils find annoying.

He solves magical disputes by walking through them, parrying the spellwork, and setting the caster's sleeve on fire. He insists this is efficient diplomacy.

House Valdris has not expelled him because his results are excellent. They have also not promoted him because nobody wants to explain him in writing.`,
      },
    ],
  },

  elara: {
    title:  'The Frostweaver',
    quote:  '"Elara never raises her voice. Winter has no need to shout." â€” Valdris apprentice',
    fragments: [
      {
        id: 'elara_f1',
        title: 'The Still Lake',
        text: `Elara Frostweaver grew up beside a mountain lake that froze so clear in winter the villagers said you could see last summer trapped beneath it.

She spent hours staring into that ice, watching fish move slowly in the dark below. Her first spell did not crack the lake. It made a perfect circle of frost bloom outward from her hand.

The elders called it beautiful. Elara called it control.`,
      },
      {
        id: 'elara_f2',
        title: 'The Lesson of Cold',
        text: `Fire mages are praised for passion. Storm mages for power. Elara chose cold because cold waits.

It slows the blade, stiffens the hand, quiets the panic, and gives thought enough room to arrive. In battle, she does not try to overwhelm the field. She makes it heavy.

Enemies discover too late that stillness can be a weapon.`,
      },
      {
        id: 'elara_f3',
        title: 'The Weaver Name',
        text: `They call her Frostweaver because her magic does not fall like snow. It threads.

Across shields, between boots, along the seams of armor, through the breath of charging men. By the time an enemy sees the pattern, they are already part of it.

Elara keeps a polite expression when they realise. She considers gloating inefficient.`,
      },
    ],
  },

  mirena: {
    title:  'The Ashveil Ember',
    quote:  '"She inherited the name. She chose what it would mean." â€” Edran Ashveil',
    fragments: [
      {
        id: 'mirena_f1',
        title: 'The Difficult Name',
        text: `Mirena Ashveil was born under a name Valdris archivists had already tried to bury.

Ashveil meant exile, burned records, forbidden research, and one missing scholar whose work refused to stay forgotten. Teachers hesitated before saying her surname. Students whispered it after she passed.

Mirena learned early that a name can be both wound and weapon.`,
      },
      {
        id: 'mirena_f2',
        title: 'The Black Flame Exercise',
        text: `Her talent was not clean fire. It darkened at the edges, curling into smoke that moved against the wind.

The Citadel demanded she purify it. Mirena tried, failed, then stopped pretending failure was the problem. Her flame burned best when allowed to remember grief, anger, and old dust.

That made the instructors nervous. It made Mirena honest.`,
      },
      {
        id: 'mirena_f3',
        title: 'The Ash That Remains',
        text: `Mirena does not chase Edran's shadow. She walks beside it until it gets in her way.

She studies forbidden heat, grave-cold embers, and the residue left after spells consume more than fuel. She believes ash is not the end of fire. It is evidence.

One day, she intends to read it all.`,
      },
    ],
  },

  caius: {
    title:  'The Stormbinder',
    quote:  '"Caius was told lightning cannot be negotiated with. He took that personally." â€” Valdris stormwarden',
    fragments: [
      {
        id: 'caius_f1',
        title: 'The Tower Strike',
        text: `Caius Stormbinder was born during the tower strike, when lightning hit the eastern spire of Valdris seven times in one night.

His mother claimed he cried only on the eighth thunderclap, offended that the storm had stopped.

As a student, Caius ignored flame exercises and frost diagrams. He spent his time on rooftops with copper rods, wet sleeves, and an expression that made sensible people stay indoors.`,
      },
      {
        id: 'caius_f2',
        title: 'The Chain Around Thunder',
        text: `Storm magic is usually brief: a flash, a crack, a corpse.

Caius wanted duration. He learned to bind pressure, delay release, and hold thunder inside sigils until the air itself trembled. His hands shake when he is tired, not from fear but from the storm still looking for exits.

He says control is not silence. Control is choosing when the sky speaks.`,
      },
      {
        id: 'caius_f3',
        title: 'The Man Under Rain',
        text: `Caius is most cheerful in bad weather.

He walks into battle smiling at clouds, counting the seconds between light and sound. Soldiers find this unsettling until the first bolt lands exactly where he said it would.

After that, they stop calling storms unlucky. They call them reinforcements.`,
      },
    ],
  },

  archmage_kelvar: {
    title:  'The Keeper of the Last Door',
    quote:  '"Every forbidden spell in Valdris passed through Kelvar\'s hands. Some were allowed to leave." â€” Citadel archivist',
    fragments: [
      {
        id: 'kelvar_f1',
        title: 'The Lowest Shelf',
        text: `Kelvar began as a shelf boy in the Arcane Citadel, too poor for tuition and too useful to remove.

He fetched ink, dusted tomes, and memorised every title he was told not to open. By fifteen he knew the catalogue better than the librarians. By seventeen he had corrected three archmages without being asked.

They finally admitted him because the alternative was admitting they had been taught by the help.`,
      },
      {
        id: 'kelvar_f2',
        title: 'The Forbidden Index',
        text: `As Archmage, Kelvar was given charge of the Forbidden Index: spells that eat memory, names that summon hunger, maps to places that should not have geography.

He did not destroy them. Destruction is a comforting lie. Knowledge has a way of surviving fire.

Kelvar locked them behind rules, rituals, and himself. It is unclear which barrier is strongest.`,
      },
      {
        id: 'kelvar_f3',
        title: 'The Last Door',
        text: `Students think Kelvar is severe because he enjoys denial. They are wrong.

He has opened enough doors to know that some rooms are not waiting to be entered. Some are waiting to enter you.

When Kelvar says no, wise mages obey. Brilliant mages ask why. Dead mages already did.`,
      },
    ],
  },

  caelwyn_warden: {
    title:  'The Green Shield',
    quote:  '"A warden does not defend the forest from the world. A warden reminds the world it is part of the forest." â€” Caelwyn saying',
    fragments: [
      {
        id: 'caelwyn_warden_f1',
        title: 'The Boundary Stones',
        text: `The Caelwyn Warden learned his first duty beside the boundary stones, where moss covered the names of families older than most kingdoms.

His teacher placed one hand on the stone and one hand on his chest. Both are borders, she said. Guard them carelessly and things cross that should not.

He spent the next year listening to the stones before he was allowed to carry a spear.`,
      },
      {
        id: 'caelwyn_warden_f2',
        title: 'The Poacher Mercy',
        text: `The first poacher he caught was starving.

The law said take the bow. The old anger in the grove said take the hand. The warden took neither. He gave the man food, walked him to the road, and marked every snare for removal.

Mercy did not make him soft. When soldiers came later to burn the grove for timber, he had no mercy left to spend.`,
      },
      {
        id: 'caelwyn_warden_f3',
        title: 'The Living Line',
        text: `In battle, the Caelwyn Warden moves like a fence made of roots.

He does not need to kill quickly. He needs to delay, heal, drag allies back, and make the enemy feel watched by every leaf around them.

The forest has many ways to say no. The warden is one of them.`,
      },
    ],
  },

  lyreth: {
    title:  'The Moonlit Arrow',
    quote:  '"Lyreth does not hunt what she hates. She hunts what the grove can no longer tolerate." â€” Caelwyn elder',
    fragments: [
      {
        id: 'lyreth_f1',
        title: 'The Night Runner',
        text: `Lyreth Moondrift was raised among hunters who painted their arrows with ash and moved only when the moon gave permission.

She was too restless for their silence, always climbing higher, ranging farther, returning with stories nobody asked for and tracks nobody else noticed.

The elders scolded her for wandering. Then she began bringing back warnings three days before danger arrived.`,
      },
      {
        id: 'lyreth_f2',
        title: 'The White Hart Trail',
        text: `Her true trial began with the White Hart, an old spirit-beast seen only before disasters.

Lyreth followed it for nine nights through fog, briar, and dreamlike clearings where footsteps sounded twice. On the tenth dawn, she found raiders marking hidden paths into Caelwyn territory.

She returned with broken arrows, a torn cloak, and enough information to save three groves.`,
      },
      {
        id: 'lyreth_f3',
        title: 'The Drift Name',
        text: `Moondrift is not a family name. It is what hunters call a shot that seems to wander before finding the heart.

Lyreth's arrows do that. They slip through branches, mist, battlefield chaos, and the small arrogance of men who believe distance protects them.

She still wanders. Caelwyn has learned to be grateful.`,
      },
    ],
  },

  caelwyn_herbalist: {
    title:  'The Bitterleaf Hand',
    quote:  '"The difference between medicine and poison is usually patience." â€” Caelwyn herbalist',
    fragments: [
      {
        id: 'herbalist_f1',
        title: 'The Root Cellar',
        text: `The Caelwyn Herbalist learned in a root cellar where winter stores hung from the rafters and every jar could save a life or end one.

Her grandmother made her identify plants by touch in darkness. Smooth stem, safe tea. Hairy stem, fever draught. Three ridges under the leaf, never after sunset.

She learned fear first. Wisdom came later.`,
      },
      {
        id: 'herbalist_f2',
        title: 'The Wrong Cure',
        text: `Her first great mistake was a cure that worked too well.

A soldier with lung rot recovered within a day, then slept for two more and woke unable to remember his brother's name. The herb had pulled sickness and memory together, as if both were weeds.

Since then, she tests everything twice and trusts miracles last.`,
      },
      {
        id: 'herbalist_f3',
        title: 'The Satchel of Small Deaths',
        text: `Her satchel smells of honey, bark, vinegar, and danger.

Inside are poultices, teas, sleeping powders, antivenoms, and three vials she hopes never to use. She will heal an enemy if the battle is over. She will poison one if it is not.

Caelwyn kindness has roots. Roots know how to strangle stone.`,
      },
    ],
  },

  sylara: {
    title:  'The Reviver',
    quote:  '"Sylara does not call souls back. She reminds them who is waiting." â€” Grove mourner',
    fragments: [
      {
        id: 'sylara_f1',
        title: 'The Deer-Eared Child',
        text: `Sylara was born with ears too sharp, eyes too bright, and a habit of turning toward sounds nobody else heard.

In Caelwyn this was not mocked. It was feared politely.

Her village said the old grove had touched her before birth. Sylara said nothing. She was too busy listening to the faint voices that lingered near places where people had almost died.`,
      },
      {
        id: 'sylara_f2',
        title: 'The First Return',
        text: `The first person Sylara revived was her brother after a river took him under the ice.

She did not cast a spell. Not as mages understand it. She knelt, pressed her forehead to his, and spoke to someone farther away than the riverbank.

When he coughed water onto the snow, the village cheered. Sylara wept because she had heard what answered.`,
      },
      {
        id: 'sylara_f3',
        title: 'The Price of the Door',
        text: `Sylara can pull life back from the edge, but she never calls it victory.

Every return leaves a thread behind her eyes. She remembers voices, regrets, unfinished promises, names spoken by people too tired to stay.

Her gift is not gentle. It is beautiful. It is terrible. And when battle turns hopeless, everyone still looks for her.`,
      },
    ],
  },

  theron: {
    title:  'The Greenmarch',
    quote:  '"Theron does not lead Caelwyn. The forest moves, and he happens to be where it becomes a man." â€” Old warden',
    fragments: [
      {
        id: 'theron_f1',
        title: 'The Seed Oath',
        text: `Theron Greenmarch planted his first oath as an acorn.

That was the old way, before kings, borders, and written laws tried to teach Caelwyn to stand still. A child swore what he would protect, buried the promise, and returned each year to see whether it had grown.

Theron's tree grew crooked, broad, and impossible to ignore. So did he.`,
      },
      {
        id: 'theron_f2',
        title: 'The March Without Boots',
        text: `When the Iron Drought came, neighbouring lords expected Caelwyn to retreat into its groves and wait.

Theron marched instead. Not with banners, but with healers, seed carts, wardens, and hunters who knew how to find water where maps showed none. Villages that had never trusted Caelwyn survived because of him.

Afterward they called it conquest. Theron called it gardening at scale.`,
      },
      {
        id: 'theron_f3',
        title: 'The Living Covenant',
        text: `Theron heals as if commanding roots beneath the skin.

Wounds close. Breath steadies. Fear loosens. Those near him feel the old promise of green things: bend, survive, return.

He is not soft. The forest is not soft. It is simply more patient than those who mistake mercy for weakness.`,
      },
    ],
  },

  zareth: {
    title:  'The Hollow Sentinel',
    quote:  '"There is a man inside that armor. The problem is knowing how much of him remains." â€” Mordaine grave-smith',
    fragments: [
      {
        id: 'zareth_f1',
        title: 'The Empty Helm',
        text: `Zareth the Hollow was found in armor that had been sealed from the inside.

He stood among the dead of a forgotten border fort, breathing shallowly through a helm with no visible eye slit. When asked his name, he answered after such a long silence that the search party nearly left.

Zareth, he said. Nothing more.`,
      },
      {
        id: 'zareth_f2',
        title: 'The Weight He Carries',
        text: `Mordaine smiths opened the armor once.

Inside they found scars arranged like script, blackened around the edges, as if something had tried to write a command into his flesh and failed halfway through. Zareth remembered nothing of it.

He asked them to close the armor again. It was easier, he said, when the emptiness had shape.`,
      },
      {
        id: 'zareth_f3',
        title: 'The Provocation',
        text: `In battle, Zareth draws hatred with unnatural ease.

Enemies turn toward him even when wiser targets stand nearby. Their anger deepens, darkens, becomes almost obedient. Zareth accepts it behind his blank helm.

Perhaps the void inside him hungers for rage. Perhaps he simply knows he can endure what others cannot.

He has never explained which answer is worse.`,
      },
    ],
  },

  serix: {
    title:  'The Wretched Blade',
    quote:  '"Serix survived the curse. That does not mean the curse lost." â€” Mordaine exile',
    fragments: [
      {
        id: 'serix_f1',
        title: 'The Man Before Wretched',
        text: `Serix the Wretched had another name once.

Those who knew it are dead, bribed, or unwilling to speak. The fragments that remain describe a proud armsman from the outer Mordaine holdings, a man with a clean blade, a sharp laugh, and too much faith in promises made by nobles.

Then came the expedition beneath the black chapel.`,
      },
      {
        id: 'serix_f2',
        title: 'The Chapel Below',
        text: `The chapel had no doors above ground, only stairs descending through roots and old bone.

Serix returned alone. His armor was split. His skin carried grey cracks like cooled ash. The others did not return at all, though sometimes voices in the walls used their names.

When asked what happened, Serix said only that someone had been feeding the dark.`,
      },
      {
        id: 'serix_f3',
        title: 'The Name He Kept',
        text: `He accepted Wretched as a title because it made people stop looking for tragedy in him.

Tragedy wants pity. Serix wants targets.

His strikes are heavy, direct, almost crude, but the void clinging to him gives each blow the finality of a door being barred. Whatever crawled out beneath the chapel marked him.

It should have killed him first.`,
      },
    ],
  },

  nyxara: {
    title:  'The Voidwalker',
    quote:  '"Nyxara steps where shadows overlap. Follow her only if you are comfortable being misplaced." â€” Mordaine scout',
    fragments: [
      {
        id: 'nyxara_f1',
        title: 'The Girl in the Wrong Room',
        text: `Nyxara Voidwalker first disappeared at age nine.

She had been sleeping in her mother's room during a storm. At dawn she was found in a locked archive three streets away, wrapped in a curtain, calmly reading a map upside down.

No door had opened. No window had broken. Nyxara said the dark between lightning flashes had taken a shortcut.`,
      },
      {
        id: 'nyxara_f2',
        title: 'The Thin Places',
        text: `Mordaine is full of thin places: alleys where sound arrives late, mirrors that reflect old grief, cellars where candle smoke falls downward.

Nyxara learned to find them by instinct. She could step through one shadow and arrive behind another, never far enough to be safe, always far enough to matter.

The first rule of such travel is simple: do not listen to anything that knows your name before you arrive.`,
      },
      {
        id: 'nyxara_f3',
        title: 'The Walker\'s Debt',
        text: `Every shortcut has a cost. Nyxara pays in memories.

Some are small: the taste of pears, a childhood song, the face of a tutor she disliked anyway. Some losses frighten her more.

She keeps a journal tied to her belt and reads it before battle. It tells her who she is. The void tells her where to go.`,
      },
    ],
  },

  mord: {
    title:  'The Forsaken',
    quote:  '"Mord was abandoned by three masters, two gods, and one knife. The knife came back." â€” Mordaine gutter-priest',
    fragments: [
      {
        id: 'mord_f1',
        title: 'The Orphan Contract',
        text: `Mord the Forsaken was sold before he was old enough to understand contracts.

His first owner used him as a runner. His second used him as bait. His third taught him to kill and then tried to spend his life cheaply.

Mord escaped all three. He remembers their faces with professional care.`,
      },
      {
        id: 'mord_f2',
        title: 'The Knife That Returned',
        text: `The story of the returning knife is almost certainly exaggerated.

It says Mord threw a blade at a fleeing merchant-lord, missed, cursed, and found the same knife in his boot three days later with blood already on it. Mord refuses to confirm the tale.

He does, however, still carries a knife nobody has ever seen him sharpen.`,
      },
      {
        id: 'mord_f3',
        title: 'The Loyalty Problem',
        text: `Mord does not betray people. That would imply he belonged to them first.

He sells work, silence, and speed. He does not sell his name, sleep near doors, or drink anything he did not pour himself.

Those who call him faithless misunderstand him. Mord has faith in exactly one person, and that person has kept him alive.`,
      },
    ],
  },

  thalric: {
    title:  'The Barrow-Bound Lord',
    quote:  '"Thalric kneels to no throne. He has seen what sits beneath them." â€” Mordaine herald',
    fragments: [
      {
        id: 'thalric_f1',
        title: 'The Vaelorian Line',
        text: `Thalric Vaelorian was born into an old Mordaine line that measured inheritance in tombs rather than land.

His family guarded barrows older than the kingdom, places where ancient nobles were buried with crowns, curses, and instructions not to open the third door. Thalric grew up with keys around his neck.

He learned early that nobility is often just ancestry refusing to stay buried.`,
      },
      {
        id: 'thalric_f2',
        title: 'The Third Door',
        text: `During a succession feud, rival claimants broke into the deepest barrow and opened the forbidden door.

What emerged did not choose sides. It moved through bloodlines like fire through dry grass.

Thalric sealed the barrow from inside, holding the passage until dawn while his own relatives beat on the stone behind him. When the door opened again, he was alive, older in the eyes, and utterly unwilling to explain.`,
      },
      {
        id: 'thalric_f3',
        title: 'The Iron Bastion',
        text: `Thalric fights like a man defending a threshold nobody else can see.

His shieldwork is patient, severe, and almost ceremonial. He provokes enemies not with insults but with presence, daring them to cross into ground he has already claimed.

The barrows taught him that some doors must hold. Thalric became one.`,
      },
    ],
  },

  gribzak: {
    title:  'The Gearvein Tinkerer',
    quote:  '"If it\'s broken and glowing, that\'s just more power waiting to happen." â€” Gribzak Gearvein',
    fragments: [
      {
        id: 'gribzak_f1',
        title: 'The Scrap Below',
        text: `Gribzak Gearvein was not born into prestige.

He began beneath the floating citadels, where failed rune parts, cracked crystal cores, and expensive mistakes fell from the workshops above. Other children collected coins. Gribzak collected anything that hummed when kicked.

His first forge was a drainage pipe. His first apprentice was a rat that learned to avoid sparks.`,
      },
      {
        id: 'gribzak_f2',
        title: 'The Damaged Stabilizer',
        text: `His green-crystal hammer began as a damaged mining-core stabilizer, discarded after it nearly vaporised three supervisors.

Gribzak saw the problem immediately: everyone had been asking the core to behave. He rebuilt it to misbehave in useful directions.

When the lower forges overloaded years later, polite Valdris artificers refused to touch the engine. Gribzak climbed inside with a wrench, a grin, and no approved safety ritual.`,
      },
      {
        id: 'gribzak_f3',
        title: 'The Exploding Machine',
        text: `House Valdris still argues whether Gribzak is a genius, a hazard, or proof that standards have collapsed.

He does not mind. Labels are for crates.

He can fix a war machine while it is exploding because explosions are simply machines explaining where the pressure went. Gribzak listens, adjusts, and occasionally loses an eyebrow.`,
      },
    ],
  },

  borrik: {
    title:  'The Stormcog Smith',
    quote:  '"Skybreaker doesn\'t care how fancy your spell theory is." â€” Borrik Stormcog',
    fragments: [
      {
        id: 'borrik_f1',
        title: 'The Rune as Gear',
        text: `Borrik Stormcog offended his first Valdris instructor by calling a rune a gear made of light.

He offended the second by being correct.

To Borrik, magic was not mystery. It was pressure, timing, housing, heat, and the awful noise a crystal made when some robed fool installed it backwards. His notes were ugly. His machines worked.`,
      },
      {
        id: 'borrik_f2',
        title: 'Skybreaker',
        text: `Skybreaker was forged around a refined arc-core from the upper citadels, blue-white and furious enough to make nearby nails stand upright.

Borrik spent six months building the hammer and another two teaching it manners. The result could flatten a siege construct or tap a misaligned crystal pin into place without cracking the casing.

He loves both uses equally.`,
      },
      {
        id: 'borrik_f3',
        title: 'The Beloved Hammer',
        text: `For someone carrying a terrifying hextech warhammer, Borrik is unusually warm-hearted.

Apprentices adore him because he explains mistakes before punishing them. Soldiers adore him because his shields hold. Enemies have less time to form an opinion.

After battle, he is often found repairing gear for anyone who asks, humming happily beside a hammer that still smells like thunder.`,
      },
    ],
  },

  zwierls: {
    title:  'The Laughing Hammer',
    quote:  '"I fight the same way I dance. Enthusiastically and without warning." â€” Zwierls',
    fragments: [
      {
        id: 'zwierls_f1',
        title: 'The Three Passions',
        text: `Zwierls of House Valdris has three passions: his rune-hammer, a cold ale, and anyone willing to dance until sunrise.

He discovered the first while breaking a training dummy, the second while apologising for the dummy, and the third when the tavern musician refused to stop playing fast enough for sensible people.

Since then, sensible people have learned to stand clear.`,
      },
      {
        id: 'zwierls_f2',
        title: 'The Friendly Warning',
        text: `Zwierls is warm to everyone he meets, enemies included.

He compliments armor, asks about families, recommends taverns, and gives sincere tactical advice seconds before making that advice irrelevant with a hammer blow. This confuses formal duelists.

The confusion usually ends when he begins the hammer round, a spinning rune-lit assault that looks less like technique and more like joy with a casualty radius.`,
      },
      {
        id: 'zwierls_f3',
        title: 'The Grinning Stone',
        text: `Those who fight beside Zwierls say the strangest part is not the hammer.

It is the grin.

He smiles through mud, thunder, bad odds, and worse music. Not because he fails to understand danger, but because danger has made the mistake of arriving where he is having a good time.

House Valdris has produced many terrifying scholars. Zwierls is proof it also produces terrifying party guests.`,
      },
    ],
  },

  arri: {
    title:  'The Witch of Ledgers',
    quote:  '"I remember everything. Even the things you would rather I forgot." â€” Arri the Witch',
    fragments: [
      {
        id: 'arri_f1',
        title: 'The Library With Warm Windows',
        text: `Arri's library is the largest in Caelwyn.

Visitors expect ancient wisdom, forgotten spells, and shelves smelling of rain and cedar. They find all of that. They also find warm tea, comfortable chairs, a black cat with judgemental eyes, and Arri smiling as if she has been waiting for them specifically.

This is usually when they relax. That is usually their first mistake.`,
      },
      {
        id: 'arri_f2',
        title: 'The Dangerous Shelves',
        text: `Most of Arri's shelves do not hold spellbooks. They hold records.

Every person she has met. What they promised. What they did instead. What they owe. Who lied politely, who lied badly, and who should be given one more chance because grief made them foolish.

Her kindness is real. So is the ink.`,
      },
      {
        id: 'arri_f3',
        title: 'The Second Crossing',
        text: `Arri is generous, patient, and genuinely warm.

She is also the only person in Westrun nobody has ever double-crossed twice.

When her verdant hex settles over a battlefield, enemies feel roots tighten around promises they never kept. Arri does not raise her voice. She merely opens the ledger and lets the world balance itself.`,
      },
    ],
  },

  kyver: {
    title:  'The Rice Warlord',
    quote:  '"For rice and honer." â€” Kyver',
    fragments: [
      {
        id: 'kyver_f1',
        title: 'The Wandering Table',
        text: `Kyver has declined lordships, refused fortunes, and once ended a siege by inviting both sides to dinner.

The meal was rice, salted fish, and vegetables badly chopped by nervous soldiers. By dawn the besiegers had agreed to leave, the defenders had agreed to repair the road that caused the dispute, and Kyver had corrected nobody's spelling because he had written the treaty himself.

It worked anyway.`,
      },
      {
        id: 'kyver_f2',
        title: 'The Flawless Blade',
        text: `His blade is flawless. His spelling is not.

This has led many opponents to the fatal conclusion that Kyver is simple. He encourages this by offering wisdom at inappropriate times, usually mid-battle, and by nodding solemnly at insults he has no intention of remembering.

Then he draws once, cuts precisely, and returns to whatever lesson he was trying to teach.`,
      },
      {
        id: 'kyver_f3',
        title: 'The Men Who Follow',
        text: `Kyver does not conquer followers. He feeds them, listens badly but sincerely, and stands between them and whatever believes kindness is weakness.

Those who underestimate him tend to lose. Those who share a meal with him tend to follow him anywhere.

He says honour is like rice: plain until you need it, terrible when absent, and best when shared.`,
      },
    ],
  },

  vorath: {
    title:  'The Undying',
    quote:  '"Vorath died with a kingdom watching. Then he stood up and made the witnesses regret staying." â€” Mordaine chronicle',
    fragments: [
      {
        id: 'vorath_f1',
        title: 'The First Death',
        text: `Vorath the Undying was once mortal enough to bleed on marble.

He was a prince, warlock, tyrant, saint, or prisoner depending on which banned history you find. All agree on one point: he was executed at dawn before a silent court, and the blade took his head cleanly.

At sunset, the executioner began screaming from inside a locked chapel.`,
      },
      {
        id: 'vorath_f2',
        title: 'The Bargain Without Witnesses',
        text: `No record explains what bargain returned Vorath to his body.

Mordaine priests blame the void. Valdris scholars blame pre-human spellwork. Caelwyn wardens blame the arrogance of men who think death is a door they can own.

Vorath never answers questions about the bargain. He only smiles as if the question itself is younger than he is.`,
      },
      {
        id: 'vorath_f3',
        title: 'The Crown of Return',
        text: `Every time Vorath falls, something comes back with him.

A colder shadow. A new word in a dead language. A memory that cannot belong to this century. His enemies celebrate killing him only once.

He rules nothing openly, commands little directly, and still whole cults arrange themselves around the possibility of his attention. Death made him patient. Undeath made patience dangerous.`,
      },
    ],
  },

  aurelan: {
    title:  'The Dawnspire Prince',
    quote:  '"Aurelan enters battle like sunrise through stained glass: beautiful, blinding, and impossible to argue with." â€” Aldric court poet',
    fragments: [
      {
        id: 'aurelan_f1',
        title: 'The Golden Brother',
        text: `Aurelan Dawnspire was born into a house that expected greatness and received something more inconvenient: decency.

As a child he broke ceremonial rules constantly, not from rebellion but because someone outside the ceremony needed help. He carried water to stablehands in formal silk, knelt beside wounded squires, and once missed his own naming feast to help search for a lost shepherd boy.

The nobles called it unbecoming. The people remembered.`,
      },
      {
        id: 'aurelan_f2',
        title: 'The Duel at First Light',
        text: `His legend began at first light on the western terrace, where an ambitious cousin challenged him for the Dawnspire inheritance.

Aurelan arrived without a helmet. When asked why, he said he wanted his opponent to see that he bore no hatred.

Then he won in seven movements, spared the challenger, and spent the next hour making sure the man's pride had somewhere useful to go.`,
      },
      {
        id: 'aurelan_f3',
        title: 'The Weight of Dawn',
        text: `Mythical power sits strangely on Aurelan.

He carries it not as entitlement but as burden, a brightness that exposes every failure around him including his own. Soldiers follow because he makes them feel seen, not small.

When he raises his blade, the field seems to remember morning. Even the afraid stand taller in that light.`,
      },
    ],
  },

  jade_dragonforge: {
    title:  'The Dragon\'s Chosen',
    quote:  '"I did not come here to hurt you. But I will not leave until this is done." â€” Jade Dragonforge',
    fragments: [
      {
        id: 'jade_f1',
        title: 'The First Offering',
        text: `The dragon did not choose a conqueror.

For three hundred years it had slept beneath black glass ridges, ignoring kings, hunters, priests, and thieves who came demanding scales, flame, blessing, or proof. Jade came carrying a basket of goat meat and bruised apples.

She asked nothing that first day. This confused the dragon enough to keep her alive.`,
      },
      {
        id: 'jade_f2',
        title: 'The Forge Name',
        text: `Dragonforge was not a family name. It was given after Jade rebuilt a broken lance using heat from the dragon's own breath.

The metal should have melted. Instead it folded into green-gold veins, remembering the flame that shaped it. Jade thanked the dragon before testing the weapon.

The dragon, amused against its better judgement, allowed this partnership to continue.`,
      },
      {
        id: 'jade_f3',
        title: 'The Wars She Ended',
        text: `Jade has never started a war.

She has ended several.

Her enemies remember the fire, the lance, the impossible descent from cloud and smoke. Her allies remember something else: she learned every one of their names on the first day and still remembers them when the songs forget.

That is why the dragon carries her. It recognises a rare thing: power that does not hunger first.`,
      },
    ],
  },

  valerius: {
    title:  'The Dawnchaser',
    quote:  '"Valerius walks behind the sun and somehow arrives before it." â€” Ancient court astrologer',
    fragments: [
      {
        id: 'valerius_f1',
        title: 'The Astral Birth',
        text: `Valerius Dawnchaser was born during an eclipse that failed.

The moon crossed the sun, the priests began their chants, and then a white star appeared in the darkened ring where no star had any right to be. The infant opened his eyes at that exact moment.

Ancient Nobles love omens. This one frightened even them.`,
      },
      {
        id: 'valerius_f2',
        title: 'The Body of Starlight',
        text: `As a youth, Valerius learned that his reflection sometimes moved half a breath late.

Then it began moving early.

His tutors discovered he could loosen himself from ordinary form, becoming something between flesh, memory, and starlight. Blades passed through him when his focus held. When it failed, pain returned with interest.

He learned discipline because the stars were beautiful and merciless.`,
      },
      {
        id: 'valerius_f3',
        title: 'The Chase Beyond Morning',
        text: `Dawnchaser is not poetry. It is a warning.

Valerius pursues threats across distance, dream, and omen, following astral fractures before they become disasters. He is gracious, luminous, and very difficult to lie to.

When he enters battle, the air seems full of sunrise that has not happened yet. Enemies feel judged by tomorrow.`,
      },
    ],
  },

  vaeric: {
    title:  'The Raven of Corvayne',
    quote:  '"Lord Vaeric does not drink blood because he needs it. He does it because rituals should be honest." â€” Corvayne chamberlain',
    fragments: [
      {
        id: 'vaeric_f1',
        title: 'The House of Black Cups',
        text: `Lord Vaeric Corvayne inherited a house where every cup was black, every mirror was veiled, and every family portrait had the eyes scratched away.

His relatives called this tradition. Vaeric called it poor lighting.

He restored the mirrors first. Then the portraits. Then he began asking why his bloodline had spent six centuries afraid of seeing itself clearly.`,
      },
      {
        id: 'vaeric_f2',
        title: 'The Raven\'s Curse',
        text: `The Corvayne curse does not kill quickly. It circles.

Ravens gather before illness, betrayal, childbirth, coronation, and war. Vaeric learned their patterns as other children learn weather. When the birds landed on his balcony by the hundred, the court prepared for his death.

Instead, he opened the windows and invited them in.`,
      },
      {
        id: 'vaeric_f3',
        title: 'The Dusk Communion',
        text: `Vaeric's blood magic is elegant in the way a scalpel is elegant.

He gives little away, wastes nothing, and treats power as debt with excellent memory. Those who enter communion with him feel dusk settle under their skin, cold and intimate.

He is not a monster by Ancient Noble standards. This says more about the standards than the man.`,
      },
    ],
  },

  sparring_dummy: {
    title:  'The Straw Champion',
    quote:  '"It has defeated more recruits than most warlords." â€” Training yard instructor',
    fragments: [
      {
        id: 'dummy_f1',
        title: 'The First Opponent',
        text: `The Sparring Dummy has no noble blood, no hidden prophecy, and no opinion about being struck in the face.

It stands in the yard through rain, summer heat, bad sword forms, and the exaggerated confidence of new recruits. Many heroes begin by hitting it badly.

The dummy keeps every lesson.`,
      },
      {
        id: 'dummy_f2',
        title: 'The Humbling Post',
        text: `Veterans respect the dummy more than recruits do.

A recruit sees straw and wood. A veteran sees the first enemy that never flinched, never praised, never forgave sloppy footwork. It teaches without cruelty because it has no feelings to satisfy.

This makes it a better instructor than several famous knights.`,
      },
      {
        id: 'dummy_f3',
        title: 'The Quiet Glory',
        text: `No song will be written for the Sparring Dummy.

Still, every clean strike, every corrected stance, every soldier who learns not to overextend owes it something. It is repaired more often than celebrated.

That is acceptable. Straw has never needed applause.`,
      },
    ],
  },

  militia_conscript: {
    title:  'The Borrowed Spear',
    quote:  '"A conscript is just a frightened citizen standing where a soldier should be. Treat that with respect." â€” Aldric drill sergeant',
    fragments: [
      {
        id: 'conscript_f1',
        title: 'The Notice on the Door',
        text: `The Militia Conscript did not dream of war.

He had a trade, a family, debts, neighbours, and opinions about the price of grain. Then a notice appeared on the village door and his name was read aloud beside men who suddenly avoided looking at one another.

He was given a spear that smelled of oil and another man's hands.`,
      },
      {
        id: 'conscript_f2',
        title: 'The First Drill',
        text: `The first drill was humiliation.

He held the spear wrong. Turned too slowly. Forgot left from right when shouted at by a sergeant with a voice like breaking stone. His palms blistered before noon.

That night, an older soldier wrapped the blisters and said everyone begins by being useless. The trick is surviving long enough to become inconvenient.`,
      },
      {
        id: 'conscript_f3',
        title: 'The Line Learns Him',
        text: `A conscript becomes dangerous when fear stops being surprising.

He still feels it. He simply knows where to put it now: behind the shield, beneath the breath, somewhere it cannot reach the hands.

He is not a hero yet. He is the reason heroes have a line to stand in.`,
      },
    ],
  },

  bloodtusk_raider: {
    title:  'The Red-Tusk Runner',
    quote:  '"Raiders do not attack because they are fearless. They attack because hunger runs faster than fear." â€” Border scout',
    fragments: [
      {
        id: 'bloodtusk_raider_f1',
        title: 'The Painted Tusk',
        text: `The Bloodtusk Raider earns red paint before earning a name.

The first mark is not for killing. It is for returning. Bloodtusk youths are sent beyond the thorn hills with a blade, a waterskin, and instructions to bring back something worth eating or stealing.

Those who return empty-handed are not mocked. They are trained harder. Hunger is considered a teacher.`,
      },
      {
        id: 'bloodtusk_raider_f2',
        title: 'The Border Fire',
        text: `Border villages know the sound of Bloodtusk raids: feet before horns, fire before speeches.

The raider strikes quickly, takes tools, grain, livestock, and anything shining enough to insult someone later. He is not subtle. Subtlety is for people with full storehouses.

To Aldric soldiers, he is a threat. To Bloodtusk elders, he is another mouth trying to become useful.`,
      },
      {
        id: 'bloodtusk_raider_f3',
        title: 'The Clan Road',
        text: `A raider who survives long enough becomes more than a thief.

He learns which walls are weak, which commanders are slow, which roads flood after rain. He becomes the clan's memory of enemy lands.

The red paint thickens. The tusks lengthen. The raids grow bolder.`,
      },
    ],
  },

  bloodraider_tusk: {
    title:  'The Iron-Tusk Bruiser',
    quote:  '"When the small raiders stop shouting, listen. It means the tusk is coming." â€” Aldric border captain',
    fragments: [
      {
        id: 'bloodraider_tusk_f1',
        title: 'The Bigger Shadow',
        text: `Bloodraider Tusk was not always the largest warrior in his band. He became that way by surviving arguments that should have killed him.

Bloodtusk clans do not promote gently. A warrior grows into status by taking the front of the charge until others stop disputing it.

Tusk stopped hearing disputes years ago.`,
      },
      {
        id: 'bloodraider_tusk_f2',
        title: 'The Broken Cart Gate',
        text: `His favourite story involves a merchant cart turned sideways across a narrow pass.

The defenders thought it a barricade. Tusk thought it a door with poor manners. He lowered his shoulder, broke the axle, and sent half the cart into the men behind it.

After that, his band started letting him open negotiations.`,
      },
      {
        id: 'bloodraider_tusk_f3',
        title: 'The Red Path Forward',
        text: `Tusk is not clever in the courtly sense.

He cannot read maps well, dislikes counting beyond enemies he can see, and thinks ambushes are suspiciously quiet. But he understands momentum better than most generals.

Point him at a line, and the line must answer. Many do not answer well.`,
      },
    ],
  },

  karg: {
    title:  'The Bloodtusk Warlord',
    quote:  '"Karg does not unite clans with speeches. He points at something bigger than their feuds." â€” Captured banner-chief',
    fragments: [
      {
        id: 'karg_f1',
        title: 'The Broken Chief',
        text: `Karg the Warlord began as the third son of a minor Bloodtusk chief, which meant he inherited nothing but enemies and a cracked axe.

His brothers fought over the clan fire. Karg left it.

For three winters he gathered outcasts, failed raiders, hungry youths, and old fighters too stubborn to die. When he returned, he did not challenge his brothers. He offered them a larger war.`,
      },
      {
        id: 'karg_f2',
        title: 'The Ambush Lesson',
        text: `Karg's ambushes are brutal because they are patient.

He studies road dust, wagon habits, guard rotations, and the pride of commanders who believe orcs only understand charging. Then he lets them believe it until the trap closes.

The survivors describe him as savage. The dead would have described him as prepared.`,
      },
      {
        id: 'karg_f3',
        title: 'The Warlord\'s Hunger',
        text: `Karg wants more than plunder.

He has seen the training grounds, the border walls, the fat storehouses behind Aldric roads. He understands that civilisation is a machine. He wants to know which gears break first.

The Bloodtusk follow him because he feeds them. They fear him because he is learning.`,
      },
    ],
  },

  ignar_cultist: {
    title:  'The Black-Flame Convert',
    quote:  '"Ignar does not recruit fools. It recruits the wounded and teaches the wound to speak." â€” Valdris inquisitor',
    fragments: [
      {
        id: 'ignar_cultist_f1',
        title: 'The Promised Mage',
        text: `The Ignar Cultist was once a promising Valdris student with clean robes, sharp handwriting, and a future respectable enough to bore him.

He studied flame theory with unusual devotion. Not power first, but meaning. Why did fire rise? Why did it consume? Why did every civilisation gather around it and pretend not to worship?

His questions became less academic each season.`,
      },
      {
        id: 'ignar_cultist_f2',
        title: 'The Ember Sermon',
        text: `The cult found him after a failed experiment burned three fingers and all of his patience.

They did not offer healing. They offered interpretation. Pain was not damage, they said. It was proof that the body had begun learning a brighter language.

He wanted to reject them. Instead he listened.`,
      },
      {
        id: 'ignar_cultist_f3',
        title: 'The Ashen Prayer',
        text: `Now he casts with a blade in one hand and black flame in the other.

He believes destruction is honesty, that everything false should be burned until only shape and appetite remain. Some part of the old student still survives behind the smoke.

That is what makes him dangerous. Fanatics with memories know exactly what they abandoned.`,
      },
    ],
  },

  carnax: {
    title:  'The Destroyer',
    quote:  '"Carnax is not the fire. He is what walks out after the fire has eaten enough." â€” Ignar ash-priest',
    fragments: [
      {
        id: 'carnax_f1',
        title: 'The Pit Crown',
        text: `Carnax the Destroyer was crowned in a pit filled with ash, broken chains, and the bones of challengers who thought size was the only measure of ruin.

The Ignar cult did not choose him because he was strongest. They chose him because the black flame behaved around him like a dog recognising its master.

Carnax laughed when it licked his wounds closed.`,
      },
      {
        id: 'carnax_f2',
        title: 'The Temple Collapse',
        text: `His legend began when a rival sect sealed him inside a burning temple.

For three days the roof glowed red. On the fourth, the walls folded outward as if something inside had grown bored of architecture.

Carnax emerged carrying the altar stone as a weapon. He used it to found the next temple. Ignar priests still consider this efficient theology.`,
      },
      {
        id: 'carnax_f3',
        title: 'The Hunger Named Doctrine',
        text: `Carnax does not preach subtle doctrine.

He believes the world is full of weak structures pretending to be eternal: walls, laws, oaths, kings, bodies. His sacred task is to reveal the lie.

When he raises his weapon, followers call it judgement. Victims call it the end. Carnax calls it clearing space.`,
      },
    ],
  },

  skeleton_warrior: {
    title:  'The Bone That Remembers',
    quote:  '"Do not mock the skeleton. It remembers swordwork better than you remember breakfast." â€” Barrow guide',
    fragments: [
      {
        id: 'skeleton_warrior_f1',
        title: 'The Nameless Soldier',
        text: `The Skeleton Warrior had a name once.

It was carved into a wooden marker that rotted before the war ended. He was buried with a cheap blade, a dented helm, and no priest because the living were busy becoming dead elsewhere.

The soil forgot him. The sword did not.`,
      },
      {
        id: 'skeleton_warrior_f2',
        title: 'The Rattle in the Dark',
        text: `When Mordaine necromancy stirred the barrows, the bones rose without understanding why.

Memory returned in pieces: weight of shield, angle of cut, pain that no longer mattered, orders shouted by captains long dust. The skeleton did not need lungs to obey.

It walked because war was the last instruction it had received.`,
      },
      {
        id: 'skeleton_warrior_f3',
        title: 'The Old Drill',
        text: `A living recruit fears death. A skeleton has already completed that lesson.

It advances with simple, terrible discipline, repeating sword forms learned in another age. Break an arm and the other lifts the blade. Shatter ribs and the feet keep coming.

There is no hatred in it. Hatred would be warmer.`,
      },
    ],
  },

  zombie_brute: {
    title:  'The Grave-Muscled Brute',
    quote:  '"It is not alive. Unfortunately, nobody told its arms." â€” Aldric pikeman',
    fragments: [
      {
        id: 'zombie_brute_f1',
        title: 'The Buried Giant',
        text: `The Zombie Brute was once a massive labourer who hauled stones for a fortress that no longer stands.

He died under a collapsed wall, crushed with the work still unfinished. The overseers buried him where he fell because moving him would have required kindness or machinery.

Centuries later, Mordaine rot found the body and mistook unfinished labour for purpose.`,
      },
      {
        id: 'zombie_brute_f2',
        title: 'The First Movement',
        text: `The brute rose slowly.

Roots snapped around its shoulders. Grave soil slid from muscle gone grey and hard as wet clay. It did not groan from hunger as lesser dead do. It pushed upward as if the earth itself were merely another stone to lift.

The first necromancer to see it applauded. The brute killed him by accident while standing.`,
      },
      {
        id: 'zombie_brute_f3',
        title: 'The Weight of No Thought',
        text: `There is little mind left in the Zombie Brute, and that is its horror.

Pain gives no instruction. Fear finds no purchase. Commands reach it dimly, like sound through mud, but momentum speaks clearly.

Once it begins moving, the battlefield must rearrange itself around the fact of its body.`,
      },
    ],
  },

  barrow_knight: {
    title:  'The Knight Beneath the Hill',
    quote:  '"The Barrow Knight still guards his lord. The tragedy is that his lord stopped being worth guarding several centuries ago." â€” Mordaine historian',
    fragments: [
      {
        id: 'barrow_knight_f1',
        title: 'The Oath Underground',
        text: `The Barrow Knight was buried standing.

Old Mordaine rites demanded that a lord's finest protector descend into the tomb alive, armored, armed, and sworn to keep watch until the last candle failed. The chronicles call this honour.

The scratches inside the helm suggest the knight may have used another word.`,
      },
      {
        id: 'barrow_knight_f2',
        title: 'The Door Opens',
        text: `When the barrow cracked during the Night of Hollow Rain, the knight stepped out still holding the same sword.

The world had changed. The house he served had rotted into myth. His lord's bones wore a crown of black fungus and whispered orders through a jaw held together by wire.

The oath remained. Oaths are crueler than memory.`,
      },
      {
        id: 'barrow_knight_f3',
        title: 'The Shield of the Dead',
        text: `The Barrow Knight fights with heavy, mournful precision.

Each blow carries the weight of ceremonies nobody performs anymore. Each wave of dark power smells of sealed stone and old incense. He does not rage.

Rage belongs to the living. The Barrow Knight has only duty, and duty has had centuries to harden.`,
      },
    ],
  },

  lich_sovereign: {
    title:  'The Sovereign Below',
    quote:  '"A king afraid of death is dangerous. A king who solved it is worse." â€” Forbidden Mordaine chronicle',
    fragments: [
      {
        id: 'lich_sovereign_f1',
        title: 'The Last Coronation',
        text: `The Lich Sovereign ruled a kingdom whose name was deliberately removed from maps.

At his final coronation, every bell rang backward, every candle burned green, and every noble in attendance wore a funeral mask. The priests declared him eternal.

They meant his dynasty. He chose to misunderstand.`,
      },
      {
        id: 'lich_sovereign_f2',
        title: 'The Treasury of Souls',
        text: `He built a treasury beneath the palace and filled it not with gold, but with names.

Soldiers, servants, rivals, wives, children, traitors, saints. Every soul owed to the crown, bound by law twisted into necromancy. When rebellion finally reached the throne room, the Sovereign opened the treasury.

The rebels won the palace and lost the dead.`,
      },
      {
        id: 'lich_sovereign_f3',
        title: 'The Crown That Revives',
        text: `The Sovereign's body can be shattered. His crown remembers how to assemble him again.

Bone returns to bone. Frost gathers. Darkness kneels. The dead around him rise because monarchy, at its worst, is the belief that even death must obey rank.

When he speaks, old graves listen.`,
      },
    ],
  },

  architect: {
    title:  'The Maker Behind the Rules',
    quote:  '"I designed this world. Every encounter, every rule, every exploit you found â€” I put it there." â€” The Architect',
    fragments: [
      {
        id: 'architect_f1',
        title: 'The First Grid',
        text: `Before Westrun had banners, roads, houses, or graves, there was a plan.

Not a divine song. Not a natural accident. A structure. Lines of possibility laid over empty dark, rules written before there were hands to break them. The Architect stood before that emptiness and chose where the first horizon would be.

Then they made it beautiful enough that the rules could be forgiven.`,
      },
      {
        id: 'architect_f2',
        title: 'The Hidden Hand',
        text: `The Architect does not rule the world from a throne.

They are present in smaller cruelties and kindnesses: the difficulty of a first battle, the mercy of a reward chest, the strange way effort becomes progress if repeated long enough. Every exploit found by clever minds was once a door left slightly open.

This may have been generosity. This may have been testing. The difference is difficult to measure from inside the design.`,
      },
      {
        id: 'architect_f3',
        title: 'The Demonstration',
        text: `When The Architect appears on the battlefield, the result is not a fight.

It is a demonstration.

Health, damage, speed, resistance, affinity â€” all the sacred numbers bend like wet ink. They do not cheat. Cheating implies rules belonging to someone else.

The Architect simply edits the room until victory remembers who wrote it.`,
      },
    ],
  },

}

// Bond lore â€” keyed by bond id. Shown in the bond reveal modal and Codex Lore tab.
export const BOND_LORE = {
  iron_vow: {
    name:        'The Iron Vow',
    subtitle:    'Lord Aldric Â· Helga',
    quote:       '"They don\'t need signals. They don\'t need orders. You put them on the same line and the battle just... resolves." â€” House Aldric commander',
    body: `Nobody witnessed the vow. That is the point.

There was no ceremony, no witness, no record written in the hall. They were standing at the edge of a field after a skirmish that had gone longer than it should have, and Aldric said something nobody else heard, and Helga said something back, and that was the whole of it.

What is known is what changed afterward. The camp noticed it before the soldiers did. The way they moved through it â€” separately, differently â€” but always with an awareness of where the other one was. Not looking. Not checking. Just knowing.

In battle it is something else entirely.

He takes the line that needs holding. She takes the line that needs breaking. They never discuss it beforehand. They have been doing this long enough that the conversation already happened, years ago, somewhere in all the fights they survived before they found each other.

The soldiers say if you watch carefully, you can catch the moment before the charge when they glance at each other. Just once. Just long enough.

Then they go.

The armor she wears was her grandmother's. The fire in his gauntlets has no name. Between them, somehow, both of those things make more sense together than they ever did apart.

They have never lost a battle they fought side by side.

This may be coincidence. The soldiers do not believe it is.`,
  },

  last_conquest: {
    name:     'The Last Conquest',
    subtitle: 'Arne Frostbound · Hilda the Shieldmaiden',
    quote:    '"He came to that gate with a warband and a reputation. She sent him home alone, twice, before she let him through. Now nobody sends either of them home." — Ignar border record',
    body: `Arne Frostbound had taken twelve territories by the time he reached the western gate.

He was not expecting a gate that talked back.

Hilda had held that village for three years without reinforcements, without recognition, and without asking for either. When Arne arrived with his warband and his standard, she came out alone. She did not draw her shield. She asked him what he planned to do with the land after he took it, and whether he had thought about the people who would still be living there once his warband moved on.

He did not have a good answer. She told him to come back when he did.

He came back twice more before she let him through the gate. Each time, his answer was better. Each time, she told him it still wasn't enough. The third time, he didn't bring a warband. He came alone, in the rain, with a plan for the village that she later admitted was actually quite good.

She has never once admitted that was the moment she decided.

He will tell anyone who asks that conquering twelve territories was easy. He will tell them, if they keep asking, that nothing he has done since has been as difficult or as worth it as earning the trust of the woman at the gate.

They fight differently. He goes forward. She holds the line. Between them, there is no line that has ever needed to be redrawn.`,
  },
}

