const wpFields = `
  content
  date
  excerpt
  id
  slug
  title
`
const taxonomyFields = `
terms: projectTypes {
    nodes {
      id
      name
      slug
    }
  }
`

const acfFields = `
  projectFields {
    collaboration {
      target
      title
      url
    }
    designer {
      target
      title
      url
    }
    projectScreenshots {
      ... on ProjectFieldsProjectScreenshotsProjectScreenLayout {
        imageTitle
        projectImage {
          node {
            altText
            mediaDetails {
              height
              sizes {
                height
                name
                sourceUrl
                width
              }
              width
            }
            sourceUrl
          }
        }
      }
    }
    siteUrl
    githubUrl
    year
  }
`

const seoFields = `
  seo {
    canonicalUrl
    description
    openGraph {
      description
      image {
        secureUrl
      }
      title
      url
    }
    title
  }
`

export const GET_PROJECTS_WITH_ARCHIVE = `
  query GetProjectsWithArchive($language: LanguageCodeFilterEnum!) {
    projects(first: 20, where: { language: $language }) {
      nodes {
        ${wpFields}
        ${taxonomyFields}
        ${acfFields}
        ${seoFields}
      }
    }
    contentType(id: "project", idType: NAME) {
      label
      name
      seo {
        description
        fullHead
        title
      }
    }
  }
`

export const GET_PROJECT_BY_SLUG = `
  query GetProjectBySlug($slug: String!, $language: LanguageCodeFilterEnum!) {
    projects(where: { name: $slug, language: $language }, first: 1) {
      nodes {
        ${wpFields}
        ${taxonomyFields}
        ${acfFields}
        ${seoFields}
      }
    }
    otherProjects: projects(where: { language: $language }, first: 5) {
      nodes {
        slug
        title
      }
    }
  }
`
