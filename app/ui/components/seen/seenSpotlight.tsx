import Image from 'next/image'
import Link from 'next/link'
import type { SeenSpotlightLayout } from '@/app/lib/types'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import { formatLink, isExternalLink } from '@/app/lib/utils/formatLink'
import styles from './seenSpotlight.module.css'

export default function SeenSpotlight({ data }: { data: SeenSpotlightLayout }) {
  const { text, link, image } = data

  return (
    <section className={styles.section}>
      <div className={styles.content}>
        {text && (
          <div
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: cleanHtml(text) }}
          />
        )}
        {link?.url && (
          <Link
            href={formatLink(link.url)}
            target={isExternalLink(link.url) ? '_blank' : undefined}
            rel={isExternalLink(link.url) ? 'noopener noreferrer' : undefined}
            className={styles.link}
          >
            {link.title}
          </Link>
        )}
      </div>
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
    </section>
  )
}
