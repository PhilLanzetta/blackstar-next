import Image from 'next/image'
import Link from 'next/link'
import type { LumenEpisode } from '@/app/lib/types'
import styles from './postCard.module.css'
import { formatEventLink } from '@/app/lib/utils/formatLink'
import LinkButton from './linkButton'

export default function LumenCard({ episode }: { episode: LumenEpisode }) {
  const { title, link, featuredImage, lumenSeasons } = episode
  const season = lumenSeasons?.nodes?.[0]?.name
  const seasonSlug = lumenSeasons?.nodes?.[0]?.slug
  const formattedLink = link ? formatEventLink(link, seasonSlug ?? '') : null

  return (
    <div className={styles.card}>
      {featuredImage?.node?.sourceUrl && (
        <div className={styles.imageWrapperLumen}>
          <Image
            src={featuredImage.node.sourceUrl}
            alt={featuredImage.node.altText ?? ''}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      )}
      {season && (
        <div className={styles.info}>
          <div className={styles.tags}>
            <span className={styles.tag}>({season})</span>
          </div>
        </div>
      )}
      <div className={styles.textInfo}>
        <h3 className={styles.title}>{title}</h3>
        {episode.manyLumensEpisodesAcf?.introduction && (
          <div
            className={styles.excerpt}
            dangerouslySetInnerHTML={{
              __html: episode.manyLumensEpisodesAcf.introduction,
            }}
          ></div>
        )}
      </div>
      <div className={styles.learnMore}>
        {formattedLink && (
          <LinkButton href={formattedLink} label='Learn More'></LinkButton>
        )}
      </div>
    </div>
  )
}
