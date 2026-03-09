<script setup lang="ts">
import type { Term } from '~/types/wordpress'

defineProps<{
  slug: string
  title?: string
  excerpt?: string
  year?: number
  terms?: { nodes: Term[] }
}>()

const { getProjectUrl } = useRouteHelpers()
</script>

<template>
  <NuxtLink
    :aria-label="`View project ${title}`"
    :to="getProjectUrl(slug)"
    class="p-8 rounded-xl border hover:text-white transition-all block space-y-2 group-hover/projects:opacity-50 hover:opacity-100!"
  >
    <h3 class="text-3xl font-bold">{{ title }}</h3>
    <div v-if="year" class="font-bold opacity-50">{{ year }}</div>
    <div v-if="terms" class="flex flex-wrap gap-2 mt-3">
      <TermBadge
        v-for="term in terms.nodes"
        :key="term.id"
        :name="term.name"
      />
      <div
        v-if="excerpt"
        v-dompurify-html="excerpt"
        class="mt-2"
      />
    </div>
  </NuxtLink>
</template>
