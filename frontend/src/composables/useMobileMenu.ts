export function useMobileMenu() {
  const isMenuOpen = useState('mobileMenu', () => false)

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
