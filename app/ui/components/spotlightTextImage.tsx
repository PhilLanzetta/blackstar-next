import Image from 'next/image'
import LinkButton from '@/app/ui/components/linkButton'
import type { SpotlightTextImageLayout } from '@/app/lib/types'
import styles from './spotlightTextImage.module.css'

export default function SpotlightTextImage({
  data,
}: {
  data: SpotlightTextImageLayout
}) {
  const { content, flip, heading, link, image } = data

  return (
    <section className={styles.container}>
      {heading && <h2>{heading}</h2>}
      <div className={`${styles.contentContainer} ${flip ? styles.flip : ''}`}>
        {content && (
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
        {image?.node?.sourceUrl && (
          <div className={styles.image}>
            <Image
              src={image.node.sourceUrl}
              alt={image.node.altText ?? ''}
              width={image.node.mediaDetails?.width ?? 800}
              height={image.node.mediaDetails?.height ?? 600}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
              sizes='(max-width: 768px) 100vw, 50vw'
            />
          </div>
        )}
      </div>
      {link?.url && (
        <div className={styles.linkContainer}>
          <LinkButton
            href={link.url}
            label={link.title}
            target={link.target as '_blank' | '_self'}
          />
        </div>
      )}
    </section>
  )
}
