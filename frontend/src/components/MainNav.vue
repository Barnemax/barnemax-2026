<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const { isMenuOpen, toggle, close } = useMobileMenu()

const navItems = computed(() => [
  { id: 1, label: t('menu.projects'), name: 'projects' },
  { id: 2, label: t('menu.contact'), name: 'contact' },
])

const isActiveRoute = (name: string) => {
  const routeName = route.name?.toString() || ''
  return routeName === name || routeName.startsWith(`${name}-`)
}

watch(() => route.path, () => {
  close()
})
</script>

<template>
  <nav class="main-nav">
    <button
      class="lg:hidden z-50 relative"
      :aria-label="t('accessibility.burger')"
      @click="toggle()"
    >
      <UIcon :name="isMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="w-6 h-6" />
    </button>

    <ul
      class="nav-list flex items-center gap-6
             lg:flex-row lg:justify-end
             max-lg:fixed max-lg:top-16 max-lg:inset-x-0
             max-lg:flex-col max-lg:items-center max-lg:py-12 max-lg:pb-24
             max-lg:bg-background max-lg:border-l max-lg:border-border
             max-lg:transition-transform max-lg:duration-300 max-lg:z-40"
      :class="isMenuOpen ? 'max-lg:translate-x-0' : 'max-lg:translate-x-full'"
    >
      <li
        v-for="item in navItems"
        :key="item.id"
      >
        <NuxtLink
          :to="localePath({ name: item.name })"
          class="nav-link hover:text-white font-bold hover:underline transition-colors"
          :class="{ 'router-link-active': isActiveRoute(item.name) }"
        >
          {{ item.label }}
        </NuxtLink>
      </li>
      <li>
        <LanguageSwitcher />
      </li>
    </ul>
  </nav>
</template>
