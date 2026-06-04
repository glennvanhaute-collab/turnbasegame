import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'player-currency'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useCurrencyStore = defineStore('currency', () => {
  const saved    = load()
  const gold     = ref(saved?.gold     ?? 1000)
  const diamonds = ref(saved?.diamonds ?? 150)

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ gold: gold.value, diamonds: diamonds.value }))
  }

  function addGold(amount)     { gold.value += amount;     persist() }
  function addDiamonds(amount) { diamonds.value += amount; persist() }

  function spendGold(amount) {
    if (gold.value < amount) return false
    gold.value -= amount
    persist()
    return true
  }

  function spendDiamonds(amount) {
    if (diamonds.value < amount) return false
    diamonds.value -= amount
    persist()
    return true
  }

  function canAffordGold(amount)     { return gold.value >= amount }
  function canAffordDiamonds(amount) { return diamonds.value >= amount }

  return {
    gold, diamonds,
    addGold, addDiamonds,
    spendGold, spendDiamonds,
    canAffordGold, canAffordDiamonds,
  }
})
