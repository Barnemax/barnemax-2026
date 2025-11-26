export interface SeoOptions {
  fallbackTitle?: string
  seoData?: SeoFields
}

export interface OpenGraphMeta {
  description?: string
  image?: {
    secureUrl?: string
  }
  title?: string
  type?: string
}

export interface SeoFields {
  canonicalUrl?: string
  description?: string
  fullHead?: string
  openGraph?: OpenGraphMeta
  title?: string
}
