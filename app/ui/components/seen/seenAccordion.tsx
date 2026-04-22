'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SeenAccordionLayout } from '@/app/lib/types'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import styles from './seenAccordion.module.css'

export default function SeenAccordion({ data }: { data: SeenAccordionLayout }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { heading, accordionSections } = data

  if (!accordionSections?.length) return null

  return (
    <section className={styles.section}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      {accordionSections.map((section, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i} className={styles.item}>
            <button
              className={styles.toggle}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span>{section.heading}</span>
              <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key='content'
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className={styles.columns}>
                    {section.columns?.map((col, j) => (
                      <div key={j} className={styles.column}>
                        {col.heading && (
                          <div
                            className={styles.colHeading}
                            dangerouslySetInnerHTML={{
                              __html: cleanHtml(col.heading),
                            }}
                          />
                        )}
                        {col.content && (
                          <div
                            className={styles.colContent}
                            dangerouslySetInnerHTML={{
                              __html: cleanHtml(col.content),
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </section>
  )
}
