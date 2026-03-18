<script setup>
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()

const i18nHead = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true,
})

useHead({
  htmlAttrs: {
    dir: i18nHead.value.htmlAttrs?.dir,
    lang: i18nHead.value.htmlAttrs?.lang,
  },
  link: computed(() => i18nHead.value.link || []),
  meta: computed(() => i18nHead.value.meta || []),
})
</script>

<template>
  <UApp :locale="locales[locale]">
    <NuxtLoadingIndicator color="var(--color-primary)" />
    <CustomCursor />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
