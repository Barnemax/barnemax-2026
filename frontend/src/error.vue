<script setup lang="ts">
import type { barnemaxError } from '~/types/error'

const { t } = useI18n()

const props = defineProps({
  error: Object as () => barnemaxError,
})

const handleError = () => clearError({ redirect: props.error?.data?.redirect?.to || '/' })
</script>

<template>
  <CustomCursor />
  <NuxtLayout>
    <div>
      <div class="h-screen">
        <div class="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <div class="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h1 class="text-6xl font-bold mb-4">
              {{ error?.statusCode }}
            </h1>
            <p class="text-xl mb-8">
              {{ error?.statusMessage }}
            </p>
            <button
              class="border-2 rounded-full px-6 py-2.5 hover:bg-white hover:text-background transition-colors"
              @click="handleError"
            >
              {{ error?.data?.redirect?.text || t('error.goHome') }}
            </button>
          </div>
        </div>

        <AnimatedBackground :rings="5" />
      </div>
    </div>
  </NuxtLayout>
</template>
