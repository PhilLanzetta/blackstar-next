// app/search/page.tsx

import { Suspense } from 'react'
import type { Metadata } from 'next'
import SearchInput from '@/app/ui/components/search/searchInput'
import SearchResults from '@/app/ui/components/search/searchResults'
import styles from '@/app/ui/components/search/search.module.css'

interface Props {
  // Next.js 15 — searchParams is a Promise
  searchParams: Promise<{ q?: string; filter?: string }>
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { q } = await searchParams
  const query = q?.trim() ?? ''
  return {
    title: query
      ? `"${query}" — Search · BlackStar Film Festival`
      : 'Search · BlackStar Film Festival',
    robots: { index: false },
  }
}

// ─── Skeleton shown while the Suspense boundary resolves ─────────────────────

function ResultsSkeleton() {
  return (
    <div className={styles.skeleton}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonMeta} />
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonExcerpt} />
        </div>
      ))}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  return (
    <main className={styles.page} id='main'>
      <div className={styles.header}>
        <h1 className={styles.heading}>SEARCH</h1>
        <SearchInput initialValue={query} />
      </div>

      <div className={styles.body}>
        {query.length >= 2 ? (
          // key={query} forces Suspense to remount + show skeleton on new searches
          <Suspense key={query} fallback={<ResultsSkeleton />}>
            <SearchResults query={query} />
          </Suspense>
        ) : (
          <p className={styles.prompt}>Enter a keyword above to search.</p>
        )}
      </div>
    </main>
  )
}
