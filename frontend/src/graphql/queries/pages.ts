const wpFields = `
  content
  id
  title
`
const acfFields = `
  homepage {
    about {
      contentAbout
      linksAbout {
        ... on HomepageAboutLinksAboutLinkLayoutLayout {
          linkLinksAbout {
            target
            title
            url
          }
        }
      }
    }
    experience {
      contentExperience
      linksExperience {
        ... on HomepageExperienceLinksExperienceLinkLayoutLayout {
          linkLinksExperience {
            target
            title
            url
          }
        }
      }
    }
    introduction {
      contentIntroduction
      linksIntroduction {
        ... on HomepageIntroductionLinksIntroductionLinkLayoutLayout {
          linkLinksIntroduction {
            target
            title
            url
          }
        }
      }
    }
    summary {
      ... on HomepageSummaryColumnLayout {
        columnTitle
        links {
          ... on HomepageSummaryLinksLinkLayoutLayout {
            link {
              target
              title
              url
            }
          }
        }
        summaryItem {
          ... on HomepageSummarySummaryItemSummaryItemLayout {
            label
            value
          }
        }
      }
    }
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

export const GET_HOMEPAGE = `
  query GetHomepage($language: LanguageCodeEnum!) {
    pageBy(uri: "/") {
      translation(language: $language) {
        ${wpFields}
        language {
          code
        }
        ${acfFields}
        ${seoFields}
      }
    }
  }
`

export const GET_PAGE_BY_SLUG = `
  query GetPageBySlug($slug: String!, $language: LanguageCodeEnum!) {
    pageBy(uri: $slug) {
      translation(language: $language) {
        ${wpFields}
        language {
          code
        }
        ${seoFields}
      }
    }
  }
`
