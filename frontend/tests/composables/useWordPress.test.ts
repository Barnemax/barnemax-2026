import { describe, expect, it } from 'vitest'
import { buildProjectSlug, pickOtherProject } from '../../src/composables/useWordPress'

describe('buildProjectSlug', () => {
  it('returns the slug unchanged for English', () => {
    expect(buildProjectSlug('my-project', 'EN')).toBe('my-project')
  })

  it('appends the lowercased language code for non-English', () => {
    expect(buildProjectSlug('my-project', 'FR')).toBe('my-project-fr')
  })

  it('lowercases the language suffix', () => {
    expect(buildProjectSlug('my-project', 'DE')).toBe('my-project-de')
  })
})

describe('pickOtherProject', () => {
  const projects = [
    { slug: 'alpha' },
    { slug: 'beta' },
    { slug: 'gamma' },
    { slug: 'delta' },
  ]

  it('returns null for an empty list', () => {
    expect(pickOtherProject([], 'alpha')).toBeNull()
  })

  it('returns null when the only project is the current one', () => {
    expect(pickOtherProject([{ slug: 'alpha' }], 'alpha')).toBeNull()
  })

  it('never returns the current project', () => {
    for (const current of projects) {
      const result = pickOtherProject(projects, current.slug)
      expect(result?.slug).not.toBe(current.slug)
    }
  })

  it('returns a deterministic result for the same slug', () => {
    const first = pickOtherProject(projects, 'alpha')
    const second = pickOtherProject(projects, 'alpha')
    expect(first).toEqual(second)
  })

  it('returns different projects for different slugs', () => {
    const results = new Set(projects.map(p => pickOtherProject(projects, p.slug)?.slug))
    // With 4 projects, different slugs should not all resolve to the same "other"
    expect(results.size).toBeGreaterThan(1)
  })
})
