'use client'
import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { FestivalFilm } from '@/app/lib/types'
import styles from './festivalFilmGuide.module.css'

type FilterItem = { name: string; slug: string; count?: number | null }

type Props = {
  films: FestivalFilm[]
  tags: FilterItem[]
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&hellip;/g, '...')
    .trim()
}

export default function FestivalFilmGuideClient({ films, tags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

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

  return (
    <div className={styles.wrapper}>
      {/* Top nav */}
      <div className={styles.topNav}>
        <Link
          href='/festival/festival-2025/schedule'
          className={styles.topNavItem}
        >
          Schedule
        </Link>
        <Link
          href='/festival/festival-2025/film-guide'
          className={`${styles.topNavItem} ${styles.topNavItemActive}`}
        >
          Films A–Z
        </Link>
        <Link
          href='/festival/festival-2025/event-guide'
          className={styles.topNavItem}
        >
          Talks & Events
        </Link>
        <Link
          href='/festival/festival-2025/my-schedule'
          className={styles.topNavItem}
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

      {/* Results */}
      <p className={styles.resultsCount}>
        {filteredFilms.length} film{filteredFilms.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      <div className={styles.grid}>
        {filteredFilms.map((film, i) => (
          <Link
            key={i}
            href={`/festival/films/${film.slug}`}
            className={styles.card}
          >
            {/* Image */}
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

            {/* Content */}
            <div className={styles.cardContent}>
              {/* Awards / premiere */}
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

              <h2 className={styles.cardTitle}>{film.title}</h2>

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

              {film.festivalFilmAcf?.triggerWarning && (
                <p className={styles.triggerWarning}>
                  TW: {film.festivalFilmAcf.triggerWarning}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
