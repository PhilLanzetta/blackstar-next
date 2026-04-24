'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { FestivalSpotlightCarouselLayout, RichCard } from '@/app/lib/types'
import { formatLink, isExternalLink } from '@/app/lib/utils/formatLink'
import styles from './festivalSpotlightCarousel.module.css'

export default function FestivalSpotlightCarousel({
  data,
}: {
  data: FestivalSpotlightCarouselLayout
}) {
  const { cards, inversed } = data
  const [activeIndex, setActiveIndex] = useState(0)

  if (!cards?.length) return null

  const activeCard = cards[activeIndex]
  const custom = activeCard?.custom
  const image = custom?.image?.node

  return (
    <section className={`${styles.section} ${inversed ? styles.inversed : ''}`}>
      <div className={styles.imageWrapper}>
        {image?.sourceUrl && (
          <Image
            src={image.sourceUrl}
            alt={image.altText ?? ''}
            fill
            sizes='(max-width: 768px) 100vw, 60vw'
            style={{ objectFit: 'cover' }}
            priority
          />
        )}
      </div>
      <div className={styles.content}>
        {custom?.preHeading && (
          <p className={styles.preHeading}>{custom.preHeading}</p>
        )}
        {custom?.heading && (
          <h2 className={styles.heading}>{custom.heading}</h2>
        )}
        {custom?.description && (
          <p className={styles.description}>{custom.description}</p>
        )}
        {custom?.buttons && custom.buttons.length > 0 && (
          <div className={styles.buttons}>
            {custom.buttons.map((btn, i) => (
              <Link
                key={i}
                href={formatLink(btn.button.url)}
                target={isExternalLink(btn.button.url) ? '_blank' : undefined}
                className={styles.button}
              >
                {btn.backArrow && <span>←</span>}
                {btn.button.title}
              </Link>
            ))}
          </div>
        )}
      </div>
      {cards.length > 1 && (
        <div className={styles.dots}>
          {cards.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === activeIndex ? styles.activeDot : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
