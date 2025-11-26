import type { Project } from '~/types/wordpress'

export const useSchema = () => {
  const { t } = useI18n()
  const localePath = useLocalePath()

  const defineBreadcrumbItems = (items: { name: string, url: string }[]) => {
    return items.map((item, index) => ({
      '@type': 'ListItem' as const,
      'item': item.url,
      'name': item.name,
      'position': index + 1,
    }))
  }

  const setProjectSchema = (project: Project) => {
    const breadcrumbItems = defineBreadcrumbItems([
      { name: t('menu.projects'), url: localePath({ name: 'projects' }) },
      { name: project.title, url: localePath({ name: 'projects-slug', params: { slug: project.slug } }) },
    ])

    useSchemaOrg([
      defineBreadcrumb({
        itemListElement: breadcrumbItems,
      }),
      {
        '@type': 'CreativeWork',
        'author': {
          '@type': 'Person',
          'name': 'Maxime Etchebarne',
        },
        'datePublished': project.date,
        'description': project.excerpt?.replace(/<[^>]*>/g, '') || '',
        'name': project.title,
        ...(project.projectFields?.year && { dateCreated: project.projectFields.year }),
        ...(project.projectFields?.projectScreenshots?.[0]?.projectImage?.node?.sourceUrl && {
          image: project.projectFields.projectScreenshots[0].projectImage.node.sourceUrl,
        }),
      },
    ])
  }

  return {
    setProjectSchema,
  }
}
