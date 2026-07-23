<template>
  <div class="blacksmith" :class="{ 'drawer-open': drawerOpen }">

    <div class="smith-bg" :style="{ backgroundImage: `url(${arsenalBg})` }" />
    <div class="smith-overlay" />
    <div class="mob-drawer-backdrop" v-if="drawerOpen" @click="drawerOpen = false" />

    <!-- ── Left: Recipe list ───────────────────────────────────────── -->
    <aside class="recipe-panel">
      <div class="panel-label">Recipes</div>

      <!-- Smelt section -->
      <div class="recipe-section-head">⊕ Smelt</div>
      <div class="smelt-group">
        <template v-for="bar in BAR_LIST" :key="bar.id">
          <!-- Special encounter-unlocked forge (elven/goblin/dwarf) — hidden until unlocked -->
          <template v-if="FORGE_TIERS[bar.requiredForge]?.special && isSpecialForgeUnlocked(bar.requiredForge)">
            <div class="smelt-forge-divider" :style="{ '--elven-color': FORGE_TIERS[bar.requiredForge].color }">
              <span class="sfd-dot" />
              <span class="sfd-name">{{ FORGE_TIERS[bar.requiredForge].name }}</span>
            </div>
            <button
              class="smelt-btn elven"
              :class="{ active: selectedType === 'smelt' && selectedId === bar.id, locked: !artisanMetForForge(bar.requiredForge) }"
              :style="{ '--bar-color': bar.color }"
              :disabled="!artisanMetForForge(bar.requiredForge)"
              @click="selectSmelt(bar)"
            >
              <GameIcon :icon="barIcon(bar.id)" :size="18" class="smelt-btn-icon" />
              <span class="smelt-btn-name">{{ bar.name }}</span>
              <span class="smelt-btn-cost" v-if="artisanMetForForge(bar.requiredForge)">{{ bar.oreCost }}× ore</span>
              <span class="smelt-btn-lock" v-else>No Blacksmith</span>
            </button>
          </template>
          <!-- Standard codex-gated bars — always visible, disabled when requirements unmet or no ore -->
          <button
            v-else-if="!FORGE_TIERS[bar.requiredForge]?.special"
            class="smelt-btn"
            :class="{
              active: selectedType === 'smelt' && selectedId === bar.id,
              locked: resources.forgeLevel < bar.requiredForge || resources.smithingLevel < (bar.smithingLevel ?? 0)
            }"
            :style="{ '--bar-color': bar.color }"
            :disabled="resources.forgeLevel < bar.requiredForge || resources.smithingLevel < (bar.smithingLevel ?? 0) || (resources.ores[bar.oreId] ?? 0) < bar.oreCost"
            @click="selectSmelt(bar)"
          >
            <GameIcon :icon="barIcon(bar.id)" :size="18" class="smelt-btn-icon" />
            <span class="smelt-btn-name">{{ bar.name }}</span>
            <span class="smelt-btn-cost" v-if="resources.forgeLevel >= bar.requiredForge && resources.smithingLevel >= (bar.smithingLevel ?? 0)">
              {{ bar.oreCost }}× ore
            </span>
            <span class="smelt-btn-lock" v-else-if="resources.forgeLevel < bar.requiredForge">{{ FORGE_TIERS[bar.requiredForge]?.name }}</span>
            <span class="smelt-btn-lock" v-else>⚒ Lv.{{ bar.smithingLevel }}</span>
          </button>
        </template>
      </div>

      <!-- Forge section -->
      <div class="recipe-section-head">⚒ Forge</div>
      <div class="tier-group" v-for="tier in visibleRecipeTiers" :key="tier.id">
        <div
          class="tier-header"
          :class="{
            locked: !tier.recipes.length || isTierArtisanLocked(tier.id) || isTierSmithingLocked(tier.id),
            'no-stock': tier.recipes.length && !isTierArtisanLocked(tier.id) && !isTierSmithingLocked(tier.id) && tier.recipes.every(r => !canAfford(r)),
            collapsible: tier.recipes.length > 0
          }"
          :style="{ '--tier-color': tier.color }"
          @click="tier.recipes.length && !isTierArtisanLocked(tier.id) && !isTierSmithingLocked(tier.id) && toggleTier(tier.id)"
        >
          <span class="tier-dot" />
          <span class="tier-name">{{ tier.name }}</span>
          <span class="tier-count" v-if="tier.recipes.length && !isTierArtisanLocked(tier.id) && !isTierSmithingLocked(tier.id)">{{ tier.recipes.length }}</span>
          <span class="tier-soon" v-else>—</span>
          <span class="tier-chevron" v-if="tier.recipes.length && !isTierArtisanLocked(tier.id) && !isTierSmithingLocked(tier.id)">{{ openTier === tier.id ? '⌄' : '›' }}</span>
        </div>

        <div class="tier-smithing-lock" v-if="isTierSmithingLocked(tier.id)">
          ⚒ Requires Blacksmithing Lv.{{ tier.smithingLevel }}
        </div>
        <div class="tier-artisan-lock" v-else-if="isTierArtisanLocked(tier.id)">
          ⚒ Recruit a Blacksmith to unlock
        </div>
        <template v-else-if="openTier === tier.id">
          <button
            class="craft-set-btn"
            :style="{ '--tier-color': tier.color }"
            :disabled="tier.recipes.every(r => !canAfford(r))"
            @click.stop="forgeFullSet(tier)"
          >
            ⚒ Craft Full Set
            <span class="csb-count">{{ tier.recipes.filter(r => canAfford(r)).length }} / {{ tier.recipes.length }}</span>
          </button>
          <button
            v-for="recipe in tier.recipes"
            :key="recipe.id"
            class="recipe-btn"
            :class="{ active: selectedType === 'forge' && selectedId === recipe.id, unaffordable: !canAfford(recipe) }"
            :style="{ '--tier-color': tier.color }"
            @click="selectForge(recipe)"
          >
            <GameIcon :icon="tierSlotIcon(recipe.tier, recipe.slot)" :size="16" class="recipe-slot-icon" />
            <span class="recipe-name">{{ recipe.name }}</span>
            <span class="recipe-cost">
              <span
                v-for="(amt, barId) in recipe.barCost"
                :key="barId"
                class="cost-pill"
                :class="{ short: (resources.bars[barId] ?? 0) < amt }"
              >{{ amt }}</span>
            </span>
          </button>
        </template>
      </div>

    </aside>

    <!-- ── Center: Forge area ─────────────────────────────────────── -->
    <main class="forge-area">

      <!-- Mobile drawer toggle -->
      <button class="mob-drawer-toggle" @click="drawerOpen = !drawerOpen" :class="{ open: drawerOpen }">
        <span>{{ drawerOpen ? '‹' : '⚒' }}</span>
      </button>

      <!-- ── SMELT MODE ── -->
      <template v-if="selectedType === 'smelt' && selectedBar">

        <!-- Forge image fills the entire center — all UI overlaid -->
        <div class="smelt-forge-wrap"
          :style="{ '--forge-glow': activeForgeGlow }"
          :class="{ 'forge-busy-other': busyOther }"
        >
          <div class="smelt-forge-glow" />
          <img :src="activeForgeImage" class="smelt-forge-img" :alt="activeForge.name" />

          <!-- Top: dramatic forge name -->
          <div class="smelt-forge-top">
            <div class="smelt-forge-name-badge">{{ activeForge.name }}</div>
            <div class="smelt-forge-xp">{{ Math.ceil(selectedBar.xp * 0.5) }} XP per bar</div>
          </div>

          <!-- Bottom: unified cinematic overlay — conversion info + controls -->
          <div class="smelt-bottom-overlay">

            <!-- Conversion info row -->
            <div class="smelt-conv-row">
              <div class="sco-side">
                <GameIcon :icon="oreIcon(selectedBar.oreId)" :size="28" />
                <div class="sco-info">
                  <span class="sco-name">{{ ORES[selectedBar.oreId]?.name }}</span>
                  <span class="sco-stock">{{ resources.ores[selectedBar.oreId] ?? 0 }} in stock</span>
                </div>
              </div>
              <div class="sco-middle">
                <span class="sco-cost-label">×{{ selectedBar.oreCost }}</span>
                <span class="sco-arrow">→</span>
                <span class="sco-yield">1 bar</span>
              </div>
              <div class="sco-side sco-right">
                <div class="sco-info sco-info-right">
                  <span class="sco-name">{{ selectedBar.name }}</span>
                  <span class="sco-stock" :class="{ 'sco-none': maxSmelt === 0 }">{{ maxSmelt }} can smelt</span>
                </div>
                <GameIcon :icon="barIcon(selectedBar.id)" :size="28" />
              </div>
            </div>

            <!-- IDLE: qty selector + start -->
            <template v-if="!smelting.isRunning">
              <div class="smelt-qty-row">
                <button class="sqr-adj" @click="adjustQty(-5)" :disabled="smeltQty <= 1">−5</button>
                <button class="sqr-adj" @click="adjustQty(-1)" :disabled="smeltQty <= 1">−</button>
                <span class="sqr-qty">{{ smeltQty }}</span>
                <button class="sqr-adj" @click="adjustQty(1)"  :disabled="smeltQty >= maxSmelt">+</button>
                <button class="sqr-adj" @click="adjustQty(5)"  :disabled="smeltQty >= maxSmelt">+5</button>
                <button class="sqr-max" @click="smeltQty = maxSmelt" :disabled="smeltQty >= maxSmelt || maxSmelt === 0">Max</button>
              </div>
              <span class="smelt-no-smith" v-if="!assignedSmith">Assign a smith first</span>
              <span class="smelt-eta-hint" v-else-if="maxSmelt > 0">
                Est. {{ formatSmeltTime(smeltQty * selectedBar.smeltTime * 1000 / forgeSpeedMultiplier) }}
              </span>
              <button
                class="smelt-start-btn"
                :class="{ ready: maxSmelt > 0 && !!assignedSmith }"
                :disabled="maxSmelt <= 0 || smeltQty <= 0 || !assignedSmith"
                @click="startSmelt"
              >⊕ Smelt ×{{ smeltQty }}</button>
            </template>

            <!-- RUNNING (this bar): progress + queue + cancel -->
            <template v-else-if="isMyJob">
              <div class="smelt-run-header">
                <span class="srh-title">Smelting in progress</span>
                <span class="srh-count">{{ smelting.completedCount }} / {{ smelting.job.totalBars }}</span>
              </div>
              <div class="srp-wrap">
                <div class="srp-track">
                  <div class="srp-fill" :style="{ width: (smelting.currentBarProgress * 100) + '%' }" />
                </div>
                <span class="srp-eta">{{ formatSmeltTime(smeltEta) }}</span>
              </div>
              <div class="smelt-qty-row" v-if="maxSmelt > 0">
                <button class="sqr-adj" @click="adjustQty(-5)" :disabled="smeltQty <= 1">−5</button>
                <button class="sqr-adj" @click="adjustQty(-1)" :disabled="smeltQty <= 1">−</button>
                <span class="sqr-qty">{{ smeltQty }}</span>
                <button class="sqr-adj" @click="adjustQty(1)"  :disabled="smeltQty >= maxSmelt">+</button>
                <button class="sqr-adj" @click="adjustQty(5)"  :disabled="smeltQty >= maxSmelt">+5</button>
                <button class="sqr-max" @click="smeltQty = maxSmelt" :disabled="smeltQty >= maxSmelt">Max</button>
              </div>
              <button
                class="smelt-start-btn smelt-queue-btn"
                :class="{ ready: maxSmelt > 0 }"
                :disabled="maxSmelt <= 0"
                @click="addToQueue"
              >⊕ Add ×{{ smeltQty }}</button>
              <button class="smelt-cancel-btn" @click="cancelSmelt">Cancel &amp; Refund Ores</button>
            </template>

            <!-- BLOCKED (other bar running) -->
            <template v-else>
              <div class="smelt-busy-msg">
                <span class="sbm-icon">⊕</span>
                <div class="sbm-text">
                  <span class="sbm-title">Forge busy</span>
                  <span class="sbm-sub">Currently smelting {{ BARS[smelting.job?.barId]?.name }}</span>
                </div>
              </div>
              <div class="smelt-busy-bar">
                <div class="sbb-fill" :style="{ width: (smelting.currentBarProgress * 100) + '%' }" />
              </div>
            </template>

          </div><!-- /smelt-bottom-overlay -->
        </div><!-- /smelt-forge-wrap -->

      </template>

      <!-- ── ARTISAN MODE moved to Arsenal → Forge → Upgrade tab ── -->
      <template v-else-if="false">
        <div class="forge-idle" v-if="!artisanItem">
          <div class="forge-idle-icon">⚙</div>
          <div class="forge-idle-text">Select a crafted item to upgrade</div>
        </div>

        <div class="artisan-content" v-else :style="{ '--tier-color': artisanTierColor }">

          <div class="forge-header">
            <div class="forge-item-name">{{ artisanItem.name }}</div>
            <div class="forge-badges">
              <span class="forge-badge tier-badge" :style="{ '--tier-color': artisanTierColor }">{{ artisanTier }} Tier</span>
              <span class="forge-badge slot-badge">{{ SLOT_LABELS[artisanItem.slot] }}</span>
              <span class="forge-badge rarity-badge" :class="artisanItem.rarity?.toLowerCase()">{{ artisanItem.rarity }}</span>
            </div>
          </div>

          <!-- Item showcase with animated stars -->
          <div class="artisan-showcase" :class="{ maxed: artisanItem.stars >= 10 }">
            <div class="artisan-glow" />
            <div v-if="artisanItem.image && GEAR_IMAGES[artisanItem.image]" class="artisan-frame-wrap">
              <div class="gear-frame-inner">
                <img :src="GEAR_IMAGES[artisanItem.image]" class="artisan-gear-img" :alt="artisanItem.name" />
              </div>
              <img :src="itemFrameImg" class="artisan-frame-img" alt="" aria-hidden="true" />
            </div>
            <GameIcon v-else :icon="tierSlotIcon(artisanItem.tier, artisanItem.slot)" :size="72" class="artisan-slot-icon" />
            <div class="artisan-stars-row">
              <span
                v-for="s in 10" :key="s"
                class="artisan-star-pip"
                :class="{ filled: artisanItem.stars >= s, gate: s === 5 || s === 6 }"
              >★</span>
            </div>
            <div class="artisan-rarity-name" :class="artisanItem.rarity?.toLowerCase()">{{ artisanItem.rarity }}</div>
          </div>

          <!-- Stat comparison -->
          <div class="artisan-stats-panel">
            <div class="forge-col-label">Stats</div>
            <div class="artisan-stat-rows">
              <div v-for="(baseStat, key) in artisanItem.baseStats" :key="key" class="artisan-stat-row">
                <span class="asr-label">{{ STAT_LABELS[key] ?? key }}</span>
                <span class="asr-current">{{ formatStatValue(key, artisanItem.stats[key]) }}</span>
                <template v-if="artisanItem.stars < 10">
                  <span class="asr-arrow">→</span>
                  <span class="asr-next">{{ formatStatValue(key, nextStatValue(key, baseStat)) }}</span>
                </template>
              </div>
            </div>
          </div>

          <!-- Upgrade panel -->
          <div class="artisan-upgrade-panel" v-if="artisanItem.stars < 10">

            <!-- Bar cost row -->
            <div class="material-row" :style="{ '--ore-color': BARS[artisanBarId]?.color ?? '#888' }">
              <span class="mat-dot" />
              <span class="mat-name">{{ BARS[artisanBarId]?.name ?? artisanBarId }}</span>
              <span class="mat-tally">
                <span class="mat-have" :class="{ ok: hasEnoughBars }">{{ resources.bars[artisanBarId] ?? 0 }}</span>
                <span class="mat-sep">/</span>
                <span class="mat-need">{{ starBarCost }}</span>
              </span>
            </div>

            <!-- Gate: rare component row -->
            <div class="material-row gate-row" v-if="gateCompMeta" :style="{ '--ore-color': gateCompMeta.color }">
              <span class="mat-dot gate-dot" />
              <span class="mat-name">{{ gateCompMeta.name }}</span>
              <span class="mat-tally">
                <span class="mat-have" :class="{ ok: hasComponent }">{{ resources.upgradeComponents[gateCompId] ?? 0 }}</span>
                <span class="mat-sep">/</span>
                <span class="mat-need">{{ gateQty }}</span>
              </span>
              <span class="gate-drop-hint">dungeon drop</span>
            </div>

            <!-- Gate: smithing level row -->
            <div class="skill-req-row" v-if="starGate?.smithingLevel">
              <span class="skill-req-icon">⚒</span>
              <span class="skill-req-label">Smithing</span>
              <span class="skill-req-val" :class="{ ok: meetsSmithingLv }">
                Lv.{{ resources.smithingLevel }} / Lv.{{ starGate.smithingLevel }} required
              </span>
            </div>

            <div class="artisan-btn-row">
              <button class="artisan-upgrade-btn" :class="{ ready: canUpgrade }" :disabled="!canUpgrade" @click="upgradeItem">
                ⚒ ★{{ artisanItem.stars }} → ★{{ nextStar }}
              </button>
              <span class="artisan-next-rarity" v-if="nextRarity !== artisanItem.rarity">↑ {{ nextRarity }}</span>
            </div>
          </div>

          <!-- Maxed -->
          <div class="artisan-maxed-msg" v-else>
            <span class="artisan-maxed-icon">✦</span>
            <div>
              <div class="artisan-maxed-title">Mythical — Fully Upgraded</div>
              <div class="artisan-maxed-sub">This item has reached its maximum potential</div>
            </div>
          </div>

        </div>
      </template>

      <!-- ── FORGE MODE / IDLE ── -->
      <template v-else>

        <!-- Item header -->
        <div class="forge-header" v-if="selected">
          <div class="forge-item-name">{{ selected.name }}</div>
          <div class="forge-badges">
            <span class="forge-badge tier-badge" :style="{ '--tier-color': selectedTierColor }">
              {{ selectedTier?.name }} Tier
            </span>
            <span class="forge-badge slot-badge">{{ SLOT_LABELS[selected.slot] }}</span>
            <span class="forge-badge rarity-badge common">Common</span>
          </div>
        </div>

        <!-- Idle placeholder -->
        <div class="forge-idle" v-if="!selected">
          <div class="forge-idle-icon">⚒</div>
          <div class="forge-idle-text">Select a recipe to begin forging</div>
        </div>

        <!-- Gear art showcase (named items) or generic anvil -->
        <template v-if="selected">
          <div
            v-if="selected.image && GEAR_IMAGES[selected.image]"
            class="gear-showcase"
            :class="{ ready: canAfford(selected) }"
            :style="{ '--tier-color': selectedTierColor }"
          >
            <div class="gear-showcase-glow" />
            <div class="gear-frame-wrap">
              <div class="gear-frame-inner">
                <img :src="GEAR_IMAGES[selected.image]" class="gear-showcase-img" :alt="selected.name" />
              </div>
              <img :src="GEAR_FRAMES[selected.frame] ?? itemFrameImg" class="gear-frame-img" alt="" aria-hidden="true" />
            </div>
          </div>
          <div v-else class="anvil-wrap" :class="{ ready: canAfford(selected) }">
            <div class="anvil-glow" />
            <img :src="anvilImg" class="anvil-img" alt="Forge" />
            <Transition name="item-appear">
              <div class="anvil-item-badge" :style="{ '--tier-color': selectedTierColor }">
                <GameIcon :icon="tierSlotIcon(selected.tier, selected.slot)" :size="64" class="anvil-item-icon" />
              </div>
            </Transition>
          </div>
        </template>

        <!-- Description -->
        <p class="forge-desc" v-if="selected">{{ selected.desc }}</p>

        <!-- Base stats + materials -->
        <div class="forge-details" v-if="selected">
          <div class="forge-col">
            <div class="forge-col-label">Base Stats</div>
            <div class="forge-stats">
              <div class="forge-stat" v-for="(val, key) in selected.baseStats" :key="key">
                <span class="forge-stat-label">{{ STAT_LABELS[key] ?? key }}</span>
                <span class="forge-stat-val">{{ formatStatValue(key, val) }}</span>
              </div>
            </div>
          </div>
          <div class="forge-col">
            <div class="forge-col-label">Materials</div>
            <div class="forge-materials">
              <div
                class="material-row"
                v-for="(amt, barId) in selected.barCost"
                :key="barId"
                :style="{ '--ore-color': BARS[barId]?.color ?? '#888' }"
              >
                <span class="mat-dot" />
                <span class="mat-name">{{ BARS[barId]?.name ?? barId }}</span>
                <span class="mat-tally">
                  <span class="mat-have" :class="{ ok: (resources.bars[barId] ?? 0) >= amt }">{{ resources.bars[barId] ?? 0 }}</span>
                  <span class="mat-sep">/</span>
                  <span class="mat-need">{{ amt }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Forge button -->
        <div class="forge-actions" v-if="selected">
          <button
            class="forge-btn"
            :class="{ ready: canAfford(selected) && !isTierArtisanLocked(selected.tier) && !isTierSmithingLocked(selected.tier) && !!assignedSmith }"
            :disabled="!canAfford(selected) || isTierArtisanLocked(selected.tier) || isTierSmithingLocked(selected.tier) || !assignedSmith"
            @click="forge"
          >
            <span class="forge-btn-icon">⚒</span>
            Forge
          </button>
          <span class="forge-hint" v-if="!assignedSmith">Assign a smith to forge</span>
          <span class="forge-hint" v-else-if="isTierSmithingLocked(selected.tier)">Requires Blacksmithing Lv.{{ selectedTier?.smithingLevel }}</span>
          <span class="forge-hint" v-else-if="isTierArtisanLocked(selected.tier)">Requires a Blacksmith in your roster</span>
          <span class="forge-hint" v-else-if="!canAfford(selected)">Need more bars</span>
        </div>

        <!-- Success flash -->
        <Transition name="forge-pop">
          <div class="forge-result" v-if="forgeResult">
            <span class="forge-result-icon">✓</span>
            <div class="forge-result-text">
              <span class="forge-result-name">{{ forgeResult }}</span>
              <span class="forge-result-sub">added to inventory</span>
            </div>
          </div>
        </Transition>

      </template>

      <!-- Forge smith assignment -->
      <div class="forge-smith-bar">
        <span class="fsb-label">⚒ Smith</span>

        <!-- Assigned -->
        <template v-if="assignedSmith">
          <div class="fsb-hero">
            <span class="fsb-name">{{ assignedSmith.hero.name }}</span>
            <span class="fsb-skill">
              Blacksmithing Lv.{{ artisan.getSkillLevel(artisan.assignedForgeSmithKey, 'blacksmithing') }}
            </span>
            <div class="fsb-xp-wrap">
              <div class="fsb-xp-track">
                <div class="fsb-xp-fill" :style="{ width: smithXpPct + '%' }" />
              </div>
              <span class="fsb-xp-text">
                {{ artisan.getSkillXp(artisan.assignedForgeSmithKey, 'blacksmithing') }}
                / {{ artisan.xpForLevel(artisan.getSkillLevel(artisan.assignedForgeSmithKey, 'blacksmithing')) }}
              </span>
            </div>
          </div>
          <span class="fsb-bonus">+{{ Math.round((forgeSpeedMultiplier - 1) * 100) }}% speed</span>
          <button class="fsb-remove" @click="artisan.unassignForgeSmith()">×</button>
        </template>

        <!-- Unassigned -->
        <template v-else>
          <button
            class="fsb-assign"
            :disabled="eligibleSmiths.length === 0"
            @click="showSmithPicker = !showSmithPicker"
          >{{ eligibleSmiths.length > 0 ? 'Assign Smith' : 'No Blacksmiths owned' }}</button>

          <Transition name="fsb-drop">
            <div class="fsb-picker" v-if="showSmithPicker && eligibleSmiths.length > 0">
              <button
                v-for="{ key, hero } in eligibleSmiths"
                :key="key"
                class="fsb-pick-row"
                @click="assignSmith(key)"
              >
                <span class="fsb-pick-name">{{ hero.name }}</span>
                <span class="fsb-pick-level">Lv.{{ artisan.getSkillLevel(key, 'blacksmithing') }}</span>
                <span class="fsb-pick-bonus">+{{ Math.round((artisan.smithSpeedMultiplier(key) - 1) * 100) }}%</span>
              </button>
            </div>
          </Transition>
        </template>
      </div>

      <!-- Blacksmithing proficiency bar — always visible -->
      <div class="smith-xp-bar">
        <div class="smith-xp-header">
          <span class="smith-xp-label">⚒ Blacksmithing</span>
          <span class="smith-xp-level">Lv. {{ resources.smithingLevel }}</span>
          <span class="smith-xp-count">{{ resources.smithingXpInLevel }} / {{ resources.XP_PER_LEVEL }} XP</span>
        </div>
        <div class="smith-xp-track">
          <div class="smith-xp-fill" :style="{ width: (resources.smithingProgress * 100) + '%' }" />
        </div>
      </div>

    </main>

    <!-- ── Right: Stockpile ───────────────────────────────────────── -->
    <aside class="ore-panel">
      <div class="panel-label">Stockpile</div>

      <div class="panel-sublabel">Ores</div>
      <div class="ore-list">
        <div
          v-for="ore in ORE_LIST"
          :key="ore.id"
          class="ore-row"
          :class="{
            empty: !resources.ores[ore.id],
            clickable: !!resources.ores[ore.id] && !!oreToBar[ore.id],
            active: selectedType === 'smelt' && selectedId === oreToBar[ore.id]?.id,
          }"
          :style="{ '--ore-color': ore.color }"
          @click="resources.ores[ore.id] && oreToBar[ore.id] && selectSmelt(oreToBar[ore.id])"
        >
          <GameIcon :icon="oreIcon(ore.id)" :size="18" class="ore-icon" />
          <span class="ore-name">{{ ore.name }}</span>
          <span class="ore-count">{{ resources.ores[ore.id] ?? 0 }}</span>
          <span class="ore-smelt-arrow" v-if="resources.ores[ore.id] && oreToBar[ore.id]">→</span>
        </div>
      </div>

      <div class="panel-sublabel bar-sublabel">Bars</div>
      <div class="ore-list">
        <div
          v-for="bar in BAR_LIST"
          :key="bar.id"
          class="ore-row"
          :class="{ empty: !resources.bars[bar.id] }"
          :style="{ '--ore-color': bar.color }"
        >
          <GameIcon :icon="barIcon(bar.id)" :size="18" class="ore-icon" />
          <span class="ore-name">{{ bar.name }}</span>
          <span class="ore-count">{{ resources.bars[bar.id] ?? 0 }}</span>
        </div>
      </div>
    </aside>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAdvisorStore } from '../stores/useAdvisorStore.js'
