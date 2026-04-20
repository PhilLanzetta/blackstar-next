import Image from 'next/image'
import Link from 'next/link'
import type {
  SeenArticlesLayout,
  SeenArticlesItem,
  SeenArticle,
} from '@/app/lib/types'
import { formatLink } from '@/app/lib/utils/formatLink'
import styles from './seenArticles.module.css'

type Props = {
  data: SeenArticlesLayout
}

export default function SeenArticles({ data }: Props) {
  const { articles } = data
  if (!articles?.length) return null

  return (
    <section className={styles.section}>
      {articles.map((item: SeenArticlesItem, i: number) => {
        const isCustom = item.type?.[0] === 'custom'
        const article = item.article?.nodes?.[0] as SeenArticle | undefined
        const issueSlug = article?.seenIssues?.nodes?.[0]?.slug
        const articleLink =
          isCustom && item.link?.url
            ? formatLink(item.link.url)
            : article && issueSlug
              ? `/seen/read/${issueSlug}/${article.slug}`
              : null
        const image = isCustom ? item.image?.node : article?.featuredImage?.node
        const title = isCustom ? item.title : article?.title
        const preTitle = item.preTitle ?? article?.seenIssues?.nodes?.[0]?.name
        const subTitle = item.subTitle ?? article?.seenAuthors?.nodes?.[0]?.name

        if (!articleLink) return null

        return (
          <Link key={i} href={articleLink} className={styles.card}>
            {image?.sourceUrl && (
              <div className={styles.imageWrapper}>
                <Image
                  src={image.sourceUrl}
                  alt={image.altText ?? ''}
                  fill
                  sizes='(max-width: 768px) 100vw, 50vw'
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            <div className={styles.info}>
              {preTitle && <p className={styles.preTitle}>{preTitle}</p>}
              {title && <h3 className={styles.title}>{title}</h3>}
              {subTitle && <p className={styles.subTitle}>{subTitle}</p>}
              {isCustom && item.link?.title && (
                <span className={styles.readMore}>{item.link.title}</span>
              )}
            </div>
          </Link>
        )
      })}
    </section>
  )
}
