import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCurrencyStore = defineStore('currency', () => {
  const gold     = ref(1000)   // starting gold
  const diamonds = ref(150)    // starting diamonds

  function addGold(amount)     { gold.value += amount }
  function addDiamonds(amount) { diamonds.value += amount }

  function spendGold(amount) {
    if (gold.value < amount) return false
    gold.value -= amount
    return true
  }

  function spendDiamonds(amount) {
    if (diamonds.value < amount) return false
    diamonds.value -= amount
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
