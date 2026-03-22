import type { NuxtConfig } from 'nuxt/schema'

const redirects: NuxtConfig['routeRules'] = {
  '/author/**': { redirect: { statusCode: 301, to: '/' } },
  '/credits': { redirect: { statusCode: 301, to: '/' } },
  '/project/**': { redirect: { statusCode: 301, to: '/projects/**' } },
}

export default redirects
