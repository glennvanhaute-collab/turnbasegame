import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { BattleEngine, BattleState } from '../game/BattleEngine.js'
import { runAI } from '../game/AI.js'
import { HERO_TEMPLATES, ENCOUNTERS } from '../game/data/heroes.js'
import { useCurrencyStore } from './useCurrencyStore.js'
import { useCampaignStore } from './useCampaignStore.js'
import { usePlayerHeroStore } from './usePlayerHeroStore.js'
import { useDungeonStore } from './useDungeonStore.js'
import { useResourceStore } from './useResourceStore.js'
import { rollOreDrops } from '../game/data/ores.js'

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
      return hero
    })

    engine.value = new BattleEngine(pTeam, eTeam)
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
        const xpGained     = ph.xpForDifficulty(enc.difficulty)
        const levelsGained = ph.addXp(xpGained)
        const oreDrops = rollOreDrops(enc.difficulty)
        const resources = useResourceStore()
        oreDrops.forEach(({ oreId, amount }) => resources.addOre(oreId, amount))
        if (enc.isDungeon) {
          useDungeonStore().onDungeonVictory(enc.dungeonId)
        }
        lastReward.value = { ...enc.rewards, xp: xpGained, levelsGained, oreDrops }
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

  return {
    engine, state, activeHero, battleKey,
    playerTeam, enemyTeam, battleLog,
    selectedSkillIndex, currentEncounterIndex, currentEncounter,
    autoplay, battleSpeed, lastReward, lastAction,
    ENCOUNTERS,
    isPlayerTurn, canAct, isOver,
    ENCOUNTERS,
    initBattle, selectSkill, selectTarget,
    toggleAutoplay, setSpeed,
  }
})
