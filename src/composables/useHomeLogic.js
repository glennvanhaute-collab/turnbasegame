import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCollectionStore }    from '../stores/useCollectionStore.js'
import { useCampaignStore }      from '../stores/useCampaignStore.js'
import { useInventoryStore }     from '../stores/useInventoryStore.js'
import { useIdleTrainingStore }  from '../stores/useIdleTrainingStore.js'
import { usePlayerHeroStore }    from '../stores/usePlayerHeroStore.js'
import { useCampStore }          from '../stores/useCampStore.js'
import { useCurrencyStore }      from '../stores/useCurrencyStore.js'
import { ENCOUNTERS }            from '../game/data/heroes.js'
import { computeCP, formatCP }   from '../game/cp.js'

export function useHomeLogic(emit) {
  const activeHomeTab = ref('training')

  const camp       = useCampStore()
  const currency   = useCurrencyStore()
  const collection = useCollectionStore()
  const campaign   = useCampaignStore()
  const inventory  = useInventoryStore()
  const idle       = useIdleTrainingStore()
  const playerHero = usePlayerHeroStore()

  let _campInterval = null
  onMounted(() => {
    camp.catchUp(g => currency.addGold(g))
    _campInterval = setInterval(() => camp.tick(g => currency.addGold(g)), 60_000)
  })
  onUnmounted(() => clearInterval(_campInterval))

  // Zone positions mapped to the training_camp image
  const ZONE_POSITIONS = [
    { left: '23%', top: '30%' },
    { left: '30%', top: '18%' },
    { left: '74%', top: '36%' },
    { left: '23%', top: '72%' },
    { left: '33%', top: '67%' },
    { left: '80%', top: '72%' },
  ]

  const teamCP = computed(() =>
    collection.team.reduce((sum, key) => sum + inventory.heroCP(key), 0)
  )

  function encounterCP(enc) {
    return enc.enemies.reduce((sum, factory) => sum + computeCP(factory()), 0)
  }

  function cpVerdict(enc) {
    const ecp = encounterCP(enc)
    const r   = ecp > 0 ? teamCP.value / ecp : 1
    if (r >= 1.15) return { label: 'Strong',    cls: 'verdict-strong' }
    if (r >= 0.85) return { label: 'Even',       cls: 'verdict-even'   }
    return               { label: 'Outmatched', cls: 'verdict-weak'   }
  }

  const selectedIndex = ref(null)
  const selectedEnc   = computed(() =>
    selectedIndex.value !== null ? ENCOUNTERS[selectedIndex.value] : null
  )

  const DIFFICULTY_ORDER = ['Easy', 'Normal', 'Hard', 'Brutal', 'Nightmare']
  const difficultyGroups = computed(() => {
    const groups = {}
    ENCOUNTERS.forEach((enc, i) => {
      if (!groups[enc.difficulty]) groups[enc.difficulty] = []
      groups[enc.difficulty].push({ ...enc, index: i })
    })
    return DIFFICULTY_ORDER
      .filter(d => groups[d])
      .map(d => ({ label: d, cls: d.toLowerCase(), encounters: groups[d] }))
  })

  function selectZone(i) {
    selectedIndex.value = selectedIndex.value === i ? null : i
  }

  function teamEntry(key) {
    return collection.roster.find(r => r.key === key)
  }

  const canBattle = computed(() => {
    if (!selectedEnc.value) return false
    if (!collection.isReady) return false
    return true
  })

  const battleHint = computed(() => {
    if (!collection.isReady) return 'Build a team in Collection first'
    return ''
  })

  function startBattle() {
    if (!canBattle.value) return
    emit('start-battle', selectedIndex.value)
  }

  const isActiveIdleZone = computed(() =>
    selectedEnc.value !== null &&
    idle.session?.encounterId === selectedEnc.value.id
  )

  const lastCollect = ref(null)
  let _collectTimer = null

  function collectIdle() {
    const levelBefore = playerHero.level
    const result      = idle.collect()
    if (!result) return
    const levelAfter  = playerHero.level
    const levelUps    = []
    if (result.levelsGained > 0) {
      for (let lv = levelBefore + 1; lv <= levelAfter; lv++) {
        levelUps.push({ name: playerHero.name, level: lv, rarity: playerHero.rarity })
      }
    }
    lastCollect.value = { xp: result.xp, levelUps }
    clearTimeout(_collectTimer)
    _collectTimer = setTimeout(() => { lastCollect.value = null }, 5000)
  }

  function startIdleHere() {
    if (!canBattle.value || !selectedEnc.value) return
    if (idle.isRunning) idle.collect()
    idle.startIdle(selectedEnc.value)
  }

  function formatElapsed(ms) {
    if (!ms || ms <= 0) return '0m'
    const totalSec = Math.floor(ms / 1000)
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    if (h > 0) return `${h}h ${m}m`
    const s = totalSec % 60
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  return {
    activeHomeTab,
    camp, collection, campaign, idle, playerHero,
    ENCOUNTERS, ZONE_POSITIONS,
    teamCP, encounterCP, cpVerdict,
    selectedIndex, selectedEnc,
    difficultyGroups,
    selectZone, teamEntry,
    canBattle, battleHint, startBattle,
    isActiveIdleZone,
    lastCollect, collectIdle, startIdleHere, formatElapsed,
    formatCP,
  }
}
