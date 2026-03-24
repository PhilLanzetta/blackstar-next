'use client'

import { useState, ComponentProps } from 'react'
import Image from 'next/image'
import type { MediaLayout, MediaSlide } from '@/app/lib/types'
import styles from './mediaBlock.module.css'

type Props = {
  data: MediaLayout
}

function cleanVideoUrl(url: string): string {
  const decoded = decodeURIComponent(url)

  const youtubeMatch = decoded.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  if (youtubeMatch)
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`

  const vimeoMatch = decoded.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch)
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`

  return decoded
}

function Slide({ slide }: { slide: MediaSlide }) {
  const [playing, setPlaying] = useState(false)
  const posterUrl = slide.image?.node.sourceUrl
  const videoType = Array.isArray(slide.videoType)
    ? slide.videoType[0]
    : slide.videoType
  const rawUrl =
    videoType === 'embed' ? slide.videoEmbed : slide.videoFile?.node.sourceUrl
  const videoUrl = rawUrl ? cleanVideoUrl(rawUrl) : null

  return (
    <div className={styles.slideInner}>
      {videoUrl ? (
        <div className={styles.videoEmbed}>
          {playing ? (
            <iframe
              src={videoUrl}
              title={slide.caption ?? 'Video'}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          ) : (
            <button
              className={styles.posterButton}
              onClick={() => setPlaying(true)}
              aria-label='Play video'
            >
              {posterUrl && (
                <Image
                  src={posterUrl}
                  alt={slide.image?.node.altText ?? ''}
                  width={slide.image?.node.mediaDetails?.width ?? 1200}
                  height={slide.image?.node.mediaDetails?.height ?? 800}
                  className={styles.posterImage}
                />
              )}
              <span className={styles.playButton} aria-hidden='true' />
            </button>
          )}
        </div>
      ) : slide.image?.node.sourceUrl ? (
        <Image
          src={slide.image.node.sourceUrl}
          alt={slide.image.node.altText ?? ''}
          width={slide.image.node.mediaDetails?.width ?? 1200}
          height={slide.image.node.mediaDetails?.height ?? 800}
          className={styles.image}
        />
      ) : null}

      {slide.caption && (
        <p
          className={styles.caption}
          dangerouslySetInnerHTML={{ __html: slide.caption }}
        />
      )}
    </div>
  )
}

export default function MediaBlock({ data }: Props) {
  const { slides, title } = data
  const [current, setCurrent] = useState(0)

  if (!slides?.length) return null

  const isSingle = slides.length === 1
  const bordered = slides[current]?.bordered

  if (isSingle) {
    return (
      <section className={styles.wrapper}>
        {title && <h2>{title}</h2>}
        <div className={slides[0].bordered ? styles.bordered : ''}>
          <Slide slide={slides[0]} />
        </div>
      </section>
    )
  }

  const prev = () => setCurrent((i) => (i - 1 + slides.length) % slides.length)
  const next = () => setCurrent((i) => (i + 1) % slides.length)

  return (
    <section className={styles.wrapper}>
      {title && <h2>{title}</h2>}
      <div className={bordered ? styles.bordered : ''}>
        <div className={styles.slider}>
          <Slide slide={slides[current]} />

          <button
            onClick={prev}
            aria-label='Previous slide'
            className={styles.prevButton}
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label='Next slide'
            className={styles.nextButton}
          >
            ›
          </button>
        </div>

        <div className={styles.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
