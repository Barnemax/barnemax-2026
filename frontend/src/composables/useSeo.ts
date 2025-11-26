import type { SeoOptions } from '~/types/seo'

export const useSeo = (options: SeoOptions) => {
  const { fallbackTitle, seoData } = options
  const route = useRoute()
  const config = useRuntimeConfig()

  if (seoData) {
    useSeoMeta({
      description: seoData.description,
      ogDescription: seoData.openGraph?.description || seoData.description,
      ogImage: seoData.openGraph?.image?.secureUrl,
      ogTitle: seoData.openGraph?.title || seoData.title || fallbackTitle,
      ogType: 'website',
      ogUrl: `${config.public.siteUrl}${route.fullPath}`,
      title: seoData.title || fallbackTitle,
    })
  }

  // Canonical and hreflang tags are handled by useLocaleHead() in app.vue
}