import { useResourceStore } from '../stores/useResourceStore.js'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import { useSmeltingStore } from '../stores/useSmeltingStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { useArtisanStore } from '../stores/useArtisanStore.js'
import { createItemInstance, SLOT_LABELS } from '../game/Gear.js'
import { ORE_LIST, ORES } from '../game/data/ores.js'
import { BAR_LIST, BARS, FORGE_TIERS } from '../game/data/bars.js'
import { RECIPE_TIERS, SLOT_ICONS, STAT_LABELS, formatStatValue } from '../game/data/recipes.js'
import { barIcon, oreIcon, SLOT_TO_ICON, tierSlotIcon } from '../game/data/spritesheet.js'
import GameIcon from './ui/GameIcon.vue'
import arsenalBg    from '../assets/backgrounds/arsenal.png'
import anvilImg     from '../assets/ui/anvil.png'
import forge01Img   from '../assets/forges/forge_01.png'
import forge02Img   from '../assets/forges/forge_02.png'
import forge03Img   from '../assets/forges/forge_03.png'
import forge04Img   from '../assets/forges/forge_04.png'
import elvenForgeImg  from '../assets/forges/elven_forge.png'
import goblinForgeImg from '../assets/forges/goblin_forge.png'
import dwarfForgeImg  from '../assets/forges/dwarven_forge.png'
const _gB = import.meta.env.BASE_URL
const itemFrameImg    = _gB + 'gear/frames/item_frame.png'
const elvenBorderImg  = _gB + 'gear/frames/elven_border.png'
const dwarvenFrameImg = _gB + 'gear/frames/dwarven_frame.png'
const goblinFrameImg  = _gB + 'gear/frames/goblin_frame.png'
const elvenSwordImg   = _gB + 'gear/elven/sword.png'
const elvenSpearImg   = _gB + 'gear/elven/spear.png'
const elvenShieldImg  = _gB + 'gear/elven/shield.png'
const elvenHelmImg    = _gB + 'gear/elven/helm.png'
const elvenChestImg   = _gB + 'gear/elven/chest.png'
const elvenPlateImg   = _gB + 'gear/elven/platelegs.png'
const elvenGlovesImg  = _gB + 'gear/elven/gloves.png'
const FORGE_IMAGES = {
  forge_01:     forge01Img,
  forge_02:     forge02Img,
  forge_03:     forge03Img,
  forge_04:     forge04Img,
  elven_forge:  elvenForgeImg,
  goblin_forge: goblinForgeImg,
  dwarven_forge: dwarfForgeImg,
}

