<template>
  <div class="shop-backdrop" @click.self="$emit('close')">
    <div class="shop-modal">
      <div class="shop-bg" :style="{ backgroundImage: `url(${theTruthImg})` }" />

      <div class="shop-header">
        <div class="shop-title-row">
          <span class="shop-icon">💎</span>
          <h2 class="shop-title">Diamond Exchange</h2>
        </div>
        <div class="shop-balance">
          <span class="balance-icon">💎</span>
          <span class="balance-amount">{{ currencyStore.diamonds.toLocaleString() }}</span>
        </div>
        <button class="shop-close" @click="$emit('close')">✕</button>
      </div>

      <!-- Orbs -->
      <div class="shop-section-label">Forging Orbs</div>
      <div class="shop-grid">
        <div
          v-for="item in ORB_ITEMS"
          :key="item.id"
          class="shop-card"
          :style="{ '--item-color': item.color }"
        >
          <OrbIcon :orbId="item.orbId" :size="52" />
          <div class="shop-card-info">
            <div class="shop-card-name">{{ item.name }}</div>
            <div class="shop-card-desc">{{ item.desc }}</div>
          </div>
          <div class="shop-card-buy">
            <div class="shop-qty-row">
              <button class="qty-btn" @click="item.qty > 1 && item.qty--">−</button>
              <span class="qty-val">{{ item.qty }}</span>
              <button class="qty-btn" @click="item.qty++">+</button>
            </div>
            <div class="shop-price">
              <span class="price-icon">💎</span>
              <span class="price-amount">{{ (item.price * item.qty).toLocaleString() }}</span>
            </div>
            <button
              class="btn-buy"
              :disabled="!currencyStore.canAffordDiamonds(item.price * item.qty)"
              @click="buyOrb(item)"
            >Buy</button>
          </div>
        </div>
      </div>

      <!-- Potential Stamps -->
      <div class="shop-section-label" style="margin-top: 20px;">Potential</div>
      <div class="shop-grid">
        <div class="shop-card" style="--item-color: #ffd700">
          <div class="stamp-icon-lg">◈</div>
          <div class="shop-card-info">
            <div class="shop-card-name">Potential Stamp</div>
            <div class="shop-card-desc">Reveals the hidden potential of a piece of gear, awakening it to Rare Potential with 2 stat lines. Use orbs to re-roll lines and rank up to Epic → Unique → Legendary Potential.</div>
          </div>
          <div class="shop-card-buy">
            <div class="shop-qty-row">
              <button class="qty-btn" @click="stampQty > 1 && stampQty--">−</button>
              <span class="qty-val">{{ stampQty }}</span>
              <button class="qty-btn" @click="stampQty++">+</button>
            </div>
            <div class="shop-price">
              <span class="price-icon">💎</span>
              <span class="price-amount">{{ (80 * stampQty).toLocaleString() }}</span>
            </div>
            <button
              class="btn-buy"
              :disabled="!currencyStore.canAffordDiamonds(80 * stampQty)"
              @click="buyStamp()"
            >Buy</button>
          </div>
        </div>
      </div>

      <!-- Utility -->
      <div class="shop-section-label" style="margin-top: 20px;">Utility</div>
      <div class="shop-grid">
        <div class="shop-card" style="--item-color: #aaff44">
          <div class="energy-icon-lg">⚡</div>
          <div class="shop-card-info">
            <div class="shop-card-name">Energy Refill</div>
            <div class="shop-card-desc">Restores 30 energy instantly. Energy regenerates on its own over time, but sometimes the call of adventure can't wait.</div>
          </div>
          <div class="shop-card-buy">
            <div class="shop-qty-row">
              <button class="qty-btn" @click="energyQty > 1 && energyQty--">−</button>
              <span class="qty-val">{{ energyQty }}</span>
              <button class="qty-btn" @click="energyQty++">+</button>
            </div>
            <div class="shop-price">
              <span class="price-icon">💎</span>
              <span class="price-amount">{{ (30 * energyQty).toLocaleString() }}</span>
            </div>
            <button
              class="btn-buy"
              :disabled="!currencyStore.canAffordDiamonds(30 * energyQty)"
              @click="buyEnergy()"
            >Buy</button>
          </div>
        </div>
      </div>

      <!-- Relics -->
      <div class="shop-section-label" style="margin-top: 20px;">Relics</div>
      <div class="shop-grid">
        <div class="shop-card" style="--item-color: #aa77ff">
          <img :src="soulVesselImg" class="relic-img" alt="Soul Vessel" />
          <div class="shop-card-info">
            <div class="shop-card-name">Soul Vessel</div>
            <div class="shop-card-desc">A crystallised fragment of a fallen hero's essence. Used to awaken Legendary units into their Progressive form.</div>
          </div>
          <div class="shop-card-buy">
            <div class="shop-qty-row">
              <button class="qty-btn" @click="soulQty > 1 && soulQty--">−</button>
              <span class="qty-val">{{ soulQty }}</span>
              <button class="qty-btn" @click="soulQty++">+</button>
            </div>
            <div class="shop-price">
              <span class="price-icon">💎</span>
              <span class="price-amount">{{ (100 * soulQty).toLocaleString() }}</span>
            </div>
            <button
              class="btn-buy"
              :disabled="!currencyStore.canAffordDiamonds(100 * soulQty)"
              @click="buySoulVessel()"
            >Buy</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import OrbIcon from './OrbIcon.vue'
