'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import styles from './festivalFilmPage.module.css'

type SocialProfiles = {
  instagram?: string | null
  twitter?: string | null
  facebook?: string | null
  website?: string | null
  youtube?: string | null
  linkedin?: string | null
}

type Director = {
  title: string
  content?: string | null
  featuredImage?: { node: { sourceUrl: string; altText: string } } | null
  biographyAcf?: {
    position?: string | null
    pronouns?: string | null
    socialProfiles?: SocialProfiles | null
  } | null
}

type EventNode = {
  title: string
  slug: string
  uri: string
  festivalEventAcf?: {
    startTime?: string | null
    endTime?: string | null
    timezoneAbv?: string | null
    isVirtual?: boolean | null
    ticketsAvailable?: boolean | null
    hideTicketsButton?: boolean | null
    eventiveId?: string | null
  } | null
  festivalVenues?: { nodes: { name: string; slug: string }[] } | null
  festivalDates?: { nodes: { name: string; slug: string }[] } | null
}

type Props = {
  film: {
    title: string
    slug: string
    uri: string
    content?: string | null
    featuredImage?: { node: { sourceUrl: string; altText: string } } | null
    premiereStatuses?: { nodes: { name: string; slug: string }[] } | null
    festivalAwards?: { nodes: { name: string; slug: string }[] } | null
    eventiveTags?: { nodes: { name: string; slug: string }[] } | null
    accessibilities?: {
      nodes: { name: string; slug: string; description?: string | null }[]
    } | null
    festivalFilmAcf?: {
      runtime?: string | null
      country?: string | null
      language?: string | null
      year?: string | null
      trailerUrl?: string | null
      triggerWarning?: string | null
      directorsSpotlightHeading?: string | null
      coverImage?: { node: { sourceUrl: string; altText: string } } | null
      stillImage?: { node: { sourceUrl: string; altText: string } } | null
      credits?: { type?: string | null; name?: string | null }[] | null
      directorsSpotlight?: { nodes: Director[] } | null
      events?: { nodes: EventNode[] } | null
    } | null
  }
}

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

