import styles from './eventDetails.module.css'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'

type Props = {
  data: {
    columnOne?: { title?: string; content?: string }
    columnTwo?: { title?: string; content?: string }
    columnThree?: { title?: string; content?: string }
  }
}

export default function EventDetails({ data }: Props) {
  const { columnOne, columnTwo, columnThree } = data
  const columns = [columnOne, columnTwo, columnThree].filter(Boolean)

  if (!columns.length) return null

  return (
    <section className={styles.section}>
      {columns.map((col, i) => (
        <div key={i} className={styles.column}>
          {col?.title && <h3 className={styles.title}>{col.title}</h3>}
          {col?.content && (
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: cleanHtml(col.content) }}
            />
          )}
        </div>
      ))}
    </section>
  )
}
