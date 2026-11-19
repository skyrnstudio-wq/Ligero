import { createClient, type QueryParams } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Read directly from Sanity Content Lake on the server; Next.js ISR/tags handle edge caching
  perspective: 'published',
})

export async function sanityFetch<T = any, const QueryString extends string = string>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: QueryString
  params?: QueryParams
  revalidate?: number | false
  tags?: string[]
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate,
      tags,
    },
  })
}
