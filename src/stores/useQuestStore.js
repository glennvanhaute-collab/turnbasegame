import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCurrencyStore } from './useCurrencyStore.js'
import { useReputationStore } from './useReputationStore.js'
import { useInventoryStore } from './useInventoryStore.js'
import { useJournalStore, ENTRY_TYPES } from './useJournalStore.js'
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
      body: `A crossing is disputed on the Ashveil's eastern tributary. Two armed groups have dug in on opposite banks and neither will yield without outside force. Your banner has been identified as available.\n\nThis is a straightforward engagement — or it can be. How you conduct it will be remembered by those who are watching.`,
    },
    options: [
      {
        id: 'charge',
        label: 'Commit forces in full. Take the crossing.',
        text: 'Full commitment, visible command.',
        repChanges: { 'House Aldric': 300, 'House Mordaine': 100, 'House Caelwyn': -100, 'House Valdris': -200 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `The crossing is yours by nightfall. Word travels fast. You are not subtle, but you are effective. House Aldric takes note.`,
      },
      {
        id: 'calculated',
        label: 'Establish a forward position. Study the field first.',
        text: 'Intelligence before commitment.',
        repChanges: { 'House Valdris': 300, 'House Caelwyn': 150, 'House Aldric': -200, 'House Mordaine': -50 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `You spend three days reading the terrain. When you move, you lose no one. House Valdris observes that you did not act until you understood. They find this encouraging.`,
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
      body: `Three farmsteads on the eastern Ashveil border have been occupied by an armed group. The landowner's petition has been passed through two intermediaries before reaching the great houses. No one is eager to handle this directly.\n\nThe group is armed but not organized. What they are doing there and why is not stated in the petition.`,
    },
    options: [
      {
        id: 'force',
        label: 'Ride out and clear them.',
        text: 'The farmstead is not theirs. You remove them.',
        repChanges: { 'House Aldric': 300, 'House Mordaine': 100, 'House Caelwyn': -150, 'House Valdris': -100 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `They are gone before dawn. The farmland returns to its owner. What drove them there is never asked. House Aldric approves of the efficiency.`,
      },
      {
        id: 'negotiate',
        label: 'Find out what drove them there.',
        text: 'Desperation has a source.',
        repChanges: { 'House Caelwyn': 300, 'House Valdris': 200, 'House Aldric': -200, 'House Mordaine': -100 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `They came from a village razed three weeks north. You find temporary shelter for the survivors and send a report to House Caelwyn. They do not forget this.`,
      },
      {
        id: 'shadow',
        label: "Make it known that you have noticed. See what they do.",
        text: "You don't appear. But word reaches the camp.",
        repChanges: { 'House Mordaine': 400, 'House Aldric': 100, 'House Caelwyn': -200, 'House Valdris': -150 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `They receive word that you have watched them for four days. The group dissolves before dawn. No confrontation, no record. House Mordaine finds this competent.`,
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
      body: `A merchant ledger has gone missing between Caelwyn and the eastern trading post. The merchant insists it contains evidence relevant to a contract dispute with one of the great houses — which house is not stated in the request.\n\nA third party was seen with the ledger at the border crossing. Find it. Return it. Do not discuss the contents with anyone. That is the instruction as written.`,
    },
    options: [
      {
        id: 'return',
        label: 'Recover it and return it.',
        text: 'A contract was made. You honor it.',
        repChanges: { 'House Aldric': 300, 'House Caelwyn': 100, 'House Mordaine': -100, 'House Valdris': -150 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `The ledger is returned unmarked. Whatever was written in it stays between the merchant and their dispute. House Aldric notes you followed the terms exactly.`,
      },
      {
        id: 'copy',
        label: 'Recover it. Read it before you return it.',
        text: 'Understanding what someone values tells you something.',
        repChanges: { 'House Valdris': 200, 'House Mordaine': 300, 'House Aldric': -100, 'House Caelwyn': -200 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `The contract dispute conceals something older — a debt that traces back further than the current houses. You keep a copy. It may be useful later. House Mordaine hears about this through channels you did not anticipate.`,
      },
      {
        id: 'buyer',
        label: 'Find the buyer first.',
        text: "The ledger is already in someone else's hands.",
        repChanges: { 'House Mordaine': 400, 'House Valdris': 100, 'House Caelwyn': -100, 'House Aldric': -200 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `The buyer is a factor operating on behalf of an unnamed interest. You sell back your discretion. The ledger disappears quietly into the kind of arrangement that does not get written down.`,
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
      body: `It arrived before dawn, slipped beneath the door of your quarters. No carrier to trace. The handwriting is careful — too careful to be in haste.\n\nThe letter knows about the farmsteads. It knows about the ledger. It names something it calls a pattern, and says you are part of it whether you have chosen to be or not.\n\nAt the end, it names a name. The name means nothing to you. The letter asks for nothing in return. It merely says you will need to decide what you do with what you now know.`,
    },
    options: [
      {
        id: 'share_aldric',
        label: 'Bring it to House Aldric.',
        text: 'Transparency serves the realm.',
        repChanges: { 'House Aldric': 300, 'House Caelwyn': 100, 'House Mordaine': -300, 'House Valdris': -100 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `House Aldric receives it with visible gravity. They do not explain what the name means. They thank you for the transparency and say the matter is being looked into.`,
      },
      {
        id: 'share_valdris',
        label: 'Send it to House Valdris.',
        text: 'This kind of information needs rigorous verification.',
        repChanges: { 'House Valdris': 300, 'House Caelwyn': 100, 'House Aldric': -100, 'House Mordaine': -150 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `Valdris scholars spend six days on the letter before sending a reply. Their note says only: the name is old. Older than any of the houses. They are working on additional context.`,
      },
      {
        id: 'keep',
        label: 'Keep it.',
        text: "This is too valuable to place in someone else's hands.",
        repChanges: { 'House Mordaine': 400, 'House Valdris': 100, 'House Caelwyn': -200, 'House Aldric': -300 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `You learn nothing new from holding it. But no one else knows you have it, which means you control what happens next. For now.`,
      },
      {
        id: 'burn',
        label: 'Burn it.',
        text: "This letter is a hook. You don't take it.",
        repChanges: { 'House Caelwyn': 400, 'House Valdris': -100, 'House Aldric': 100, 'House Mordaine': -200 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `You burn it in the hearth without rereading it. Whatever was set in motion, you have declined the invitation. House Caelwyn later mentions, without elaboration, that they respect this kind of restraint.`,
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
      body: `House Aldric writes directly — not through intermediaries. The letter carries their military seal and is notably short.\n\nThey have followed your record in the field. They have an interest in your forge output and your warband's demonstrated results. They are prepared to offer formal sponsorship under terms they describe as favorable to both parties.\n\nThey have expectations. They are not hidden about this. The letter closes with: we prefer to work with those who understand obligation.`,
    },
    options: [
      {
        id: 'accept',
        label: 'Accept the commission.',
        text: 'You take the terms.',
        repChanges: { 'House Aldric': 500, 'House Mordaine': -200 },
        reward: [{ type: 'sealedCharter', amount: 1 }],
        outcomeText: `You send word of acceptance by midday. A rider from House Aldric arrives the following week with the first advance and a list of future expectations. The relationship is formal now.`,
      },
      {
        id: 'decline',
        label: 'Decline gracefully.',
        text: 'You acknowledge the offer but do not commit.',
        repChanges: { 'House Caelwyn': 200, 'House Aldric': -100 },
        reward: [{ type: 'commonWrit', amount: 2 }],
        outcomeText: `You acknowledge the offer with the appropriate formality and decline without explanation. House Aldric notes it without visible displeasure. The door has not been closed. It has simply not been opened.`,
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
      body: `During clearance of a site in the Ashveil region, a stone tablet was recovered from a sealed chamber. The etchings are not a language any active scholar can place with certainty.\n\nA traveling archivist identified the pattern as a lockwork cipher — a puzzle type used by pre-Realm institutions to encode sensitive records. Once solved, the cipher reveals the actual text embedded within.\n\nThe archivist departed before the decoding was complete. The tablet is on your table. The pattern waits.`,
    },
    options: [
      {
        id: 'study',
        label: 'Study the decoded contents.',
        text: 'Knowledge is worth more than the object.',
        repChanges: { 'House Valdris': 400, 'House Caelwyn': 100, 'House Aldric': -100, 'House Mordaine': -150 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `The decoded text describes a location and a warning attached to it. Both are now in your possession and in no one else's. House Valdris later inquires, politely but persistently, whether you found anything of scholarly interest.`,
      },
      {
        id: 'hold',
        label: 'Hold the information.',
        text: 'Interested parties reveal themselves when you make them wait.',
        repChanges: { 'House Mordaine': 400, 'House Valdris': 100, 'House Caelwyn': -100, 'House Aldric': -200 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `Within a week, two separate parties send inquiries about what you recovered from the Ashveil site. You have said nothing. They are now identifiable. House Mordaine finds this approach professionally sound.`,
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
      body: `A letter stamped with House Aldric's military seal. Terse, as their warband correspondence always is.\n\nTheir northern deployment is underequipped. The resupply convoy was intercepted three weeks ago and they have not recovered the loss. They are calling in what they describe as a reasonable expectation from allied forges.\n\nThirty steel pieces. Weapons and armor both accepted. Delivery through their standard courier within the fortnight.`,
    },
    options: [
      {
        id: 'comply',
        label: 'Send the shipment as requested.',
        text: 'You honor the levy without condition.',
        repChanges: { 'House Aldric': 400, 'House Mordaine': 100, 'House Caelwyn': -200, 'House Valdris': -150 },
        reward: [{ type: 'sealedCharter', amount: 1 }],
        outcomeText: `The shipment leaves within the week. House Aldric sends a brief acknowledgment and the name of a contact for future requisitions. You are now on their resupply list.`,
      },
      {
        id: 'redirect',
        label: 'Redirect the shipment elsewhere.',
        text: 'You have other uses for this steel.',
        repChanges: { 'House Caelwyn': 400, 'House Valdris': 100, 'House Aldric': -200, 'House Mordaine': -150 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `The steel goes where you decide. House Aldric receives no direct refusal — only silence where a shipment should have been. They note the absence.`,
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
      body: `No seal. No origin mark. The handwriting matches nothing in your files.\n\nThe letter describes a cache of darksteel arms and requests they be moved within a narrow window. The routing instructions are specific — specific enough that whoever wrote this knows your patrol schedules and your current storage capacity. They are not guessing at your resources.\n\nThere is no name to reply to. Only a location, a time, and the clear implication that someone capable of this kind of knowledge is waiting for your answer.`,
    },
    options: [
      {
        id: 'deliver',
        label: 'Deliver the arms as directed.',
        text: 'You ask nothing about where they go.',
        repChanges: { 'House Valdris': 300, 'House Mordaine': 200, 'House Aldric': -100, 'House Caelwyn': -200 },
        reward: [{ type: 'sealedCharter', amount: 1 }],
        outcomeText: `The arms are moved. No courier appears at the handoff. When you check the drop point a week later, everything is gone. Whoever this served, you have served them — and they now know you can be relied upon.`,
      },
      {
        id: 'route_own',
        label: 'Route them to your own stores.',
        text: 'You take the arms. No explanation given.',
        repChanges: { 'House Mordaine': 400, 'House Aldric': 100, 'House Caelwyn': -200, 'House Valdris': -150 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `You redirect the shipment. The intended recipient receives nothing. You have twenty darksteel pieces and an unknown party who is now aware that you cannot be assumed cooperative.`,
      },
      {
        id: 'destroy',
        label: 'Destroy the cache.',
        text: "You don't know who is waiting for these. Neither will anyone else.",
        repChanges: { 'House Caelwyn': 400, 'House Valdris': 200, 'House Aldric': -200, 'House Mordaine': -300 },
        reward: [{ type: 'commonWrit', amount: 3 }],
        outcomeText: `The cache is destroyed in place. You cannot be used as a courier for something you no longer hold. Whoever expected this delivery will need to find another path — and will spend time wondering whether you were compromised or simply unwilling.`,
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
      body: `One of your heroes has a past that predates your banner. That past has now walked into the present.\n\nA figure appeared at the edge of camp before dawn. One of your own recognized them. They spoke for less than a minute, voices low, and the figure was gone before your patrol completed its circuit.\n\nYour hero said nothing to you about it until you asked directly. They are not hiding that they know this person. They are not explaining who it is either.\n\nThere is history here. It is not clean.`,
    },
    options: [
      {
        id: 'confront',
        label: 'Confront them directly.',
        text: 'No more silence.',
        repChanges: { 'House Aldric': 200, 'House Mordaine': 200, 'House Caelwyn': -100, 'House Valdris': -100 },
        reward: [{ type: 'sealedCharter', amount: 2 }],
        outcomeText: `You ask for a full account. Your hero provides it — slowly and with evident difficulty. The figure is not an enemy. Not exactly. But they are not safe to have near your banner either. You know more now. So does your hero, about where they stand with you.`,
      },
      {
        id: 'cover',
        label: "Cover for them. Their past is not yours to expose.",
        text: 'What happened before is not your account to give.',
        repChanges: { 'House Caelwyn': 300, 'House Mordaine': 200, 'House Aldric': -200, 'House Valdris': -100 },
        reward: [{ type: 'sealedCharter', amount: 2 }],
        outcomeText: `You tell anyone who inquires that the meeting was a routine contact. It was not. Your hero does not forget that you covered for them. Whatever debt that creates, it is now part of the arrangement between you.`,
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
      { id: 'raid_set', type: 'raidSetComplete', setId: 'any', label: 'Obtain a complete raid set (all 5 armor pieces)' },
    ],
    dispatch: {
      sender: 'The Realm',
      subject: 'What the Raids Left Behind',
      body: `The raids have been teaching you something. Not only in the fighting — in what the defeated left behind.\n\nYou now hold a complete set of arms and armor forged in a tradition that predates the great houses. Possibly predates the Realm itself. The craftsmanship is not comparable to anything your forge produces. Neither is what it implies about who wore it and where it came from.\n\nThere are those who would take this from you given the opportunity. There are those who would pay considerably simply to confirm you possess it. What you do next will be visible to both.`,
    },
    options: [
      {
        id: 'claim_openly',
        label: 'Claim the power openly.',
        text: 'You wear it. You let them see it.',
        repChanges: { 'House Aldric': 300, 'House Mordaine': 300, 'House Caelwyn': -200, 'House Valdris': -200 },
        reward: [{ type: 'sealedCharter', amount: 2 }],
        outcomeText: `You make no effort to conceal what you carry. Within a week, three separate parties have sent representatives. The nature of these conversations has changed. You are no longer someone who can move quietly.`,
      },
      {
        id: 'conceal',
        label: 'Conceal what you found.',
        text: 'The armor goes somewhere no one thinks to look.',
        repChanges: { 'House Caelwyn': 300, 'House Valdris': 300, 'House Aldric': -200, 'House Mordaine': -200 },
        reward: [{ type: 'sealedCharter', amount: 2 }],
        outcomeText: `The armor is stored where only your innermost circle knows. You continue to move as though nothing has changed. For now, you are still someone who can make decisions that others cannot track.`,
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
      body: `They have kept records on you. Not the great houses — though they have their own. The Realm itself. Whatever that means at this point.\n\nThe account is extensive. The crossing. The farmsteads. The ledger. The night letter and what you chose to do with it. The raids. The dungeons. The siege. The armor. Every decision, weighted and filed.\n\nThe letter does not explain what the Realm intends or what happens after. It gives a location and a time.\n\nEvery path you took led here. That is all it says.`,
    },
    options: [
      {
        id: 'siege',
        label: 'Lead the siege.',
        text: 'Every choice has led here.',
        repChanges: {},
        reward: [{ type: 'houseSeal', amount: 1 }],
        outcomeText: `You go. The record that was kept on you is now part of something larger than any of the houses planned for. What comes after this is yours to determine — and no one else's to predict.`,
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
      const instances  = gameStats.ownedInstances ?? useInventoryStore().ownedInstances
      const setsToCheck = obj.setId === 'any' ? ['regret', 'null_panoply'] : [obj.setId]
      const allSlots   = Object.values(GearSlot)
      return setsToCheck.some(setId =>
        allSlots.every(slot =>
          instances.some(i => i.setId === setId && i.slot === slot)
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

    useJournalStore().addEntry({
      type:  ENTRY_TYPES.QUEST_COMPLETE,
      title: `Quest complete: ${quest.name}`,
      body:  option.outcomeText ?? '',
    })

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

  // Returns the best-progressing set's slot breakdown for raidSetComplete objectives.
  // { setId, setName, slots: [{ slot, owned }], count, total }
  function raidSetSlotProgress(questId, objectiveId) {
    const quest = QUESTS.find(q => q.id === questId)
    const obj   = quest?.objectives.find(o => o.id === objectiveId)
    if (!obj || obj.type !== 'raidSetComplete') return null
    const inventory   = useInventoryStore()
    const setsToCheck = obj.setId === 'any' ? ['regret', 'null_panoply'] : [obj.setId]
    const allSlots    = Object.values(GearSlot)
    const SET_NAMES   = { regret: 'Regalia of Regret', null_panoply: 'Null Panoply' }
    const results = setsToCheck.map(setId => {
      const slots = allSlots.map(slot => ({
        slot,
        owned: inventory.ownedInstances.some(i => i.setId === setId && i.slot === slot),
      }))
      return { setId, setName: SET_NAMES[setId] ?? setId, slots, count: slots.filter(s => s.owned).length, total: allSlots.length }
    })
    return results.sort((a, b) => b.count - a.count)[0]
  }

  return {
    QUESTS, totalQP,
    completedIds, chosenOptions,
    questStatus, objectiveProgress, getReadyDispatch,
    markManualDone, complete,
    canDonate, donateItems, donateAvailableCount,
    raidSetSlotProgress,
  }
})
