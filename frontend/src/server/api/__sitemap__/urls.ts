import { defineSitemapEventHandler } from '#imports'

const GET_PROJECTS_FOR_SITEMAP = `
  query GetProjectsForSitemap {
    enProjects: projects(first: 100, where: { language: EN }) {
      nodes {
        slug
        date
      }
    }
    frProjects: projects(first: 100, where: { language: FR }) {
      nodes {
        slug
        date
      }
    }
  }
`

interface ProjectNode {
  slug: string
  date: string
}

interface SitemapResponse {
  enProjects: { nodes: ProjectNode[] }
  frProjects: { nodes: ProjectNode[] }
}

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()

  const urls: Array<{ loc: string, lastmod?: string, priority?: number }> = []

  // Static pages
  urls.push(
    { loc: '/', priority: 1.0 },
    { loc: '/fr', priority: 1.0 },
    { loc: '/projects', priority: 0.8 },
    { loc: '/fr/projets', priority: 0.8 },
    { loc: '/contact', priority: 0.6 },
    { loc: '/fr/contact', priority: 0.6 },
  )

  // Fetch dynamic projects
  try {
    const response = await fetch(config.wpGraphqlUrl as string, {
      body: JSON.stringify({ query: GET_PROJECTS_FOR_SITEMAP }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })

    const json = await response.json()
    const data = json.data as SitemapResponse

    for (const project of data.enProjects.nodes) {
      urls.push({
        lastmod: project.date,
        loc: `/projects/${project.slug}`,
        priority: 0.7,
      })
    }

    for (const project of data.frProjects.nodes) {
      const cleanSlug = project.slug.replace(/-fr$/, '')
      urls.push({
        lastmod: project.date,
        loc: `/fr/projets/${cleanSlug}`,
        priority: 0.7,
      })
    }
  }
  catch (error) {
    console.error('Sitemap: Failed to fetch projects', error)
  }

  return urls
})
