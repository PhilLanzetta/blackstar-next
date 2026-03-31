'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { FaqAccordionLayout } from '@/app/lib/types'
import styles from './faqAccordion.module.css'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'

export default function FaqAccordion({ data }: { data: FaqAccordionLayout }) {
  const [activeTab, setActiveTab] = useState(-1)
  const [visibleCount, setVisibleCount] = useState(5)

  const faqs = data.collection.nodes.flatMap((node) => node.faqs.nodes)

  if (!faqs.length) return null

  const visibleFaqs = faqs.slice(0, visibleCount)
  const hasMore = visibleCount < faqs.length

  return (
    <section>
     <h2 className={styles.faqHeader}>FAQ</h2>
      <div className={styles.container}>
        {visibleFaqs.map((faq, i) => {
          const isActive = i === activeTab
          return (
            <div
              key={i}
              className={`${styles.item} ${isActive ? styles.active : ''}`}
            >
              <button
                className={styles.trigger}
                onClick={() => setActiveTab(isActive ? -1 : i)}
              >
                <span>{faq.title}</span>
                <span className={styles.icon}>{isActive ? '−' : '+'}</span>
              </button>
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    key='content'
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className={styles.contentInner}>
                      {faq.content && (
                        <div
                          className={styles.contentText}
                          dangerouslySetInnerHTML={{ __html: cleanHtml(faq.content) }}
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
        {hasMore && (
         <div className={styles.loadMoreContainer}>
          <button
            className={styles.btn}
            onClick={() => setVisibleCount((c) => c + 5)}
          >
            Load More
          </button>
          </div>
        )}
      </div>
    </section>
  )
}
