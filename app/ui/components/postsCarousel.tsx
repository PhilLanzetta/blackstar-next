'use client'
import { useState, useMemo, useRef, useCallback } from 'react'
import type {
  PostsCarouselLayout,
  LumenEpisode,
  WPPost,
  ProgramEvent,
  WPPage,
} from '@/app/lib/types'
import styles from './postsCarousel.module.css'
import PostCard from './postCard'
import CustomPostCard from './customPostCard'
import LumenCard from './lumenCard'

type Props = {
  data: PostsCarouselLayout
  lumenEpisodes?: LumenEpisode[]
}

export default function PostsCarousel({ data, lumenEpisodes = [] }: Props) {
  const { title, link, posts, customPosts, type, featured } = data

  const isCustom = type && type[0] === 'custom'
  const isLumen = type && type[0] === 'lumen-episode'

  const visibleCount = featured ? 2 : 4
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedSeason, setSelectedSeason] = useState<string>('all')
  const dragStartX = useRef<number | null>(null)

  const seasons = useMemo(() => {
    if (!isLumen) return []
    const set = new Map<string, string>()
    lumenEpisodes.forEach((ep) => {
      ep.lumenSeasons?.nodes?.forEach((s) => set.set(s.slug, s.name))
    })
    return Array.from(set.entries()).map(([slug, name]) => ({ slug, name }))
  }, [isLumen, lumenEpisodes])

  const filteredEpisodes = useMemo(() => {
    if (!isLumen) return []
    if (selectedSeason === 'all') return lumenEpisodes
    return lumenEpisodes.filter((ep) =>
      ep.lumenSeasons?.nodes?.some((s) => s.slug === selectedSeason),
    )
  }, [isLumen, lumenEpisodes, selectedSeason])

  const items = useMemo(() => {
    if (isLumen) return filteredEpisodes
    if (isCustom) return customPosts ?? []
    return posts?.nodes ?? []
  }, [isLumen, isCustom, filteredEpisodes, customPosts, posts])

  const maxIndex = Math.max(0, items.length - visibleCount)
  const showArrows = maxIndex > 0

  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1))
  }, [])

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(maxIndex, i + 1))
  }, [maxIndex])

  const onDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    dragStartX.current = x
  }, [])

  const onDragEnd = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (dragStartX.current === null) return
      const x = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX
      const diff = dragStartX.current - x
      const threshold = 50
      if (diff > threshold) {
        setCurrentIndex((i) => Math.min(maxIndex, i + 1))
      } else if (diff < -threshold) {
        setCurrentIndex((i) => Math.max(0, i - 1))
      }
      dragStartX.current = null
    },
    [maxIndex],
  )

  const renderCard = (item: any, i: number) => {
    if (isLumen)
      return <LumenCard key={item.id ?? i} episode={item as LumenEpisode} />
    if (isCustom) return <CustomPostCard key={i} post={item} />
    return (
      <PostCard
        key={item.id ?? i}
        post={item as ProgramEvent | WPPost | WPPage}
      />
    )
  }

  const itemWidth = `calc(100% / ${visibleCount} - var(--carousel-gap) * ${visibleCount - 1} / ${visibleCount})`

  return (
    <section className={styles.postCarouselContainer}>
      <div className={styles.postCarouselHeader}>
        {title && <h2 className={styles.postCarouselHeading}>{title}</h2>}
        {isLumen && seasons.length > 0 && (
          <div className={styles.seasonFilters}>
            <button
              className={`${styles.seasonFilter} ${selectedSeason === 'all' ? styles.active : ''}`}
              onClick={() => {
                setSelectedSeason('all')
                setCurrentIndex(0)
              }}
            >
              All
            </button>
            {seasons.map((s) => (
              <button
                key={s.slug}
                className={`${styles.seasonFilter} ${selectedSeason === s.slug ? styles.active : ''}`}
                onClick={() => {
                  setSelectedSeason(s.slug)
                  setCurrentIndex(0)
                }}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
        <div className={styles.headerRight}>
          {link && (
            <a href={link.url} className={styles.viewAll}>
              {link.title}
            </a>
          )}
          {showArrows && (
            <div className={styles.arrows}>
              <button
                className={styles.arrow}
                onClick={prev}
                disabled={currentIndex === 0}
                aria-label='Previous'
              >
                ←
              </button>
              <button
                className={styles.arrow}
                onClick={next}
                disabled={currentIndex >= maxIndex}
                aria-label='Next'
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.carouselViewport}>
        <div
          className={styles.carouselTrack}
          style={
            {
              '--item-width': itemWidth,
              transform: `translateX(calc(-${currentIndex} * (${itemWidth} + var(--carousel-gap))))`,
            } as React.CSSProperties
          }
          onMouseDown={onDragStart}
          onMouseUp={onDragEnd}
          onTouchStart={onDragStart}
          onTouchEnd={onDragEnd}
        >
          {items.map((item, i) => (
            <div key={i} className={styles.carouselItem}>
              {renderCard(item, i)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
