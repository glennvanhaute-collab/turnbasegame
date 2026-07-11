import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCurrencyStore } from './useCurrencyStore.js'
import { useReputationStore } from './useReputationStore.js'
import { useInventoryStore } from './useInventoryStore.js'
import { GearSlot } from '../game/Gear.js'

const STORAGE_KEY = 'raid-quests'

// Objective types:
//   { id, type: 'battleWins',      count, label }
//   { id, type: 'dungeonClears',   count, label }
//   { id, type: 'raidClears',      count, label }
//   { id, type: 'heroCount',       count, label }
//   { id, type: 'siegeClears',     count, label }
//   { id, type: 'raidSetComplete', setId, label }  — 'any' or specific setId; checked via inventory
//   { id, type: 'puzzle',                 label }  — completed via markManualDone
//   { id, type: 'craft',   itemId,        label }  — completed via markManualDone
//   { id, type: 'donate',  itemTier, count, label } — completed via donateItems()

export const QUESTS = [
  {
    id: 'first_blood_oath',
    name: 'The First Blood Oath',
    type: 'STORY',
    questPoints: 1,
    prerequisites: [],
    objectives: [],
    dispatch: {
      sender: 'The Realm',
      subject: 'A Call to the Field',
      body: `[Placeholder — quest writing comes later]`,
    },
    options: [
      {
        id: 'charge',
        label: 'Commit forces in full. Take the crossing.',
        text: 'Full commitment, visible command.',
        repChanges: { 'House Aldric': 300, 'House Mordaine': 100, 'House Caelwyn': -100, 'House Valdris': -200 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `[Placeholder]`,
      },
      {
        id: 'calculated',
        label: 'Establish a forward position. Study the field first.',
        text: 'Intelligence before commitment.',
        repChanges: { 'House Valdris': 300, 'House Caelwyn': 150, 'House Aldric': -200, 'House Mordaine': -50 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `[Placeholder]`,
      },
    ],
  },

  {
    id: 'farmstead_claim',
    name: 'The Farmstead Claim',
    type: 'STORY',
    questPoints: 1,
    prerequisites: ['first_blood_oath'],
    objectives: [
      { id: 'wins', type: 'battleWins', count: 3, label: 'Win 3 battles' },
    ],
    dispatch: {
      sender: 'The Realm',
      subject: 'A Petition from the Borderlands',
      body: `[Placeholder]`,
    },
    options: [
      {
        id: 'force',
        label: 'Ride out and clear them.',
        text: 'The farmstead is not theirs. You remove them.',
        repChanges: { 'House Aldric': 300, 'House Mordaine': 100, 'House Caelwyn': -150, 'House Valdris': -100 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `[Placeholder]`,
      },
      {
        id: 'negotiate',
        label: 'Find out what drove them there.',
        text: 'Desperation has a source.',
        repChanges: { 'House Caelwyn': 300, 'House Valdris': 200, 'House Aldric': -200, 'House Mordaine': -100 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `[Placeholder]`,
      },
      {
        id: 'shadow',
        label: "Make it known that you have noticed. See what they do.",
        text: "You don't appear. But word reaches the camp.",
        repChanges: { 'House Mordaine': 400, 'House Aldric': 100, 'House Caelwyn': -200, 'House Valdris': -150 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `[Placeholder]`,
      },
    ],
  },

  {
    id: 'merchants_account',
    name: "The Merchant's Account",
    type: 'STORY',
    questPoints: 1,
    prerequisites: ['farmstead_claim'],
    objectives: [
      { id: 'wins',   type: 'battleWins', count: 5, label: 'Win 5 battles' },
      { id: 'heroes', type: 'heroCount',  count: 1, label: 'Recruit your first hero' },
    ],
    dispatch: {
      sender: 'The Realm',
      subject: 'A Matter Requiring Discretion',
      body: `[Placeholder]`,
    },
    options: [
      {
        id: 'return',
        label: 'Recover it and return it.',
        text: 'A contract was made. You honor it.',
        repChanges: { 'House Aldric': 300, 'House Caelwyn': 100, 'House Mordaine': -100, 'House Valdris': -150 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `[Placeholder]`,
      },
      {
        id: 'copy',
        label: 'Recover it. Read it before you return it.',
        text: 'Understanding what someone values tells you something.',
        repChanges: { 'House Valdris': 200, 'House Mordaine': 300, 'House Aldric': -100, 'House Caelwyn': -200 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `[Placeholder]`,
      },
      {
        id: 'buyer',
        label: 'Find the buyer first.',
        text: "The ledger is already in someone else's hands.",
        repChanges: { 'House Mordaine': 400, 'House Valdris': 100, 'House Caelwyn': -100, 'House Aldric': -200 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `[Placeholder]`,
      },
    ],
  },

  {
    id: 'night_letter',
    name: 'The Night Letter',
    type: 'STORY',
    questPoints: 2,
    prerequisites: ['merchants_account'],
    objectives: [
      { id: 'dungeon', type: 'dungeonClears', count: 1, label: 'Clear your first dungeon' },
      { id: 'heroes',  type: 'heroCount',     count: 3, label: 'Have 3 heroes in your banner' },
    ],
    dispatch: {
      sender: 'Unknown',
      subject: 'No Seal. No Name.',
      body: `[Placeholder]`,
    },
    options: [
      {
        id: 'share_aldric',
        label: 'Bring it to House Aldric.',
        text: 'Transparency serves the realm.',
        repChanges: { 'House Aldric': 300, 'House Caelwyn': 100, 'House Mordaine': -300, 'House Valdris': -100 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `[Placeholder]`,
      },
      {
        id: 'share_valdris',
        label: 'Send it to House Valdris.',
        text: 'This kind of information needs rigorous verification.',
        repChanges: { 'House Valdris': 300, 'House Caelwyn': 100, 'House Aldric': -100, 'House Mordaine': -150 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `[Placeholder]`,
      },
      {
        id: 'keep',
        label: 'Keep it.',
        text: "This is too valuable to place in someone else's hands.",
        repChanges: { 'House Mordaine': 400, 'House Valdris': 100, 'House Caelwyn': -200, 'House Aldric': -300 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `[Placeholder]`,
      },
      {
        id: 'burn',
        label: 'Burn it.',
        text: "This letter is a hook. You don't take it.",
        repChanges: { 'House Caelwyn': 400, 'House Valdris': -100, 'House Aldric': 100, 'House Mordaine': -200 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `[Placeholder]`,
      },
    ],
  },

  {
    id: 'iron_commission',
    name: 'The Iron Commission',
    type: 'HOUSE',
    questPoints: 2,
    prerequisites: ['night_letter'],
    objectives: [
      { id: 'wins',    type: 'battleWins',    count: 15, label: 'Win 15 battles' },
      { id: 'dungeon', type: 'dungeonClears', count: 2,  label: 'Clear 2 dungeons' },
    ],
    dispatch: {
      sender: 'House Aldric',
      subject: 'A Personal Commission',
      body: `[Placeholder]`,
    },
    options: [
      {
        id: 'accept',
        label: 'Accept the commission.',
        text: 'You take the terms.',
        repChanges: { 'House Aldric': 500, 'House Mordaine': -200 },
        reward: [{ type: 'sealedCharter', amount: 1 }],
        outcomeText: `[Placeholder]`,
      },
      {
        id: 'decline',
        label: 'Decline gracefully.',
        text: 'You acknowledge the offer but do not commit.',
        repChanges: { 'House Caelwyn': 200, 'House Aldric': -100 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `[Placeholder]`,
      },
    ],
  },

  {
    id: 'ashvein_cipher',
    name: 'The Ashvein Cipher',
    type: 'PUZZLE',
    questPoints: 2,
    prerequisites: ['night_letter'],
    objectives: [
      { id: 'dungeon', type: 'dungeonClears', count: 3, label: 'Clear 3 dungeons' },
      { id: 'puzzle',  type: 'puzzle',                  label: 'Decode the Ashvein cipher' },
    ],
    dispatch: {
      sender: 'The Realm',
      subject: 'On the Matter of What Was Found',
      body: `[Placeholder]`,
    },
    options: [
      {
        id: 'study',
        label: 'Study the decoded contents.',
        text: 'Knowledge is worth more than the object.',
        repChanges: { 'House Valdris': 400, 'House Caelwyn': 100, 'House Aldric': -100, 'House Mordaine': -150 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `[Placeholder]`,
      },
      {
        id: 'hold',
        label: 'Hold the information.',
        text: 'Interested parties reveal themselves when you make them wait.',
        repChanges: { 'House Mordaine': 400, 'House Valdris': 100, 'House Caelwyn': -100, 'House Aldric': -200 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `[Placeholder]`,
      },
    ],
  },

  {
    id: 'iron_levy',
    name: 'The Iron Levy',
    type: 'HOUSE',
    questPoints: 2,
    prerequisites: ['iron_commission'],
    objectives: [
      { id: 'steel_gear', type: 'donate', itemTier: 'steel', count: 30, label: 'Donate 30 steel gear pieces' },
    ],
    dispatch: {
      sender: 'House Aldric',
      subject: 'A Request of the Warband',
      body: `[Placeholder]`,
    },
    options: [
      {
        id: 'comply',
        label: 'Send the shipment as requested.',
        text: 'You honor the levy without condition.',
        repChanges: { 'House Aldric': 400, 'House Mordaine': 100, 'House Caelwyn': -200, 'House Valdris': -150 },
        reward: [{ type: 'sealedCharter', amount: 1 }],
        outcomeText: `[Placeholder]`,
      },
      {
        id: 'redirect',
        label: 'Redirect the shipment elsewhere.',
        text: 'You have other uses for this steel.',
        repChanges: { 'House Caelwyn': 400, 'House Valdris': 100, 'House Aldric': -200, 'House Mordaine': -150 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `[Placeholder]`,
      },
    ],
  },

  {
    id: 'dark_requisition',
    name: 'The Dark Requisition',
    type: 'STORY',
    questPoints: 2,
    prerequisites: ['ashvein_cipher'],
    objectives: [
      { id: 'dungeons',      type: 'dungeonClears', count: 6,  label: 'Clear 6 dungeons' },
      { id: 'darksteel_gear',type: 'donate', itemTier: 'darksteel', count: 20, label: 'Donate 20 darksteel gear pieces' },
    ],
    dispatch: {
      sender: 'Unknown',
      subject: 'The Arms Must Move',
      body: `[Placeholder]`,
    },
    options: [
      {
        id: 'deliver',
        label: 'Deliver the arms as directed.',
        text: 'You ask nothing about where they go.',
        repChanges: { 'House Valdris': 300, 'House Mordaine': 200, 'House Aldric': -100, 'House Caelwyn': -200 },
        reward: [{ type: 'sealedCharter', amount: 1 }],
        outcomeText: `[Placeholder]`,
      },
      {
        id: 'route_own',
        label: 'Route them to your own stores.',
        text: 'You take the arms. No explanation given.',
        repChanges: { 'House Mordaine': 400, 'House Aldric': 100, 'House Caelwyn': -200, 'House Valdris': -150 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `[Placeholder]`,
      },
      {
        id: 'destroy',
        label: 'Destroy the cache.',
        text: "You don't know who is waiting for these. Neither will anyone else.",
        repChanges: { 'House Caelwyn': 400, 'House Valdris': 200, 'House Aldric': -200, 'House Mordaine': -300 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `[Placeholder]`,
      },
    ],
  },

  {
    id: 'shadow_that_followed',
    name: 'The Shadow That Followed',
    type: 'CHARACTER',
    questPoints: 3,
    prerequisites: ['iron_levy', 'dark_requisition'],
    objectives: [
      { id: 'heroes', type: 'heroCount',  count: 5,  label: 'Have 5 heroes in your banner' },
      { id: 'wins',   type: 'battleWins', count: 30, label: 'Win 30 battles' },
      { id: 'raid',   type: 'raidClears', count: 1,  label: 'Clear at least one raid' },
    ],
    dispatch: {
      sender: 'Unknown',
      subject: 'Something Left Unsaid',
      body: `[Placeholder]`,
    },
    options: [
      {
        id: 'confront',
        label: 'Confront them directly.',
        text: 'No more silence.',
        repChanges: { 'House Aldric': 200, 'House Mordaine': 200, 'House Caelwyn': -100, 'House Valdris': -100 },
        reward: [{ type: 'sealedCharter', amount: 2 }],
        outcomeText: `[Placeholder]`,
      },
      {
        id: 'cover',
        label: "Cover for them. Their past is not yours to expose.",
        text: 'What happened before is not your account to give.',
        repChanges: { 'House Caelwyn': 300, 'House Mordaine': 200, 'House Aldric': -200, 'House Valdris': -100 },
        reward: [{ type: 'sealedCharter', amount: 2 }],
        outcomeText: `[Placeholder]`,
      },
    ],
  },

  {
    id: 'fallen_kings_mantle',
    name: "The Fallen King's Mantle",
    type: 'ENDGAME',
    questPoints: 4,
    prerequisites: ['shadow_that_followed'],
    objectives: [
      { id: 'raid_set', type: 'raidSetComplete', setId: 'any', label: 'Obtain a complete raid set (all 7 pieces)' },
    ],
    dispatch: {
      sender: 'The Realm',
      subject: 'What the Raids Left Behind',
      body: `[Placeholder]`,
    },
    options: [
      {
        id: 'claim_openly',
        label: 'Claim the power openly.',
        text: 'You wear it. You let them see it.',
        repChanges: { 'House Aldric': 300, 'House Mordaine': 300, 'House Caelwyn': -200, 'House Valdris': -200 },
        reward: [{ type: 'sealedCharter', amount: 2 }],
        outcomeText: `[Placeholder]`,
      },
      {
        id: 'conceal',
        label: 'Conceal what you found.',
        text: 'The armor goes somewhere no one thinks to look.',
        repChanges: { 'House Caelwyn': 300, 'House Valdris': 300, 'House Aldric': -200, 'House Mordaine': -200 },
        reward: [{ type: 'sealedCharter', amount: 2 }],
        outcomeText: `[Placeholder]`,
      },
    ],
  },

  {
    id: 'final_breach',
    name: 'The Final Breach',
    type: 'FINAL',
    questPoints: 5,
    prerequisites: ['fallen_kings_mantle'],
    objectives: [
      { id: 'raids',    type: 'raidClears',    count: 2,  label: 'Clear both raids' },
      { id: 'wins',     type: 'battleWins',    count: 50, label: 'Win 50 battles' },
      { id: 'heroes',   type: 'heroCount',     count: 6,  label: 'Have 6 heroes in your banner' },
      { id: 'dungeons', type: 'dungeonClears', count: 5,  label: 'Clear 5 dungeons' },
      { id: 'siege',    type: 'siegeClears',   count: 1,  label: 'Complete at least one siege' },
    ],
    dispatch: {
      sender: 'The Realm',
      subject: 'The Account is Complete',
      body: `[Placeholder]`,
    },
    options: [
      {
        id: 'siege',
        label: 'Lead the siege.',
        text: 'Every choice has led here.',
        repChanges: {},
        reward: [{ type: 'houseSeal', amount: 1 }],
        outcomeText: `[Placeholder]`,
      },
    ],
  },
]

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useQuestStore = defineStore('quests', () => {
  const saved = loadSaved()

  const completedIds   = ref(new Set(saved?.completedIds   ?? []))
  const chosenOptions  = ref(saved?.chosenOptions          ?? {})
  // 'questId:objectiveId' keys for puzzle/craft/donate objectives
  const manualProgress = ref(new Set(saved?.manualProgress ?? []))

  const totalQP = computed(() =>
    QUESTS.filter(q => completedIds.value.has(q.id)).reduce((s, q) => s + q.questPoints, 0)
  )

  function _isObjectiveDone(quest, obj, gameStats) {
    if (obj.type === 'battleWins')    return (gameStats.battleWins    ?? 0) >= obj.count
    if (obj.type === 'dungeonClears') return (gameStats.dungeonClears ?? 0) >= obj.count
    if (obj.type === 'raidClears')    return (gameStats.raidClears    ?? 0) >= obj.count
    if (obj.type === 'heroCount')     return (gameStats.heroCount     ?? 0) >= obj.count
    if (obj.type === 'siegeClears')   return (gameStats.siegeClears   ?? 0) >= obj.count
    if (obj.type === 'raidSetComplete') {
      const inventory  = useInventoryStore()
      const setsToCheck = obj.setId === 'any' ? ['regret', 'null_panoply'] : [obj.setId]
      const allSlots   = Object.values(GearSlot)
      return setsToCheck.some(setId =>
        allSlots.every(slot =>
          inventory.ownedInstances.some(i => i.setId === setId && i.slot === slot)
        )
      )
    }
    return manualProgress.value.has(`${quest.id}:${obj.id}`)
  }

  function objectiveProgress(quest, gameStats) {
    return quest.objectives.map(obj => ({ ...obj, done: _isObjectiveDone(quest, obj, gameStats) }))
  }

  // 'locked' | 'available' | 'dispatch_ready' | 'completed'
  function questStatus(questId, gameStats) {
    if (completedIds.value.has(questId)) return 'completed'
    const quest = QUESTS.find(q => q.id === questId)
    if (!quest) return 'locked'
    if (!quest.prerequisites.every(id => completedIds.value.has(id))) return 'locked'
    const allDone = quest.objectives.every(obj => _isObjectiveDone(quest, obj, gameStats))
    return allDone ? 'dispatch_ready' : 'available'
  }

  // First quest whose prerequisites are met and all objectives are complete
  function getReadyDispatch(gameStats) {
    return QUESTS.find(q => questStatus(q.id, gameStats) === 'dispatch_ready') ?? null
  }

  function markManualDone(questId, objectiveId) {
    manualProgress.value = new Set([...manualProgress.value, `${questId}:${objectiveId}`])
    _persist()
  }

  function canDonate(questId, objectiveId) {
    if (manualProgress.value.has(`${questId}:${objectiveId}`)) return false
    const quest = QUESTS.find(q => q.id === questId)
    const obj   = quest?.objectives.find(o => o.id === objectiveId)
    if (!obj || obj.type !== 'donate') return false
    return useInventoryStore().countUnequippedByTier(obj.itemTier) >= obj.count
  }

  function donateItems(questId, objectiveId) {
    if (!canDonate(questId, objectiveId)) return false
    const quest = QUESTS.find(q => q.id === questId)
    const obj   = quest?.objectives.find(o => o.id === objectiveId)
    const removed = useInventoryStore().removeItemsByTier(obj.itemTier, obj.count)
    if (!removed) return false
    markManualDone(questId, objectiveId)
    return true
  }

  function donateAvailableCount(questId, objectiveId) {
    const quest = QUESTS.find(q => q.id === questId)
    const obj   = quest?.objectives.find(o => o.id === objectiveId)
    if (!obj || obj.type !== 'donate') return 0
    return useInventoryStore().countUnequippedByTier(obj.itemTier)
  }

  function complete(questId, optionId) {
    const quest  = QUESTS.find(q => q.id === questId)
    const option = quest?.options.find(o => o.id === optionId)
    if (!quest || !option) return null

    const currency = useCurrencyStore()
    for (const { type, amount } of option.reward) {
      currency.addScroll(type, amount)
    }

    const repStore = useReputationStore()
    repStore.applyRepChanges(option.repChanges)

    completedIds.value  = new Set([...completedIds.value, questId])
    chosenOptions.value = { ...chosenOptions.value, [questId]: optionId }
    _persist()

    return {
      questName:   quest.name,
      questPoints: quest.questPoints,
      outcomeText: option.outcomeText,
      repChanges:  option.repChanges,
      reward:      option.reward,
    }
  }

  function _persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      completedIds:   [...completedIds.value],
      chosenOptions:  chosenOptions.value,
      manualProgress: [...manualProgress.value],
    }))
  }

  return {
    QUESTS, totalQP,
    completedIds, chosenOptions,
    questStatus, objectiveProgress, getReadyDispatch,
    markManualDone, complete,
    canDonate, donateItems, donateAvailableCount,
  }
})
