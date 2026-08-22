<template>
  <div class="cp-wrap" @keydown="onKey" tabindex="0" ref="wrapRef">

    <div class="cp-header">
      <p class="cp-title">The Ashvein Cipher</p>
      <p class="cp-sub">Each row, column, and region must contain the runes 1–9 exactly once.</p>
    </div>

    <div class="cp-grid">
      <div
        v-for="(row, r) in grid"
        :key="r"
        class="cp-row"
        :class="{ 'row-box-bottom': r === 2 || r === 5 }"
      >
        <div
          v-for="(val, c) in row"
          :key="c"
          class="cp-cell"
          :class="{
            'cell-given':    isGiven(r, c),
            'cell-selected': sel?.r === r && sel?.c === c,
            'cell-conflict': conflicts.has(`${r},${c}`),
            'cell-correct':  !isGiven(r,c) && val && val === SOLUTION[r][c] && !conflicts.has(`${r},${c}`),
            'col-box-right': c === 2 || c === 5,
          }"
          @click="selectCell(r, c)"
        >{{ val || '' }}</div>
      </div>
    </div>

    <div class="cp-numpad">
      <button
        v-for="n in 9"
        :key="n"
        class="cp-num"
        :class="{ 'cp-num--active': sel && !isGiven(sel.r, sel.c) && grid[sel.r][sel.c] === n }"
        @click="enter(n)"
        :disabled="!sel || isGiven(sel?.r, sel?.c)"
      >{{ n }}</button>
      <button
        class="cp-num cp-erase"
        @click="enter(0)"
        :disabled="!sel || isGiven(sel?.r, sel?.c)"
      >✕</button>
    </div>

    <div class="cp-footer">
      <span class="cp-progress">{{ filled }} / {{ blanks }}</span>
      <button
        class="cp-decipher"
        :disabled="filled < blanks || solved"
        @click="check"
      >Decipher</button>
    </div>

    <Transition name="verdict">
      <div v-if="verdict === 'error'" class="cp-verdict cp-verdict--error">
        The pattern contains errors. Look again.
      </div>
      <div v-else-if="verdict === 'success'" class="cp-verdict cp-verdict--success">
        ✦ The cipher yields. The pattern is complete.
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const STORAGE_KEY = 'cipher-ashvein-grid'

const PUZZLE = [
  [0, 0, 0, 2, 6, 0, 7, 0, 1],
  [6, 8, 0, 0, 7, 0, 0, 9, 0],
  [1, 9, 0, 0, 0, 4, 5, 0, 0],
  [8, 2, 0, 1, 0, 0, 0, 4, 0],
  [0, 0, 4, 6, 0, 2, 9, 0, 0],
  [0, 5, 0, 0, 0, 3, 0, 2, 8],
  [0, 0, 9, 3, 0, 0, 0, 7, 4],
  [0, 4, 0, 0, 5, 0, 0, 3, 6],
  [7, 0, 3, 0, 1, 8, 0, 0, 0],
]

const SOLUTION = [
  [4, 3, 5, 2, 6, 9, 7, 8, 1],
  [6, 8, 2, 5, 7, 1, 4, 9, 3],
  [1, 9, 7, 8, 3, 4, 5, 6, 2],
  [8, 2, 6, 1, 9, 5, 3, 4, 7],
  [3, 7, 4, 6, 8, 2, 9, 1, 5],
  [9, 5, 1, 7, 4, 3, 6, 2, 8],
  [5, 1, 9, 3, 2, 6, 8, 7, 4],
  [2, 4, 8, 9, 5, 7, 1, 3, 6],
  [7, 6, 3, 4, 1, 8, 2, 5, 9],
]

const emit = defineEmits(['solved'])

const wrapRef = ref(null)

function loadGrid() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (saved?.length === 9 && saved[0]?.length === 9) return saved
  } catch {}
  return PUZZLE.map(row => [...row])
}

const grid   = ref(loadGrid())
const sel    = ref(null)
const verdict = ref(null)
const solved  = ref(false)

watch(grid, (g) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(g))
}, { deep: true })

onMounted(() => {
  wrapRef.value?.focus()
})

function isGiven(r, c) {
  return PUZZLE[r][c] !== 0
}

function selectCell(r, c) {
  if (solved.value) return
  sel.value = { r, c }
  wrapRef.value?.focus()
  verdict.value = null
}

function enter(n) {
  if (!sel.value || isGiven(sel.value.r, sel.value.c) || solved.value) return
  grid.value[sel.value.r][sel.value.c] = n
  verdict.value = null
}

function move(dr, dc) {
  const r = ((sel.value?.r ?? 0) + dr + 9) % 9
  const c = ((sel.value?.c ?? 0) + dc + 9) % 9
  sel.value = { r, c }
}

