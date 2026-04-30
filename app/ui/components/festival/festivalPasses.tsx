'use client'
// app/ui/components/festival/festivalPasses.tsx
// Renders pass cards from siteSettingsAcf.passesNew
// Eventive buy buttons are rendered via the global eventive-button div

import styles from './festivalPasses.module.css'

type Pass = {
  name: string
  price: string
  description: string
  eventiveId: string
  discountPrice?: string | null
  buttonLabelOverride?: string | null
}

type Props = {
  title: string
  passes: Pass[]
}

export default function FestivalPasses({ title, passes }: Props) {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.grid}>
        {passes.map((pass, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.passName}>{pass.name}</h3>
              <div className={styles.priceBlock}>
                {pass.discountPrice && (
                  <span className={styles.discountPrice}>
                    ${pass.discountPrice}
                  </span>
                )}
                <span className={styles.price}>${pass.price}</span>
              </div>
            </div>

            <p className={styles.description}>{pass.description}</p>
            <div className={styles.cardFooter}>
              <div
                className='eventive-button'
                data-pass-bucket={pass.eventiveId}
                data-buy-label={pass.buttonLabelOverride ?? 'Buy Now'}
                data-quantity='1'
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
