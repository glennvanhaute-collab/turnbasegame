export const RAIDS = [
  {
    id: 'throne_of_regret',
    name: 'The Throne of Regret',
    boss: 'Batman, Lord of Nightmares',
    subtitle: 'Dungeon Arena',
    difficulty: 5,
    bgFile: 'Raid_fallen-king-batman',
    setting: 'A ruined throne room suspended in an endless void.',
    features: [
      'Endless darkness beyond the walls',
      'Thousands of empty thrones',
      'Ghostly citizens watching silently',
      'Giant stained-glass windows depicting happier times',
      'Swarms of shadow bats circling overhead',
      'A massive broken crown hanging above the arena',
    ],
    phases: [
      {
        number: 1,
        name: 'The Noble King',
        threshold: null,
        description: 'Batman still believes he can save everyone.',
        transition: null,
        abilities: [
          {
            name: 'Royal Decree',
            description: 'Marks players with impossible expectations. Damage increases based on how many allies are alive.',
          },
          {
            name: 'Burden of Duty',
            description: 'Absorbs damage intended for his minions.',
          },
          {
            name: '"I Can Fix This"',
            description: 'Heals himself whenever players remove debuffs.',
          },
        ],
      },
      {
        number: 2,
        name: 'Prisoner of the Mind',
        threshold: 70,
        description: 'The king begins arguing with voices nobody else can hear. His glasses crack. One eye glows bright gold. The other burns crimson.',
        transition: 'The throne room collapses.',
        abilities: [
          {
            name: 'Endless Doubt',
            description: 'Creates shadow clones of the players.',
          },
          {
            name: 'What If I Failed?',
            description: 'Forces players to relive previous mistakes.',
          },
          {
            name: 'The Labyrinth',
            description: 'The arena becomes a maze of memories.',
          },
        ],
      },
      {
        number: 3,
        name: 'Batman, Lord of Nightmares',
        threshold: 30,
        description: 'The king realizes he can never save everyone. Instead of accepting it — he embraces the darkness. His beard becomes streaked with shadow. His glasses become a black void. Great wings made of living darkness erupt from his back.',
        transition: 'The crown shatters.',
        abilities: [
          {
            name: 'Kingdom of One',
            description: 'Instantly destroys all summoned creatures.',
          },
          {
            name: 'Prison of the Mind',
            description: 'Traps players in their own fears.',
          },
          {
            name: 'The Endless Night',
            description: 'Arena slowly darkens until only his glowing silhouette remains.',
          },
        ],
      },
    ],
    finalQuote: 'I gave them everything.\nIt was never enough.\nSo now...\nlet the night judge us all.',
    status: 'available',
  },
  {
    id: 'malachar_void',
    name: 'The Null Throne',
    boss: 'Malachar, Vanguard of the Void',
    subtitle: 'Void Sanctum',
    difficulty: 5,
    bgFile: 'malachar_raid',
    lore: 'The Void does not hate. It does not want. Malachar learned this before he stopped being a man.\n\nHe was once a general of the high houses — a tactician without equal, decorated at thirty, feared at forty. He studied the Void as a weapon: how to harness its entropy, turn its emptiness into leverage. He succeeded. He opened a gate that should never have been opened.\n\nWhat came through was not power. It was understanding.\n\nThe Void is not the end of things. It is their natural state. The noise of the living world — ambition, fear, love, grief — is the aberration. Malachar stood at the edge of that truth and let it empty him.\n\nHe came back without the trembling that haunts lesser void-touched soldiers. No madness. No rage. No grief for what he had surrendered. His superiors called it mastery. His enemies called it terrifying. Both were wrong. There was simply no one left to be afraid.\n\nHe commands the Void\'s forces because command requires no feeling — only clarity. The armies of the Void have found their perfect instrument: something that does not waver, does not second-guess, and has not felt the cold in years.\n\nHe comes before his master because his master does not need to come yet.',
    setting: 'A sanctum without walls. The floor is a perfect mirror of nothingness. The throne he arrived from floats at the back of the arena, empty. Temperature drops where he stands.',
    features: [
      'The floor mirrors nothing — no reflection, no depth',
      'Void tendrils coil at the edges, watching but never advancing',
      'His empty throne drifts behind him, uninhabited',
      'Temperature falls wherever he moves',
      'His footsteps make no sound',
      'The sky above is not dark — it is simply absent',
    ],
    phases: [
      {
        number: 1,
        name: 'The Vanguard',
        threshold: null,
        description: 'Malachar does not open with fury. He opens with precision. Every strike is a calculation. He does not enjoy this — enjoyment requires something he no longer has.',
        transition: null,
        abilities: [
          { name: 'Void Strike',   description: 'A single devastating blow. 380% ATK damage to one target. No buildup. No warning.' },
          { name: 'Null Decree',   description: 'All buffs on the enemy team are stripped simultaneously. No status immunity applies.' },
          { name: 'Voidgate',      description: '220% AOE damage. Opens a rift that silences all players for 1 turn.' },
        ],
      },
      {
        number: 2,
        name: 'The Null Commander',
        threshold: 65,
        description: 'The void around him thickens. Blue flame spreads across his crown. He does not escalate out of desperation — he escalates because the calculation demands it.',
        transition: 'The mirror floor fractures. Void light bleeds through the cracks.',
        abilities: [
          { name: 'Absence',         description: 'Malachar steps into the void briefly. Becomes untargetable for 1 turn. Void tendrils attack all enemies for 160% ATK each.' },
          { name: 'Entropy Pulse',   description: '260% AOE damage. Applies a stacking void-mark debuff: each mark increases damage taken by 8% for 3 turns.' },
          { name: 'Command the Dark',description: 'Raises his own ATK by 40% and DEF by 20% for 3 turns. Removes one debuff from himself.' },
        ],
      },
      {
        number: 3,
        name: 'Malachar, the Void Incarnate',
        threshold: 30,
        description: 'The commander dissolves the last of what he was. His form becomes partially void — parts of him simply missing, revealing swirling dark behind. He does not speak. He does not need to.',
        transition: 'The floating throne collapses inward and vanishes.',
        abilities: [
          { name: 'Null Convergence', description: 'A singularity collapses at the center of the battlefield. 340% AOE damage to all enemies. Cannot be dodged or shielded.' },
          { name: 'Void Erasure',     description: 'Targets the lowest-HP hero. 500% single-target damage. If it kills, Malachar heals 15% max HP.' },
          { name: 'The Silence Before', description: 'Removes all buffs, dispels all shields, and reduces all enemy SPD by 30% for 2 turns. Then acts again immediately.' },
        ],
      },
    ],
    finalQuote: 'You brought your grief here.\nYour anger.\nYour hope.\nNone of it reaches me.\nThere is only the work.',
    status: 'available',
  },
  {
    id: 'void_heir',
    name: 'The Void Heir',
    boss: 'Aurelian Dragonforge',
    subtitle: 'Eclipse Arena',
    difficulty: 5,
    bgFile: 'Aurelian-Dragonforge',
    lore: 'Aurelian Dragonforge was not corrupted. He chose.\n\nOnce a warlord of the old order, Aurelian spent years studying the Void not as an enemy to repel, but as a truth to understand. What he found at its edge — Nytherax, the Starless Wyrm, coiled between collapsed stars — did not drive him mad. It convinced him. The Void does not destroy. It completes. Everything the living world calls loss is simply the universe finishing a sentence it started.\n\nHe returned wearing a crown that drinks light and a title no one granted him: Heir. Not of any throne of men, but of what comes after all thrones.\n\nNytherax follows him not out of domination but recognition — the dragon and the man are the only two things that have looked into the end of the world and come back unchanged. The wyrm\'s body exists in several places at once; where its wings open, stars go dark, because they are already gone in the future Aurelian walks toward.\n\nHe does not hate the people who come to stop him. He finds them interesting. They are proof that something still resists — and resistance, he has learned, is just the last thing a thing does before it becomes nothing.\n\nHis shadow falls in three directions at once. The arena smells like the end of something. He fights with the calm certainty of a man who has already seen how this goes.',
    setting: 'A fractured sky suspended above the void. Stars collapse near Nytherax\'s wings. Reality does not hold here.',
    features: [
      'A permanent eclipse — black sun haloed by violet light',
      'Stars vanishing near the edges of the arena',
      'Nytherax coiled in the dark beyond, incomprehensibly vast',
      'Aurelian\'s shadow falls in three directions at once',
      'Gravity flows sideways across the lower half of the battlefield',
      'The air smells like the end of something',
    ],
    phases: [
      {
        number: 1,
        name: 'The Void Heir',
        threshold: null,
        description: 'Aurelian fights with the calm certainty of someone who has already won. He is not cruel. He is just further along a road everyone else refuses to walk.',
        transition: null,
        abilities: [
          {
            name: 'Eclipse Slash',
            description: 'A void-edged blade strike that deals massive single-target damage and strips one defensive buff.',
          },
          {
            name: 'Crown of Hunger',
            description: 'His crown absorbs ambient life force. Aurelian heals and gains increased ATK for 3 turns.',
          },
          {
            name: 'Void Dominion',
            description: 'Reality bends around his authority. All players suffer reduced DEF and take increased damage for 2 turns.',
          },
        ],
      },
      {
        number: 2,
        name: 'Nytherax Awakens',
        threshold: 65,
        description: 'The dragon unfolds. Where its wings spread, stars go dark. Parts of its body are simply missing — those gaps reveal swirling galaxies that shouldn\'t be visible from here.',
        transition: 'Nytherax spreads its impossible wings. The sky empties.',
        abilities: [
          {
            name: 'Singularity Breath',
            description: 'A collapsing singularity strikes all players. Pulls them toward its center, dealing massive AOE damage.',
          },
          {
            name: 'Starless Wings',
            description: 'Nytherax banks across the battlefield. All players are stunned and take heavy damage.',
          },
          {
            name: 'Reality Rift',
            description: 'A tear opens in the arena. One player is isolated from their allies — they cannot receive heals for 2 turns.',
          },
        ],
      },
      {
        number: 3,
        name: 'Aurelian, Lord of the Eclipse',
        threshold: 30,
        description: 'The boundary between Aurelian and the void dissolves. Half his body becomes cosmic darkness. His wings form from tears in reality itself. He is no longer fighting to win — he is simply what happens to things that end.',
        transition: 'The eclipse completes. Aurelian\'s form tears open.',
        abilities: [
          {
            name: 'Eclipse of All',
            description: 'A cataclysmic AOE that deals extreme damage and silences all players for 1 turn.',
          },
          {
            name: 'Entropy\'s Embrace',
            description: 'Drains life from all players simultaneously, healing both Aurelian and Nytherax.',
          },
          {
            name: 'Transcendence',
            description: 'Aurelian becomes briefly untargetable as he dissolves further into the void. Nytherax attacks freely during this time.',
          },
        ],
      },
    ],
    finalQuote: 'She called me back.\nEven at the end.\nI could hear her voice — across the void, through the dark, past what I had become.\nI chose not to answer.\nThat was the last thing that hurt.',
    status: 'available',
  },
]
