<template>
  <MythosShell />
</template>

<script setup>
import MythosShell from './components/MythosShell.vue'
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: #07080b;
  color: #b9b2a4;
  font-family: 'Cormorant Garamond', Georgia, serif;
  min-height: 100vh;
}
* { scrollbar-width: thin; scrollbar-color: #2a2620 transparent; }
*::-webkit-scrollbar       { width: 5px; height: 5px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb { background: #2a2620; border-radius: 3px; }
</style>
