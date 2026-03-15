import type { NuxtConfig } from 'nuxt/schema'

const ISR_12H = 3600 * 12

const cache: NuxtConfig['routeRules'] = {
  '/': { isr: ISR_12H },
  '/contact': { isr: ISR_12H },
  '/fr': { isr: ISR_12H },
  '/fr/contact': { isr: ISR_12H },
  '/fr/projets': { isr: ISR_12H },
  '/fr/projets/**': { isr: ISR_12H },
  '/projects': { isr: ISR_12H },
  '/projects/**': { isr: ISR_12H },
}

export default cache
