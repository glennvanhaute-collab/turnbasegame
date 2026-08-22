<template>
  <HomeMobile v-if="isMobile" v-bind="$attrs" />
  <HomeDesktop v-else v-bind="$attrs" />
</template>

<script setup>
import { useIsMobile }  from '../composables/useIsMobile.js'
import HomeMobile       from './home/HomeMobile.vue'
import HomeDesktop      from './home/HomeDesktop.vue'

defineOptions({ inheritAttrs: false })

const { isMobile } = useIsMobile()
</script>
