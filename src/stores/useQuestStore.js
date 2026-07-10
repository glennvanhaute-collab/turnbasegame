import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCurrencyStore } from './useCurrencyStore.js'
import { useReputationStore } from './useReputationStore.js'

const STORAGE_KEY = 'raid-quests'

// Trigger types:
// { type: 'always' }
// { type: 'stat', key, gte }    — battleWins | dungeonClears | heroCount | raidClears
// { type: 'quest', id }          — after completing a specific quest

export const QUESTS = [
  {
    id: 'warfront_call',
    name: 'The Warfront Call',
    questPoints: 1,
    trigger: { type: 'always' },
    dispatch: {
      sender: 'The Realm',
      subject: 'A Call to the Field',
      body: `The border skirmishes near the Thornwall crossing have gone unresolved for three days. Regional commanders have been asked to commit. No house has formally claimed this engagement — it is open ground, and the first to hold it writes the terms.\n\nYou are expected to respond before the week's end.`,
    },
    options: [
      {
        id: 'charge',
        label: 'Commit forces in full. Take the crossing.',
        text: 'You lead the push personally. Full commitment, visible command.',
        repChanges: { 'House Aldric': 400, 'House Mordaine': 100, 'House Caelwyn': -100, 'House Valdris': -200 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `The crossing is taken in a single push. Your forces hold through the night. The method is noted — by more than one party.`,
      },
      {
        id: 'calculated',
        label: 'Establish a forward position. Study the field first.',
        text: 'Intelligence before commitment. You observe before you move.',
        repChanges: { 'House Valdris': 400, 'House Caelwyn': 150, 'House Aldric': -200, 'House Mordaine': -50 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `Two days of patience. On the third, you find the soft point the others missed. The crossing is yours at a third of the expected cost.`,
      },
    ],
  },

  {
    id: 'abandoned_farmstead',
    name: 'The Abandoned Farmstead',
    questPoints: 1,
    trigger: { type: 'stat', key: 'battleWins', gte: 1 },
    dispatch: {
      sender: 'The Realm',
      subject: 'A Petition from the Borderlands',
      body: `A farming family was driven from their land three nights ago by a group of thirty armed men. Not soldiers — likely former miners from the collapsed Ashvein operation, according to the farmer's account. They have fortified the property. No violence yet.\n\nThe farmer is demanding justice. The thirty are asking, implicitly, for a reason not to fight.`,
    },
    options: [
      {
        id: 'force',
        label: 'Ride out and clear them.',
        text: 'The farmstead is not theirs. You remove them.',
        repChanges: { 'House Aldric': 300, 'House Mordaine': 100, 'House Caelwyn': -150, 'House Valdris': -100 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `The farmstead is returned by evening. The farmer is grateful. What happened to the thirty is not recorded.`,
      },
      {
        id: 'negotiate',
        label: 'Find out what drove them there.',
        text: 'Desperation has a source. You intend to find it before drawing steel.',
        repChanges: { 'House Caelwyn': 300, 'House Valdris': 200, 'House Aldric': -200, 'House Mordaine': -100 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `They were displaced by the Ashvein collapse — no pay, no land, nowhere to go. You arrange a labor contract with a mill three towns east. It takes four days. Nothing burned.`,
      },
      {
        id: 'shadow',
        label: 'Make it known that you have noticed. See what they do.',
        text: `You don't appear. But word reaches the camp that the region's commander has eyes on them.`,
        repChanges: { 'House Mordaine': 400, 'House Aldric': 100, 'House Caelwyn': -200, 'House Valdris': -150 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `The farmstead is empty by dawn on the third day. The farmer asks how. You don't answer. He doesn't press.`,
      },
    ],
  },

  {
    id: 'merchants_account',
    name: "The Merchant's Account",
    questPoints: 1,
    trigger: { type: 'stat', key: 'heroCount', gte: 1 },
    dispatch: {
      sender: 'The Realm',
      subject: 'A Matter Requiring Discretion',
      body: `A merchant who traveled under your banner's protection was attacked on the Dunford road. He survived. His coin did not. More significantly, his account ledger was taken — the original, not a copy. He reports the attackers were professional. Someone paid for that ledger.\n\nHe is asking for your involvement. The question is what you do when you find it.`,
    },
    options: [
      {
        id: 'return',
        label: 'Recover it and return it. That is what protection means.',
        text: 'A contract was made. You honor it.',
        repChanges: { 'House Aldric': 300, 'House Caelwyn': 100, 'House Mordaine': -100, 'House Valdris': -150 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `The ledger is recovered and returned intact. The merchant is relieved — and quietly indebted in the way that compounds over years.`,
      },
      {
        id: 'copy',
        label: 'Recover it. Read it before you return it.',
        text: 'Understanding what someone values tells you something about them.',
        repChanges: { 'House Valdris': 200, 'House Mordaine': 300, 'House Aldric': -100, 'House Caelwyn': -200 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `There are three entries that explain exactly why someone paid for it. You return the ledger. Your own record of those entries does not leave your hands.`,
      },
      {
        id: 'buyer',
        label: 'Find the buyer first. Understand what the ledger is worth before touching it.',
        text: 'The ledger is already in someone else\'s hands. That is the more interesting problem.',
        repChanges: { 'House Mordaine': 400, 'House Valdris': 100, 'House Caelwyn': -100, 'House Aldric': -200 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `The buyer turns out to be a minor lord with ambitions that outpace his patience. You now know that. The ledger reaches the merchant eventually.`,
      },
    ],
  },

  {
    id: 'relic_of_the_deep',
    name: 'The Relic of the Deep',
    questPoints: 1,
    trigger: { type: 'stat', key: 'dungeonClears', gte: 1 },
    dispatch: {
      sender: 'The Realm',
      subject: 'On the Matter of What Was Found',
      body: `Your expedition into the ruins returned with something unexpected. The object is clearly old — older than the current roads, possibly older than written record of the region. Your people are waiting on instruction.\n\nThree separate parties have already sent inquiries. They have not identified themselves.`,
    },
    options: [
      {
        id: 'study',
        label: 'Study it. There is knowledge in old things.',
        text: 'Understanding what it was is worth more than what it could be sold for.',
        repChanges: { 'House Valdris': 400, 'House Caelwyn': 100, 'House Aldric': -100, 'House Mordaine': -150 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `Three weeks of careful work. You understand, approximately, what it was built for. The knowledge is worth considerably more than the object.`,
      },
      {
        id: 'return',
        label: 'Return it to where it was found.',
        text: 'Something this old belongs where it rested, not in a collection.',
        repChanges: { 'House Caelwyn': 400, 'House Valdris': -100, 'House Aldric': 100, 'House Mordaine': -100 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `You bring it back and place it where your expedition found it. Something in the ruins shifts — a stillness, like pressure releasing. You do not include this in your written report.`,
      },
      {
        id: 'hold',
        label: 'Hold it. Interested parties reveal themselves when you make them wait.',
        text: 'Three anonymous inquiries. You intend to know who sent them.',
        repChanges: { 'House Mordaine': 400, 'House Valdris': 100, 'House Caelwyn': -100, 'House Aldric': -200 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `Four parties made contact within two weeks. You now know who values old things, and how much. The relic remains in your possession.`,
      },
    ],
  },

  {
    id: 'the_informant',
    name: 'The Informant',
    questPoints: 2,
    trigger: { type: 'stat', key: 'battleWins', gte: 5 },
    dispatch: {
      sender: 'The Realm',
      subject: 'A Matter Brought to Your Attention',
      body: `One of your senior soldiers brought you something this morning: documented evidence that a member of your warband has been selling your patrol routes and battle plans to an outside party. The documentation is reliable.\n\nThe informant does not know they have been found out. You have time to decide how to respond.`,
    },
    options: [
      {
        id: 'execute',
        label: 'Execute them. Publicly. Make the lesson clear.',
        text: 'There is only one response to betrayal that the warband will understand.',
        repChanges: { 'House Aldric': 300, 'House Mordaine': 200, 'House Caelwyn': -200, 'House Valdris': -100 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `The execution is public. The warband is shaken, then steady. What you notice, afterward, is that both the iron-minded and the shadow-minded found this acceptable — for entirely different reasons.`,
      },
      {
        id: 'exile',
        label: 'Exile them quietly. Justice without making enemies of their family.',
        text: 'The threat is removed. The wound closes without a scar.',
        repChanges: { 'House Caelwyn': 300, 'House Valdris': 100, 'House Aldric': -100, 'House Mordaine': -150 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `They are gone by nightfall. Their family is told they left for the coast on their own terms. The rest of the warband never knows what happened.`,
      },
      {
        id: 'turn',
        label: 'Turn them. Feed false information back through them.',
        text: 'A known leak is more valuable than a sealed one.',
        repChanges: { 'House Mordaine': 400, 'House Valdris': 200, 'House Aldric': -200, 'House Caelwyn': -100 },
        reward: [{ type: 'commonWrit', amount: 4 }],
        outcomeText: `For six weeks you know exactly what your adversary believes you're planning. Eventually you allow the informant to defect — carrying the wrong map.`,
      },
    ],
  },

  {
    id: 'night_letter',
    name: 'The Night Letter',
    questPoints: 2,
    trigger: { type: 'quest', id: 'the_informant' },
    dispatch: {
      sender: 'Unknown',
      subject: 'No Seal. No Name.',
      body: `This arrived before dawn, sealed with no house mark. The handwriting is educated. The contents are precise: verified accounts of the internal vulnerabilities of all four great houses — Aldric, Caelwyn, Valdris, Mordaine. Not rumors. Verified.\n\nThe letter ends with a single line:\n\n"You will want to know who sent this before you decide what to do with it."\n\nYou have not been able to determine the source.`,
    },
    options: [
      {
        id: 'share_aldric',
        label: 'Bring it to House Aldric. Transparency serves the realm.',
        text: 'An open hand earns more than a closed fist.',
        repChanges: { 'House Aldric': 300, 'House Caelwyn': 100, 'House Mordaine': -300, 'House Valdris': -100 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `Lord Aldric reads it in silence. "We knew most of this," he says. The parts he did not know, he does not name. Your standing with the iron house rises noticeably.`,
      },
      {
        id: 'share_valdris',
        label: 'Send it to House Valdris. Let them analyze it properly.',
        text: 'This kind of information needs rigorous verification before it becomes dangerous.',
        repChanges: { 'House Valdris': 300, 'House Caelwyn': 100, 'House Aldric': -100, 'House Mordaine': -150 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `The archmage's office returns a summary two days later. Several claims are corroborated; two are fabricated. They file their own copy. So do you.`,
      },
      {
        id: 'keep',
        label: 'Keep it. This is too valuable to place in someone else\'s hands.',
        text: 'Whoever sent this is watching what you do with it.',
        repChanges: { 'House Mordaine': 400, 'House Valdris': 100, 'House Caelwyn': -200, 'House Aldric': -300 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `You lock it somewhere only you can reach. Whoever sent it will reveal themselves eventually — by watching for how you use what you now know.`,
      },
      {
        id: 'burn',
        label: 'Burn it. Whoever sent this is trying to use you.',
        text: `This letter is a hook. You don't take it.`,
        repChanges: { 'House Caelwyn': 400, 'House Valdris': -100, 'House Aldric': 100, 'House Mordaine': -200 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `You burn it before anyone else reads it. If someone wants you holding this information, they want something in return. You deny them the assumption.`,
      },
    ],
  },
]

function meetsCondition(trigger, stats) {
  if (trigger.type === 'always') return true
  if (trigger.type === 'stat') return (stats[trigger.key] ?? 0) >= trigger.gte
  if (trigger.type === 'quest') return stats.completedQuestIds?.has(trigger.id)
  return false
}

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useQuestStore = defineStore('quests', () => {
  const saved = loadSaved()

  const completedIds  = ref(new Set(saved?.completedIds ?? []))
  const chosenOptions = ref(saved?.chosenOptions ?? {})
  const activeQuestId = ref(saved?.activeQuestId ?? null)

  const totalQP = computed(() =>
    QUESTS.filter(q => completedIds.value.has(q.id)).reduce((s, q) => s + q.questPoints, 0)
  )

  function getNextAvailable(stats) {
    for (const quest of QUESTS) {
      if (completedIds.value.has(quest.id)) continue
      if (quest.id === activeQuestId.value) continue
      if (!meetsCondition(quest.trigger, stats)) continue
      return quest
    }
    return null
  }

  function getActiveQuest() {
    if (!activeQuestId.value) return null
    return QUESTS.find(q => q.id === activeQuestId.value) ?? null
  }

  function openDispatch(id) {
    activeQuestId.value = id
    persist()
  }

  // Returns outcome data for display, or null on failure
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
    activeQuestId.value = null
    persist()

    return {
      questName:   quest.name,
      questPoints: quest.questPoints,
      outcomeText: option.outcomeText,
      repChanges:  option.repChanges,
      reward:      option.reward,
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      completedIds:  [...completedIds.value],
      chosenOptions: chosenOptions.value,
      activeQuestId: activeQuestId.value,
    }))
  }

  return {
    QUESTS, totalQP,
    completedIds, activeQuestId, chosenOptions,
    getNextAvailable, getActiveQuest, openDispatch, complete,
  }
})
