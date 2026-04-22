import type { SeenFeatureTextLayout } from '@/app/lib/types'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import styles from './seenFeatureText.module.css'

export default function SeenFeatureText({
  data,
}: {
  data: SeenFeatureTextLayout
}) {
  if (!data.text) return null
  return (
    <div className={styles.container}>
      <div
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: cleanHtml(data.text) }}
      />
    </div>
  )
}