const GEAR_IMAGES = {
  'elven/sword':     elvenSwordImg,
  'elven/spear':     elvenSpearImg,
  'elven/shield':    elvenShieldImg,
  'elven/helm':      elvenHelmImg,
  'elven/chest':     elvenChestImg,
  'elven/platelegs': elvenPlateImg,
  'elven/gloves':    elvenGlovesImg,
}

const GEAR_FRAMES = {
  elven:   elvenBorderImg,
  dwarven: dwarvenFrameImg,
  goblin:  goblinFrameImg,
}

const XP_PER_TIER = { copper: 10, tin: 20, steel: 35, darksteel: 55, mithril: 80, moonsilver: 120 }
const TIER_ORDER  = { copper: 0, tin: 1, steel: 2, darksteel: 3, mithril: 4, moonsilver: 5 }

const resources  = useResourceStore()
const inventory  = useInventoryStore()
const advisor    = useAdvisorStore()
const smelting   = useSmeltingStore()
const collection = useCollectionStore()
const artisan    = useArtisanStore()

const showSmithPicker = ref(false)
// Open by default on mobile so recipes are immediately visible
const drawerOpen = ref(typeof window !== 'undefined' && window.innerWidth <= 640)

const eligibleSmiths = computed(() =>
  collection.roster.filter(({ hero }) =>
    hero.artisanSkills?.some(s => s.id === 'blacksmithing')
  )
)

