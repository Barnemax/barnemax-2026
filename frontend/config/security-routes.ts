import type { NuxtConfig } from 'nuxt/schema'

const securityRoutes: NuxtConfig['routeRules'] = {
  '/api/contact': {
    security: {
      rateLimiter: {
        interval: 300000, // 5 minutes
        tokensPerInterval: 5,
      },
    },
  },
  '/api/graphql': {
    security: {
      rateLimiter: {
        interval: 60000, // 1 minute
        tokensPerInterval: 30,
      },
    },
  },
}

export default securityRoutes
