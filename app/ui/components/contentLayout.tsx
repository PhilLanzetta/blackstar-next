import styles from './contentLayout.module.css'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'

export default function ContentLayout({
  data,
}: {
  data: { content?: string }
}) {
  if (!data.content) return null

  return (
    <div className={styles.container}>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: cleanHtml(data.content) }}
      />
    </div>
  )
}
