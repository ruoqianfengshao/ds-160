<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useDS160Store } from '~/stores/ds160'

const store = useDS160Store()

onMounted(() => {
  // Initialize store from localStorage on app mount
  store.initializeFromStorage()
})
</script>