import soulVesselImg from '../assets/ui/soulvessel.png'
import theTruthImg from '../assets/lore/The truth.png'
import { useCurrencyStore } from '../stores/useCurrencyStore.js'
import { useForgeStore, ORBS } from '../stores/useForgeStore.js'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import { useEnergyStore } from '../stores/useEnergyStore.js'

defineEmits(['close'])

const currencyStore  = useCurrencyStore()
const forgeStore     = useForgeStore()
const inventoryStore = useInventoryStore()
const energyStore    = useEnergyStore()

const ORB_ITEMS = reactive([
  {
    id:     'simple',
    orbId:  'cracked',
    name:   ORBS.cracked.label,
    desc:   ORBS.cracked.desc,
    color:  ORBS.cracked.color,
    price:  50,
    qty:    1,
  },
  {
    id:     'magnificent',
    orbId:  'master',
    name:   ORBS.master.label,
    desc:   ORBS.master.desc,
    color:  ORBS.master.color,
    price:  150,
    qty:    1,
  },
  {
    id:     'astral',
    orbId:  'dark',
    name:   ORBS.dark.label,
    desc:   ORBS.dark.desc,
    color:  ORBS.dark.color,
    price:  400,
    qty:    1,
  },
])

const soulQty   = ref(1)
const energyQty = ref(1)
const stampQty  = ref(1)

function buyOrb(item) {
  const total = item.price * item.qty
  if (!currencyStore.spendDiamonds(total)) return
  forgeStore.orbs[item.orbId] += item.qty
  item.qty = 1
}

function buySoulVessel() {
  const total = 100 * soulQty.value
  if (!currencyStore.spendDiamonds(total)) return
  inventoryStore.soulVessels += soulQty.value
  soulQty.value = 1
}

function buyEnergy() {
  const total = 30 * energyQty.value
  if (!currencyStore.spendDiamonds(total)) return
  energyStore.add(30 * energyQty.value)
  energyQty.value = 1
}

function buyStamp() {
  const total = 80 * stampQty.value
  if (!currencyStore.spendDiamonds(total)) return
  forgeStore.stamps += stampQty.value
  stampQty.value = 1
}
</script>

<style scoped>
.shop-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(3px);
}

.shop-modal {
  position: relative;
  background: #110c06;
  border: 1px solid var(--border-gold);
  border-radius: 14px;
  width: min(720px, 95vw);
  max-height: 85vh;
  overflow-y: auto;
  padding: 24px;
  box-shadow: 0 20px 80px rgba(0,0,0,0.9);
}

.shop-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center center;
  opacity: 0.10;
  border-radius: 14px;
  pointer-events: none;
}

.shop-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-brown);
}
.shop-title-row { display: flex; align-items: center; gap: 8px; flex: 1; }
.shop-icon { font-size: 1.2rem; }
.shop-title {
  font-family: var(--font-head);
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 2px;
}
.shop-balance {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #0a0602;
  border: 1px solid #0a204055;
  border-radius: 6px;
  padding: 5px 12px;
  font-family: var(--font-head);
  font-size: 0.82rem;
  font-weight: 700;
  color: #88ccff;
}
.balance-icon { font-size: 0.78rem; }
.shop-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.15s;
}
.shop-close:hover { color: var(--text-parchment); }

.shop-section-label {
  font-family: var(--font-head);
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--gold);
  margin-bottom: 10px;
}

.shop-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shop-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #0e0905;
  border: 1px solid var(--border-brown);
  border-radius: 10px;
  padding: 14px 16px;
  transition: border-color 0.15s;
}
.shop-card:hover { border-color: color-mix(in srgb, var(--item-color) 50%, transparent); }

.relic-img {
  width: 52px;
  height: 52px;
  object-fit: cover;
  object-position: center;
  border-radius: 6px;
  flex-shrink: 0;
  filter: drop-shadow(0 0 6px #8844ff88);
}

.shop-card-info { flex: 1; }
.shop-card-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--item-color);
  margin-bottom: 4px;
}
.shop-card-desc {
  font-size: 0.64rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.shop-card-buy {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.shop-qty-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.qty-btn {
  background: #1a1008;
  border: 1px solid var(--border-brown);
  border-radius: 4px;
  color: var(--text-parchment);
  width: 22px; height: 22px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: border-color 0.15s, color 0.15s;
}
.qty-btn:hover { border-color: var(--gold-dim); color: var(--gold); }
.qty-val {
  font-family: var(--font-head);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-parchment);
  min-width: 20px;
  text-align: center;
}

.shop-price {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-head);
  font-size: 0.78rem;
  font-weight: 700;
  color: #88ccff;
}
.price-icon { font-size: 0.72rem; }

.btn-buy {
  padding: 6px 20px;
  border-radius: 6px;
  border: 1px solid var(--item-color);
  background: color-mix(in srgb, var(--item-color) 12%, transparent);
  color: var(--item-color);
  font-family: var(--font-head);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}
.btn-buy:hover:not(:disabled) {
  background: color-mix(in srgb, var(--item-color) 25%, transparent);
}
.btn-buy:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.energy-icon-lg {
  font-size: 2.2rem;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  filter: drop-shadow(0 0 8px #aaff4488);
}

.stamp-icon-lg {
  font-size: 2rem;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #ffd700;
  filter: drop-shadow(0 0 8px #ffd70066);
}
</style>
