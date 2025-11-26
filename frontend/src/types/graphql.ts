import type { SeoFields } from './seo'
import type { DefaultWPStructure, Homepage, Project } from './wordpress'

export interface PageResponse {
  pageBy: {
    translation: DefaultWPStructure
  }
}

export interface HomepageResponse {
  pageBy: {
    translation: Homepage
  }
}

export interface ProjectsResponse {
  otherProjects?: {
    nodes: {
      slug: string
      title: string
    }[]
  }
  projects: {
    nodes: Project[]
  }
}

export interface ProjectsWithArchiveResponse {
  contentType: {
    label: string
    name: string
    seo: SeoFields
  }
  projects: {
    nodes: Project[]
  }
}
