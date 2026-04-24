import Link from 'next/link'
import type { FestivalHeadingLayout } from '@/app/lib/types'
import { formatLink, isExternalLink } from '@/app/lib/utils/formatLink'
import styles from './festivalHeading.module.css'

export default function FestivalHeading({
  data,
}: {
  data: FestivalHeadingLayout
}) {
  const { heading, links } = data
  if (!heading) return null

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{heading}</h2>
      {links && links.length > 0 && (
        <div className={styles.links}>
          {links.map((item, i) => (
            <Link
              key={i}
              href={formatLink(item.link.url)}
              target={isExternalLink(item.link.url) ? '_blank' : undefined}
              rel={
                isExternalLink(item.link.url)
                  ? 'noopener noreferrer'
                  : undefined
              }
              className={styles.link}
            >
              {item.link.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
