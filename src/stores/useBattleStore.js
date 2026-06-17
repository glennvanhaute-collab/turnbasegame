import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { BattleEngine, BattleState } from '../game/BattleEngine.js'
import { runAI } from '../game/AI.js'
import { HERO_TEMPLATES, ENCOUNTERS } from '../game/data/heroes.js'
import { useCurrencyStore }    from './useCurrencyStore.js'
import { useCampaignStore }    from './useCampaignStore.js'
import { usePlayerHeroStore }  from './usePlayerHeroStore.js'
import { useDungeonStore }     from './useDungeonStore.js'
import { useResourceStore }    from './useResourceStore.js'
import { useCollectionStore }  from './useCollectionStore.js'
import { rollOreDrops, rollTrainingOreDrops, rollDungeonGatheringDrops, rollTrainingKeyDrops } from '../game/data/ores.js'
import { rollRaidResourceDrops }  from '../game/data/raidEncounters.js'

export const useBattleStore = defineStore('battle', () => {
  const currency = useCurrencyStore()

  const engine = ref(null)
  const state = ref(BattleState.IDLE)
  const battleKey = ref(0)  // increments on every initBattle — lets Pixi detect retries
  const activeHero = ref(null)
  const playerTeam = ref([])
  const enemyTeam = ref([])
  const battleLog = ref([])
  const selectedSkillIndex = ref(null)
  const currentEncounterIndex = ref(0)
  const currentEncounter = ref(null)
  const lastReward = ref(null)   // { gold, diamonds, xp, levelsGained, oreDrops } shown after victory

  const lastAction = ref(null)

  const _savedSpeed = Number(localStorage.getItem('battle-speed')) || 1
  const _savedAuto  = localStorage.getItem('battle-auto') === 'true'

  const autoplay    = ref(_savedAuto)
  const battleSpeed = ref([1, 2, 3].includes(_savedSpeed) ? _savedSpeed : 1)

  const SPEED_DELAY = { 1: 800, 2: 400, 3: 120 }
  const turnDelay = computed(() => SPEED_DELAY[battleSpeed.value] ?? 800)

  const isPlayerTurn = computed(() => state.value === BattleState.SELECTING_SKILL || state.value === BattleState.SELECTING_TARGET)
  const canAct = computed(() => state.value === BattleState.SELECTING_SKILL)
  const isOver = computed(() => state.value === BattleState.VICTORY || state.value === BattleState.DEFEAT)

  // ── Batch run state ────────────────────────────────────────────────
  const batchTotal   = ref(0)
  const batchDone    = ref(0)
  const batchRewards = ref(null)
  const isBatchRunning = computed(() => batchTotal.value > 0 && batchDone.value < batchTotal.value)

  function toggleAutoplay() {
    autoplay.value = !autoplay.value
    localStorage.setItem('battle-auto', autoplay.value)
  }
  function setSpeed(s) {
    battleSpeed.value = s
    localStorage.setItem('battle-speed', s)
  }

  // If autoplay is switched on while already waiting for player input, kick things off
  watch(autoplay, (on) => {
    if (on && state.value === BattleState.SELECTING_SKILL) _runAutoTurn()
  })

  function initBattle(encounterOrIndex = 0, customTeam = null) {
    lastReward.value = null
    battleKey.value++
    const encounter = typeof encounterOrIndex === 'number'
      ? ENCOUNTERS[encounterOrIndex]
      : encounterOrIndex
    currentEncounterIndex.value = typeof encounterOrIndex === 'number' ? encounterOrIndex : -1
    currentEncounter.value = encounter

    const pTeam = customTeam ?? [
      HERO_TEMPLATES.IRON_BLADE(),
      HERO_TEMPLATES.EMBER_SAGE(),
      HERO_TEMPLATES.LIRIEN(),
      HERO_TEMPLATES.SHADOW_FANG(),
    ]
    const eTeam = encounter.enemies.map((factory, i) => {
      const hero = factory()
      hero.id = `${hero.id}_${i}`
      const scale = encounter.enemyScale ?? 1.0
      if (scale > 1) hero.applyLevelScale(scale, Math.sqrt(scale))
      return hero
    })

    engine.value = new BattleEngine(pTeam, eTeam, { mechanics: encounter.mechanics ?? [] })
    playerTeam.value = engine.value.playerTeam
    enemyTeam.value = engine.value.enemyTeam
    battleLog.value = engine.value.log
    selectedSkillIndex.value = null

    const result = engine.value.startBattle()
    _applyResult(result)
  }

  function selectSkill(index) {
    if (state.value !== BattleState.SELECTING_SKILL) return
    selectedSkillIndex.value = index
    const result = engine.value.selectSkill(index)
    if (result) _applyResult(result)
  }

  function selectTarget(target) {
    if (state.value !== BattleState.SELECTING_TARGET) return
    const result = engine.value.selectTarget(target)
    if (result) _applyResult(result)
    selectedSkillIndex.value = null
  }

  async function _applyResult(result) {
    if (!result) return
    if (result.action) lastAction.value = result.action
    const prev = state.value
    state.value = result.state
    activeHero.value = result.activeHero ?? engine.value?.activeHero ?? null
    battleLog.value = engine.value?.log ?? []

    if (result.state === BattleState.VICTORY && prev !== BattleState.VICTORY) {
      const enc = currentEncounter.value
      if (enc) {
        if (!enc.isDungeon) useCampaignStore().completeEncounter(enc.id)
        currency.addGold(enc.rewards.gold)
        currency.addDiamonds(enc.rewards.diamonds)
        const ph = usePlayerHeroStore()
        const EPIC_OR_HIGHER = new Set(['Epic', 'Legendary', 'Mythical', 'Ancient'])
        const easyCapReached = enc.difficulty === 'Easy' && EPIC_OR_HIGHER.has(ph.rarity)
        const xpGained     = easyCapReached ? 0 : ph.xpForDifficulty(enc.difficulty)
        const levelsGained = ph.addXp(xpGained)
        const oreDrops = enc.isTraining
          ? rollTrainingOreDrops(enc.difficulty)
          : rollOreDrops(enc.difficulty)
        const resources = useResourceStore()
        oreDrops.forEach(({ oreId, amount }) => resources.addOre(oreId, amount))
        let gatherDrops = { hides: [], fibers: [] }
        if (enc.isDungeon) {
          const g = rollDungeonGatheringDrops(enc.difficulty)
          gatherDrops = g
          g.hides.forEach(({ id, amount })  => resources.addHide(id, amount))
          g.fibers.forEach(({ id, amount }) => resources.addFiber(id, amount))
        }
        let componentDrops = []
        let forgeUnlock    = null
        if (enc.isDungeon) {
          const dungeonResult = useDungeonStore().onDungeonVictory(enc.dungeonId, enc.tier)
          componentDrops = dungeonResult?.componentDrops ?? []
          forgeUnlock    = dungeonResult?.forgeUnlock ?? null
        }
        let keyDrops = []
        if (enc.isTraining) {
          const TRAINING_ESSENCE = {
            Hard:      [{ id: 'copper_essence', chance: 0.12 }, { id: 'tin_essence',   chance: 0.12 }],
            Nightmare: [{ id: 'tin_essence',    chance: 0.15 }, { id: 'steel_essence', chance: 0.10 }],
          }
          for (const { id, chance } of (TRAINING_ESSENCE[enc.difficulty] ?? [])) {
            if (Math.random() < chance) {
              resources.addUpgradeComponent(id, 1)
              componentDrops.push(id)
            }
          }
          keyDrops = rollTrainingKeyDrops(enc.difficulty)
          keyDrops.forEach(({ tier, amount }) => resources.addDungeonKey(tier, amount))
        }
        let raidDrops = null
        if (enc.isRaid) {
          raidDrops = rollRaidResourceDrops()
          raidDrops.ores.forEach(({ id, amount })     => resources.addOre(id, amount))
          raidDrops.logs.forEach(({ id, amount })     => resources.addLog(id, amount))
          raidDrops.hides.forEach(({ id, amount })    => resources.addHide(id, amount))
          raidDrops.fibers.forEach(({ id, amount })   => resources.addFiber(id, amount))
          raidDrops.leathers.forEach(({ id, amount }) => resources.addLeather(id, amount))
          raidDrops.cloths.forEach(({ id, amount })   => resources.addCloth(id, amount))
        }
        const runReward = { ...enc.rewards, xp: xpGained, levelsGained, oreDrops, gatherDrops, componentDrops, keyDrops, raidDrops, forgeUnlock }

        if (isBatchRunning.value) {
          // Accumulate into batch totals; don't display until final run
          const br = batchRewards.value
          br.gold         += runReward.gold         ?? 0
          br.diamonds     += runReward.diamonds     ?? 0
          br.xp           += runReward.xp           ?? 0
          br.levelsGained += runReward.levelsGained ?? 0
          for (const drop of (runReward.oreDrops ?? [])) {
            const ex = br.oreDrops.find(d => d.oreId === drop.oreId)
            if (ex) ex.amount += drop.amount
            else br.oreDrops.push({ ...drop })
          }
          for (const drop of (runReward.gatherDrops?.hides ?? [])) {
            const ex = br.gatherDrops.hides.find(d => d.id === drop.id)
            if (ex) ex.amount += drop.amount
            else br.gatherDrops.hides.push({ ...drop })
          }
          for (const drop of (runReward.gatherDrops?.fibers ?? [])) {
            const ex = br.gatherDrops.fibers.find(d => d.id === drop.id)
            if (ex) ex.amount += drop.amount
            else br.gatherDrops.fibers.push({ ...drop })
          }
          br.componentDrops.push(...(runReward.componentDrops ?? []))
          for (const drop of (runReward.keyDrops ?? [])) {
            const ex = br.keyDrops.find(d => d.tier === drop.tier)
            if (ex) ex.amount += drop.amount
            else br.keyDrops.push({ ...drop })
          }
          batchDone.value++
          if (batchDone.value < batchTotal.value) {
            setTimeout(() => _runBatchNext(), 250)
            return
          }
          // Final run — show cumulative summary, end batch mode
          lastReward.value = { ...batchRewards.value }
          batchTotal.value = 0
        } else {
          lastReward.value = runReward
        }
      }
    }

    if (result.state === BattleState.ENEMY_TURN) {
      await _runAutoTurn()
    } else if (result.state === BattleState.SELECTING_SKILL && autoplay.value) {
      await _runAutoTurn()
    }
  }

  async function _runAutoTurn() {
    await new Promise(r => setTimeout(r, turnDelay.value))
    if (!engine.value) return
    const result = runAI(engine.value)
    if (result) _applyResult(result)
  }

  function startBatchRun(n) {
    batchTotal.value   = n
    batchDone.value    = 0
    batchRewards.value = { gold: 0, diamonds: 0, xp: 0, levelsGained: 0, oreDrops: [], gatherDrops: { hides: [], fibers: [] }, componentDrops: [], keyDrops: [] }
    if (!autoplay.value) { autoplay.value = true; localStorage.setItem('battle-auto', true) }
    _runBatchNext()
  }

  // Primes batch state without starting the first run — call initBattle afterwards.
  // Used for dungeon key batches where the caller controls the encounter.
  function setupBatch(n) {
    batchTotal.value   = n
    batchDone.value    = 0
    batchRewards.value = { gold: 0, diamonds: 0, xp: 0, levelsGained: 0, oreDrops: [], gatherDrops: { hides: [], fibers: [] }, componentDrops: [], keyDrops: [] }
    if (!autoplay.value) { autoplay.value = true; localStorage.setItem('battle-auto', true) }
  }

  function stopBatch() {
    batchTotal.value = 0
    batchDone.value  = 0
  }

  function devCompleteBatch() {
    if (!isBatchRunning.value) return
    const enc = currentEncounter.value
    if (!enc) { stopBatch(); return }

    const ph        = usePlayerHeroStore()
    const resources = useResourceStore()
    const EPIC_OR_HIGHER = new Set(['Epic', 'Legendary', 'Mythical', 'Ancient'])
    const remaining = batchTotal.value - batchDone.value
    const br = batchRewards.value

    for (let i = 0; i < remaining; i++) {
      currency.addGold(enc.rewards.gold ?? 0)
      currency.addDiamonds(enc.rewards.diamonds ?? 0)
      br.gold         += enc.rewards.gold     ?? 0
      br.diamonds     += enc.rewards.diamonds ?? 0

      const easyCapReached = enc.difficulty === 'Easy' && EPIC_OR_HIGHER.has(ph.rarity)
      const xpGained     = easyCapReached ? 0 : ph.xpForDifficulty(enc.difficulty)
      const levelsGained = ph.addXp(xpGained)
      br.xp           += xpGained
      br.levelsGained += levelsGained

      const oreDrops = enc.isTraining
        ? rollTrainingOreDrops(enc.difficulty)
        : rollOreDrops(enc.difficulty)
      oreDrops.forEach(({ oreId, amount }) => {
        resources.addOre(oreId, amount)
        const ex = br.oreDrops.find(d => d.oreId === oreId)
        if (ex) ex.amount += amount
        else br.oreDrops.push({ oreId, amount })
      })
    }

    lastReward.value = { ...br }
    batchTotal.value = 0
    batchDone.value  = 0
    engine.value = null          // stop pending autoplay turns
    state.value  = BattleState.VICTORY  // show reward panel
  }

  function _runBatchNext() {
    const team = useCollectionStore().buildTeam()
    const enc  = currentEncounterIndex.value >= 0 ? currentEncounterIndex.value : currentEncounter.value
    initBattle(enc, team)
  }

  return {
    engine, state, activeHero, battleKey,
    playerTeam, enemyTeam, battleLog,
    selectedSkillIndex, currentEncounterIndex, currentEncounter,
    autoplay, battleSpeed, lastReward, lastAction,
    batchTotal, batchDone, isBatchRunning,
    ENCOUNTERS,
    isPlayerTurn, canAct, isOver,
    initBattle, selectSkill, selectTarget,
    toggleAutoplay, setSpeed,
    startBatchRun, setupBatch, stopBatch, devCompleteBatch,
  }
})
