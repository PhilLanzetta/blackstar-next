'use client'
import { useState, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { FestivalFilm } from '@/app/lib/types'
import styles from './festivalFilmGuide.module.css'

type FilterItem = { name: string; slug: string; count?: number | null }

type Props = {
  films: FestivalFilm[]
  tags: FilterItem[]
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

export default function FestivalFilmGuideClient({ films, tags }: Props) {
  const pathname = usePathname()
  const yearMatch = pathname.match(/festival-(\d{4})/)
  const festivalYear = yearMatch ? yearMatch[1] : '2025'

  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null)

  const filteredFilms = useMemo(() => {
    return films
      .filter((film) => {
        if (
          activeTag &&
          !film.eventiveTags?.nodes.some((t) => t.slug === activeTag)
        )
          return false
        if (search && !film.title?.toLowerCase().includes(search.toLowerCase()))
          return false
        return true
      })
      .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
  }, [films, activeTag, search])

  const director = (film: FestivalFilm) =>
    film.festivalFilmAcf?.credits?.find((c) => c.type === 'Director')?.name

  const getAccessibilityLabel = (slug: string) => {
    if (slug === 'closed-captioning') return 'CC'
    if (slug === 'open-captions') return 'OC'
    if (slug === 'audio-described') return 'AD'
    return slug.substring(0, 2).toUpperCase()
  }

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
        <h1 className={styles.title}>FILMS A–Z</h1>
        <div className={styles.headerRight}>
          <input
            className={styles.searchInput}
            type='text'
            placeholder='Search films...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
              onClick={() => setActiveTag(null)}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag.slug}
                className={`${styles.tagBtn} ${activeTag === tag.slug ? styles.tagBtnActive : ''}`}
                onClick={() =>
                  setActiveTag(tag.slug === activeTag ? null : tag.slug)
                }
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className={styles.resultsCount}>
        {filteredFilms.length} film{filteredFilms.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      <div className={styles.grid}>
        {filteredFilms.map((film, i) => (
          <div key={i} className={styles.card}>
            {/* Image */}
            <Link href={film.uri} className={styles.cardImageLink}>
              <div className={styles.cardImage}>
                {film.featuredImage?.node?.sourceUrl ? (
                  <Image
                    src={film.featuredImage.node.sourceUrl}
                    alt={film.featuredImage.node.altText ?? film.title ?? ''}
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
              <div className={styles.cardTags}>
                {film.premiereStatuses?.nodes.map((s, j) => (
                  <span key={j} className={styles.cardTag}>
                    ({s.name} Premiere)
                  </span>
                ))}
                {film.festivalAwards?.nodes.map((a, j) => (
                  <span key={j} className={styles.cardTag}>
                    ({a.name})
                  </span>
                ))}
              </div>

              <Link href={film.uri} className={styles.cardTitleLink}>
                <h2 className={styles.cardTitle}>{film.title}</h2>
              </Link>

              <div className={styles.cardMeta}>
                {film.eventiveTags?.nodes[0] && (
                  <span>{film.eventiveTags.nodes[0].name}</span>
                )}
                {director(film) && <span>Dir. by {director(film)}</span>}
                {film.festivalFilmAcf?.country && (
                  <span>{film.festivalFilmAcf.country}</span>
                )}
                {film.festivalFilmAcf?.runtime && (
                  <span>Runtime: {film.festivalFilmAcf.runtime} minutes</span>
                )}
              </div>

              {/* Accessibility + trigger warning icons */}
              <div className={styles.cardIcons}>
                {film.festivalFilmAcf?.triggerWarning && (
                  <Tooltip
                    label='!'
                    tooltip={`TW: ${film.festivalFilmAcf.triggerWarning}`}
                  />
                )}
                {film.accessibilities?.nodes.map((a, j) => (
                  <Tooltip
                    key={j}
                    label={getAccessibilityLabel(a.slug)}
                    tooltip={a.description ?? a.name}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className={styles.cardActions}>
                <Link href={film.uri} className={styles.actionBtn}>
                  Learn More
                </Link>
                {film.festivalFilmAcf?.trailerUrl && (
                  <button
                    className={styles.actionBtn}
                    onClick={() =>
                      setTrailerUrl(film.festivalFilmAcf!.trailerUrl!)
                    }
                  >
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trailer modal */}
      {trailerUrl && (
        <TrailerModal url={trailerUrl} onClose={() => setTrailerUrl(null)} />
      )}
    </div>
  )
}
