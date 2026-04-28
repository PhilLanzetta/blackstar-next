'use client'
// app/components/search/SearchFilters.tsx

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import styles from './search.module.css'
import type { SearchFilterType } from '@/app/lib/types'

export interface FilterTab {
  key: SearchFilterType
  label: string
}

export const FILTER_TABS: FilterTab[] = [
  { key: 'all', label: 'ALL' },
  { key: 'pages', label: 'PAGES' },
  { key: 'news', label: 'NEWS' },
  { key: 'festival', label: 'FESTIVAL' },
  { key: 'events', label: 'EVENTS' },
  { key: 'seen', label: 'SEEN' },
  { key: 'many-lumens', label: 'MANY LUMENS' },
]

interface Props {
  counts: Partial<Record<SearchFilterType, number>>
  total: number
  startTransition: (fn: () => void) => void
}

export default function SearchFilters({
  counts,
  total,
  startTransition,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeFilter = (searchParams.get('filter') ?? 'all') as SearchFilterType

  const setFilter = (key: SearchFilterType) => {
    const params = new URLSearchParams(searchParams.toString())
    if (key === 'all') {
      params.delete('filter')
    } else {
      params.set('filter', key)
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div
      className={styles.filters}
      role='tablist'
      aria-label='Filter search results'
    >
      {FILTER_TABS.map((tab) => {
        const count = tab.key === 'all' ? total : (counts[tab.key] ?? 0)
        const isActive = tab.key === activeFilter
        const isDisabled = tab.key !== 'all' && count === 0

        return (
          <button
            key={tab.key}
            role='tab'
            aria-selected={isActive}
            aria-disabled={isDisabled}
            disabled={isDisabled && !isActive}
            className={`${styles.filterTab} ${isActive ? styles.filterTabActive : ''} ${isDisabled ? styles.filterTabDisabled : ''}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
