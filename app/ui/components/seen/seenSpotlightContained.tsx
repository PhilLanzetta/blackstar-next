import Image from 'next/image'
import Link from 'next/link'
import type { SeenSpotlightContainedLayout } from '@/app/lib/types'
import { formatLink, isExternalLink } from '@/app/lib/utils/formatLink'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import styles from './seenSpotlightContained.module.css'

type Props = {
  data: SeenSpotlightContainedLayout
}

export default function SeenSpotlightContained({ data }: Props) {
  const { title1, title2, title3, link, image } = data

  return (
    <section className={styles.section}>
      {image?.node?.sourceUrl && (
        <div className={styles.imageWrapper}>
          <Image
            src={image.node.sourceUrl}
            alt={image.node.altText ?? ''}
            fill
            sizes='(max-width: 768px) 100vw, 50vw'
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
      <div className={styles.textColumns}>
        {title1 && (
          <div
            className={styles.column1}
            dangerouslySetInnerHTML={{ __html: cleanHtml(title1) }}
          />
        )}
        {title2 && (
          <div
            className={styles.column2}
            dangerouslySetInnerHTML={{ __html: cleanHtml(title2) }}
          />
        )}
        {title3 && (
          <div
            className={styles.column3}
            dangerouslySetInnerHTML={{ __html: cleanHtml(title3) }}
          />
        )}
        {link?.url && (
          <div className={styles.linkWrapper}>
            <Link
              href={formatLink(link.url)}
              target={isExternalLink(link.url) ? '_blank' : undefined}
              rel={isExternalLink(link.url) ? 'noopener noreferrer' : undefined}
              className={styles.link}
            >
              {link.title}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
