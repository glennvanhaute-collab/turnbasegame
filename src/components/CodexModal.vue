<template>
  <div class="codex-backdrop" @click.self="$emit('close')">
    <div class="codex-modal">

      <!-- Spine decoration -->
      <div class="codex-spine" />

      <!-- Header -->
      <div class="codex-header">
        <div class="codex-title-row">
          <span class="codex-icon">📖</span>
          <h2 class="codex-title">Codex of Westrun</h2>
        </div>
        <div class="codex-tabs">
          <button class="codex-tab" :class="{ active: tab === 'journal' }"    @click="tab = 'journal'">Adventure Log</button>
          <button class="codex-tab" :class="{ active: tab === 'lore' }"       @click="tab = 'lore'">Lore</button>
          <button class="codex-tab" :class="{ active: tab === 'heroes' }"     @click="tab = 'heroes'">Heroes</button>
        </div>
        <button class="codex-close" @click="$emit('close')">✕</button>
      </div>

      <!-- Adventure Log -->
      <div class="codex-body" v-if="tab === 'journal'">
        <div class="journal-empty" v-if="!journal.entries.length">
          <div class="empty-icon">🖋</div>
          <p>Your story has not yet been written.</p>
          <p class="empty-sub">As you explore Westrun, your deeds will be recorded here.<br>Look for the <strong>"Write in my journal"</strong> prompt during key moments.</p>
        </div>

        <div class="journal-entries" v-else>
          <div
            v-for="entry in journal.entries"
            :key="entry.id"
            class="journal-entry"
            :class="entry.type"
          >
            <div class="entry-header">
              <span class="entry-type-icon">{{ TYPE_ICONS[entry.type] }}</span>
              <span class="entry-title">{{ entry.title }}</span>
              <span class="entry-date">{{ entry.date }}</span>
              <button class="entry-delete" @click="journal.removeEntry(entry.id)" title="Remove entry">✕</button>
            </div>
            <p class="entry-body">{{ entry.body }}</p>
            <div class="entry-context" v-if="entry.context">
              <span v-for="(val, key) in entry.context" :key="key" class="context-chip">
                {{ key }}: {{ val }}
              </span>
            </div>
          </div>
        </div>

        <!-- Manual entry -->
        <div class="journal-write" v-if="writing">
          <input
            v-model="newTitle"
            class="write-input"
            placeholder="Title this moment..."
            maxlength="60"
          />
          <textarea
            v-model="newBody"
            class="write-textarea"
            placeholder="Write what happened, what you felt, why this matters..."
            rows="4"
          />
          <div class="write-actions">
            <button class="btn-write-cancel" @click="cancelWrite">Cancel</button>
            <button class="btn-write-save"   @click="saveManual" :disabled="!newTitle.trim()">Seal the Entry</button>
          </div>
        </div>

        <button class="btn-open-journal" v-else @click="writing = true">
          🖋 Write in my journal
        </button>
      </div>

      <!-- Lore tab — discovered bonds -->
      <div class="codex-body" v-else-if="tab === 'lore'">
        <template v-if="bondStore.discoveredList.length">
          <div v-for="bondId in bondStore.discoveredList" :key="bondId" class="lore-bond-entry">
            <img
              v-if="BOND_IMAGES[bondId]"
              :src="BOND_IMAGES[bondId]"
              class="lore-bond-image"
              :alt="BOND_LORE[bondId]?.name"
            />
            <div class="lore-bond-body">
              <div class="lore-bond-eyebrow">Companionship Bond</div>
              <h3 class="lore-bond-title">{{ BOND_LORE[bondId]?.name }}</h3>
              <p class="lore-bond-subtitle">{{ BOND_LORE[bondId]?.subtitle }}</p>
              <blockquote class="lore-bond-quote" v-if="BOND_LORE[bondId]?.quote">{{ BOND_LORE[bondId].quote }}</blockquote>
              <p class="lore-bond-text" v-if="BOND_LORE[bondId]?.body">{{ BOND_LORE[bondId].body }}</p>
            </div>
          </div>
        </template>
        <div class="codex-coming" v-else>
          <div class="empty-icon">🗺</div>
          <p>No bonds discovered yet.</p>
          <p class="empty-sub">Some connections are only revealed when certain heroes stand side by side.</p>
        </div>
      </div>

      <!-- Heroes tab — placeholder -->
      <div class="codex-body codex-coming" v-else-if="tab === 'heroes'">
        <div class="empty-icon">⚔</div>
        <p>Hero codex entries unlock as you learn their stories.</p>
        <p class="empty-sub">Some names are only revealed through the world itself.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useJournalStore, ENTRY_TYPES } from '../stores/useJournalStore.js'
