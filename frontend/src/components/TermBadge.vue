<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <span
    role="button"
    class="inline-block border-2 border-primary text-sm px-3 py-1.5 rounded-full hover:text-white hover:border-white transition-colors cursor-pointer"
  >
    {{ name }}
  </span>
</template>
