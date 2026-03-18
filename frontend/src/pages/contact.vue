<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { getPageBySlug } = useWordPress()
const { locale } = useI18n()

const { data: contactPageData, pending: contactPagePending } = await useAsyncData(
  `contact-page-${locale.value}`,
  () => getPageBySlug('contact-page', locale.value.toUpperCase()),
  {
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
    watch: [locale],
  },
)

if (contactPageData.value?.seo) {
  useSeo({
    fallbackTitle: 'Contact Page',
    seoData: contactPageData.value.seo,
  })
}

const { contentRef } = useLocaleTransition(contactPagePending)

const token = ref()
const UInput = resolveComponent('UInput')
const UTextarea = resolveComponent('UTextarea')
const { t } = useI18n()

const fields = computed(() => [
  {
    component: UInput,
    icon: 'i-lucide-at-sign',
    label: t('contact.email.label'),
    name: 'email',
    placeholder: t('contact.email.placeholder'),
    schema: z.email({ message: t('contact.email.error') }),
    type: 'text',
  },
  {
    component: UInput,
    icon: 'i-lucide-file-text',
    label: t('contact.subject.label'),
    name: 'subject',
    placeholder: t('contact.subject.placeholder'),
    schema: z.string().min(1, t('contact.subject.error')),
    type: 'text',
  },
  {
    component: UTextarea,
    label: t('contact.message.label'),
    name: 'message',
    placeholder: t('contact.message.placeholder'),
    schema: z.string().min(10, t('contact.message.error')),
    type: 'textarea',
  },
])

const schema = computed(() => z.object(
  Object.fromEntries(fields.value.map(f => [f.name, f.schema])),
))

const state: Record<string, string> = reactive({ email: '', message: '', subject: '' })

const isSubmitted = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

async function onSubmit(event: FormSubmitEvent<Record<string, string>>) {
  isSubmitting.value = true
  errorMessage.value = null

  // Need to validate Turnstile token here
  const bodyVerify = {
    token: String(token.value),
  }

  const response = await fetch('/_turnstile/validate', {
    body: JSON.stringify(bodyVerify),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  if (!response.ok) {
    isSubmitting.value = false
    errorMessage.value = t('contact.errorMessage')
    return
  }

  // Send mail via server API
  const emailResponse = await fetch('/api/contact', {
    body: JSON.stringify(event.data),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })

  if (!emailResponse.ok) {
    isSubmitting.value = false
    errorMessage.value = t('contact.errorMessage')
    return
  }

  isSubmitting.value = false
  isSubmitted.value = true
}
</script>

<template>
  <div ref="contentRef" class="pt-36 pb-16 text-center flex flex-col items-center">
    <div class="opacity-50 text-4xl font-bold">
      {{ t('contact.title') }}
    </div>
    <h1 v-if="contactPageData" class="text-4xl font-bold mb-6">
      {{ contactPageData?.title }}
    </h1>
    <div
      v-if="contactPageData && !isSubmitted"
      v-dompurify-html="contactPageData?.content"
      class="mb-8"
    />

    <div class="w-full lg:w-1/3 mx-auto">
      <div v-if="isSubmitted" class="text-center py-8">
        <div class="flex flex-col items-center justify-center mb-2">
          <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-green-500 mb-4" />
          <h2 class="text-2xl font-bold">
            {{ t('contact.successTitle') }}
          </h2>
        </div>
        <p class="text-secondary">
          {{ t('contact.successMessage') }}
        </p>
      </div>

      <UForm
        v-else
        :schema="schema"
        :state="state"
        class="space-y-4 w-full"
        @submit="onSubmit"
      >
        <NuxtTurnstile v-model="token" />

        <template
          v-for="field in fields"
          :key="field.name"
        >
          <UFormField
            :name="field.name"
            :label="field.label"
            :ui="{
              labelWrapper: 'mb-2 font-bold',
            }"
          >
            <component
              :is="field.component"
              v-model="state[field.name]"
              :type="field.type"
              :icon="field.icon"
              :placeholder="field.placeholder"
              variant="outlined"
              size="xl"
              :ui="{
                root: 'w-full',
                base: field.component === UInput ? 'ps-8 ring-1 ring-white/50 focus:ring-white py-2' : 'ring-1 ring-white/50 focus:ring-white py-2',
                leading: 'ps-3',
              }"
            />
          </UFormField>
        </template>
        <p v-if="errorMessage" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </p>
        <UButton
          type="submit"
          :disabled="isSubmitting"
          :loading="isSubmitting"
          class="border-2 rounded-full px-6 cursor-pointer py-2.5 mt-4 text-primary bg-background hover:bg-white hover:text-background transition-colors flex items-center gap-2 justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>
            {{ t('contact.submitText') }}
          </span>
          <GeometricSquare size="auto" />
        </UButton>
      </UForm>
    </div>
  </div>
</template>
