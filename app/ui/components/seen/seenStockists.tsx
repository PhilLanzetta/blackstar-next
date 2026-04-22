import type { SeenStockistsLayout } from '@/app/lib/types'
import styles from './seenStockists.module.css'

export default function SeenStockists({ data }: { data: SeenStockistsLayout }) {
  const { heading, locations } = data
  if (!locations?.length) return null

  return (
    <section className={styles.section}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      <div className={styles.grid}>
        {locations.map((location, i) => (
          <div key={i} className={styles.location}>
            {location.locationName && (
              <h3 className={styles.locationName}>{location.locationName}</h3>
            )}
            <ul className={styles.list}>
              {location.stockists?.map((stockist, j) => (
                <li key={j} className={styles.item}>
                  {stockist.link?.url ? (
                    <a
                      href={stockist.link.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={styles.link}
                    >
                      {stockist.name}
                    </a>
                  ) : (
                    <span>{stockist.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}