export const SOCIAL_LINKS = {
  github: { label: 'GitHub', url: 'https://github.com/barnemax' },
  instagram: { label: 'Instagram', url: 'https://www.instagram.com/barnemax_/' },
  linkedin: { label: 'LinkedIn', url: 'https://linkedin.com/in/barnemax' },
} as const

/** Profile URLs for schema.org `sameAs` — consumed by nuxt.config.ts */
export const SOCIAL_PROFILE_URLS = Object.values(SOCIAL_LINKS).map(({ url }) => url)