function getAccessibilityLabel(slug: string): string {
  if (slug === 'closed-captioning') return 'CC'
  if (slug === 'open-captions') return 'OC'
  if (slug === 'audio-described') return 'AD'
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

function TrailerModal({ url, onClose }: { url: string; onClose: () => void }) {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&?/]+)/,
  )
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  const embedUrl = youtubeMatch
    ? `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`
    : vimeoMatch
      ? `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
      : url

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.modalClose}
          onClick={onClose}
          aria-label='Close'
        >
          ✕
        </button>
        <div className={styles.modalVideo}>
          <iframe
            src={embedUrl}
            allow='autoplay; fullscreen'
            allowFullScreen
            className={styles.modalIframe}
          />
        </div>
      </div>
    </div>
  )
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href.trim()}
      target='_blank'
      rel='noopener noreferrer'
      className={styles.socialLink}
      aria-label={label}
    >
      {children}
    </a>
  )
}

export default function FestivalFilmPage({ film }: Props) {
  const pathname = usePathname()
  const yearMatch = pathname.match(/\/festival(?:-\d{4})?\/(\d{4})\//)
  const festivalYear = yearMatch ? yearMatch[1] : '2025'

  const [showTrailer, setShowTrailer] = useState(false)
  const acf = film.festivalFilmAcf
  const coverImage =
    acf?.coverImage?.node ?? acf?.stillImage?.node ?? film.featuredImage?.node
  const inPersonEvents =
    acf?.events?.nodes.filter((e) => !e.festivalEventAcf?.isVirtual) ?? []
  const virtualEvents =
    acf?.events?.nodes.filter((e) => e.festivalEventAcf?.isVirtual) ?? []

  return (
    <div className={styles.wrapper}>
      {/* Top nav */}
      <div className={styles.topNav}>
        <Link
          href={`/festival/festival-${festivalYear}/schedule`}
          className={`${styles.topNavItem} ${pathname.includes('schedule') && !pathname.includes('my-schedule') ? styles.topNavItemActive : ''}`}
        >
          Schedule
        </Link>
        <Link
          href={`/festival/festival-${festivalYear}/film-guide`}
          className={`${styles.topNavItem} ${pathname.includes('film-guide') || pathname.includes('/films/') ? styles.topNavItemActive : ''}`}
        >
          Films A–Z
        </Link>
        <Link
          href={`/festival/festival-${festivalYear}/event-guide`}
          className={`${styles.topNavItem} ${pathname.includes('event-guide') || pathname.includes('/events/') ? styles.topNavItemActive : ''}`}
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

      {/* Back + header */}
      <div className={styles.backBar}>
        <Link
          href={`/festival/festival-${festivalYear}/film-guide`}
          className={styles.backLink}
        >
          ← Back to Films A–Z
        </Link>
      </div>

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.tags}>
            {film.eventiveTags?.nodes.map((t, i) => (
              <span key={i} className={styles.tag}>
                {t.name}
              </span>
            ))}
            {film.premiereStatuses?.nodes.map((s, i) => (
              <span key={i} className={styles.tag}>
                ({s.name} Premiere)
              </span>
            ))}
            {film.festivalAwards?.nodes.map((a, i) => (
              <span key={i} className={styles.tag}>
                ({a.name})
              </span>
            ))}
          </div>
          <h1 className={styles.title}>{film.title}</h1>
          <div className={styles.headerIcons}>
            {acf?.triggerWarning && (
              <Tooltip label='!' tooltip={`TW: ${acf.triggerWarning}`} />
            )}
            {film.accessibilities?.nodes.map((a, i) => (
              <Tooltip
                key={i}
                label={getAccessibilityLabel(a.slug)}
                tooltip={a.description ?? a.name}
              />
            ))}
          </div>
        </div>
        <div className={styles.headerRight}>
          <Link href='#screenings' className={styles.screeningsBtn}>
            Screenings
          </Link>
        </div>
      </div>

      {/* Cover image with trailer button */}
      {coverImage?.sourceUrl && (
        <div
          className={`${styles.coverImage} ${acf?.trailerUrl ? styles.coverImageClickable : ''}`}
          onClick={acf?.trailerUrl ? () => setShowTrailer(true) : undefined}
          role={acf?.trailerUrl ? 'button' : undefined}
          aria-label={acf?.trailerUrl ? 'Play trailer' : undefined}
        >
          <Image
            src={coverImage.sourceUrl}
            alt={coverImage.altText ?? film.title ?? ''}
            fill
            sizes='100vw'
            style={{ objectFit: 'cover' }}
            priority
          />
          {acf?.trailerUrl && (
            <div className={styles.trailerOverlay}>
              <div className={styles.trailerBtn}>
                <svg
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  width='32'
                  height='32'
                >
                  <path d='M8 5v14l11-7z' />
                </svg>
                Play Trailer
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main content */}
      <div className={styles.mainContent}>
        {/* Left: content */}
        <div className={styles.contentCol}>
          {film.content && (
            <div
              className={styles.prose}
              dangerouslySetInnerHTML={{ __html: cleanHtml(film.content) }}
            />
          )}
        </div>

        {/* Right: screenings */}
        <div className={styles.screeningsCol}>
          <div id='screenings' className={styles.screeningsAnchor} />
          <div className={styles.screeningsBox}>
            <h2 className={styles.screeningsHeading}>Screenings</h2>

            {inPersonEvents.length > 0 && (
              <div className={styles.instanceGroup}>
                <h3 className={styles.instanceGroupLabel}>In Person</h3>
                {inPersonEvents.map((event, i) => {
                  const eacf = event.festivalEventAcf
                  return (
                    <div key={i} className={styles.instance}>
                      <Link href={event.uri} className={styles.instanceLink}>
                        <div className={styles.instanceMeta}>
                          {event.festivalDates?.nodes[0] && (
                            <span className={styles.instanceDate}>
                              {event.festivalDates.nodes[0].name}
                            </span>
                          )}
                          {eacf?.startTime && (
                            <span className={styles.instanceTime}>
                              {formatTime(eacf.startTime, eacf.timezoneAbv)}
                            </span>
                          )}
                          {event.festivalVenues?.nodes[0] && (
                            <span className={styles.instanceVenue}>
                              {event.festivalVenues.nodes[0].name}
                            </span>
                          )}
                        </div>
                      </Link>
                      {eacf?.eventiveId &&
                        eacf.ticketsAvailable &&
                        !eacf.hideTicketsButton && (
                          <div
                            className='eventive-button'
                            data-event={eacf.eventiveId}
                            data-universal='true'
                          />
                        )}
                    </div>
                  )
                })}
              </div>
            )}

            {virtualEvents.length > 0 && (
              <div className={styles.instanceGroup}>
                <h3 className={styles.instanceGroupLabel}>Virtual</h3>
                {virtualEvents.map((event, i) => {
                  const eacf = event.festivalEventAcf
                  return (
                    <div key={i} className={styles.instance}>
                      <div className={styles.instanceMeta}>
                        {event.festivalDates?.nodes[0] && (
                          <span className={styles.instanceDate}>
                            {event.festivalDates.nodes[0].name}
                            {event.festivalDates.nodes.length > 1 &&
                              ` – ${event.festivalDates.nodes[event.festivalDates.nodes.length - 1].name}`}
                          </span>
                        )}
                      </div>
                      {eacf?.eventiveId &&
                        eacf.ticketsAvailable &&
                        !eacf.hideTicketsButton && (
                          <div
                            className='eventive-button'
                            data-event={eacf.eventiveId}
                            data-universal='true'
                          />
                        )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Directors Spotlight */}
      {acf?.directorsSpotlight?.nodes &&
        acf.directorsSpotlight.nodes.length > 0 && (
          <div className={styles.spotlight}>
            <h2 className={styles.spotlightHeading}>
              {acf.directorsSpotlightHeading ?? 'Directors Spotlight'}
            </h2>
            <div className={styles.spotlightGrid}>
              {acf.directorsSpotlight.nodes.map((director, i) => {
                const s = director.biographyAcf?.socialProfiles
                return (
                  <div key={i} className={styles.directorCard}>
                    {director.featuredImage?.node?.sourceUrl && (
                      <div className={styles.directorImage}>
                        <Image
                          src={director.featuredImage.node.sourceUrl}
                          alt={
                            director.featuredImage.node.altText ??
                            director.title
                          }
                          fill
                          sizes='(max-width: 768px) 100vw, 300px'
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div className={styles.directorContent}>
                      <h3 className={styles.directorName}>{director.title}</h3>
                      {director.biographyAcf?.position && (
                        <p className={styles.directorRole}>
                          {director.biographyAcf.position}
                        </p>
                      )}
                      {director.content && (
                        <div
                          className={styles.directorBio}
                          dangerouslySetInnerHTML={{
                            __html: cleanHtml(director.content),
                          }}
                        />
                      )}
                      {s &&
                        (s.instagram ||
                          s.twitter ||
                          s.facebook ||
                          s.website ||
                          s.youtube ||
                          s.linkedin) && (
                          <div className={styles.socialLinks}>
                            {s.instagram && (
                              <SocialIcon href={s.instagram} label='Instagram'>
                                Instagram
                              </SocialIcon>
                            )}
                            {s.twitter && (
                              <SocialIcon href={s.twitter} label='X'>
                                X
                              </SocialIcon>
                            )}
                            {s.facebook && (
                              <SocialIcon href={s.facebook} label='Facebook'>
                                Facebook
                              </SocialIcon>
                            )}
                            {s.website && (
                              <SocialIcon href={s.website} label='Website'>
                                Website
                              </SocialIcon>
                            )}
                            {s.youtube && (
                              <SocialIcon href={s.youtube} label='YouTube'>
                                YouTube
                              </SocialIcon>
                            )}
                            {s.linkedin && (
                              <SocialIcon href={s.linkedin} label='LinkedIn'>
                                LinkedIn
                              </SocialIcon>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      {/* Film details */}
      <div className={styles.details}>
        <dl className={styles.detailsList}>
          {acf?.year && (
            <>
              <dt>Year</dt>
              <dd>{acf.year}</dd>
            </>
          )}
          {acf?.runtime && (
            <>
              <dt>Runtime</dt>
              <dd>{acf.runtime} minutes</dd>
            </>
          )}
          {acf?.country && (
            <>
              <dt>Country</dt>
              <dd>{acf.country}</dd>
            </>
          )}
          {acf?.language && (
            <>
              <dt>Language</dt>
              <dd>{acf.language}</dd>
            </>
          )}
          {acf?.credits?.map((credit, i) =>
            credit.type && credit.name ? (
              <>
                <dt key={`dt-${i}`}>{credit.type}</dt>
                <dd key={`dd-${i}`}>{credit.name}</dd>
              </>
            ) : null,
          )}
          {film.premiereStatuses?.nodes.map((s, i) => (
            <>
              <dt key={`pt-${i}`}>Premiere</dt>
              <dd key={`pd-${i}`}>{s.name}</dd>
            </>
          ))}
        </dl>
      </div>

      {/* Trailer modal */}
      {showTrailer && acf?.trailerUrl && (
        <TrailerModal
          url={acf.trailerUrl}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  )
}
