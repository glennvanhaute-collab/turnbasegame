<template>
  <WorldSelectorView v-if="!worldStore.activeWorld" />
  <YamatoShell       v-else-if="worldStore.activeWorld === 'yamato'" />
  <MythosShell       v-else-if="worldStore.activeWorld === 'mythos'" />
  <WestrunShell      v-else />
</template>

<script setup>
import { useWorldStore } from './stores/useWorldStore.js'
import WorldSelectorView from './components/WorldSelectorView.vue'
import YamatoShell       from './components/yamato/YamatoShell.vue'
import MythosShell       from './components/mythos/MythosShell.vue'
import WestrunShell      from './components/westrun/WestrunShell.vue'

const worldStore = useWorldStore()
</script>

<style>
:root {
  --gold:          #c9a227;
  --gold-bright:   #ffd700;
  --gold-dim:      #7a5228;
  --gold-faint:    #2e1c08;
  --bg-deep:       #070503;
  --bg-dark:       #0e0905;
  --bg-panel:      #160f08;
  --bg-card:       #1c1208;
  --border-brown:  #3a1e0a;
  --border-gold:   #5c3a14;
  --text-gold:     #c9a227;
  --text-parchment:#c4a882;
  --text-muted:    #6b5440;
  --text-dim:      #3e2a18;
  --font-head:     'Cinzel', 'Georgia', serif;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: var(--bg-deep);
  background-image: radial-gradient(ellipse at 50% 0%, #1a0e06 0%, #070503 55%);
  color: var(--text-parchment);
  font-family: 'Segoe UI', system-ui, sans-serif;
  min-height: 100vh;
}

/* Global scrollbar — dark parchment theme */
* {
  scrollbar-width: thin;
  scrollbar-color: #3e1c0c transparent;
}
*::-webkit-scrollbar       { width: 5px; height: 5px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb { background: #3e1c0c; border-radius: 3px; }
*::-webkit-scrollbar-thumb:hover { background: #5c2810; }
</style>