import { useBondStore } from '../stores/useBondStore.js'
import { BOND_LORE } from '../game/data/lore.js'
import bondHelgaAldricImg from '../assets/lore/bond-unlocked-helga-aldric.png'

defineEmits(['close'])

const journal   = useJournalStore()
const bondStore = useBondStore()
const tab       = ref('journal')

const BOND_IMAGES = { iron_vow: bondHelgaAldricImg }
const writing = ref(false)
const newTitle = ref('')
const newBody  = ref('')

const TYPE_ICONS = {
  [ENTRY_TYPES.GEAR_DROP]:     '⚔',
  [ENTRY_TYPES.LEVEL_UP]:      '★',
  [ENTRY_TYPES.LORE_FOUND]:    '📜',
  [ENTRY_TYPES.DUNGEON_CLEAR]: '🏰',
  [ENTRY_TYPES.RECRUIT]:       '⚑',
  [ENTRY_TYPES.MANUAL]:        '🖋',
}

function saveManual() {
  if (!newTitle.value.trim()) return
  journal.addEntry({
    type:  ENTRY_TYPES.MANUAL,
    title: newTitle.value.trim(),
    body:  newBody.value.trim(),
  })
  newTitle.value = ''
  newBody.value  = ''
  writing.value  = false
}

function cancelWrite() {
  newTitle.value = ''
  newBody.value  = ''
  writing.value  = false
}
</script>

<style scoped>
.codex-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(3px);
}

.codex-modal {
  position: relative;
  background: #0f0a05;
  background-image: linear-gradient(135deg, #130d06 0%, #0a0703 100%);
  border: 1px solid var(--border-gold);
  border-radius: 4px;
  width: min(780px, 95vw);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 80px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.03);
  overflow: hidden;
}

/* Book spine on the left */
.codex-spine {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 6px;
  background: linear-gradient(180deg, #5c3a14 0%, #3a1e08 50%, #5c3a14 100%);
  border-radius: 4px 0 0 4px;
}

.codex-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px 0 20px;
  padding-left: 26px;
  border-bottom: 1px solid var(--border-brown);
  flex-shrink: 0;
}

.codex-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 8px;
}
.codex-icon { font-size: 1rem; }
.codex-title {
  font-family: var(--font-head);
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 2px;
  white-space: nowrap;
}

.codex-tabs {
  display: flex;
  gap: 0;
  flex: 1;
}
.codex-tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-muted);
  font-family: var(--font-head);
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 6px 14px 10px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  position: relative;
  top: 1px;
}
.codex-tab:hover  { color: var(--text-parchment); }
.codex-tab.active { color: var(--gold); border-bottom-color: var(--gold); }

.codex-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.15s;
  margin-left: auto;
}
.codex-close:hover { color: var(--text-parchment); }

/* Body */
.codex-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 20px 20px 26px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Empty state */
.journal-empty, .codex-coming {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 60px 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.74rem;
  line-height: 1.7;
  flex: 1;
}
.empty-icon { font-size: 2.5rem; opacity: 0.4; }
.empty-sub  { font-size: 0.66rem; color: var(--text-dim); }
.empty-sub strong { color: var(--text-muted); }

