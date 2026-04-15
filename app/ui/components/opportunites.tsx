'use client'

import { useState } from 'react'
import type { OpportunityType } from '@/app/lib/types'
import styles from './opportunities.module.css'
import Link from 'next/link'
import { formatLink } from '@/app/lib/utils/formatLink'

type Props = {
  opportunityTypes: OpportunityType[]
  noOpportunitiesMessage?: string
}

export default function Opportunities({
  opportunityTypes,
  noOpportunitiesMessage,
}: Props) {
  const [activeType, setActiveType] = useState<string>(
    opportunityTypes[0]?.name ?? '',
  )

  const allEmpty = opportunityTypes.every(
    (type) => type.opportunities.nodes.length === 0,
  )

  const activeOpportunities =
    opportunityTypes.find((type) => type.name === activeType)?.opportunities
      .nodes ?? []

  return (
    <section className={styles.wrapper}>
      <h2>Opportunities</h2>
      <div className={styles.tabs}>
        {opportunityTypes.map((type) => (
          <button
            key={type.name}
            className={`${styles.tab} ${activeType === type.name ? styles.tabActive : ''}`}
            onClick={() => setActiveType(type.name)}
          >
            {type.name}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {allEmpty || activeOpportunities.length === 0 ? (
          <p
            className={styles.emptyMessage}
            dangerouslySetInnerHTML={{ __html: noOpportunitiesMessage ?? '' }}
          />
        ) : (
          <ul className={styles.list}>
            {activeOpportunities.map((opportunity, index) => (
              <li key={index} className={styles.item}>
                <h3 className={styles.itemTitle}>{opportunity.title}</h3>
                {opportunity.opportunityAcf?.shortDescription && (
                  <div
                    className={styles.itemDescription}
                    dangerouslySetInnerHTML={{
                      __html: opportunity.opportunityAcf.shortDescription,
                    }}
                  ></div>
                )}
                <Link
                  href={formatLink(opportunity.link)}
                  className={styles.readMore}
                >
                  Read More
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
