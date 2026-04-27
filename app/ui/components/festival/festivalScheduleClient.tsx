'use client'
import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { FestivalEvent } from '@/app/lib/types'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import { formatLink } from '@/app/lib/utils/formatLink'
import styles from './festivalSchedule.module.css'
import FestivalCalendarView from './festivalCalendarView'
import WishlistButton from './wishlistButton'

type FilterItem = { name: string; slug: string; count?: number | null }

type Props = {
  events: FestivalEvent[]
  dates: FilterItem[]
  venues: FilterItem[]
  tags: FilterItem[]
  isMySchedule?: boolean
  emptyMessage?: React.ReactNode
  initialShowInPerson?: boolean
}

function formatTime(isoString: string, timezoneAbv?: string | null): string {
  try {
    const date = new Date(isoString)
    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `${displayHours}:${displayMinutes}${period}${timezoneAbv ? ` ${timezoneAbv}` : ' EST'}`
  } catch {
    return ''
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .trim()
}

export default function FestivalScheduleClient({
  events,
  dates,
  venues,
  tags,
  emptyMessage, initialShowInPerson
}: Props) {
  const [activeDateIndex, setActiveDateIndex] = useState(0)
  const [activeVenue, setActiveVenue] = useState<string | null>(null)
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [showInPerson, setShowInPerson] = useState(initialShowInPerson ?? false)
  const [showVirtual, setShowVirtual] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  console.log('FestivalScheduleClient rendering, events:', events.length)

  useEffect(() => {
    setActiveDateIndex(0)
  }, [events])

  // Sort dates chronologically
  const sortedDates = useMemo(() => {
    return [...dates].sort((a, b) => {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]
      const parseDate = (slug: string) => {
        const parts = slug.replace(/-\d{4}$/, '').split('-')
        const month = months.indexOf(
          parts[0].charAt(0).toUpperCase() + parts[0].slice(1),
        )
        const day = parseInt(parts[1])
        return month * 100 + day
      }
      return parseDate(a.slug) - parseDate(b.slug)
    })
  }, [dates])

  const activeDate = sortedDates[activeDateIndex]

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        if (
          activeDate &&
          !event.festivalDates?.nodes.some((d) => d.slug === activeDate?.slug)
        )
          return false
        if (
          activeVenue &&
          !event.festivalVenues?.nodes.some((v) => v.slug === activeVenue)
        )
          return false
        if (
          activeTags.length > 0 &&
          !activeTags.every((t) =>
            event.eventiveTags?.nodes.some((et) => et.slug === t),
          )
        )
          return false
        if (showInPerson && event.festivalEventAcf?.isVirtual) return false
        if (showVirtual && !event.festivalEventAcf?.isVirtual) return false
        return true
      })
      .sort((a, b) => {
        const aTime = a.festivalEventAcf?.startTime ?? ''
        const bTime = b.festivalEventAcf?.startTime ?? ''
        return aTime.localeCompare(bTime)
      })
  }, [events, activeDate, activeVenue, activeTags, showInPerson, showVirtual])

  function toggleTag(slug: string) {
    setActiveTags((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug],
    )
  }

  function clearFilters() {
    setActiveVenue(null)
    setActiveTags([])
    setShowInPerson(false)
    setShowVirtual(false)
  }

  const hasFilters =
    activeVenue || activeTags.length > 0 || showInPerson || showVirtual

  return (
    <div className={styles.wrapper}>
      {/* Top nav tabs */}
      <div className={styles.topNav}>
        <Link
          href={`/festival/festival-2025/schedule`}
          className={`${styles.topNavItem} ${styles.topNavItemActive}`}
        >
          Schedule
        </Link>
        <Link
          href={`/festival/festival-2025/film-guide`}
          className={styles.topNavItem}
        >
          Films A–Z
        </Link>
        <Link
          href={`/festival/festival-2025/event-guide`}
          className={styles.topNavItem}
        >
          Talks & Events
        </Link>
        <Link
          href={`/festival/festival-2025/my-schedule`}
          className={styles.topNavItem}
        >
          My Schedule
        </Link>
      </div>

      {/* Date navigation */}
      <div className={styles.dateNav}>
        <div className={styles.dateNavLeft}>
          <h1 className={styles.scheduleTitle}>SCHEDULE</h1>
        </div>
        <div className={styles.dateNavCenter}>
          <button
            className={styles.dateArrow}
            onClick={() => setActiveDateIndex((i) => Math.max(0, i - 1))}
            disabled={activeDateIndex === 0}
          >
            ←
          </button>
          <span className={styles.dateDisplay}>
            {activeDate?.name?.toUpperCase() ?? ''}
          </span>
          <button
            className={styles.dateArrow}
            onClick={() =>
              setActiveDateIndex((i) => Math.min(sortedDates.length - 1, i + 1))
            }
            disabled={activeDateIndex === sortedDates.length - 1}
          >
            →
          </button>
        </div>
        <div className={styles.dateNavRight}>
          <button
            className={`${styles.filterToggle} ${filtersOpen ? styles.filterToggleActive : ''}`}
            onClick={() => setFiltersOpen((f) => !f)}
          >
            {filtersOpen ? 'CLOSE' : 'FILTER'}
          </button>
          <div className={styles.personageToggle}>
            <button
              className={`${styles.personageBtn} ${showInPerson && !showVirtual ? styles.personageBtnActive : ''}`}
              onClick={() => {
                setShowInPerson(true)
                setShowVirtual(false)
              }}
            >
              IN PERSON
            </button>
            <button
              className={`${styles.personageBtn} ${showVirtual && !showInPerson ? styles.personageBtnActive : ''}`}
              onClick={() => {
                setShowVirtual(true)
                setShowInPerson(false)
              }}
            >
              VIRTUAL
            </button>
          </div>
          <button
            className={styles.filterToggle}
            onClick={() =>
              setViewMode((v) => (v === 'list' ? 'calendar' : 'list'))
            }
          >
            {`${viewMode === 'calendar' ? 'LIST' : 'CALENDAR'}`} VIEW
          </button>
        </div>
      </div>

      {/* Expandable filters */}
      {filtersOpen && (
        <div className={styles.filtersPanel}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Venue</span>
            <select
              className={styles.filterSelect}
              value={activeVenue ?? ''}
              onChange={(e) => setActiveVenue(e.target.value || null)}
            >
              <option value=''>All Venues</option>
              {venues.map((venue) => (
                <option key={venue.slug} value={venue.slug}>
                  {venue.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Tags</span>
            <div className={styles.tagOptions}>
              {tags.map((tag) => (
                <button
                  key={tag.slug}
                  className={`${styles.tagBtn} ${activeTags.includes(tag.slug) ? styles.tagBtnActive : ''}`}
                  onClick={() => toggleTag(tag.slug)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
          {hasFilters && (
            <button className={styles.clearBtn} onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Events list */}
      {viewMode === 'calendar' ? (
        <FestivalCalendarView events={filteredEvents} venues={venues} />
      ) : (
        <div className={styles.eventsList}>
          {filteredEvents.length === 0
            ? (emptyMessage ?? (
                <div className={styles.noResults}>
                  <p>No events found for the selected filters.</p>
                  <button className={styles.clearBtn} onClick={clearFilters}>
                    Clear Filters
                  </button>
                </div>
              ))
            : filteredEvents.map((event, i) => {
                const acf = event.festivalEventAcf
                const isFilm = event.eventiveTags?.nodes.some((t) =>
                  [
                    'feature-narrative',
                    'feature-documentary',
                    'short-narrative',
                    'short-documentary',
                    'experimental',
                    'shorts-program',
                    'shorts-programs',
                  ].includes(t.slug),
                )
                const eventType = isFilm ? 'FILM' : 'EVENT'

                return (
                  <div key={i} className={styles.eventRow}>
                    <div className={styles.eventLeft}>
                      {/* Tags row */}
                      <div className={styles.eventTags}>
                        <span className={styles.eventType}>({eventType})</span>
                        {event.premiereStatuses?.nodes.map((s, j) => (
                          <span key={j} className={styles.eventTag}>
                            ({s.name.toUpperCase()})
                          </span>
                        ))}
                        {event.festivalAwards?.nodes.map((a, j) => (
                          <span key={j} className={styles.eventTag}>
                            ({a.name.toUpperCase()})
                          </span>
                        ))}
                        {event.accessibilities?.nodes.map((a, j) => (
                          <span key={j} className={styles.eventTag}>
                            ({a.name.toUpperCase()})
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h2 className={styles.eventTitle}>
                        <Link
                          href={`/festival/events/${event.slug}`}
                          className={styles.eventTitleLink}
                        >
                          {event.title}
                        </Link>
                      </h2>

                      {/* Meta */}
                      <div className={styles.eventMeta}>
                        {event.eventiveTags?.nodes.slice(0, 2).map((t, j) => (
                          <span key={j}>{t.name}</span>
                        ))}
                        {acf?.startTime && acf.timezone && (
                          <span>
                            <span>
                              {activeDate?.name ??
                                event.festivalDates?.nodes[0]?.name}
                            </span>
                            ,{' '}
                            {acf?.startTime && (
                              <span>
                                {formatTime(acf.startTime, acf.timezoneAbv)}
                              </span>
                            )}
                          </span>
                        )}
                        {event.festivalVenues?.nodes[0] && (
                          <span>{event.festivalVenues.nodes[0].name}</span>
                        )}
                      </div>

                      {/* Excerpt */}
                      {event.excerpt && (
                        <p className={styles.eventExcerpt}>
                          {stripHtml(event.excerpt).slice(0, 200)}
                          {stripHtml(event.excerpt).length > 200 ? '...' : ''}
                        </p>
                      )}

                      {/* Actions */}
                      <div className={styles.eventActions}>
                        <Link
                          href={`/festival/events/${event.slug}`}
                          className={styles.actionBtn}
                        >
                          READ MORE
                        </Link>
                        {acf?.eventiveId && (
                          <WishlistButton eventiveId={acf.eventiveId} />
                        )}
                      </div>
                    </div>

                    {/* Image */}
                    {event.featuredImage?.node?.sourceUrl && (
                      <Link
                        href={`/festival/events/${event.slug}`}
                        className={styles.eventImageWrapper}
                      >
                        <Image
                          src={event.featuredImage.node.sourceUrl}
                          alt={
                            event.featuredImage.node.altText ??
                            event.title ??
                            ''
                          }
                          fill
                          sizes='(max-width: 768px) 100vw, 300px'
                          style={{ objectFit: 'cover' }}
                        />
                      </Link>
                    )}
                  </div>
                )
              })}
        </div>
      )}
    </div>
  )
}
