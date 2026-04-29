import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import {
  getLumenEpisode,
  getAllLumenEpisodeSlugs,
  getRelatedLumenEpisodes,
} from '@/app/lib/queries'
import { getLumenEpisodePreview } from '@/app/lib/previewQueries'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import LumenCard from '@/app/ui/components/lumenCard'
import LumenDropdown from '@/app/ui/components/lumenDropdown'
import styles from './page.module.css'
import type { LumenEpisode } from '@/app/lib/types'

export const dynamicParams = false
export const revalidate = 3600

type Props = {
  params: Promise<{ season: string; slug: string }>
}

export async function generateStaticParams() {
  const episodes = await getAllLumenEpisodeSlugs()
  return episodes.map((e) => ({ season: e.season, slug: e.slug }))
}

export default async function LumenEpisodePage({ params }: Props) {
  const { slug } = await params
  const { isEnabled: isPreview } = await draftMode()
  const episode = isPreview
    ? await getLumenEpisodePreview(slug)
    : await getLumenEpisode(slug)

  if (!episode) return notFound()

  const acf = episode.manyLumensEpisodesAcf
  const coverImage =
    episode.blogSettings?.coverImage?.node ?? episode.featuredImage?.node
  const mobileCoverImage = episode.blogSettings?.mobileCoverImage?.node
  const coverVideo = episode.blogSettings?.coverVideo?.node
  const hasMobileCover = !!mobileCoverImage
  const season = episode.lumenSeasons?.nodes?.[0]

  const manualRelated = (acf?.relatedEpisodes?.nodes ?? []) as LumenEpisode[]
  const relatedEpisodes =
    manualRelated.length > 0
      ? manualRelated
      : await getRelatedLumenEpisodes(slug, episode.date ?? '')

  const date = episode.date
    ? new Date(episode.date)
        .toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
        .toUpperCase()
    : null

  const dropdowns = [
    { label: 'Show Notes', content: acf?.showNotes },
    { label: 'Credits', content: acf?.credits },
    { label: 'Transcript', content: acf?.transcript },
  ].filter((d) => d.content)

  return (
    <main>
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

      {/* Intro section */}
      <div className={styles.intro}>
        {acf?.episodeName && (
          <p className={styles.episodeName}>{acf.episodeName}</p>
        )}
        <h1 className={styles.title}>{episode.title}</h1>
        {acf?.subtitleHost && (
          <p className={styles.subtitle}>{acf.subtitleHost}</p>
        )}
        {date && <p className={styles.date}>{date}</p>}
        {acf?.introduction && (
          <div
            className={styles.introduction}
            dangerouslySetInnerHTML={{ __html: cleanHtml(acf.introduction) }}
          />
        )}
      </div>

      {/* Buzzsprout embed */}
      {acf?.buzzSprout?.embedCode && (
        <div
          className={styles.embed}
          dangerouslySetInnerHTML={{ __html: acf.buzzSprout.embedCode }}
        />
      )}

      {/* Guest bios */}
      {acf?.guestBios && acf.guestBios.length > 0 && (
        <div className={styles.guestBios}>
          {acf.guestBios.map((bio, i) => (
            <div key={i} className={styles.guestBio}>
              {bio.image?.node?.sourceUrl && (
                <div className={styles.guestImageWrapper}>
                  <Image
                    src={bio.image.node.sourceUrl}
                    alt={bio.image.node.altText ?? ''}
                    fill
                    sizes='(max-width: 768px) 100vw, 50vw'
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                  />
                </div>
              )}
              <div className={styles.guestContent}>
                {bio.content && (
                  <div
                    className={styles.guestText}
                    dangerouslySetInnerHTML={{ __html: cleanHtml(bio.content) }}
                  />
                )}
                {bio.link?.url && (
                  <a
                    href={bio.link.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles.guestLink}
                  >
                    {bio.link.title ?? 'Learn More'}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dropdowns */}
      {dropdowns.length > 0 && (
        <div className={styles.dropdowns}>
          {dropdowns.map((d, i) => (
            <LumenDropdown key={i} label={d.label} content={d.content!} />
          ))}
        </div>
      )}

      {/* Back link */}
      <div className={styles.actions}>
        <Link
          href={season ? `/manylumens/${season.slug}` : '/manylumens'}
          className={styles.backLink}
        >
          ← Back to Many Lumens
        </Link>
      </div>

      {/* Related episodes */}
      {relatedEpisodes.length > 0 && (
        <div className={styles.related}>
          <h2 className={styles.relatedHeading}>RELATED</h2>
          <div className={styles.relatedGrid}>
            {relatedEpisodes.map((ep: LumenEpisode, i: number) => (
              <LumenCard key={ep.id ?? i} episode={ep} />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
