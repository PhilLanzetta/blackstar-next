'use client'
import Link from 'next/link'
import type { FestivalEvent } from '@/app/lib/types'
import styles from './festivalCalendarView.module.css'

type Props = {
  events: FestivalEvent[]
  venues: { name: string; slug: string }[]
}

const HOUR_START = 8 // 8am
const HOUR_END = 24 // midnight
const TOTAL_HOURS = HOUR_END - HOUR_START
const HOUR_WIDTH_PX = 200 // px per hour

function toMinutes(isoString: string): number {
  // Times are stored as local time with +00:00 suffix — read directly
  const date = new Date(isoString)
  return date.getUTCHours() * 60 + date.getUTCMinutes()
}

function formatHour(hour: number): string {
  if (hour === 0 || hour === 24) return '12AM'
  if (hour === 12) return '12PM'
  return hour < 12 ? `${hour}AM` : `${hour - 12}PM`
}

export default function FestivalCalendarView({ events, venues }: Props) {
  // Get unique venues that have events
  const venuesWithEvents = venues.filter((venue) =>
    events.some((e) =>
      e.festivalVenues?.nodes.some((v) => v.slug === venue.slug),
    ),
  )

  const hours = Array.from(
    { length: TOTAL_HOURS + 1 },
    (_, i) => HOUR_START + i,
  )
  const totalWidth = TOTAL_HOURS * HOUR_WIDTH_PX

  function getEventStyle(event: FestivalEvent): React.CSSProperties | null {
    const acf = event.festivalEventAcf
    if (!acf?.startTime || !acf?.timezone) return null

    const startMins = toMinutes(acf.startTime)
    const startHour = HOUR_START * 60
    const endHour = HOUR_END * 60

    if (startMins >= endHour || startMins < startHour) return null

    let durationMins = 60 // default 1 hour
    if (acf.endTime) {
      const endMins = toMinutes(acf.endTime)
      durationMins = Math.max(30, endMins - startMins)
    }

    const leftPx = ((startMins - startHour) / 60) * HOUR_WIDTH_PX
    const widthPx = (durationMins / 60) * HOUR_WIDTH_PX - 4

    return {
      left: `${leftPx}px`,
      width: `${widthPx}px`,
    }
  }

  function formatDuration(event: FestivalEvent): string {
    const acf = event.festivalEventAcf
    if (!acf?.startTime || !acf?.endTime || !acf?.timezone) return ''
    const startMins = toMinutes(acf.startTime)
    const endMins = toMinutes(acf.endTime)
    const diff = endMins - startMins
    if (diff <= 0) return ''
    const h = Math.floor(diff / 60)
    const m = diff % 60
    return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`
  }

  function formatStartTime(event: FestivalEvent): string {
    const acf = event.festivalEventAcf
    if (!acf?.startTime || !acf?.timezone) return ''
    try {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: acf.timezone,
        hour12: true,
      }).format(new Date(acf.startTime))
    } catch {
      return ''
    }
  }

  const isFilm = (event: FestivalEvent) =>
    event.eventiveTags?.nodes.some((t) =>
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.scroll}>
        <div style={{ width: `${totalWidth + 160}px` }}>
          {/* Header row with times */}
          <div className={styles.headerRow}>
            <div className={styles.venueCol} />
            <div
              className={styles.timelineHeader}
              style={{ width: `${totalWidth}px` }}
            >
              {hours.map((hour) => (
                <div
                  key={hour}
                  className={styles.hourLabel}
                  style={{ width: `${HOUR_WIDTH_PX}px` }}
                >
                  {formatHour(hour)}
                </div>
              ))}
            </div>
          </div>

          {/* Venue rows */}
          {venuesWithEvents.map((venue, vi) => {
            const venueEvents = events.filter((e) =>
              e.festivalVenues?.nodes.some((v) => v.slug === venue.slug),
            )

            return (
              <div
                key={venue.slug}
                className={`${styles.venueRow} ${vi % 2 === 1 ? styles.venueRowAlt : ''}`}
              >
                <div className={styles.venueCol}>
                  <span className={styles.venueName}>{venue.name}</span>
                </div>
                <div
                  className={styles.timeline}
                  style={{ width: `${totalWidth}px` }}
                >
                  {/* Hour grid lines */}
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className={styles.hourLine}
                      style={{
                        left: `${(hour - HOUR_START) * HOUR_WIDTH_PX}px`,
                      }}
                    />
                  ))}

                  {/* Events */}
                  {venueEvents.map((event, ei) => {
                    const style = getEventStyle(event)
                    if (!style) return null
                    const duration = formatDuration(event)
                    const startTime = formatStartTime(event)
                    const film = isFilm(event)

                    return (
                      <Link
                        key={ei}
                        href={`/festival/events/${event.slug}`}
                        className={styles.eventBlock}
                        style={style}
                        title={event.title ?? ''}
                      >
                        <div className={styles.eventBlockInner}>
                          <div className={styles.eventBlockMeta}>
                            {event.eventiveTags?.nodes[0] && (
                              <span className={styles.eventBlockTag}>
                                {event.eventiveTags.nodes[0].name}
                                {duration && `,  ${duration}`}
                              </span>
                            )}
                            <span className={styles.eventBlockType}>
                              {film ? 'Film' : 'Event'}
                            </span>
                          </div>
                          <div className={styles.eventBlockTitle}>
                            {event.title}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
