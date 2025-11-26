const isMenuOpen = ref(false)

export function useMobileMenu() {
  const open = () => {
    isMenuOpen.value = true
  }

  const close = () => {
    isMenuOpen.value = false
  }

  const toggle = () => {
    isMenuOpen.value = !isMenuOpen.value
  }

  return {
    close,
    isMenuOpen: readonly(isMenuOpen),
    open,
    toggle,
  }
}
