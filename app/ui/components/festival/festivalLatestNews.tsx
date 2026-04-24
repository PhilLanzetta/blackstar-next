import Link from 'next/link'
import Image from 'next/image'
import type { FestivalLatestNewsLayout } from '@/app/lib/types'
import { getFestivalPosts } from '@/app/lib/queries'
import { formatLink, isExternalLink } from '@/app/lib/utils/formatLink'
import styles from './festivalLatestNews.module.css'

export default async function FestivalLatestNews({
  data,
}: {
  data: FestivalLatestNewsLayout
}) {
  const { heading, items, viewAllButtonLabel } = data
  const posts = await getFestivalPosts(items ?? 3)

  if (!posts.length) return null

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        {heading && <h2 className={styles.heading}>{heading}</h2>}
        <Link href='/festival/news' className={styles.viewAll}>
          {viewAllButtonLabel ?? 'View All'}
        </Link>
      </div>
      <div className={styles.grid}>
        {posts.map((post, i) => {
          const href = post.festivalPostAcf?.redirectTo?.url
            ? post.festivalPostAcf.redirectTo.url
            : formatLink(post.link)
          const isExternal = post.festivalPostAcf?.redirectTo?.url
            ? true
            : isExternalLink(post.link)

          return (
            <Link
              key={i}
              href={href}
              className={styles.card}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
            >
              {post.featuredImage?.node?.sourceUrl && (
                <div className={styles.imageWrapper}>
                  <Image
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.featuredImage.node.altText ?? ''}
                    fill
                    sizes='(max-width: 768px) 100vw, 33vw'
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              <h3 className={styles.cardTitle}>{post.title}</h3>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
