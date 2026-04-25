import Image from 'next/image'
import Link from 'next/link'
import type { FestivalExplainersLayout } from '@/app/lib/types'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import { formatLink, isExternalLink } from '@/app/lib/utils/formatLink'
import styles from './festivalExplainers.module.css'

export default function FestivalExplainers({
  data,
}: {
  data: FestivalExplainersLayout
}) {
  const { explainer } = data
  if (!explainer?.length) return null

  return (
    <div className={styles.grid}>
      {explainer.map((item, i) => (
        <div key={i} className={styles.item}>
          {item.icon?.node?.sourceUrl && (
            <div className={styles.icon}>
              <Image
                src={item.icon.node.sourceUrl}
                alt={item.icon.node.altText ?? ''}
                width={48}
                height={48}
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}
          {item.heading && <h3 className={styles.heading}>{item.heading}</h3>}
          {item.description && (
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: cleanHtml(item.description) }}
            />
          )}
          {item.buttons && item.buttons.length > 0 && (
            <div className={styles.buttons}>
              {item.buttons.map((btn, j) => (
                <Link
                  key={j}
                  href={formatLink(btn.button.url)}
                  target={isExternalLink(btn.button.url) ? '_blank' : undefined}
                  rel={
                    isExternalLink(btn.button.url)
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className={styles.button}
                >
                  {btn.backArrow && <span>←</span>}
                  {btn.button.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
