import type { MaybeRefOrGetter } from 'vue'
import type { SeoOptions } from '~/types/seo'

export const useSeo = (options: MaybeRefOrGetter<SeoOptions>) => {
  const route = useRoute()
  const config = useRuntimeConfig()

  const resolved = computed(() => toValue(options))

  useSeoMeta({
    description: () => resolved.value.seoData?.description,
    ogDescription: () => resolved.value.seoData?.openGraph?.description || resolved.value.seoData?.description,
    ogImage: () => resolved.value.seoData?.openGraph?.image?.secureUrl,
    ogTitle: () => resolved.value.seoData?.openGraph?.title || resolved.value.seoData?.title || resolved.value.fallbackTitle,
    ogType: 'website',
    ogUrl: () => `${config.public.siteUrl}${route.fullPath}`,
    title: () => resolved.value.seoData?.title || resolved.value.fallbackTitle,
  })

  // Canonical and hreflang tags are handled by useLocaleHead() in app.vue
}
