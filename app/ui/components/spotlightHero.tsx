'use client'
import Image from 'next/image'
import type { SpotlightHeroLayout } from '@/app/lib/types'
import styles from './spotlightHero.module.css'
import LinkButton from '@/app/ui/components/linkButton'

export default function SpotlightHero({ data }: { data: SpotlightHeroLayout }) {
  const { heading1, image, links, contained } = data

  return (
    <section
      style={{
        width: '100%',
        height: '100dvh',
        position: 'relative',
        marginBottom: '80px',
      }}
    >
      <Image
        src={image.node.sourceUrl}
        alt={image.node.altText}
        fill
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        className={styles.heroMedia}
      />
      <div className={styles.heroInfoBox}>
        <p className={styles.heroBoxHeading}>{heading1}</p>
        <div className={styles.heroBoxLinkContainer}>
          {links.map((item, i) => (
            <LinkButton key={i} href={item.link.url} label={item.link.title} />
          ))}
        </div>
      </div>
    </section>
  )
}
