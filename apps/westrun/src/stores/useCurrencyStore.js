import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'player-currency'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useCurrencyStore = defineStore('currency', () => {
  const saved    = load()
  const gold     = ref(saved?.gold            ?? 1000)
  const diamonds = ref(saved?.diamonds        ?? 150)
  const commonWrits    = ref(saved?.commonWrits    ?? 0)
  const sealedCharters = ref(saved?.sealedCharters ?? 0)
  const houseSeals     = ref(saved?.houseSeals     ?? 0)

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      gold:            gold.value,
      diamonds:        diamonds.value,
      commonWrits:     commonWrits.value,
      sealedCharters:  sealedCharters.value,
      houseSeals:      houseSeals.value,
    }))
  }

  function addGold(amount)     { gold.value += amount;     persist() }
  function addDiamonds(amount) { diamonds.value += amount; persist() }

  function spendGold(amount) {
    if (gold.value < amount) return false
    gold.value -= amount; persist(); return true
  }
  function spendDiamonds(amount) {
    if (diamonds.value < amount) return false
    diamonds.value -= amount; persist(); return true
  }

  function canAffordGold(amount)     { return gold.value >= amount }
  function canAffordDiamonds(amount) { return diamonds.value >= amount }

  // Recruit scrolls
  function addScroll(type, amount = 1) {
    if (type === 'commonWrit')    commonWrits.value    += amount
    if (type === 'sealedCharter') sealedCharters.value += amount
    if (type === 'houseSeal')     houseSeals.value     += amount
    persist()
  }
  function spendScroll(type, amount = 1) {
    if (type === 'commonWrit'    && commonWrits.value    >= amount) { commonWrits.value    -= amount; persist(); return true }
    if (type === 'sealedCharter' && sealedCharters.value >= amount) { sealedCharters.value -= amount; persist(); return true }
    if (type === 'houseSeal'     && houseSeals.value     >= amount) { houseSeals.value     -= amount; persist(); return true }
    return false
  }
  function canAffordScroll(type, amount = 1) {
    if (type === 'commonWrit')    return commonWrits.value    >= amount
    if (type === 'sealedCharter') return sealedCharters.value >= amount
    if (type === 'houseSeal')     return houseSeals.value     >= amount
    return false
  }
  function getScrollCount(type) {
    if (type === 'commonWrit')    return commonWrits.value
    if (type === 'sealedCharter') return sealedCharters.value
    if (type === 'houseSeal')     return houseSeals.value
    return 0
  }

  return {
    gold, diamonds, commonWrits, sealedCharters, houseSeals,
    addGold, addDiamonds, spendGold, spendDiamonds, canAffordGold, canAffordDiamonds,
    addScroll, spendScroll, canAffordScroll, getScrollCount,
  }
})
