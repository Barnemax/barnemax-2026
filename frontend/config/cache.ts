import type { NuxtConfig } from 'nuxt/schema'

const cache: NuxtConfig['routeRules'] = {
  '/**': { prerender: true },
  '/api/**': { prerender: false },
}

export default cache
