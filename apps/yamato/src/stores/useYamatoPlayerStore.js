import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'yamato-player'

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const YAMATO_REGIONS = [
  { id: 'seiryozan',    name: 'Seiryōzan',      sub: 'DragonPeaks',        kanji: '青龍山', color: '#4a7aaa', affinity: 'Void' },
  { id: 'kazanbi',      name: 'Kazanbi',         sub: 'The Ashen Heart',    kanji: '火山火', color: '#cc4422', affinity: 'Force' },
  { id: 'hokkaimori',   name: 'Hokkaimori',      sub: 'Spirit Forest',      kanji: '北海森', color: '#4a8844', affinity: 'Spirit' },
  { id: 'sakuragawa',   name: 'Sakuragawa',      sub: 'Blossom Valley',     kanji: '桜川',   color: '#cc6688', affinity: 'Force' },
  { id: 'heianjo',      name: 'Heianjo',         sub: 'Celestial Capital',  kanji: '平安城', color: '#cc9922', affinity: 'Magic' },
  { id: 'suisen',       name: 'Suisen no Satō',  sub: 'Jadewater Terraces', kanji: '翠泉の里', color: '#44aaaa', affinity: 'Spirit' },
  { id: 'kitsune',      name: 'Kitsunegashima',  sub: 'Fox Isles',          kanji: '狐ヶ島', color: '#cc7722', affinity: 'Void' },
  { id: 'yokaigata',    name: 'Yokaigata',       sub: 'Haunted Marshes',    kanji: '妖怪潟', color: '#7744aa', affinity: 'Magic' },
  { id: 'shiogami',     name: 'Shiogami',        sub: 'Tidetorn Cliffs',    kanji: '潮神',   color: '#2266aa', affinity: 'Force' },
]

export const useYamatoPlayerStore = defineStore('yamato-player', () => {
  const saved = loadSaved()

  const playerName   = ref(saved?.playerName   ?? null)
  const regionId     = ref(saved?.regionId     ?? null)
  const clanTitle    = ref(saved?.clanTitle    ?? null)

  const isCreated = computed(() => playerName.value !== null && regionId.value !== null)
  const region    = computed(() => YAMATO_REGIONS.find(r => r.id === regionId.value) ?? null)

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      playerName: playerName.value,
      regionId:   regionId.value,
      clanTitle:  clanTitle.value,
    }))
  }

  function create(name, region, title) {
    playerName.value = name.trim()
    regionId.value   = region
    clanTitle.value  = title ?? null
    persist()
  }

  return { playerName, regionId, clanTitle, isCreated, region, create }
})
