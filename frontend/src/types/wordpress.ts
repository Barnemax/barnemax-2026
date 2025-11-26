import type { SeoFields } from './seo'

export interface ProjectLanguage {
  code: string
}

export interface ProjectTranslation {
  id: string
  language: ProjectLanguage
  slug: string
}

export interface DefaultWPStructure {
  content: string
  date: string
  excerpt?: string
  id: string
  seo?: SeoFields
  slug: string
  title: string
}

export interface SummaryItem {
  label: string
  value: string
}

export interface SummaryColumn {
  columnTitle: string
  links: Array<{
    link: AcfLink
  }>
  summaryItem: SummaryItem[]
}

export interface Homepage extends DefaultWPStructure {
  homepage: {
    about: {
      contentAbout: string
      linksAbout: Array<{
        linkLinksAbout: AcfLink
      }>
    }
    experience: {
      contentExperience: string
      linksExperience: Array<{
        linkLinksExperience: AcfLink
      }>
    }
    introduction: {
      contentIntroduction: string
      linksIntroduction: Array<{
        linkLinksIntroduction: AcfLink
      }>
    }
    summary: SummaryColumn[]
  }
}

export interface Term {
  id: string
  name: string
}

export interface Project extends DefaultWPStructure {
  excerpt: string
  projectFields: {
    collaboration?: AcfLink
    designer?: AcfLink
    projectScreenshots?:
    Array<{
      imageTitle: string
      projectImage: AcfImage
    }>
    siteUrl?: string
    year: string
  }
  terms?: {
    nodes: Term[]
  }
  translations?: ProjectTranslation[]
}

export interface AcfLink {
  target: string
  title: string
  url: string
}

export interface AcfImage {
  node: {
    altText: string
    mediaDetails: {
      height: number
      sizes: Array<{
        height: number
        name: string
        sourceUrl: string
        width: number
      }>
      width: number
    }
    sourceUrl: string
  }
}