const assignedSmith = computed(() => {
  const key = artisan.assignedForgeSmithKey
  if (!key) return null
  return eligibleSmiths.value.find(e => e.key === key) ?? null
})

const forgeSpeedMultiplier = computed(() => {
  if (!assignedSmith.value) return 1.0
  return artisan.smithSpeedMultiplier(artisan.assignedForgeSmithKey)
})

const smithXpPct = computed(() => {
  const key = artisan.assignedForgeSmithKey
  if (!key) return 0
  const level = artisan.getSkillLevel(key, 'blacksmithing')
  const xp    = artisan.getSkillXp(key, 'blacksmithing')
  return Math.round((xp / artisan.xpForLevel(level)) * 100)
})

function assignSmith(key) {
  artisan.assignForgeSmith(key)
  showSmithPicker.value = false
}

const hasBlacksmithInRoster = computed(() =>
  collection.roster.some(({ hero }) =>
    hero.artisanSkills?.some(s => s.id === 'blacksmithing')
  )
)

function artisanMetForForge(level) {
  if (level === 5 || level === 6) return hasBlacksmithInRoster.value
  return true
}

function isTierArtisanLocked(tierId) {
  const forgeLevel = TIER_REQUIRED_FORGE[tierId]
  if (forgeLevel === undefined) return false
  return isSpecialForgeUnlocked(forgeLevel) && !artisanMetForForge(forgeLevel)
}

function isTierSmithingLocked(tierId) {
  const tier = RECIPE_TIERS.find(t => t.id === tierId)
  if (!tier) return false
  return resources.smithingLevel < (tier.smithingLevel ?? 1)
}

const selectedType = ref(null)   // 'smelt' | 'forge' | null
const selectedId   = ref(null)
const forgeResult  = ref(null)
const smeltQty     = ref(1)
let _flashTimer = null

watch(selectedId, () => { smeltQty.value = 1 })

// ── Smelt ────────────────────────────────────────────────────────
const selected = computed(() => {
  if (selectedType.value !== 'forge' || !selectedId.value) return null
  for (const tier of RECIPE_TIERS) {
    const found = tier.recipes.find(r => r.id === selectedId.value)
    if (found) return found
  }
  return null
})

const selectedBar = computed(() => {
  if (selectedType.value !== 'smelt' || !selectedId.value) return null
  return BARS[selectedId.value] ?? null
})

const selectedTier      = computed(() => selected.value ? RECIPE_TIERS.find(t => t.id === selected.value.tier) : null)
const selectedTierColor = computed(() => selectedTier.value?.color ?? '#888')

const maxSmelt = computed(() => {
  if (!selectedBar.value) return 0
  return Math.floor((resources.ores[selectedBar.value.oreId] ?? 0) / selectedBar.value.oreCost)
})

const activeForge = computed(() => {
  if (!selectedBar.value) return FORGE_TIERS[0]
  return FORGE_TIERS[selectedBar.value.requiredForge] ?? FORGE_TIERS[0]
})
const activeForgeImage = computed(() => FORGE_IMAGES[activeForge.value.image])
const activeForgeGlow  = computed(() => activeForge.value.glow)

const isMyJob   = computed(() => smelting.isRunning && smelting.job?.barId === selectedId.value)
const busyOther = computed(() => smelting.isRunning && !isMyJob.value)

const smeltEta = computed(() => {
  if (!smelting.isRunning || !smelting.job) return 0
  return Math.max(0, (smelting.remainingCount - smelting.currentBarProgress) * smelting.job.timePerBar)
})

function formatSmeltTime(ms) {
  const s = Math.ceil(ms / 1000)
  if (s < 60)  return `${s}s`
  const m = Math.floor(s / 60), r = s % 60
  if (m < 60)  return r > 0 ? `${m}m ${r}s` : `${m}m`
  const h = Math.floor(m / 60), rm = m % 60
  return rm > 0 ? `${h}h ${rm}m` : `${h}h`
}

function adjustQty(delta) {
  smeltQty.value = Math.max(1, Math.min(Math.max(1, maxSmelt.value), smeltQty.value + delta))
}

function isSpecialForgeUnlocked(level) {
  if (level === 4) return resources.elvenForgeUnlocked
  if (level === 5) return resources.goblinForgeUnlocked
  if (level === 6) return resources.dwarfForgeUnlocked
  return false
}

// Tier IDs that require a special forge, keyed by forge level
const TIER_REQUIRED_FORGE = { moonsilver: 4, vaultmetal: 5, runeite: 6 }

const visibleRecipeTiers = computed(() =>
  RECIPE_TIERS.filter(tier => {
    const forgeLevel = TIER_REQUIRED_FORGE[tier.id]
    if (forgeLevel === undefined) return true
    return isSpecialForgeUnlocked(forgeLevel)
  })
)

const openTier = ref(null)
function toggleTier(id) {
  openTier.value = openTier.value === id ? null : id
}

// Maps each oreId → the first accessible bar for that ore
const oreToBar = computed(() => {
  const map = {}
  for (const ore of ORE_LIST) {
    const bar = BAR_LIST.find(b => {
      if (b.oreId !== ore.id) return false
      if (resources.smithingLevel < (b.smithingLevel ?? 0)) return false
      if (FORGE_TIERS[b.requiredForge]?.special) return isSpecialForgeUnlocked(b.requiredForge)
      return resources.forgeLevel >= b.requiredForge
    }) ?? BAR_LIST.find(b => b.oreId === ore.id)
    if (bar) map[ore.id] = bar
  }
  return map
})

onMounted(() => {
  if (!localStorage.getItem('bow-tip-blacksmith')) {
    localStorage.setItem('bow-tip-blacksmith', '1')
    setTimeout(() => advisor.say([
      `Welcome to the Blacksmith. Gear here follows set bonuses — equip matching pieces to unlock them. Plate armour rewards defence and endurance: two pieces grants +8% DEF, four pieces grants +12% HP.`,
      `A full six-piece plate set adds a further +5% DEF and +8% HP — and unlocks Steadfast, a passive that shields the wearer for 10% of their max HP the first time they fall below 30% health in battle.`,
      `Leather and cloth sets follow the same principle, favouring speed and offence respectively. Mix sets if you must, but a hero committed to one set will always outperform a hero who hedges.`,
    ]), 500)
  }
})

function selectSmelt(bar)    { selectedType.value = 'smelt'; selectedId.value = bar.id;    drawerOpen.value = false }
function selectForge(recipe) { selectedType.value = 'forge'; selectedId.value = recipe.id; drawerOpen.value = false }
function canAfford(recipe) {
  if (!recipe?.barCost) return false
  return Object.entries(recipe.barCost).every(([id, amt]) => (resources.bars[id] ?? 0) >= amt)
}

function startSmelt() {
  if (!selectedBar.value || maxSmelt.value <= 0) return
  if (!assignedSmith.value) return
  if (!artisanMetForForge(selectedBar.value.requiredForge)) return
  smelting.startSmelt(selectedBar.value.id, Math.min(smeltQty.value, maxSmelt.value), forgeSpeedMultiplier.value)
}

