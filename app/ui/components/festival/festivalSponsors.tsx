import Image from 'next/image'
import type { FestivalSponsorsCarouselLayout } from '@/app/lib/types'
import { getSponsorsByCollection } from '@/app/lib/queries'
import styles from './festivalSponsors.module.css'

export default async function FestivalSponsors({
  data,
}: {
  data: FestivalSponsorsCarouselLayout
}) {
  const { collection } = data
  const collectionSlug = collection?.nodes?.[0]?.slug
  if (!collectionSlug) return null

  const sponsors = await getSponsorsByCollection(collectionSlug)
  if (!sponsors.length) return null

  const sponsorItems = sponsors.filter(
    (s) =>
      s.sponsorAcf?.logoBlack?.node?.sourceUrl ||
      s.sponsorAcf?.logo?.node?.sourceUrl,
  )

  if (!sponsorItems.length) return null

  const renderSet = (ariaHidden?: boolean) => (
    <div className={styles.marqueeSet} aria-hidden={ariaHidden}>
      {sponsorItems.map((sponsor, i) => {
        const logo =
          sponsor.sponsorAcf?.logoBlack?.node ?? sponsor.sponsorAcf?.logo?.node
        if (!logo?.sourceUrl) return null
        const img = (
          <Image
            src={logo.sourceUrl}
            alt={sponsor.title ?? ''}
            width={0}
            height={0}
            sizes='200px'
            style={{ width: 'auto', height: '60px', display: 'block' }}
          />
        )
        return (
          <div key={i} className={styles.sponsor}>
            {sponsor.sponsorAcf?.website ? (
              <a
                href={sponsor.sponsorAcf.website}
                target='_blank'
                rel='noopener noreferrer'
              >
                {img}
              </a>
            ) : (
              img
            )}
          </div>
        )
      })}
    </div>
  )

  return (
    <div className={styles.marqueeOuterWrapper}>
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          {renderSet()}
          {renderSet(true)}
        </div>
      </div>
    </div>
  )
}
