'use client'
// app/components/search/SearchResultsClient.tsx

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense, useTransition, useState } from 'react'
import styles from './search.module.css'
import cardStyles from '@/app/ui/components/postCard.module.css'
import SearchFilters from './searchFilters'
import type { SearchResult, SearchFilterType } from '@/app/lib/types'
import LinkButton from '../linkButton'

// ─── Card ────────────────────────────────────────────────────────────────────

function SearchResultCard({ result }: { result: SearchResult }) {
  return (
    <article className={cardStyles.card}>
      {/* Image — 16:9 ratio via .imageWrapper */}
      <div className={cardStyles.imageWrapper}>
        {result.image ? (
          <Image
            src={result.image.sourceUrl}
            alt={result.image.altText || result.title}
            fill
            sizes='(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 25vw'
            style={{ objectFit: 'cover' }}
          />
        ) : (
          // Empty placeholder keeps the 16:9 box when there's no image
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'var(--color-surface, #f0f0f0)',
            }}
          />
        )}
      </div>

      {/* Metadata line: (TYPE) · META — matches .info pattern in your other cards */}
      <div className={cardStyles.info}>
        {result.typeLabel && <span>({result.typeLabel})</span>}
        {result.meta && <span>{result.meta}</span>}
      </div>

      {/* Title + excerpt */}
      <div className={cardStyles.textInfo}>
        <p className={cardStyles.title}>{result.title}</p>
        {result.excerpt && (
          <div
            className={cardStyles.excerpt}
            dangerouslySetInnerHTML={{ __html: result.excerpt }}
          ></div>
        )}
      </div>

      {/* CTA */}
      <div className={cardStyles.learnMore}>
        <LinkButton href={result.uri} label='Learn More'></LinkButton>
      </div>
    </article>
  )
}

// ─── Filtered grid — reads ?filter= from URL ─────────────────────────────────

function FilteredGrid({ results }: { results: SearchResult[] }) {
  const searchParams = useSearchParams()
  const activeFilter = (searchParams.get('filter') ?? 'all') as SearchFilterType

  const filtered =
    activeFilter === 'all'
      ? results
      : results.filter((r) => r.filterKey === activeFilter)

  if (filtered.length === 0) {
    return <p className={styles.noResults}>No results in this category.</p>
  }

  return (
    <div className={styles.grid}>
      {filtered.map((result) => (
        <SearchResultCard key={result.id} result={result} />
      ))}
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

interface Props {
  results: SearchResult[]
  total: number
}

export default function SearchResultsClient({ results, total }: Props) {
  const counts: Partial<Record<SearchFilterType, number>> = {}
  for (const r of results) {
    counts[r.filterKey] = (counts[r.filterKey] ?? 0) + 1
  }
  const [isPending, startTransition] = useTransition()

  return (
    <>
      <SearchFilters
        counts={counts}
        total={total}
        startTransition={startTransition}
      />
      {/* Suspense needed because FilteredGrid calls useSearchParams() */}
      <Suspense>
        <FilteredGrid results={results} />
      </Suspense>
    </>
  )
}
