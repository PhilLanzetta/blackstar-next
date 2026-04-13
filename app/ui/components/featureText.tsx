import type { FeatureTextLayout } from '@/app/lib/types'
import styles from './featureText.module.css'
import LinkButton from './linkButton'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'

export default function FeatureText({ data }: { data: FeatureTextLayout }) {
  const { content, additionalContent, buttons } = data

  return (
    <div className={styles.container}>
      {content && (
        <h2
          className={styles.heading}
          dangerouslySetInnerHTML={{ __html: cleanHtml(content) }}
        />
      )}
      {additionalContent && (
        <div className={styles.contentContainer}>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: cleanHtml(additionalContent) }}
          />
          {buttons && buttons.length > 0 && (
            <div className={styles.linkContainer}>
              {buttons.map((item, i) => (
                <LinkButton
                  key={i}
                  href={item.link.url}
                  label={item.link.title}
                  target={item.link.target === '_blank' ? '_blank' : '_self'}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
