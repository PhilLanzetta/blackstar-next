import type { TextListAltLayout } from '@/app/lib/types'
import styles from './textListAlt.module.css'

export default function TextListAlt({ data }: { data: TextListAltLayout }) {
  const { heading, column1, column2, column3 } = data

  const columns = [column1, column2, column3].filter(Boolean)

  const cleanColumn = (col: string) =>
    col.replace(/<br\s*\/?><br\s*\/?>/gi, '<br />')

  if (!columns.length && !heading) return null

  return (
    <section
      className={styles.wrapper}
      style={{ gridTemplateColumns: `repeat(${columns.length + 1}, 1fr)` }}
    >
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      {columns.map((column, i) => (
        <div
          key={i}
          className={styles.column}
          dangerouslySetInnerHTML={{ __html: cleanColumn(column!) }}
        />
      ))}
    </section>
  )
}
