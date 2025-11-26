import { GET_HOMEPAGE } from '../../graphql/queries/pages'
import { GET_PROJECTS_WITH_ARCHIVE } from '../../graphql/queries/projects'

export default defineNitroPlugin(async () => {
  const warmupQueries = [
    { query: GET_HOMEPAGE, variables: { language: 'EN' } },
    { query: GET_HOMEPAGE, variables: { language: 'FR' } },
    { query: GET_PROJECTS_WITH_ARCHIVE, variables: { language: 'EN' } },
    { query: GET_PROJECTS_WITH_ARCHIVE, variables: { language: 'FR' } },
  ]

  await Promise.all(
    warmupQueries.map(body =>
      $fetch('/api/graphql', { method: 'POST', body }).catch(() => {}),
    ),
  )
})
