import type { PageResponse, HomepageResponse, ProjectsResponse, ProjectsWithArchiveResponse } from '~/types/graphql'

import { GET_HOMEPAGE, GET_PAGE_BY_SLUG } from '~/graphql/queries/pages'
import { GET_PROJECT_BY_SLUG, GET_PROJECTS_WITH_ARCHIVE } from '~/graphql/queries/projects'

export const useWordPress = () => {
  const graphqlClient = async <T>(query: string, variables = {}): Promise<T> => {
    return await $fetch<T>('/api/graphql', {
      body: { query, variables },
      method: 'POST',
    })
  }

  const getHomepage = async (language: string = 'EN') => {
    const data = await graphqlClient<HomepageResponse>(GET_HOMEPAGE, { language })
    return data.pageBy.translation
  }

  const getPageBySlug = async (slug: string, language: string = 'EN') => {
    const data = await graphqlClient<PageResponse>(GET_PAGE_BY_SLUG, { language, slug })
    return data.pageBy.translation
  }

  const getProjectBySlug = async (slug: string, language: string = 'EN') => {
    // For non-English, append language code to slug
    const actualSlug = language === 'EN' ? slug : `${slug}-${language.toLowerCase()}`

    const data = await graphqlClient<ProjectsResponse>(
      GET_PROJECT_BY_SLUG,
      { language, slug: actualSlug },
    )

    const project = data.projects?.nodes?.[0] ?? null

    // Get a random other project (excluding current)
    const otherProjects = data.otherProjects?.nodes?.filter(p => p.slug !== actualSlug) ?? []
    const randomOther = otherProjects.length > 0
      ? otherProjects[Math.floor(Math.random() * otherProjects.length)]
      : null

    return {
      otherProject: randomOther,
      project,
    }
  }

  const getProjectsWithArchive = async (language: string = 'EN') => {
    const data = await graphqlClient<ProjectsWithArchiveResponse>(GET_PROJECTS_WITH_ARCHIVE, { language })
    return {
      archive: data.contentType,
      projects: data.projects.nodes,
    }
  }

  return {
    getHomepage,
    getPageBySlug,
    getProjectBySlug,
    getProjectsWithArchive,
  }
}