function onKey(e) {
  const n = parseInt(e.key)
  if (n >= 1 && n <= 9)                         { enter(n); return }
  if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') { enter(0); return }
  if (e.key === 'ArrowUp')    { move(-1,  0); e.preventDefault(); return }
  if (e.key === 'ArrowDown')  { move( 1,  0); e.preventDefault(); return }
  if (e.key === 'ArrowLeft')  { move( 0, -1); e.preventDefault(); return }
  if (e.key === 'ArrowRight') { move( 0,  1); e.preventDefault(); return }
}

const blanks = computed(() =>
  PUZZLE.flat().filter(v => v === 0).length
)

const filled = computed(() =>
  grid.value.flat().reduce((n, v, i) => PUZZLE.flat()[i] === 0 && v !== 0 ? n + 1 : n, 0)
)

const conflicts = computed(() => {
  const bad = new Set()
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = grid.value[r][c]
      if (!v) continue
      // row
      for (let cc = 0; cc < 9; cc++) {
        if (cc !== c && grid.value[r][cc] === v) { bad.add(`${r},${c}`); bad.add(`${r},${cc}`) }
      }
      // col
      for (let rr = 0; rr < 9; rr++) {
        if (rr !== r && grid.value[rr][c] === v) { bad.add(`${r},${c}`); bad.add(`${rr},${c}`) }
      }
      // box
      const br = Math.floor(r / 3) * 3
      const bc = Math.floor(c / 3) * 3
      for (let rr = br; rr < br + 3; rr++) {
        for (let cc = bc; cc < bc + 3; cc++) {
          if ((rr !== r || cc !== c) && grid.value[rr][cc] === v) {
            bad.add(`${r},${c}`); bad.add(`${rr},${cc}`)
          }
        }
      }
    }
  }
  return bad
})

function check() {
  const correct = grid.value.every((row, r) =>
    row.every((val, c) => val === SOLUTION[r][c])
  )
  if (correct) {
    verdict.value = 'success'
    solved.value  = true
    localStorage.removeItem(STORAGE_KEY)
    setTimeout(() => emit('solved'), 1200)
  } else {
    verdict.value = 'error'
  }
}
</script>

<style scoped>
.cp-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 28px 32px 32px;
  background: #09080c;
  outline: none;
  min-width: 420px;
}

.cp-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cp-title {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #c4b888;
  margin: 0;
}

.cp-sub {
  font-size: 0.68rem;
  color: #5a5040;
  letter-spacing: 0.06em;
  margin: 0;
  font-style: italic;
}

/* ── Grid ── */
.cp-grid {
  display: flex;
  flex-direction: column;
  border: 2px solid #3a2e18;
}

.cp-row {
  display: flex;
}

.cp-row.row-box-bottom .cp-cell {
  border-bottom: 2px solid #5a4830;
}

.cp-cell {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  border: 1px solid #1e1814;
  cursor: pointer;
  user-select: none;
  color: #8a7e60;
  background: #0d0b0a;
  transition: background 0.08s;
  box-sizing: border-box;
}

.cp-cell.col-box-right {
  border-right: 2px solid #5a4830;
}

.cp-cell.cell-given {
  color: #d4af37;
  font-weight: 700;
  background: #0f0d09;
  cursor: default;
}

.cp-cell.cell-selected {
  background: #1a1608;
  outline: 1px solid #d4af37;
  outline-offset: -1px;
  color: #e8d888;
  z-index: 1;
}

.cp-cell.cell-conflict {
  color: #ff5555;
  background: #1a0808;
}

.cp-cell.cell-correct {
  color: #4dcc88;
}

/* ── Numpad ── */
.cp-numpad {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 380px;
}

.cp-num {
  width: 36px;
  height: 36px;
  background: #0f0e0b;
  border: 1px solid #2a2418;
  border-radius: 3px;
  color: #c4b888;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.1s, border-color 0.1s;
}

.cp-num:hover:not(:disabled) {
  background: #1a1814;
  border-color: #4a4030;
}

.cp-num:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.cp-num--active {
  background: #1a1508;
  border-color: #d4af37;
  color: #d4af37;
}

.cp-erase {
  color: #6a5040;
  font-size: 0.72rem;
}

/* ── Footer ── */
.cp-footer {
  display: flex;
  align-items: center;
  gap: 20px;
}

.cp-progress {
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #4a4030;
  font-variant-numeric: tabular-nums;
}

.cp-decipher {
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 8px 22px;
  background: #1a1508;
  border: 1px solid #3a3020;
  color: #d4af37;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;
}

.cp-decipher:hover:not(:disabled) {
  background: #241e0a;
  border-color: #5a5030;
}

.cp-decipher:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* ── Verdict ── */
.cp-verdict {
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  padding: 10px 18px;
  border-radius: 3px;
  text-align: center;
}

.cp-verdict--error {
  background: #1a0808;
  border: 1px solid #4a1010;
  color: #ff6666;
}

.cp-verdict--success {
  background: #081a10;
  border: 1px solid #104a28;
  color: #4dff88;
  font-weight: 600;
}

.verdict-enter-active, .verdict-leave-active { transition: opacity 0.2s; }
.verdict-enter-from, .verdict-leave-to { opacity: 0; }
</style>
