import { describe, expect, it } from 'vitest'
import { contactSchema, escapeHtml } from '../../src/server/utils/contact'

describe('escapeHtml', () => {
  it('escapes ampersands', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b')
  })

  it('escapes angle brackets', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;')
  })

  it('escapes double quotes', () => {
    expect(escapeHtml('"quoted"')).toBe('&quot;quoted&quot;')
  })

  it('escapes single quotes', () => {
    expect(escapeHtml('it\'s')).toBe('it&#039;s')
  })

  it('leaves plain text untouched', () => {
    expect(escapeHtml('Hello world')).toBe('Hello world')
  })

  it('handles multiple special chars in one string', () => {
    expect(escapeHtml('<b>a & "b"</b>')).toBe('&lt;b&gt;a &amp; &quot;b&quot;&lt;/b&gt;')
  })
})

describe('contactSchema', () => {
  const valid = {
    email: 'user@example.com',
    message: 'This is a valid message.',
    subject: 'Hello',
  }

  it('accepts valid input', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects invalid email', () => {
    expect(contactSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false)
  })

  it('rejects message shorter than 10 chars', () => {
    expect(contactSchema.safeParse({ ...valid, message: 'short' }).success).toBe(false)
  })

  it('rejects message longer than 5000 chars', () => {
    expect(contactSchema.safeParse({ ...valid, message: 'a'.repeat(5001) }).success).toBe(false)
  })

  it('rejects empty subject', () => {
    expect(contactSchema.safeParse({ ...valid, subject: '' }).success).toBe(false)
  })

  it('rejects subject longer than 200 chars', () => {
    expect(contactSchema.safeParse({ ...valid, subject: 'a'.repeat(201) }).success).toBe(false)
  })
})
