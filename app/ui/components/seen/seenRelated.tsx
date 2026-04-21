import Image from 'next/image'
import Link from 'next/link'
import type { SeenArticle } from '@/app/lib/types'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import styles from './seenRelated.module.css'

type Props = {
  articles: SeenArticle[]
  currentArticle: SeenArticle
}

export default function SeenRelated({ articles, currentArticle }: Props) {
  const issue = currentArticle.seenIssues?.nodes?.[0]
  const category = currentArticle.seenCategories?.nodes?.[0]
  const author = currentArticle.seenAuthors?.nodes?.[0]
  const authorDescription = author?.description

  return (
    <div className={styles.wrapper}>
      {/* Related section */}
      {articles.length > 0 && (
        <div className={styles.related}>
          <div className={styles.relatedSidebar}>
            <h2 className={styles.relatedHeading}>Related</h2>
            <div className={styles.relatedLinks}>
              {issue && (
                <Link
                  href={`/seen/read?issue=${issue.slug}`}
                  className={styles.relatedLink}
                >
                  MORE FROM {issue.name.toUpperCase()}
                </Link>
              )}
              {category && (
                <Link
                  href={`/seen/read?category=${category.slug}`}
                  className={styles.relatedLink}
                >
                  MORE {category.name.toUpperCase()}
                </Link>
              )}
              {author && (
                <Link
                  href={`/seen/read?author=${author.slug}`}
                  className={styles.relatedLink}
                >
                  MORE FROM {author.name.toUpperCase()}
                </Link>
              )}
            </div>
          </div>

          <div className={styles.relatedGrid}>
            {articles.map((related, i) => {
              const relatedIssue =
                related.seenIssues?.nodes?.[0]?.slug ?? 'issue'
              const href = `/seen/read/${relatedIssue}/${related.slug}`
              const relatedCategories = related.seenCategories?.nodes ?? []
              const relatedAuthors = related.seenAuthors?.nodes ?? []

              return (
                <div key={i} className={styles.card}>
                  {related.featuredImage?.node?.sourceUrl && (
                    <div className={styles.imageWrapper}>
                      <Image
                        src={related.featuredImage.node.sourceUrl}
                        alt={related.featuredImage.node.altText ?? ''}
                        fill
                        sizes='(max-width: 768px) 100vw, 33vw'
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className={styles.cardInfo}>
                    {relatedCategories.length > 0 && (
                      <p className={styles.cardCategory}>
                        ({relatedCategories.map((c) => c.name).join(') (')})
                      </p>
                    )}
                    <h3 className={styles.cardTitle}>{related.title}</h3>
                    {relatedAuthors.length > 0 && (
                      <p className={styles.cardAuthor}>
                        BY{' '}
                        {relatedAuthors
                          .map((a) => a.name)
                          .join(', ')
                          .toUpperCase()}
                      </p>
                    )}
                  </div>
                  <div className={styles.cardActions}>
                    <Link href={href} className={styles.readButton}>
                      READ
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Author bio */}
      {author && authorDescription && (
        <div className={styles.authorBio}>
          <h2 className={styles.authorName}>{author.name}</h2>
          <div
            className={styles.authorDescription}
            dangerouslySetInnerHTML={{ __html: cleanHtml(authorDescription) }}
          />
        </div>
      )}
    </div>
  )
}
