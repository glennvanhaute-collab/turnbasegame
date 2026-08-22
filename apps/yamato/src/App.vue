<template>
  <YamatoShell />
</template>

<script setup>
import YamatoShell from './components/YamatoShell.vue'
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: #070906;
  color: #c0b8b0;
  font-family: 'Segoe UI', system-ui, sans-serif;
  min-height: 100vh;
}
* { scrollbar-width: thin; scrollbar-color: #2a3a2a transparent; }
*::-webkit-scrollbar       { width: 5px; height: 5px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb { background: #2a3a2a; border-radius: 3px; }
</style>
