import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src/',
  serverDir: 'src/server',
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@nuxtjs/turnstile',
    'nuxt-schema-org',
    'nuxt-security',
  ],
  devtools: { enabled: true }, app: {
    pageTransition: { mode: 'out-in', name: 'page' },
  },
  css: ['./assets/css/main.css'],
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://barnemax.com',
  },
  runtimeConfig: {
    brevoApiKey: process.env.NUXT_BREVO_API_KEY,
    mailReceiver: process.env.NUXT_MAIL_RECEIVER,
    wpGraphqlUrl: process.env.NUXT_WP_GRAPHQL_URL,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://barnemax.com',
    },
  },
  routeRules: {
    '/': { isr: 3600 * 12 }, // 12 hours
    '/fr': { isr: 3600 * 12 },
    '/contact': { isr: 3600 * 12 },
    '/fr/contact': { isr: 3600 * 12 },
    '/credits': { redirect: { to: '/', statusCode: 301 } },
    '/project/**': { redirect: { to: '/projects/**', statusCode: 301 } },
    '/projects': { isr: 3600 * 12 },
    '/projects/**': { isr: 3600 * 12 },
    '/fr/projets': { isr: 3600 * 12 },
    '/fr/projets/**': { isr: 3600 * 12 },
  },
  compatibilityDate: '2025-07-15',
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      Geist: [400, 700, 800],
    },
  },
  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://barnemax.com',
    customRoutes: 'config',
    defaultLocale: 'en',
    langDir: 'locales',
    restructureDir: 'src/i18n',
    locales: [{
      code: 'en',
      file: 'en.ts',
      language: 'en',
      name: 'English',
    }, {
      code: 'fr',
      file: 'fr.ts',
      language: 'fr',
      name: 'Français',
    }],
    pages: {
      'contact': {
        en: '/contact',
        fr: '/contact',
      },
      'projects/[slug]': {
        en: '/projects/[slug]',
        fr: '/projets/[slug]',
      },
      'projects/index': {
        en: '/projects',
        fr: '/projets',
      },
    },
    strategy: 'prefix_except_default',
  },
  robots: {
    blockAiBots: true,
    blockNonSeoBots: true,
  },
  schemaOrg: {
    identity: {
      jobTitle: 'Web Developer',
      name: 'Maxime Etchebarne',
      sameAs: [
        'https://github.com/barnemax',
        'https://linkedin.com/in/barnemax',
        'https://www.instagram.com/barnemax_/',
      ],
      type: 'Person',
      url: 'https://barnemax.com',
    },
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        'connect-src': ['\'self\'', 'https://challenges.cloudflare.com'],
        'default-src': ['\'self\''],
        'font-src': ['\'self\'', 'https://fonts.gstatic.com'],
        'frame-src': ['\'self\'', 'https://challenges.cloudflare.com'],
        'img-src': ['\'self\'', 'data:', 'https:', 'blob:'],
        'script-src': ['\'self\'', '\'unsafe-inline\'', 'https://challenges.cloudflare.com'],
        'style-src': ['\'self\'', '\'unsafe-inline\'', 'https://fonts.googleapis.com'],
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      xContentTypeOptions: 'nosniff',
      xFrameOptions: 'SAMEORIGIN',
    },
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },
  turnstile: {
    addValidateEndpoint: true,
    secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
    siteKey: process.env.NUXT_TURNSTILE_SITE_KEY,
  },
})
