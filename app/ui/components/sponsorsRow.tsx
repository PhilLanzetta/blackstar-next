import Image from 'next/image'
import type { SponsorsRowLayout } from '@/app/lib/types'
import styles from './sponsorsRow.module.css'

type Props = {
  data: SponsorsRowLayout
}

export default function SponsorsRow({ data }: Props) {
  const { description, descriptionPosition, sponsors, heading } = data

  const descriptionAbove = Array.isArray(descriptionPosition)
    ? descriptionPosition[0] === 'above'
    : descriptionPosition === 'above'

  const logoItems = (sponsors ?? []).flatMap((s) => {
    if (s.sponsor?.nodes?.length) {
      return s.sponsor.nodes.map((node) => ({
        id: node.id,
        logo: node.sponsorAcf?.logoBlack,
        website: node.sponsorAcf?.website,
      }))
    }
    if (s.manualSponsor?.logo) {
      return [
        {
          id: s.manualSponsor.logo.node.sourceUrl,
          logo: s.manualSponsor.logo,
          website: s.manualSponsor.link?.url,
        },
      ]
    }
    return []
  })

  return (
    <section className={styles.wrapper}>
      <div className={styles.headingContainer}>
        {heading && <h2 className={styles.heading}>{heading}</h2>}
        {description && descriptionAbove && (
          <p className={styles.description}>{description}</p>
        )}
      </div>
      <div className={styles.logos}>
        {logoItems.map((item) => {
          const logo = item.logo?.node
          if (!logo?.sourceUrl) return null
          const inner = (
            <Image
              src={logo.sourceUrl}
              alt={logo.altText ?? ''}
              width={logo.mediaDetails?.width ?? 200}
              height={logo.mediaDetails?.height ?? 100}
              className={styles.logo}
            />
          )
          return item.website ? (
            <a
              key={item.id}
              href={item.website}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.logoLink}
            >
              {inner}
            </a>
          ) : (
            <div key={item.id} className={styles.logoLink}>
              {inner}
            </div>
          )
        })}
      </div>
      {description && !descriptionAbove && (
        <p className={styles.description}>{description}</p>
      )}
    </section>
  )
}
