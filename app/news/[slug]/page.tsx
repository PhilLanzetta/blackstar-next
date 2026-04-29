import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import {
  getPressReleasePost,
  getAllBlogSlugs,
  getRelatedPosts,
} from '@/app/lib/queries'
import { getPressReleasePostPreview } from '@/app/lib/previewQueries'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import PostCard from '@/app/ui/components/postCard'
import styles from '@/app/press/[slug]/page.module.css'
import type { WPPost } from '@/app/lib/types'

export const dynamicParams = true
export const revalidate = 3600

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const { isEnabled: isPreview } = await draftMode()
  const post = isPreview
    ? await getPressReleasePostPreview(slug)
    : await getPressReleasePost(slug)

  if (!post) return notFound()

  const coverImage =
    post.blogSettings?.coverImage?.node ?? post.featuredImage?.node
  const mobileCoverImage = post.blogSettings?.mobileCoverImage?.node
  const coverVideo = post.blogSettings?.coverVideo?.node
  const guestAuthor = post.blogSettings?.guestAuthor
  const hasMobileCover = !!mobileCoverImage

  const manualRelated = post.blogRelated?.relatedPosts?.nodes ?? []
  const relatedPosts =
    manualRelated.length > 0
      ? manualRelated
      : await getRelatedPosts('blog', slug, post.date)

  const date = new Date(post.date)
    .toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    .toUpperCase()

  return (
    <main>
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
        ) : coverImage ? (
          <Image
            src={coverImage.sourceUrl}
            alt={coverImage.altText ?? ''}
            fill
            sizes='100vw'
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            className={hasMobileCover ? styles.desktopOnly : ''}
          />
        ) : null}
        {mobileCoverImage && (
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

      <div className={styles.heading}>
        <div className={styles.meta}>
          <span className={styles.category}>(BLOG)</span>
        </div>
        <h1 className={styles.title}>{post.title}</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.dateLine}>
          <span>{date}</span>
          {post.pressRelease?.location && (
            <span> · {post.pressRelease.location.toUpperCase()}</span>
          )}
          {guestAuthor && <span> · {guestAuthor.toUpperCase()}</span>}
        </div>
        {post.pressRelease?.introduction && (
          <div
            className={styles.introduction}
            dangerouslySetInnerHTML={{
              __html: cleanHtml(post.pressRelease.introduction),
            }}
          />
        )}
        {post.content && (
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: cleanHtml(post.content) }}
          />
        )}
      </div>

      <div className={styles.actions}>
        <Link href='/news' className={styles.backLink}>
          ← Back to News
        </Link>
        {post.pressRelease?.pdf?.node?.mediaItemUrl && (
          <a
            href={post.pressRelease.pdf.node.mediaItemUrl}
            target='_blank'
            rel='noopener noreferrer'
            className={styles.pdfButton}
          >
            DOWNLOAD PDF
          </a>
        )}
      </div>

      {relatedPosts.length > 0 && (
        <div className={styles.related}>
          <h2 className={styles.relatedHeading}>RELATED</h2>
          <div className={styles.relatedGrid}>
            {relatedPosts.map((related: WPPost, i: number) => (
              <PostCard key={i} post={related} />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
