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
    id: 'void_heir',
    name: 'The Void Heir',
    boss: 'Aurelian Dragonforge',
    subtitle: 'Eclipse Arena',
    difficulty: 5,
    bgFile: 'Aurelian-Dragonforge',
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