function cancelSmelt()  { smelting.cancelSmelt() }
function addToQueue()   {
  if (!selectedBar.value || maxSmelt.value <= 0) return
  smelting.addToQueue(selectedBar.value.id, Math.min(smeltQty.value, maxSmelt.value))
}

function forge() {
  if (!selected.value || !canAfford(selected.value)) return
  if (isTierArtisanLocked(selected.value.tier) || isTierSmithingLocked(selected.value.tier)) return
  if (!assignedSmith.value) return
  const recipe = selected.value
  Object.entries(recipe.barCost).forEach(([id, amt]) => resources.removeBar(id, amt))
  const instance = createItemInstance({
    id:          recipe.id,
    name:        recipe.name,
    gearType:    recipe.gearType,
    weaponType:  recipe.weaponType ?? null,
    rarity:      recipe.rarity,
    description: recipe.desc,
    stats:       { ...recipe.baseStats },
    baseStats:   { ...recipe.baseStats },
    tier:        recipe.tier,
    slot:        recipe.slot,
    image:       recipe.image     ?? null,
    frame:       recipe.frame     ?? null,
    armorType:   recipe.armorType ?? null,
  })
  instance.craftedAt = Date.now()
  instance.crafted   = true
  inventory.addInstance(instance)
  resources.addSmithingXp(XP_PER_TIER[recipe.tier] ?? 10)
  forgeResult.value = recipe.name
  clearTimeout(_flashTimer)
  _flashTimer = setTimeout(() => { forgeResult.value = null }, 3000)

  if (!localStorage.getItem('bow-tip-first-craft')) {
    localStorage.setItem('bow-tip-first-craft', '1')
    setTimeout(() => advisor.say([
      `A fine piece of work. That ${recipe.name} is now in your inventory — head to Arsenal → Forge to upgrade it with stars. Each star improves its stats, and enough stars will raise its rarity entirely.`,
      `If you find yourself with gear you no longer need, the Inventory tab has a sell option. Gold is always useful. Do not let good metal gather dust.`,
    ]), 600)
  }
}

function forgeFullSet(tier) {
  const affordable = tier.recipes.filter(r => canAfford(r))
  if (!affordable.length) return
  for (const recipe of affordable) {
    Object.entries(recipe.barCost).forEach(([id, amt]) => resources.removeBar(id, amt))
    const instance = createItemInstance({
      id: recipe.id, name: recipe.name, gearType: recipe.gearType,
      weaponType: recipe.weaponType ?? null, rarity: recipe.rarity,
      description: recipe.desc, stats: { ...recipe.baseStats },
      baseStats: { ...recipe.baseStats }, tier: recipe.tier,
      slot: recipe.slot, image: recipe.image ?? null,
      frame: recipe.frame ?? null, armorType: recipe.armorType ?? null,
    })
    instance.craftedAt = Date.now()
    instance.crafted   = true
    inventory.addInstance(instance)
    resources.addSmithingXp(XP_PER_TIER[recipe.tier] ?? 10)
  }
  forgeResult.value = `${affordable.length} ${tier.name} items crafted`
  clearTimeout(_flashTimer)
  _flashTimer = setTimeout(() => { forgeResult.value = null }, 3000)
}

</script>

<style scoped>
/* ── Shell ─────────────────────────────────────────────────────── */
.blacksmith {
  position: relative;
  display: flex;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  border-radius: 12px;
}

.smith-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: 0.65; pointer-events: none; z-index: 0; border-radius: 12px;
}
.smith-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to right,
    rgba(4,2,1,0.94) 0%,
    rgba(4,2,1,0.55) 18%,
    rgba(4,2,1,0.30) 50%,
    rgba(4,2,1,0.55) 82%,
    rgba(4,2,1,0.94) 100%
  );
  pointer-events: none; z-index: 1; border-radius: 12px;
}

.panel-label {
  font-family: var(--font-head); font-size: 0.58rem; text-transform: uppercase;
  letter-spacing: 2.5px; color: var(--text-muted); font-weight: 700;
  padding-bottom: 10px; border-bottom: 1px solid var(--border-brown); margin-bottom: 12px;
}

/* ── Left: Recipe panel ─────────────────────────────────────────── */
.recipe-panel {
  width: 210px; flex-shrink: 0; position: relative; z-index: 2;
  border-right: 1px solid var(--border-gold);
  background: rgba(4,2,1,0.88); backdrop-filter: blur(8px);
  padding: 16px 12px; display: flex; flex-direction: column; overflow-y: auto;
}

.recipe-section-head {
  font-family: var(--font-head); font-size: 0.56rem; text-transform: uppercase;
  letter-spacing: 2px; color: var(--text-dim); font-weight: 700;
  padding: 8px 4px 6px; margin-bottom: 4px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.recipe-section-head + .smelt-group { margin-bottom: 10px; }

/* Smelt buttons */
.smelt-group { display: flex; flex-direction: column; gap: 2px; }
.smelt-btn {
  width: 100%; display: flex; align-items: center; gap: 7px;
  padding: 7px 8px; background: transparent; border: 1px solid transparent;
  border-radius: 6px; cursor: pointer; text-align: left;
  transition: background 0.12s, border-color 0.12s;
}
.smelt-btn:not(.locked):hover {
  background: rgba(255,255,255,0.04);
  border-color: color-mix(in srgb, var(--bar-color) 25%, transparent);
}
.smelt-btn.active {
  background: color-mix(in srgb, var(--bar-color) 12%, rgba(0,0,0,0.4));
  border-color: color-mix(in srgb, var(--bar-color) 50%, transparent);
}
.smelt-btn.locked { opacity: 0.3; cursor: not-allowed; }
.smelt-btn-icon { flex-shrink: 0; }
.smelt-btn.active .smelt-btn-icon { filter: drop-shadow(0 0 4px var(--bar-color)); }
.smelt-btn-name { flex: 1; font-size: 0.66rem; font-weight: 600; color: var(--text-parchment); }
.smelt-btn-cost {
  font-size: 0.58rem; font-family: var(--font-head); color: var(--text-muted);
  background: rgba(255,255,255,0.04); border-radius: 6px; padding: 1px 5px;
}
.smelt-btn-lock {
  font-size: 0.52rem; font-family: var(--font-head); color: #4a3a3a;
  letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 72px;
}

/* Forge tier groups */
.tier-group { margin-bottom: 6px; }
.tier-header {
  display: flex; align-items: center; gap: 7px;
  padding: 6px 8px 5px; margin-bottom: 2px;
}
.tier-header.collapsible { cursor: pointer; }
.tier-header.collapsible:hover .tier-name { color: #fff; }
.tier-header.locked { opacity: 0.35; }
.tier-chevron { font-size: 0.7rem; color: var(--text-dim); margin-left: auto; line-height: 1; }
.tier-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--tier-color); flex-shrink: 0; }
.tier-name {
  font-family: var(--font-head); font-size: 0.62rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1.5px; color: var(--tier-color); flex: 1;
}
.tier-count { font-size: 0.55rem; color: var(--text-dim); background: rgba(255,255,255,0.05); border-radius: 8px; padding: 0 5px; line-height: 1.6; }
.tier-soon  { font-size: 0.55rem; color: var(--text-dim); }
.tier-artisan-lock {
  font-size: 0.58rem; color: #664444; font-style: italic;
  padding: 5px 8px 3px; letter-spacing: 0.3px;
}
.tier-smithing-lock {
  font-size: 0.58rem; color: #7a5828; font-style: italic;
  padding: 5px 8px 3px; letter-spacing: 0.3px;
}
.tier-header.no-stock { opacity: 0.42; filter: saturate(0.25); }

.craft-set-btn {
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 7px 10px; margin-bottom: 4px;
  background: color-mix(in srgb, var(--tier-color) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--tier-color) 35%, transparent);
  border-radius: 6px; cursor: pointer;
  font-size: 0.65rem; font-weight: 700; color: var(--tier-color);
  letter-spacing: 0.5px; transition: background 0.12s, border-color 0.12s;
}
.craft-set-btn:hover:not(:disabled) {
  background: color-mix(in srgb, var(--tier-color) 18%, transparent);
  border-color: var(--tier-color);
}
.craft-set-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.csb-count { font-size: 0.58rem; opacity: 0.65; }

