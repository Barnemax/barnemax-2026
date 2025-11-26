import type { NuxtError } from 'nuxt/app'

export interface barnemaxError extends NuxtError {
  data?: {
    redirect?: {
      text: string
      to: string
    }
  }
}
