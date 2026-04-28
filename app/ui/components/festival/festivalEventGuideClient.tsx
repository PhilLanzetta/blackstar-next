'use client'
import { useState, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { FestivalEvent } from '@/app/lib/types'
import WishlistButton from './wishlistButton'
import styles from './festivalEventGuide.module.css'

type FilterItem = { name: string; slug: string; count?: number | null }

type Props = {
  events: FestivalEvent[]
  tags: FilterItem[]
}

const PAGE_SIZE = 12

function formatTime(isoString: string, timezoneAbv?: string | null): string {
  try {
    const date = new Date(isoString)
    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `${displayHours}:${displayMinutes}${period}${timezoneAbv ? ` ${timezoneAbv}` : ''}`
  } catch {
    return ''
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&hellip;/g, '...')
    .trim()
}

function getAccessibilityLabel(slug: string): string {
  if (slug === 'closed-captioning') return 'CC'
  if (slug === 'open-captions') return 'OC'
  if (slug === 'audio-described') return 'AD'
  if (slug === 'asl-interpretation') return 'ASL'
  return slug.substring(0, 2).toUpperCase()
}

function Tooltip({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipIcon}>{label}</div>
      <div className={styles.tooltipText}>{tooltip}</div>
    </div>
  )
}

export default function FestivalEventGuideClient({ events, tags }: Props) {
  const pathname = usePathname()
  const yearMatch = pathname.match(/festival-(\d{4})/)
  const festivalYear = yearMatch ? yearMatch[1] : '2025'

  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        if (
          activeTag &&
          !event.eventiveTags?.nodes.some((t) => t.slug === activeTag)
        )
          return false
        if (
          search &&
          !event.title?.toLowerCase().includes(search.toLowerCase())
        )
          return false
        return true
      })
      .sort((a, b) => {
        const aTime = a.festivalEventAcf?.startTime ?? ''
        const bTime = b.festivalEventAcf?.startTime ?? ''
        return aTime.localeCompare(bTime)
      })
  }, [events, activeTag, search])

  const paginated = filteredEvents.slice(0, page * PAGE_SIZE)
  const hasMore = paginated.length < filteredEvents.length

  return (
    <div className={styles.wrapper}>
      {/* Top nav */}
      <div className={styles.topNav}>
        <Link
          href={`/festival/festival-${festivalYear}/schedule`}
          className={`${styles.topNavItem} ${pathname.includes('schedule') ? styles.topNavItemActive : ''}`}
        >
          Schedule
        </Link>
        <Link
          href={`/festival/festival-${festivalYear}/film-guide`}
          className={`${styles.topNavItem} ${pathname.includes('film-guide') ? styles.topNavItemActive : ''}`}
        >
          Films A–Z
        </Link>
        <Link
          href={`/festival/festival-${festivalYear}/event-guide`}
          className={`${styles.topNavItem} ${pathname.includes('event-guide') ? styles.topNavItemActive : ''}`}
        >
          Talks & Events
        </Link>
        <Link
          href={`/festival/festival-${festivalYear}/my-schedule`}
          className={`${styles.topNavItem} ${pathname.includes('my-schedule') ? styles.topNavItemActive : ''}`}
        >
          My Schedule
        </Link>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>TALKS AND EVENTS</h1>
        <div className={styles.headerRight}>
          <input
            className={styles.searchInput}
            type='text'
            placeholder='Search events...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
          <button
            className={`${styles.filterToggle} ${filtersOpen ? styles.filterToggleActive : ''}`}
            onClick={() => setFiltersOpen((f) => !f)}
          >
            {filtersOpen ? 'CLOSE' : 'FILTER'}
          </button>
        </div>
      </div>

      {/* Filters */}
      {filtersOpen && (
        <div className={styles.filtersPanel}>
          <div className={styles.tagOptions}>
            <button
              className={`${styles.tagBtn} ${!activeTag ? styles.tagBtnActive : ''}`}
              onClick={() => {
                setActiveTag(null)
                setPage(1)
              }}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag.slug}
                className={`${styles.tagBtn} ${activeTag === tag.slug ? styles.tagBtnActive : ''}`}
                onClick={() => {
                  setActiveTag(tag.slug === activeTag ? null : tag.slug)
                  setPage(1)
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className={styles.resultsCount}>
        {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      <div className={styles.grid}>
        {paginated.map((event, i) => {
          const acf = event.festivalEventAcf
          const excerpt = event.excerpt ? stripHtml(event.excerpt) : null

          return (
            <div key={i} className={styles.card}>
              {/* Image */}
              <Link href={event.uri} className={styles.cardImageLink}>
                <div className={styles.cardImage}>
                  {event.featuredImage?.node?.sourceUrl ? (
                    <Image
                      src={event.featuredImage.node.sourceUrl}
                      alt={
                        event.featuredImage.node.altText ?? event.title ?? ''
                      }
                      fill
                      sizes='(max-width: 768px) 50vw, 25vw'
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className={styles.cardImagePlaceholder} />
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className={styles.cardContent}>
                {/* Tags */}
                <div className={styles.cardTags}>
                  {event.eventiveTags?.nodes.map((t, j) => (
                    <span key={j} className={styles.cardTag}>
                      ({t.name.toUpperCase()})
                    </span>
                  ))}
                </div>

                <Link href={event.uri} className={styles.cardTitleLink}>
                  <h2 className={styles.cardTitle}>{event.title}</h2>
                </Link>

                <div className={styles.cardMeta}>
                  {acf?.startTime && (
                    <span>
                      {event.festivalDates?.nodes[0]?.name},{' '}
                      {formatTime(acf.startTime, acf.timezoneAbv)}
                    </span>
                  )}
                  {event.festivalVenues?.nodes[0] && (
                    <span>{event.festivalVenues.nodes[0].name}</span>
                  )}
                </div>

                {excerpt && (
                  <p className={styles.cardExcerpt}>
                    {excerpt.slice(0, 150)}
                    {excerpt.length > 150 ? '...' : ''}
                  </p>
                )}

                {/* Accessibility icons */}
                {event.accessibilities &&
                  event.accessibilities.nodes.length > 0 && (
                    <div className={styles.cardIcons}>
                      {event.accessibilities.nodes.map((a, j) => (
                        <Tooltip
                          key={j}
                          label={getAccessibilityLabel(a.slug)}
                          tooltip={a.description ?? a.name}
                        />
                      ))}
                    </div>
                  )}

                {/* Actions */}
                <div className={styles.cardActions}>
                  <Link href={event.uri} className={styles.actionBtn}>
                    Learn More
                  </Link>
                  {acf?.eventiveId && (
                    <WishlistButton eventiveId={acf.eventiveId} />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className={styles.loadMore}>
          <button
            className={styles.loadMoreBtn}
            onClick={() => setPage((p) => p + 1)}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}
