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
]