.recipe-btn {
  width: 100%; display: flex; align-items: center; gap: 8px;
  padding: 7px 8px; background: transparent; border: 1px solid transparent;
  border-radius: 6px; cursor: pointer; text-align: left;
  transition: background 0.12s, border-color 0.12s; margin-bottom: 2px;
}
.recipe-btn:hover {
  background: rgba(255,255,255,0.04);
  border-color: color-mix(in srgb, var(--tier-color) 25%, transparent);
}
.recipe-btn.active {
  background: color-mix(in srgb, var(--tier-color) 12%, rgba(0,0,0,0.4));
  border-color: color-mix(in srgb, var(--tier-color) 50%, transparent);
}
.recipe-btn.unaffordable { opacity: 0.42; }
.recipe-slot-icon { flex-shrink: 0; }
.recipe-name { flex: 1; font-size: 0.68rem; font-weight: 600; color: var(--text-parchment); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.recipe-cost { display: flex; gap: 3px; flex-shrink: 0; }
.cost-pill {
  font-size: 0.6rem; font-family: var(--font-head); font-weight: 700;
  color: var(--tier-color); background: color-mix(in srgb, var(--tier-color) 12%, transparent);
  border-radius: 8px; padding: 0 5px; line-height: 1.6;
}
.cost-pill.short { color: #ff6b6b; background: rgba(255,107,107,0.12); }

/* ── Center: Forge area ─────────────────────────────────────────── */
.forge-area {
  flex: 1; position: relative; z-index: 2;
  padding: 0 16px 20px; overflow-y: auto;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
}

.forge-header { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; }
.forge-item-name {
  font-family: var(--font-head); font-size: 1.3rem; font-weight: 800;
  color: #fff; letter-spacing: 2px;
  text-shadow: 0 2px 16px rgba(0,0,0,0.95), 0 0 32px rgba(255,160,60,0.15);
}
.forge-badges { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
.forge-badge {
  font-family: var(--font-head); font-size: 0.58rem; text-transform: uppercase;
  letter-spacing: 1.5px; font-weight: 700; padding: 2px 10px;
  border-radius: 10px; border: 1px solid;
}
.tier-badge { color: var(--tier-color); border-color: color-mix(in srgb, var(--tier-color) 40%, transparent); background: color-mix(in srgb, var(--tier-color) 10%, transparent); }
.slot-badge { color: var(--text-muted); border-color: var(--border-brown); background: rgba(255,255,255,0.03); }
.rarity-badge.common { color: #aaa; border-color: #333; background: rgba(255,255,255,0.03); }

/* Idle */
.forge-idle {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; opacity: 0.35; padding: 40px 0;
}
.forge-idle-icon { font-size: 2.4rem; }
.forge-idle-text { font-size: 0.78rem; color: var(--text-muted); font-style: italic; }

/* Gear art showcase */
.gear-showcase {
  position: relative; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; overflow: visible;
  margin: 0 auto;
}
.gear-showcase-glow {
  position: absolute; inset: -32px;
  background: radial-gradient(ellipse at 50% 55%, color-mix(in srgb, var(--tier-color) 22%, transparent) 0%, transparent 68%);
  pointer-events: none; z-index: 0;
  animation: glow-pulse 2.4s ease-in-out infinite;
}
.gear-frame-wrap {
  position: relative; width: 280px; height: 280px;
  z-index: 1;
  animation: gear-float 2.8s ease-in-out infinite;
}
.gear-frame-inner {
  position: absolute; inset: 14%;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.gear-showcase-img {
  width: 100%; height: 100%;
  object-fit: cover;
  filter: brightness(1.0);
  transition: filter 0.5s ease;
}
.gear-showcase.ready .gear-showcase-img {
  filter:
    drop-shadow(0 0 14px var(--tier-color))
    brightness(1.08);
}
.gear-frame-img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: contain; pointer-events: none; z-index: 2;
  filter: drop-shadow(0 4px 16px rgba(0,0,0,0.8));
  transition: filter 0.5s ease;
}
.gear-showcase.ready .gear-frame-img {
  filter:
    drop-shadow(0 4px 16px rgba(0,0,0,0.8))
    drop-shadow(0 0 12px color-mix(in srgb, var(--tier-color) 30%, transparent));
}

/* Anvil showcase */
.anvil-wrap {
  position: relative; display: flex;
  align-items: center; justify-content: center;
  flex-shrink: 0; overflow: visible;
}
.anvil-img {
  width: 220px; height: auto; object-fit: contain; display: block;
  position: relative; z-index: 1;
  transition: filter 0.5s ease;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.9)) brightness(0.85);
}
.anvil-wrap.ready .anvil-img {
  filter:
    drop-shadow(0 8px 24px rgba(0,0,0,0.9))
    drop-shadow(0 0 10px rgba(255,140,40,0.30))
    drop-shadow(0 0 22px rgba(200,90,20,0.15))
    brightness(1.03);
  animation: forge-breathe 2.4s ease-in-out infinite;
}
@keyframes forge-breathe {
  0%, 100% { filter:
    drop-shadow(0 8px 24px rgba(0,0,0,0.9))
    drop-shadow(0 0 10px rgba(255,140,40,0.30))
    drop-shadow(0 0 22px rgba(200,90,20,0.15))
    brightness(1.03); }
  50% { filter:
    drop-shadow(0 8px 24px rgba(0,0,0,0.9))
    drop-shadow(0 0 16px rgba(255,160,60,0.45))
    drop-shadow(0 0 32px rgba(220,100,20,0.25))
    brightness(1.07); }
}
.anvil-glow {
  position: absolute; top: 0; left: -24px; right: -24px; bottom: -24px;
  background: radial-gradient(ellipse at 50% 70%, rgba(255,120,30,0.10) 0%, transparent 65%);
  pointer-events: none; z-index: 0;
  animation: glow-pulse 2.4s ease-in-out infinite;
}
@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 0.85; }
}
.anvil-item-badge {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -80%); z-index: 2;
  width: 96px; height: 96px; border-radius: 14px;
  background: color-mix(in srgb, var(--tier-color) 12%, rgba(6,3,1,0.88));
  border: 1.5px solid color-mix(in srgb, var(--tier-color) 70%, transparent);
  box-shadow: 0 0 18px color-mix(in srgb, var(--tier-color) 55%, transparent), 0 0 40px color-mix(in srgb, var(--tier-color) 20%, transparent), inset 0 0 12px color-mix(in srgb, var(--tier-color) 10%, transparent);
  display: flex; align-items: center; justify-content: center;
  animation: item-float 2.8s ease-in-out infinite;
}
@keyframes item-float {
  0%, 100% { transform: translateX(-50%) translateY(0px); }
  50%       { transform: translateX(-50%) translateY(-6px); }
}
@keyframes gear-float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
}
.item-appear-enter-active { transition: opacity 0.25s, transform 0.3s cubic-bezier(0.22,1,0.36,1); }
.item-appear-leave-active { transition: opacity 0.15s; }
.item-appear-enter-from   { opacity: 0; transform: translateX(-50%) translateY(12px) scale(0.7); }
.item-appear-leave-to     { opacity: 0; }

.forge-desc {
  font-size: 0.7rem; color: var(--text-muted); line-height: 1.6;
  font-style: italic; text-align: center; max-width: 380px;
  text-shadow: 0 1px 6px rgba(0,0,0,0.8);
}

