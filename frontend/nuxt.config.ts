import tailwindcss from '@tailwindcss/vite'
import cache from './config/cache'
import redirects from './config/redirects'
import securityRoutes from './config/security-routes'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/favicon.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
    pageTransition: { mode: 'out-in', name: 'fade' },
  },
  compatibilityDate: '2025-07-15',
  css: ['./assets/css/main.css'],
  devtools: { enabled: true },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      Geist: [400, 600, 700],
    },
  },
  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://barnemax.com',
    customRoutes: 'config',
    defaultLocale: 'en',
    langDir: 'locales',
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
    restructureDir: 'src/i18n',
    strategy: 'prefix_except_default',
  },
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
  robots: {
    blockAiBots: true,
    blockNonSeoBots: true,
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },
  routeRules: {
    ...(process.env.NODE_ENV !== 'development' ? cache : {}),
    ...redirects,
    ...securityRoutes,
  },
  runtimeConfig: {
    brevoApiKey: process.env.NUXT_BREVO_API_KEY,
    mailReceiver: process.env.NUXT_MAIL_RECEIVER,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://barnemax.com',
    },
    wpGraphqlUrl: process.env.NUXT_WP_GRAPHQL_URL,
  },
  schemaOrg: {
    identity: {
      image: 'https://media.barnemax.com/barnemax-logo.png',
      jobTitle: 'Full-Stack Developer',
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
  serverDir: 'src/server',
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://barnemax.com',
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },
  srcDir: 'src/',
  turnstile: {
    addValidateEndpoint: true,
    secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
    siteKey: process.env.NUXT_TURNSTILE_SITE_KEY,
  },
  ui: {
    colorMode: false,
    theme: {
      colors: ['primary', 'neutral'],
    },
  },
  vite: {
    optimizeDeps: {
      include: ['vue-dompurify-html', 'zod'],
    },
    plugins: [
      tailwindcss(),
    ],
  },
})
