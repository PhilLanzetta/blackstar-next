// app/components/search/SearchResults.tsx
// Server component. Calls searchService directly — no HTTP round-trip.

import { runSearch } from '@/app/lib/searchService'
import SearchResultsClient from './searchResultsClient'

interface Props {
  query: string
}

export default async function SearchResults({ query }: Props) {
  let data

  try {
    data = await runSearch(query)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[SearchResults]', message)
    return (
      <p style={{ padding: '0 20px', opacity: 0.6 }}>
        Something went wrong. Please try again.
      </p>
    )
  }

  if (data.total === 0) {
    return (
      <p style={{ padding: '2rem 0', opacity: 0.6 }}>
        No results for <strong>"{query}"</strong>. Try different keywords.
      </p>
    )
  }

  return <SearchResultsClient results={data.results} total={data.total} />
}
