import { z } from 'zod'

export const contactSchema = z.object({
  email: z.email(),
  message: z.string().min(10).max(5000),
  subject: z.string().min(1).max(200),
})

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
