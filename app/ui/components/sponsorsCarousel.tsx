import Image from 'next/image'
import type { SponsorsCarouselLayout } from '@/app/lib/types'
import styles from './sponsorsCarousel.module.css'

export default function SponsorsCarousel({
  data,
}: {
  data: SponsorsCarouselLayout
}) {
  const { title, button, sponsorCollection } = data

  const sponsors =
    sponsorCollection?.nodes?.flatMap(
      (collection) => collection.sponsors?.nodes ?? [],
    ) ?? []

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        {title && <h2>{title}</h2>}
        {button?.url && (
          <a href={button.url} className='view-all'>
            {button.title}
          </a>
        )}
      </div>
      <div className={styles.marqueeOuterWrapper}>
        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeTrack}>
            <div className={styles.marqueeSet}>
              {sponsors.map(
                (sponsor, i) =>
                  sponsor.sponsorAcf?.logoBlack?.node?.sourceUrl && (
                    <a
                      key={i}
                      href={sponsor.sponsorAcf.website ?? '#'}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={styles.sponsor}
                    >
                      <Image
                        src={sponsor.sponsorAcf.logoBlack.node.sourceUrl}
                        alt={sponsor.sponsorAcf.logoBlack.node.altText ?? ''}
                        width={
                          sponsor.sponsorAcf.logoBlack.node.mediaDetails
                            ?.width ?? 200
                        }
                        height={
                          sponsor.sponsorAcf.logoBlack.node.mediaDetails
                            ?.height ?? 80
                        }
                        style={{
                          width: 'auto',
                          height: '60px',
                          display: 'block',
                        }}
                      />
                    </a>
                  ),
              )}
            </div>
            <div className={styles.marqueeSet} aria-hidden='true'>
              {sponsors.map(
                (sponsor, i) =>
                  sponsor.sponsorAcf?.logoBlack?.node?.sourceUrl && (
                    <a
                      key={i}
                      href={sponsor.sponsorAcf.website ?? '#'}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={styles.sponsor}
                    >
                      <Image
                        src={sponsor.sponsorAcf.logoBlack.node.sourceUrl}
                        alt={sponsor.sponsorAcf.logoBlack.node.altText ?? ''}
                        width={
                          sponsor.sponsorAcf.logoBlack.node.mediaDetails
                            ?.width ?? 200
                        }
                        height={
                          sponsor.sponsorAcf.logoBlack.node.mediaDetails
                            ?.height ?? 80
                        }
                        style={{
                          width: 'auto',
                          height: '60px',
                          display: 'block',
                        }}
                      />
                    </a>
                  ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
