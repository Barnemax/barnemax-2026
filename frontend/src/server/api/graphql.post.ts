import { hash } from 'ohash'

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { query, variables } = event.context.parsedBody

  const response = await fetch(config.wpGraphqlUrl as string, {
    body: JSON.stringify({ query, variables }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })

  const text = await response.text()

  if (!response.ok || !text) {
    throw createError({
      message: `WP GraphQL ${response.status} ${response.statusText}`.trim(),
      statusCode: 502,
    })
  }

  const json = JSON.parse(text)

  if (json.errors) {
    throw createError({ message: json.errors[0].message, statusCode: 400 })
  }

  return json.data
}, {
  getKey: async (event) => {
    const body = await readBody(event)
    event.context.parsedBody = body

    return hash(body)
  },
  maxAge: 3600 * 12,
  shouldBypassCache: () => false,
})
