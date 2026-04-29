import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import {
  getSeenArticle,
  getAllSeenArticleSlugs,
  getRelatedSeenArticles,
} from '@/app/lib/queries'
import { getSeenArticlePreview } from '@/app/lib/previewQueries'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import type {
  SeenArticleLayout,
  SeenArticleContentLayout,
  SeenArticleContainedMediaLayout,
  SeenArticleFullWidthMediaLayout,
  SeenArticleFootnotesLayout,
  SeenArticle,
} from '@/app/lib/types'
import styles from './page.module.css'
import SeenRelated from '@/app/ui/components/seen/seenRelated'
import SeenShare from '@/app/ui/components/seen/seenShare'

export const dynamicParams = true
export const revalidate = 3600

type Props = {
  params: Promise<{ issue: string; slug: string }>
}

export async function generateStaticParams() {
  const articles = await getAllSeenArticleSlugs()
  return articles.map((a) => ({ issue: a.issue, slug: a.slug }))
}

export default async function SeenArticlePage({ params }: Props) {
  const { slug, issue } = await params
  const { isEnabled: isPreview } = await draftMode()
  const article = isPreview
    ? await getSeenArticlePreview(slug)
    : await getSeenArticle(slug)

  if (!article) return notFound()

  const acf = article.seenArticleLayouts
  const cover = acf?.cover
  const coverImage = cover?.image?.node
  const mobileCoverImage = cover?.mobileImage?.node
  const coverVideo = cover?.video?.node
  const hasMobileCover = !!mobileCoverImage

  const authors = article.seenAuthors?.nodes ?? []
  const issueNode = article.seenIssues?.nodes?.[0]
  const categories = article.seenCategories?.nodes ?? []

  const manualRelated = (acf?.relatedArticles?.nodes ?? []) as SeenArticle[]
  const categorySlug = article.seenCategories?.nodes?.[0]?.slug ?? ''
  const issueSlug = article.seenIssues?.nodes?.[0]?.slug ?? ''
  const authorSlug = article.seenAuthors?.nodes?.[0]?.slug ?? ''

  const relatedArticles =
    manualRelated.length >= 3
      ? manualRelated.slice(0, 3)
      : await getRelatedSeenArticles(
          slug,
          categorySlug,
          issueSlug,
          authorSlug,
          article.date ?? '',
        )

  const date = article.date
    ? new Date(article.date)
        .toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
        .toUpperCase()
    : null

  return (
    <main>
      <SeenShare />
      {/* Hero */}
      <div className={styles.hero}>
        {coverVideo ? (
          <video
            className={`${styles.heroVideo} ${hasMobileCover ? styles.desktopOnly : ''}`}
            src={coverVideo.mediaItemUrl}
            poster={coverImage?.sourceUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : coverImage?.sourceUrl ? (
          <Image
            src={coverImage.sourceUrl}
            alt={coverImage.altText ?? ''}
            fill
            sizes='100vw'
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            className={hasMobileCover ? styles.desktopOnly : ''}
          />
        ) : null}
        {mobileCoverImage?.sourceUrl && (
          <Image
            src={mobileCoverImage.sourceUrl}
            alt={mobileCoverImage.altText ?? ''}
            fill
            sizes='100vw'
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            className={styles.mobileOnly}
          />
        )}
      </div>
      {/* Header */}
      <div className={styles.header}>
        {categories.length > 0 && (
          <p className={styles.category}>({categories[0].name})</p>
        )}
        <h1 className={styles.title}>
          {cover?.overrideTitle ?? article.title}
        </h1>
        {cover?.subtitle && <p className={styles.subtitle}>{cover.subtitle}</p>}
        {authors.length > 0 && (
          <p className={styles.authors}>
            BY {authors.map((a) => a.name).join(', ')}
          </p>
        )}
        {issueNode && <p className={styles.issue}>{issueNode.name}</p>}
        {date && <p className={styles.date}>{date}</p>}
      </div>
      {/* Introduction */}
      {acf?.introduction && (
        <div className={styles.introContainer} data-share-trigger>
          <div
            className={styles.introduction}
            dangerouslySetInnerHTML={{ __html: cleanHtml(acf.introduction) }}
          />
        </div>
      )}
      {/* Layouts */}
      {acf?.layouts?.map((layout: SeenArticleLayout, index: number) => {
        switch (layout.__typename) {
          case 'SeenArticleLayoutsLayoutsContentLayout':
            return (
              <div key={index} className={styles.contentContainer}>
                <div
                  className={styles.content}
                  dangerouslySetInnerHTML={{
                    __html: cleanHtml(
                      (layout as SeenArticleContentLayout).content ?? '',
                    ),
                  }}
                />
              </div>
            )
          case 'SeenArticleLayoutsLayoutsContainedMediaLayout': {
            const l = layout as SeenArticleContainedMediaLayout
            return (
              <div
                key={index}
                className={`${styles.containedMedia} ${l.reducedContainer ? styles.reduced : ''}`}
              >
                {l.image?.node?.sourceUrl && (
                  <Image
                    src={l.image.node.sourceUrl}
                    alt={l.image.node.altText ?? ''}
                    width={1200}
                    height={800}
                    style={{ width: '100%', height: 'auto' }}
                  />
                )}
                {l.videoEmbed && (
                  <div
                    className={styles.videoEmbed}
                    dangerouslySetInnerHTML={{ __html: l.videoEmbed }}
                  />
                )}
              </div>
            )
          }
          case 'SeenArticleLayoutsLayoutsFullWidthMediaLayout': {
            const l = layout as SeenArticleFullWidthMediaLayout
            return (
              <div key={index} className={styles.fullWidthMedia}>
                {l.image?.node?.sourceUrl && (
                  <Image
                    src={l.image.node.sourceUrl}
                    alt={l.image.node.altText ?? ''}
                    width={1920}
                    height={1080}
                    style={{ width: '100%', height: 'auto' }}
                  />
                )}
                {l.videoEmbed && (
                  <div
                    className={styles.videoEmbed}
                    dangerouslySetInnerHTML={{ __html: l.videoEmbed }}
                  />
                )}
              </div>
            )
          }
          case 'SeenArticleLayoutsLayoutsFootnotesLayout':
            return (
              <div key={index} className={styles.footnotesContainer}>
                <div
                  className={styles.footnotes}
                  dangerouslySetInnerHTML={{
                    __html: cleanHtml(
                      (layout as SeenArticleFootnotesLayout).footnotes ?? '',
                    ),
                  }}
                />
              </div>
            )
          default:
            return null
        }
      })}
      {/* Back link */}
      <div className={styles.actions}>
        <Link href='/seen' className={styles.backLink}>
          ← Back to Seen
        </Link>
      </div>
      {/* Related articles */}
      <div data-share-end>
        <SeenRelated articles={relatedArticles} currentArticle={article} />
      </div>
    </main>
  )
}