/* Journal entries */
.journal-entries { display: flex; flex-direction: column; gap: 10px; }
.journal-entry {
  background: #0e0905;
  border: 1px solid var(--border-brown);
  border-left: 3px solid var(--gold-dim);
  border-radius: 0 6px 6px 0;
  padding: 12px 14px;
  transition: border-color 0.15s;
}
.journal-entry:hover { border-left-color: var(--gold); }
.journal-entry.gear_drop  { border-left-color: #4fa8ff55; }
.journal-entry.gear_drop:hover { border-left-color: #4fa8ff; }
.journal-entry.level_up   { border-left-color: #aaff4455; }
.journal-entry.level_up:hover { border-left-color: #aaff44; }
.journal-entry.lore_found { border-left-color: #c9a22755; }
.journal-entry.lore_found:hover { border-left-color: var(--gold); }
.journal-entry.recruit    { border-left-color: #aa77ff55; }
.journal-entry.recruit:hover { border-left-color: #aa77ff; }

.entry-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.entry-type-icon { font-size: 0.8rem; flex-shrink: 0; }
.entry-title {
  font-family: var(--font-head);
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--text-parchment);
  flex: 1;
}
.entry-date {
  font-size: 0.58rem;
  color: var(--text-dim);
  font-style: italic;
  white-space: nowrap;
}
.entry-delete {
  background: none;
  border: none;
  color: var(--text-dim);
  font-size: 0.65rem;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  transition: color 0.15s;
  flex-shrink: 0;
}
.entry-delete:hover { color: #cc4444; }

.entry-body {
  font-size: 0.7rem;
  color: var(--text-muted);
  line-height: 1.7;
  font-style: italic;
}

.entry-context {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 6px;
}
.context-chip {
  font-size: 0.58rem;
  background: #0a0602;
  border: 1px solid var(--border-brown);
  border-radius: 4px;
  padding: 1px 7px;
  color: var(--text-dim);
}

/* Write section */
.journal-write {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #0e0905;
  border: 1px solid var(--border-gold);
  border-radius: 6px;
  padding: 14px;
}
.write-input {
  background: #080503;
  border: 1px solid var(--border-brown);
  border-radius: 4px;
  color: var(--text-parchment);
  font-family: var(--font-head);
  font-size: 0.76rem;
  padding: 8px 12px;
  outline: none;
  transition: border-color 0.15s;
}
.write-input:focus { border-color: var(--gold); }
.write-textarea {
  background: #080503;
  border: 1px solid var(--border-brown);
  border-radius: 4px;
  color: var(--text-parchment);
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 0.72rem;
  line-height: 1.7;
  padding: 8px 12px;
  outline: none;
  resize: vertical;
  transition: border-color 0.15s;
}
.write-textarea:focus { border-color: var(--gold); }
.write-textarea::placeholder,
.write-input::placeholder { color: var(--text-dim); font-style: italic; }

.write-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.btn-write-cancel {
  background: none;
  border: 1px solid var(--border-brown);
  border-radius: 6px;
  color: var(--text-muted);
  font-family: var(--font-head);
  font-size: 0.65rem;
  padding: 6px 16px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.btn-write-cancel:hover { color: var(--text-parchment); border-color: var(--border-gold); }

.btn-write-save {
  background: color-mix(in srgb, var(--gold) 12%, transparent);
  border: 1px solid var(--gold-dim);
  border-radius: 6px;
  color: var(--gold);
  font-family: var(--font-head);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 6px 16px;
  cursor: pointer;
  transition: background 0.15s;
  text-transform: uppercase;
}
.btn-write-save:hover:not(:disabled) { background: color-mix(in srgb, var(--gold) 22%, transparent); }
.btn-write-save:disabled { opacity: 0.3; cursor: not-allowed; }

.btn-open-journal {
  align-self: flex-start;
  background: none;
  border: 1px solid var(--border-brown);
  border-radius: 6px;
  color: var(--text-muted);
  font-family: var(--font-head);
  font-size: 0.65rem;
  letter-spacing: 1px;
  padding: 7px 16px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  text-transform: uppercase;
}
.btn-open-journal:hover { color: var(--gold); border-color: var(--gold-dim); }

/* Lore tab — bond entries */
.lore-bond-entry {
  display: flex;
  flex-direction: column;
  border: 1px solid #c8860a44;
  border-radius: 6px;
  overflow: hidden;
  background: #0e0a04;
}
.lore-bond-image {
  width: 100%;
  height: auto;
  display: block;
}
.lore-bond-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 18px;
}
.lore-bond-eyebrow {
  font-size: 0.58rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #c8860a;
  font-family: var(--font-head);
  font-weight: 700;
}
.lore-bond-title {
  font-family: var(--font-head);
  font-size: 1rem;
  font-weight: 800;
  color: #f5c842;
  margin: 0;
  letter-spacing: 0.5px;
}
.lore-bond-subtitle {
  font-size: 0.66rem;
  color: #8a7040;
  margin: 0;
  letter-spacing: 0.5px;
}
.lore-bond-quote {
  border-left: 2px solid #c8860a44;
  margin: 2px 0;
  padding: 6px 12px;
  font-size: 0.68rem;
  font-style: italic;
  color: #9a7840;
  line-height: 1.6;
}
.lore-bond-text {
  font-size: 0.68rem;
  color: #7a6650;
  line-height: 1.85;
  white-space: pre-line;
  margin: 0;
}
</style>
