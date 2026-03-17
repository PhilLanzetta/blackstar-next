import Image from 'next/image'
import LinkButton from '@/app/ui/components/linkButton'
import type { CustomPost } from '@/app/lib/types'
import styles from './postCard.module.css' // reuse same styles or create new

export default function CustomPostCard({ post }: { post: CustomPost }) {
  const { preTitle, title, shortDescription, image, programLogo, buttons } =
    post

  return (
    <div className={styles.customCard}>
      {image?.node?.sourceUrl && (
        <div className={styles.imageWrapper}>
          <Image
            src={image.node.sourceUrl}
            alt={image.node.altText ?? ''}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
      <div className={styles.info}>
        {preTitle && <p className={styles.preTitle}>({preTitle})</p>}
      </div>
      <div className={styles.textInfo}>
        {programLogo?.node?.sourceUrl && (
          <div className={styles.logoWrapper}>
            <Image
              src={programLogo.node.sourceUrl}
              alt={programLogo.node.altText ?? ''}
              width={programLogo.node.mediaDetails?.width ?? 500}
              height={programLogo.node.mediaDetails?.height ?? 80}
              style={{
                width: '50%',
                height: 'auto',
                maxHeight: '80px',
                objectFit: 'contain',
                objectPosition: 'left',
              }}
            />
          </div>
        )}
        {title && <h3 className={styles.title}>{title}</h3>}
        {shortDescription && (
          <p className={styles.excerpt}>{shortDescription}</p>
        )}
      </div>
      {buttons && buttons.length > 0 && (
        <div className={styles.learnMore}>
          {buttons.map((btn, i) => (
            <LinkButton key={i} href={btn.link.url} label={btn.link.title} />
          ))}
        </div>
      )}
    </div>
  )
}
