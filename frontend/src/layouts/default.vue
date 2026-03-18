<script setup="ts">
const localePath = useLocalePath()

const { isMenuOpen } = useMobileMenu()
const isHeaderVisible = ref(true)
const lastScrollY = ref(0)

const onScroll = () => {
  const currentScrollY = window.scrollY
  isHeaderVisible.value = currentScrollY < lastScrollY.value || currentScrollY < 100
  lastScrollY.value = currentScrollY
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="bg-background text-primary min-h-screen flex flex-col">
    <header
      class="py-4 fixed top-0 left-0 w-full z-10 transition-all duration-300"
      :class="[
        isHeaderVisible || isMenuOpen ? 'translate-y-0' : '-translate-y-full',
        isMenuOpen ? 'bg-background' : 'bg-linear-to-b from-background from-50% to-transparent',
      ]"
    >
      <div class="container px-8 mx-auto flex justify-between items-center">
        <NuxtLink
          :to="localePath('/')"
          class="text-2xl font-bold tracking-wide hover:text-white flex items-center"
        >
          <GeometricSquare size="auto" class="opacity-75" />
          <span class="ml-2">barnemax</span>
        </NuxtLink>
        <MainNav />
      </div>
    </header>

    <main
      class="pb-20"
    >
      <div class="container mx-auto px-8">
        <slot />
      </div>
    </main>
    <footer class="mt-auto p-4 border-t border-border text-center text-sm opacity-50">
      &copy; 2017 - {{ new Date().getFullYear() }} barnemax
    </footer>
  </div>
</template>
