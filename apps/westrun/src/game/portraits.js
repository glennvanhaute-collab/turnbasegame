// Portrait lookup backed by public/units/ — no Vite asset processing, just URL paths.
// To add a new portrait: drop the file in public/units/{rarity}/ and add one entry here.
const B = import.meta.env.BASE_URL

const MANIFEST = {
  // root
  'seraphel_01':           'units/Seraphel_01.png',
  'aldric_starter':        'units/aldric_starter.jpg',
  'advisor':               'units/advisor.png',
  'advisor_with_text':     'units/advisor_with_text.png',
  'advisor_with_text_v2':  'units/advisor_with_text_v2.png',
  'sprite_lord_aldric':    'units/sprite_lord_aldric.png',
  // avatars
  'avatar_01': 'units/avatar_01.png',
  'avatar_02': 'units/avatar_02.png',
  'avatar_03': 'units/avatar_03.png',
  'avatar_04': 'units/avatar_04.png',
  'avatar_05': 'units/avatar_05.png',
  // ancient
  'lord-vaeric-corvayne':  'units/ancient/lord-vaeric-corvayne.png',
  'valerius-dawnchaser':   'units/ancient/valerius-dawnchaser.png',
  // enemies
  'malachar':                   'units/enemy/Malachar.png',
  'bloodraider-tusk':           'units/enemy/bloodraider-tusk.png',
  'bloodtusk-raider':           'units/enemy/bloodtusk-raider.png',
  'karg-the-warlord':           'units/enemy/karg-the-warlord.png',
  'lich-sovereign':             'units/enemy/lich-sovereign.png',
  'nytherax-the-starless-wyrm': 'units/enemy/nytherax-the-starless-wyrm.png',
  'skeleton-warrior':           'units/enemy/skeleton-warrior.png',
  'zombie-brute':               'units/enemy/zombie-brute.png',
  // epic
  'eilistra':            'units/epic/Eilistra.jpg',
  'barrow-knight':       'units/epic/Barrow-Knight.png',
  'borrik-stormcog':     'units/epic/Borrik-Stormcog.png',
  'eron':                'units/epic/Eron.png',
  'gwendal-ironvow':     'units/epic/Gwendal-Ironvow.png',
  'hilda-the-shieldmaiden': 'units/epic/Hilda-the-shieldmaiden.png',
  'mira-of-caelwyn':     'units/epic/Mira-of-Caelwyn.png',
  'velmorn-the-shadow':  'units/epic/Velmorn-the-Shadow.png',
  'arne-frostbound':     'units/epic/arne-frostbound.png',
  'marina-aegira':        'units/epic/marina-aegira.png',
  'glennios-aegira':      'units/epic/glennios-aegira.png',
  'brenna-shieldmaiden': 'units/epic/brenna-shieldmaiden.png',
  'caelwyn-warden':      'units/epic/caelwyn-warden.png',
  'caius-stormbinder':   'units/epic/caius-stormbinder.png',
  'ignar-cultist':       'units/epic/ignar-cultist.png',
  'mord-the-forsaken':   'units/epic/mord-the-forsaken.png',
  'ser-roland':          'units/epic/ser-roland.png',
  'serix-the-wretched':  'units/epic/serix-the-wretched.png',
  'sylara-the-reviver':  'units/epic/sylara-the-reviver.png',
  'thalric-vaelorian':   'units/epic/thalric-vaelorian.png',
  'zwierls':             'units/epic/zwierls.png',
  // legendary
  'arri-the-witch':       'units/legendary/Arri-the-witch.png',
  'helga':                'units/legendary/Helga.png',
  'kyver':                'units/legendary/Kyver.png',
  'archmage-kelvar':      'units/legendary/archmage-kelvar.png',
  'carnax-the-destroyer': 'units/legendary/carnax-the-destroyer.png',
  'genesis':              'units/legendary/genesis.png',
  'lord-aldric':          'units/legendary/lord-aldric.png',
  'king-hartvane':        'units/legendary/king-hartvane.png',
  'ser-roswaine':         'units/legendary/ser-roswaine.png',
  'lord-aldric copy':     'units/legendary/lord-aldric copy.png',
  'seraphel':             'units/legendary/seraphel.png',
  'theron-greenmarch':    'units/legendary/theron-greenmarch.png',
  // mythical
  'the-architect':         'units/mythical/The-architect.png',
  'aurelian-dragonforge':  'units/mythical/Aurelian-Dragonforge.png',
  'jade-dragonforge':      'units/mythical/Jade-dragonforge.png',
  'raid_fallen-king-batman': 'units/mythical/Raid_fallen-king-batman.png',
  'archmage-valdris':      'units/mythical/archmage-valdris.png',
  'aurelan-dawnspire':     'units/mythical/aurelan-dawnspire.png',
  'lord-caelwyn':          'units/mythical/lord-caelwyn.png',
  'lord-mordaine':         'units/mythical/lord-mordaine.png',
  'lord_caelwyn_alternate':'units/mythical/lord_caelwyn_alternate.png',
  'vorath-the-undying':    'units/mythical/vorath-the-undying.png',
  // rare
  'arendial':            'units/rare/Arendial.png',
  'draven-spellblade':   'units/rare/Draven-Spellblade.png',
  'durwald-the-immovable':'units/rare/Durwald-the-Immovable.png',
  'elara-frostweaver':   'units/rare/Elara-Frostweaver.png',
  'gribzak-gearvein':    'units/rare/Gribzak-Gearvein.png',
  'lyra-of-the-crescent':'units/rare/Lyra-of-the-Crescent.png',
  'lyreth-moondrift':    'units/rare/Lyreth-Moondrift.png',
  'mirena-ashveil':      'units/rare/Mirena-Ashveil.png',
  'nyxara-voidwalker':   'units/rare/Nyxara-Voidwalker.png',
  'rowan-the-wandering': 'units/rare/Rowan-the-Wandering.png',
  'sir-hadvar':          'units/rare/Sir-Hadvar.png',
  'thrandyl':            'units/rare/Thrandyl.png',
  'zareth-the-hollow':   'units/rare/Zareth-the-Hollow.png',
  'aldric-marksman':     'units/rare/aldric-marksman.png',
  'caelwyn-herbalist':   'units/rare/caelwyn-herbalist.png',
  'garrett-the-unbroken':'units/rare/garrett-the-unbroken.png',
  'gorundal':            'units/rare/gorundal.png',
}

export function getPortrait(hero) {
  if (!hero) return null
  const nameKey = hero.name?.toLowerCase().replace(/\s+/g, '-')
  if (nameKey && MANIFEST[nameKey]) return B + MANIFEST[nameKey]
  const idKey = hero.id?.replace(/_/g, '-')
  return MANIFEST[idKey] ? B + MANIFEST[idKey] : null
}

export const PORTRAIT_MAP = Object.fromEntries(
  Object.entries(MANIFEST).map(([k, v]) => [k, B + v])
)

export const PLAYER_AVATARS = {
  avatar_01: B + 'units/avatar_01.png',
  avatar_02: B + 'units/avatar_02.png',
  avatar_03: B + 'units/avatar_03.png',
  avatar_04: B + 'units/avatar_04.png',
  avatar_05: B + 'units/avatar_05.png',
}
