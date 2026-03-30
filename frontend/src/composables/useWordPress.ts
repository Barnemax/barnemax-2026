import type { PageResponse, HomepageResponse, ProjectsResponse, ProjectsWithArchiveResponse } from '~/types/graphql'

import { GET_HOMEPAGE, GET_PAGE_BY_SLUG } from '~/graphql/queries/pages'
import { GET_PROJECT_BY_SLUG, GET_PROJECTS_WITH_ARCHIVE } from '~/graphql/queries/projects'

export function buildProjectSlug(slug: string, language: string): string {
  return language === 'EN' ? slug : `${slug}-${language.toLowerCase()}`
}

export function pickOtherProject<T extends { slug: string }>(projects: T[], currentSlug: string): T | null {
  const others = projects.filter(p => p.slug !== currentSlug)
  if (others.length === 0) {
    return null
  }
  const slugSum = currentSlug.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0)

  return others[slugSum % others.length]!
}

export const useWordPress = () => {
  const graphqlClient = async <T>(query: string, variables = {}): Promise<T> => {
    return await $fetch<T>('/api/graphql', {
      body: { query, variables },
      method: 'POST',
    }) as T
  }

  const getHomepage = async (language: string = 'EN') => {
    const data = await graphqlClient<HomepageResponse>(GET_HOMEPAGE, { language })

    return data.pageBy?.translation ?? null
  }

  const getPageBySlug = async (slug: string, language: string = 'EN') => {
    const data = await graphqlClient<PageResponse>(GET_PAGE_BY_SLUG, { language, slug })

    return data.pageBy?.translation ?? null
  }

  const getProjectBySlug = async (slug: string, language: string = 'EN') => {
    const actualSlug = buildProjectSlug(slug, language)

    const data = await graphqlClient<ProjectsResponse>(
      GET_PROJECT_BY_SLUG,
      { language, slug: actualSlug },
    )

    const project = data.projects?.nodes?.[0] ?? null

    // Pick a deterministic "other" project based on the current slug so the
    // selection is stable under ISR caching rather than frozen at render time.
    const otherProject = pickOtherProject(data.otherProjects?.nodes ?? [], actualSlug)

    return {
      otherProject,
      project,
    }
  }

  const getProjectsWithArchive = async (language: string = 'EN') => {
    const data = await graphqlClient<ProjectsWithArchiveResponse>(GET_PROJECTS_WITH_ARCHIVE, { language })

    return {
      archive: data.contentType ?? null,
      projects: data.projects?.nodes ?? [],
    }
  }

  return {
    getHomepage,
    getPageBySlug,
    getProjectBySlug,
    getProjectsWithArchive,
  }
}
