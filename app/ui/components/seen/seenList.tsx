import type { SeenListLayout } from '@/app/lib/types'
import styles from './seenList.module.css'

export default function SeenList({ data }: { data: SeenListLayout }) {
  const { heading, listItems } = data
  if (!listItems?.length) return null

  return (
    <section className={styles.section}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      <ul className={styles.list}>
        {listItems.map((item, i) => (
          <li key={i} className={styles.item}>
            {item.line1 && <span className={styles.line1}>{item.line1}</span>}
            {item.line2 && <span className={styles.line2}>{item.line2}</span>}
          </li>
        ))}
      </ul>
    </section>
  )
}
