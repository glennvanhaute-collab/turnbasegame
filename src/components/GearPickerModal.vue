<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="inventory.closePicker()">
      <div class="modal">
        <div class="modal-header">
          <div>
            <div class="slot-label">{{ SLOT_LABELS[inventory.pendingSlot] }}</div>
            <div class="slot-hint" v-if="inventory.pendingSlot === GearSlot.OFF_HAND">
              Equip a <strong>weapon</strong> for dual wield (+15% ATK, +5% Crit) or a <strong>shield</strong> for defence (-12% damage taken)
            </div>
          </div>
          <button class="close-btn" @click="inventory.closePicker()">✕</button>
        </div>

        <!-- Currently equipped -->
        <div class="current-section" v-if="currentItem">
          <div class="section-label">Currently equipped</div>
          <GearItemRow :item="currentItem" :equipped="true" @unequip="doUnequip" />
        </div>

        <!-- Available items -->
        <div class="modal-body">
          <div class="section-label">Available</div>
          <div class="item-list" v-if="availableWithOwner.length">
            <GearItemRow
              v-for="{ item, equippedOnName } in availableWithOwner"
              :key="item.instanceId"
              :item="item"
              :equipped="item.instanceId === currentId"
              :equipped-on-name="equippedOnName"
              @equip="doEquip(item.instanceId)"
            />
          </div>
          <div class="empty" v-else>No compatible items in inventory.</div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import { SLOT_LABELS, GearSlot } from '../game/Gear.js'
import { HERO_TEMPLATES } from '../game/data/heroes.js'
import GearItemRow from './GearItemRow.vue'

const inventory = useInventoryStore()

const heroKey = computed(() => inventory.focusedHeroKey)
const slot    = computed(() => inventory.pendingSlot)

const currentId   = computed(() => inventory.getLoadout(heroKey.value)?.[slot.value] ?? null)
const currentItem = computed(() => currentId.value ? inventory.instanceById(currentId.value) : null)

const availableWithOwner = computed(() =>
  inventory.availableForSlot(heroKey.value, slot.value).map(item => {
    const owner = inventory.getEquippedBy(item.instanceId)
    const isThisSlot = owner?.heroKey === heroKey.value && owner?.slot === slot.value
    const equippedOnName = (owner && !isThisSlot)
      ? (HERO_TEMPLATES[owner.heroKey]?.()?.name ?? owner.heroKey)
      : null
    return { item, equippedOnName }
  })
)

function doEquip(instanceId) {
  inventory.equip(heroKey.value, slot.value, instanceId)
  inventory.closePicker()
}
function doUnequip() {
  inventory.unequip(heroKey.value, slot.value)
  inventory.closePicker()
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center;
  z-index: 200;
  backdrop-filter: blur(2px);
}
.modal {
  background: #1a0d0a;
  border: 1px solid #5c2810;
  border-radius: 12px;
  width: min(540px, 95vw);
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #221108;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
}
.slot-label { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
.slot-hint  { font-size: 0.72rem; color: #888; max-width: 380px; line-height: 1.4; }
.slot-hint strong { color: #ffd700; }
.close-btn {
  background: none; border: none; color: #666;
  font-size: 1.1rem; cursor: pointer; flex-shrink: 0;
}
.close-btn:hover { color: #ccc; }

.current-section {
  padding: 10px 20px;
  background: #130908;
  border-bottom: 1px solid #221108;
  flex-shrink: 0;
}
.modal-body { padding: 10px 20px; overflow-y: auto; flex: 1; }
.section-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; color: #444; margin-bottom: 8px; }
.item-list { display: flex; flex-direction: column; gap: 4px; }
.empty { color: #444; font-style: italic; font-size: 0.8rem; padding: 12px 0; }
</style>
