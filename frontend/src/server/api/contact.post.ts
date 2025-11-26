// Simple HTML escape for email content
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export default defineEventHandler(async (event) => {
  const { email, subject, message } = await readBody(event)
  const config = useRuntimeConfig()

  if (!email || !subject || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    })
  }

  // Escape user input to prevent HTML injection
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
      'api-key': config.brevoApiKey,
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
