export const useRouteHelpers = () => {
  const { locale } = useI18n()
  const localePath = useLocalePath()

  const getProjectUrl = (slug: string) => {
    const cleanSlug = locale.value === 'fr' ? slug.replace(/-fr$/, '') : slug

    return localePath({ name: 'projects-slug', params: { slug: cleanSlug } })
  }

  return { getProjectUrl }
}
