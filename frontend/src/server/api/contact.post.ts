import { contactSchema, escapeHtml } from '../utils/contact'

export default defineEventHandler(async (event) => {
  const { token, ...contactData } = await readBody(event)
  const config = useRuntimeConfig()

  if (!token) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Token not provided.',
    })
  }

  const turnstileResult = await verifyTurnstileToken(token)
  if (!turnstileResult.success) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid token.',
    })
  }

  const result = contactSchema.safeParse(contactData)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input',
    })
  }

  const { email, subject, message } = result.data

  const sanitizedEmail = escapeHtml(email)
  const sanitizedSubject = escapeHtml(subject)
  const sanitizedMessage = escapeHtml(message)

  const mailArgs = {
    htmlContent: `<html><head></head><body><p>From: ${sanitizedEmail}</p><p>Subject: ${sanitizedSubject}</p><p>Message:</p><p>${sanitizedMessage}</p></body></html>`,
    sender: {
      email: config.mailReceiver,
      name: 'barnemax Portfolio',
    },
    subject: `barnemax Portfolio | ${sanitizedSubject}`,
    to: [{ email: config.mailReceiver }],
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    body: JSON.stringify(mailArgs),
    headers: {
      'accept': 'application/json',
      'api-key': config.brevoApiKey as string,
      'content-type': 'application/json',
    },
    method: 'POST',
  })

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: 'Failed to send email',
    })
  }

  return { success: true }
})
