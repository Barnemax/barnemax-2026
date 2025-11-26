<script setup lang="ts">
const { locale, setLocale, t } = useI18n()

const locales = [
  { label: 'English', value: 'en' },
  { label: 'Français', value: 'fr' },
]
</script>

<template>
  <USelect
    :model-value="locale"
    :items="locales"
    value-key="value"
    :aria-label="t('accessibility.languageSwitcher')"
    :title="t('accessibility.languageSwitcher')"
    icon="i-lucide-globe"
    color="primary"
    :ui="{
      base: 'gap-2 cursor-pointer hover:text-white text-base px-6 font-bold py-0 outline-none ring-0',
      content: 'p-2 bg-background',
      item: 'text-primary gap-2 cursor-pointer items-center hover:text-white text-base font-bold hover:underline',
      leading: 'inset-y-0 left-0',
      trailing: 'inset-y-0 right-0',
      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
    }"
    @update:model-value="setLocale($event)"
  />
</template>
