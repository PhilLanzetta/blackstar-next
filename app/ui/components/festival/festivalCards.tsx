import Image from 'next/image'
import Link from 'next/link'
import type { FestivalCardsLayout } from '@/app/lib/types'
import { formatLink, isExternalLink } from '@/app/lib/utils/formatLink'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import styles from './festivalCards.module.css'

export default function FestivalCards({ data }: { data: FestivalCardsLayout }) {
  const { cards, gridLayout } = data
  if (!cards?.length) return null
  const isTwoUp = gridLayout?.[0] === 'two_up'

  return (
    <div
      className={`${styles.grid} ${isTwoUp ? styles.twoUp : styles.threeUp}`}
    >
      {cards.map((card, i) => (
        <div key={i} className={styles.card}>
          {card.image?.node?.sourceUrl && (
            <div className={styles.imageWrapper}>
              <Image
                src={card.image.node.sourceUrl}
                alt={card.image.node.altText ?? ''}
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          <div className={styles.cardContent}>
            {card.heading && (
              <h3 className={styles.cardHeading}>{card.heading}</h3>
            )}
            {card.extraHeading && (
              <p className={styles.cardExtraHeading}>{card.extraHeading}</p>
            )}
            {card.content && (
              <div
                className={styles.cardText}
                dangerouslySetInnerHTML={{ __html: cleanHtml(card.content) }}
              />
            )}
            {card.extraContent && (
              <div
                className={styles.cardExtraText}
                dangerouslySetInnerHTML={{
                  __html: cleanHtml(card.extraContent),
                }}
              />
            )}
            {card.callToAction?.url && (
              <Link
                href={formatLink(card.callToAction.url)}
                target={
                  isExternalLink(card.callToAction.url) ? '_blank' : undefined
                }
                rel={
                  isExternalLink(card.callToAction.url)
                    ? 'noopener noreferrer'
                    : undefined
                }
                className={styles.cardCta}
              >
                {card.callToAction.title}
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
