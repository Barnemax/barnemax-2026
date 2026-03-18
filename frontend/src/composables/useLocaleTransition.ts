import type { Ref } from 'vue'

export function useLocaleTransition(pending: Ref<boolean>) {
  const { locale } = useI18n()
  const contentRef = ref<HTMLDivElement | null>(null)

  const reveal = () => {
    if (!contentRef.value) return
    void contentRef.value.offsetHeight
    contentRef.value.classList.remove('locale-loading')
  }

  onMounted(() => {
    contentRef.value?.classList.add('locale-content')
  })

  // Hide synchronously before Vue re-renders t() calls on locale change
  watch(locale, () => {
    contentRef.value?.classList.add('locale-loading')
  }, { flush: 'sync' })

  // Reveal after async fetch completes (covers same-page locale reload without navigation)
  watch(pending, (isPending) => {
    if (isPending) return
    nextTick(() => reveal())
  })

  return { contentRef }
}
