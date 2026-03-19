import type { TextListLayout } from '@/app/lib/types'
import styles from './textList.module.css'

export default function TextList({ data }: { data: TextListLayout }) {
  const { heading, numberOfColumns, items } = data

  return (
    <section className={styles.container}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      <div
        className={styles.grid}
        style={{ '--columns': numberOfColumns ?? 3 } as React.CSSProperties}
      >
        {items.map((item, i) => (
          <div key={i} className={styles.item}>
            <p className={styles.itemHeading}>{item.heading}</p>
            {item.detail && (
              <div
                className={styles.itemDetail}
                dangerouslySetInnerHTML={{ __html: item.detail }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