/* Stats + materials */
.forge-details { display: flex; gap: 16px; width: 100%; max-width: 440px; }
.forge-col { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.forge-col-label {
  font-family: var(--font-head); font-size: 0.56rem; text-transform: uppercase;
  letter-spacing: 2px; color: var(--text-muted); font-weight: 700;
  padding-bottom: 5px; border-bottom: 1px solid rgba(58,30,10,0.5);
}
.forge-stats { display: flex; gap: 6px; flex-wrap: wrap; }
.forge-stat {
  display: flex; flex-direction: column; align-items: center; gap: 1px;
  background: rgba(0,0,0,0.35); border: 1px solid var(--border-brown);
  border-radius: 6px; padding: 7px 12px; backdrop-filter: blur(4px); min-width: 58px;
}
.forge-stat-label { font-size: 0.54rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-family: var(--font-head); }
.forge-stat-val { font-size: 0.95rem; font-weight: 800; color: #ffd700; font-family: var(--font-head); }

.forge-materials { display: flex; flex-direction: column; gap: 5px; }
.material-row {
  display: flex; align-items: center; gap: 8px; padding: 6px 10px;
  border-radius: 6px; border: 1px solid color-mix(in srgb, var(--ore-color) 20%, transparent);
  background: color-mix(in srgb, var(--ore-color) 6%, rgba(0,0,0,0.3));
  backdrop-filter: blur(4px);
}
.mat-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--ore-color); box-shadow: 0 0 5px var(--ore-color); flex-shrink: 0; }
.mat-name { flex: 1; font-size: 0.68rem; font-weight: 600; color: var(--text-parchment); }
.mat-tally { display: flex; align-items: baseline; gap: 2px; flex-shrink: 0; }
.mat-have { font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; color: #666; }
.mat-have.ok { color: var(--ore-color); }
.mat-sep { font-size: 0.6rem; color: var(--text-dim); }
.mat-need { font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; color: var(--text-muted); }

/* Stars track */
.stars-track { display: flex; gap: 3px; flex-wrap: wrap; justify-content: center; width: 100%; max-width: 440px; }
.star-node {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 4px 8px; border-radius: 5px; border: 1px solid transparent; opacity: 0.35;
}
.star-node.current { opacity: 1; border-color: var(--border-gold); background: rgba(201,162,39,0.08); }
.star-node-stars { font-size: 0.55rem; color: #ffd700; letter-spacing: 1px; min-height: 12px; }
.star-node-rarity { font-size: 0.5rem; font-family: var(--font-head); text-transform: uppercase; letter-spacing: 1px; }
.star-node.common    .star-node-rarity { color: #888; }
.star-node.uncommon  .star-node-rarity { color: #4dff88; }
.star-node.rare      .star-node-rarity { color: #4fa8ff; }
.star-node.epic      .star-node-rarity { color: #b44fff; }
.star-node.legendary .star-node-rarity { color: #ffd700; }
.star-node.mythical  .star-node-rarity { color: #ff2244; }

/* Forge button */
.forge-actions { display: flex; align-items: center; gap: 12px; }
.forge-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 40px; border-radius: 8px;
  border: 1px solid var(--border-brown);
  background: linear-gradient(135deg, #2a1408 0%, #160a04 100%);
  color: var(--text-dim);
  font-family: var(--font-head); font-size: 0.9rem; font-weight: 800;
  letter-spacing: 3px; text-transform: uppercase;
  cursor: not-allowed; transition: all 0.2s;
}
.forge-btn.ready {
  border-color: #8a5a18;
  background: linear-gradient(135deg, #4a2808 0%, #2a1408 100%);
  color: var(--gold); cursor: pointer;
  box-shadow: 0 0 20px rgba(150,90,20,0.25);
}
.forge-btn.ready:hover {
  background: linear-gradient(135deg, #6a3810 0%, #3a1c08 100%);
  border-color: var(--gold);
  box-shadow: 0 0 32px rgba(201,162,39,0.40), inset 0 1px 0 rgba(255,220,100,0.1);
}
.forge-btn-icon { font-size: 1rem; }
.forge-hint { font-size: 0.62rem; color: #884444; font-style: italic; }

/* Elven forge divider in left panel */
.smelt-forge-divider {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 4px 4px; margin-top: 6px;
}
.sfd-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--elven-color); box-shadow: 0 0 6px var(--elven-color); flex-shrink: 0;
}
.sfd-name {
  flex: 1; font-family: var(--font-head); font-size: 0.56rem; text-transform: uppercase;
  letter-spacing: 1.5px; color: var(--elven-color); font-weight: 700;
}
.sfd-lock {
  font-size: 0.52rem; font-family: var(--font-head); color: #664466;
  background: rgba(126,232,255,0.06); border: 1px solid rgba(126,232,255,0.12);
  border-radius: 6px; padding: 1px 5px; letter-spacing: 0.5px;
}
.smelt-btn.elven { border-color: transparent; }
.smelt-btn.elven.active {
  background: color-mix(in srgb, #7ee8ff 10%, rgba(0,0,0,0.5));
  border-color: rgba(126,232,255,0.35);
}

/* ── Smelt mode: forge image fills center ───────────────────────── */
.smelt-forge-wrap {
  flex: 1; position: relative; width: 100%; min-height: 520px;
  border-radius: 0 0 12px 12px; overflow: hidden; flex-shrink: 0;
  border: 1px solid rgba(255,200,100,0.18); border-top: none;
  box-shadow: 0 12px 64px rgba(0,0,0,0.9);
}
.forge-busy-other { filter: saturate(0.2) brightness(0.45); transition: filter 0.4s; }
.smelt-forge-img {
  width: 100%; height: 100%; min-height: 520px;
  object-fit: cover; object-position: center 25%;
  display: block; filter: brightness(0.68) contrast(1.14) saturate(1.1);
  transition: filter 0.5s ease;
}
.smelt-forge-wrap:hover .smelt-forge-img { filter: brightness(0.82) contrast(1.1) saturate(1.1); }
.smelt-forge-glow {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 90%, var(--forge-glow) 0%, transparent 58%);
  pointer-events: none; z-index: 1;
  animation: forge-glow-pulse 3s ease-in-out infinite;
}
@keyframes forge-glow-pulse {
  0%, 100% { opacity: 0.55; }
  50%       { opacity: 1.0; }
}

/* Top banner — forge name, large and dramatic */
.smelt-forge-top {
  position: absolute; top: 0; left: 0; right: 0; z-index: 2;
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  padding: 22px 20px 42px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 60%, transparent 100%);
}
.smelt-forge-name-badge {
  font-family: var(--font-head); font-size: 1.3rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: 6px; color: rgba(255,235,175,0.98);
  text-shadow:
    0 0 32px rgba(255,150,40,0.9),
    0 0 64px rgba(255,100,20,0.5),
    0 2px 12px rgba(0,0,0,0.98);
}
.smelt-forge-xp {
  font-family: var(--font-head); font-size: 0.56rem; letter-spacing: 2px;
  color: rgba(255,200,120,0.5); text-transform: uppercase;
}

/* Unified bottom overlay — conversion row + action controls */
.smelt-bottom-overlay {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 70px 32px 24px;
  background: linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.7) 38%, transparent 100%);
}

/* Conversion info row */
.smelt-conv-row {
  display: flex; align-items: center; justify-content: space-between; width: 100%;
  padding-bottom: 14px; margin-bottom: 2px;
  border-bottom: 1px solid rgba(255,200,100,0.12);
}
.sco-side { display: flex; align-items: center; gap: 12px; }
.sco-right { flex-direction: row-reverse; }
.sco-info { display: flex; flex-direction: column; gap: 2px; }
.sco-info-right { text-align: right; }
.sco-name { font-size: 0.9rem; font-weight: 700; color: rgba(255,230,180,0.95); font-family: var(--font-head); letter-spacing: 0.5px; }
.sco-stock { font-size: 0.68rem; color: rgba(180,150,100,0.7); text-transform: uppercase; letter-spacing: 1px; }
.sco-none { color: #884444 !important; }
.sco-middle { display: flex; flex-direction: column; align-items: center; gap: 2px; flex-shrink: 0; }
.sco-cost-label { font-family: var(--font-head); font-size: 0.75rem; font-weight: 700; color: rgba(255,200,100,0.6); letter-spacing: 1px; }
.sco-arrow { font-size: 1.6rem; color: rgba(255,200,100,0.35); line-height: 1; }
.sco-yield { font-family: var(--font-head); font-size: 0.68rem; color: rgba(180,150,100,0.55); letter-spacing: 1px; }

/* Idle: qty row + start */
.smelt-qty-row { display: flex; align-items: center; gap: 4px; }
.sqr-adj {
  width: 34px; height: 34px; border-radius: 6px;
  border: 1px solid var(--border-brown); background: rgba(255,255,255,0.03);
  color: var(--text-muted); font-family: var(--font-head); font-size: 0.72rem; font-weight: 700;
  cursor: pointer; transition: all 0.12s;
}
.sqr-adj:not(:disabled):hover { background: rgba(255,255,255,0.07); border-color: #8a5a18; color: var(--gold); }
.sqr-adj:disabled { opacity: 0.28; cursor: not-allowed; }
.sqr-qty {
  min-width: 48px; text-align: center;
  font-family: var(--font-head); font-size: 1.1rem; font-weight: 800; color: var(--gold);
}
.sqr-max {
  padding: 0 10px; height: 34px; border-radius: 6px;
  border: 1px solid var(--border-brown); background: rgba(255,255,255,0.03);
  color: var(--text-dim); font-family: var(--font-head); font-size: 0.6rem; font-weight: 700;
  cursor: pointer; letter-spacing: 1px; text-transform: uppercase;
  transition: all 0.12s; margin-left: 4px;
}
.sqr-max:not(:disabled):hover { background: rgba(255,255,255,0.06); border-color: #8a5a18; color: var(--gold); }
.sqr-max:disabled { opacity: 0.28; cursor: not-allowed; }
.smelt-eta-hint { font-size: 0.6rem; color: var(--text-dim); font-style: italic; }
.smelt-no-smith { font-size: 0.62rem; color: #c47a3a; font-style: italic; }
.smelt-start-btn {
  padding: 12px 44px; border-radius: 8px;
  border: 1px solid var(--border-brown);
  background: linear-gradient(135deg, #2a1408 0%, #160a04 100%);
  color: var(--text-dim);
  font-family: var(--font-head); font-size: 0.9rem; font-weight: 800;
  letter-spacing: 3px; text-transform: uppercase;
  cursor: not-allowed; transition: all 0.2s;
}
.smelt-start-btn.ready {
  border-color: #8a5a18;
  background: linear-gradient(135deg, #4a2808 0%, #2a1408 100%);
  color: var(--gold); cursor: pointer;
  box-shadow: 0 0 20px rgba(150,90,20,0.25);
}
.smelt-start-btn.ready:hover {
  background: linear-gradient(135deg, #6a3810 0%, #3a1c08 100%);
  border-color: var(--gold);
  box-shadow: 0 0 32px rgba(201,162,39,0.40), inset 0 1px 0 rgba(255,220,100,0.1);
}

/* Running: progress */
.smelt-running { gap: 8px; }
.smelt-run-header { display: flex; align-items: baseline; gap: 10px; width: 100%; max-width: 400px; }
.srh-title { flex: 1; font-family: var(--font-head); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); }
.srh-count { font-family: var(--font-head); font-size: 1rem; font-weight: 800; color: var(--gold); }
.srp-wrap { display: flex; align-items: center; gap: 10px; width: 100%; max-width: 400px; }
.srp-track { flex: 1; height: 12px; background: rgba(255,255,255,0.07); border-radius: 6px; overflow: hidden; border: 1px solid var(--border-brown); }
.srp-fill { height: 100%; background: linear-gradient(to right, #cd7f32, #ffd700); border-radius: 6px; transition: width 0.8s linear; }
.srp-eta { font-family: var(--font-head); font-size: 0.78rem; color: rgba(255,200,100,0.85); flex-shrink: 0; min-width: 54px; text-align: right; }
.smelt-queue-btn { padding: 9px 32px; font-size: 0.78rem; }

.smelt-cancel-btn {
  padding: 8px 24px; border-radius: 6px;
  border: 1px solid #5a2020; background: rgba(90,20,20,0.25);
  color: #c08080; font-family: var(--font-head); font-size: 0.68rem; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.15s;
}
.smelt-cancel-btn:hover { border-color: #cc4444; background: rgba(120,20,20,0.4); color: #ffaaaa; }

/* Blocked: other job running */
.smelt-blocked { gap: 8px; opacity: 0.75; }
.smelt-busy-msg {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 16px; border-radius: 8px;
  border: 1px solid rgba(255,120,40,0.15); background: rgba(30,12,4,0.6);
}
.sbm-icon { font-size: 1.1rem; color: #cd7f32; opacity: 0.7; }
.sbm-text { display: flex; flex-direction: column; gap: 1px; }
.sbm-title { font-family: var(--font-head); font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; }
.sbm-sub   { font-size: 0.62rem; color: var(--text-dim); }
.smelt-busy-bar { width: 100%; max-width: 300px; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
.sbb-fill { height: 100%; background: linear-gradient(to right, #cd7f32, #ffd700); border-radius: 2px; transition: width 0.8s linear; }

/* Result flash */
.forge-result {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 16px; border-radius: 8px;
  border: 1px solid #2a5a2a; background: rgba(10,30,10,0.75);
  backdrop-filter: blur(4px);
}
.forge-result-icon { font-size: 1.1rem; color: #4dff88; }
.forge-result-text { display: flex; flex-direction: column; gap: 1px; }
.forge-result-name { font-size: 0.8rem; font-weight: 700; color: #aaffcc; font-family: var(--font-head); }
.forge-result-sub  { font-size: 0.6rem; color: #3a6a3a; }
.forge-pop-enter-active { animation: forge-flash 0.3s ease-out; }
.forge-pop-leave-active { transition: opacity 0.4s ease; }
.forge-pop-leave-to     { opacity: 0; }
@keyframes forge-flash {
  from { transform: translateY(6px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
}

/* Forge smith assignment bar */
.forge-smith-bar {
  width: 100%; max-width: 440px; position: relative;
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  padding: 12px 16px; border-radius: 8px;
  border: 1px solid rgba(201,162,39,0.18);
  background: rgba(0,0,0,0.35); backdrop-filter: blur(4px);
  margin-top: auto;
}
.fsb-label {
  font-family: var(--font-head); font-size: 0.65rem; text-transform: uppercase;
  letter-spacing: 2px; color: var(--text-muted); font-weight: 700; flex-shrink: 0;
}
.fsb-hero { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; flex-wrap: wrap; }
.fsb-name { font-size: 0.8rem; font-weight: 700; color: var(--text-parchment); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fsb-skill { font-size: 0.68rem; color: #cd7f32; font-family: var(--font-head); font-weight: 700; white-space: nowrap; }
.fsb-xp-wrap { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.fsb-xp-track { width: 80px; height: 6px; background: rgba(255,255,255,0.07); border-radius: 3px; overflow: hidden; }
.fsb-xp-fill  { height: 100%; background: linear-gradient(to right, #cd7f32, #ffd700); border-radius: 3px; transition: width 0.4s ease; }
.fsb-xp-text  { font-size: 0.62rem; color: var(--text-dim); white-space: nowrap; }
.fsb-bonus {
  font-family: var(--font-head); font-size: 0.72rem; font-weight: 800;
  color: #4dff88; background: rgba(77,255,136,0.08); border: 1px solid rgba(77,255,136,0.2);
  border-radius: 6px; padding: 3px 10px; white-space: nowrap; flex-shrink: 0;
}
.fsb-remove {
  width: 22px; height: 22px; border-radius: 50%; border: 1px solid #5a2020;
  background: rgba(90,20,20,0.3); color: #c08080; font-size: 0.7rem; font-weight: 700;
  cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.fsb-remove:hover { border-color: #cc4444; background: rgba(120,20,20,0.5); color: #ffaaaa; }
.fsb-assign {
  flex: 1; padding: 6px 12px; border-radius: 6px;
  border: 1px dashed rgba(201,162,39,0.25); background: transparent;
  color: var(--text-dim); font-size: 0.66rem; font-family: var(--font-head);
  cursor: pointer; transition: all 0.15s; text-align: left;
}
.fsb-assign:not(:disabled):hover { border-color: #8a5a18; color: var(--gold); }
.fsb-assign:disabled { opacity: 0.3; cursor: not-allowed; }
.fsb-picker {
  flex-basis: 100%; order: 99; margin-top: 4px;
  background: rgba(12,6,2,0.97); border: 1px solid var(--border-gold);
  border-radius: 8px; overflow: hidden;
  box-shadow: 0 -8px 32px rgba(0,0,0,0.8);
}
.fsb-pick-row {
  width: 100%; display: flex; align-items: center; gap: 10px;
  padding: 9px 14px; background: transparent; border: none;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  cursor: pointer; transition: background 0.1s; text-align: left;
}
.fsb-pick-row:last-child { border-bottom: none; }
.fsb-pick-row:hover { background: rgba(255,255,255,0.05); }
.fsb-pick-name  { flex: 1; font-size: 0.7rem; font-weight: 600; color: var(--text-parchment); }
.fsb-pick-level { font-size: 0.6rem; color: #cd7f32; font-family: var(--font-head); }
.fsb-pick-bonus { font-size: 0.6rem; color: #4dff88; font-family: var(--font-head); font-weight: 700; }
.fsb-drop-enter-active { transition: opacity 0.15s, transform 0.15s; }
.fsb-drop-leave-active { transition: opacity 0.1s; }
.fsb-drop-enter-from   { opacity: 0; transform: translateY(4px); }
.fsb-drop-leave-to     { opacity: 0; }

/* Smithing XP bar */
.smith-xp-bar { width: 100%; max-width: 440px; display: flex; flex-direction: column; gap: 7px; }
.smith-xp-header { display: flex; align-items: baseline; gap: 8px; }
.smith-xp-label { font-family: var(--font-head); font-size: 0.7rem; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: 1.5px; flex: 1; }
.smith-xp-level { font-family: var(--font-head); font-size: 0.85rem; font-weight: 800; color: #ffd700; }
.smith-xp-count { font-size: 0.68rem; color: var(--text-muted); }
.smith-xp-track { height: 8px; background: #1a0e04; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-brown); }
.smith-xp-fill { height: 100%; background: linear-gradient(to right, #cd7f32, #ffd700); border-radius: 4px; transition: width 0.6s ease; }

/* ── Right: Stockpile ────────────────────────────────────────────── */
.ore-panel {
  width: 190px; flex-shrink: 0; position: relative; z-index: 2;
  border-left: 1px solid var(--border-gold);
  background: rgba(4,2,1,0.88); backdrop-filter: blur(8px);
  padding: 16px 14px; display: flex; flex-direction: column; overflow-y: auto;
}
.panel-sublabel {
  font-family: var(--font-head); font-size: 0.52rem; text-transform: uppercase;
  letter-spacing: 2px; color: var(--text-dim); font-weight: 700; margin-bottom: 6px;
}
.bar-sublabel { margin-top: 14px; }
.ore-list { display: flex; flex-direction: column; gap: 5px; }
.ore-row {
  display: flex; align-items: center; gap: 9px; padding: 7px 10px;
  border-radius: 6px; border: 1px solid transparent; transition: background 0.12s;
}
.ore-row:not(.empty) {
  border-color: color-mix(in srgb, var(--ore-color) 20%, transparent);
  background: color-mix(in srgb, var(--ore-color) 5%, transparent);
}
.ore-row.empty { opacity: 0.28; filter: saturate(0.2); }
.ore-icon { flex-shrink: 0; }
.ore-row:not(.empty) .ore-icon { filter: drop-shadow(0 0 4px var(--ore-color)); }
.ore-name { flex: 1; font-size: 0.65rem; font-weight: 600; color: var(--text-parchment); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ore-count { font-family: var(--font-head); font-size: 0.85rem; font-weight: 800; color: var(--ore-color); min-width: 20px; text-align: right; }
.ore-row.empty .ore-count { color: var(--text-dim); }
.ore-row.clickable { cursor: pointer; }
.ore-row.clickable:hover { background: color-mix(in srgb, var(--ore-color) 12%, transparent); border-color: color-mix(in srgb, var(--ore-color) 40%, transparent); }
.ore-row.active { background: color-mix(in srgb, var(--ore-color) 15%, transparent); border-color: color-mix(in srgb, var(--ore-color) 55%, transparent); }
.ore-smelt-arrow { font-size: 0.65rem; color: var(--ore-color); opacity: 0.7; flex-shrink: 0; }

/* ── Mobile drawer ── */
.mob-drawer-toggle  { display: none; }
.mob-drawer-backdrop { display: none; }

@media (max-width: 640px) {
  /* Recipe panel slides in from the left */
  .recipe-panel {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 240px;
    max-height: none;
    z-index: 20;
    border-right: 1px solid var(--border-gold);
    border-bottom: none;
    transform: translateX(-100%);
    transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    overflow-y: auto;
  }
  .blacksmith.drawer-open .recipe-panel { transform: translateX(0); }

  /* Stockpile hidden on mobile — visible in Arsenal → Inventory → Resources */
  .ore-panel { display: none; }

  /* Backdrop behind drawer */
  .mob-drawer-backdrop {
    display: block;
    position: absolute;
    inset: 0;
    z-index: 18;
    background: rgba(0,0,0,0.5);
  }

  /* Toggle handle tab on the left edge of the forge */
  .mob-drawer-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 28px;
    height: 56px;
    background: rgba(4,2,1,0.92);
    border: 1px solid var(--border-gold);
    border-left: none;
    border-radius: 0 8px 8px 0;
    color: var(--gold);
    font-size: 0.9rem;
    cursor: pointer;
    z-index: 25;
    padding: 0;
    transition: background 0.15s;
  }
  .mob-drawer-toggle:hover   { background: rgba(20,10,2,0.98); }
  .mob-drawer-toggle.open    { left: 240px; }

  /* Forge area takes full width, left padding makes room for the toggle tab */
  .forge-area {
    padding: 12px 14px 20px 34px;
    overflow-y: auto;
  }
  .forge-details { flex-direction: column; max-width: 100%; }
  .forge-col { flex: none; }
  .forge-smith-bar { max-width: 100%; }
  .smith-xp-bar    { max-width: 100%; }
}
</style>
