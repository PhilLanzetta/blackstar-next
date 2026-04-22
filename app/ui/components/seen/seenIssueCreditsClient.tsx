'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import styles from './seenIssueCredits.module.css'

type Issue = {
  name: string
  slug: string
  seenIssueAcf: {
    showInAbout?: boolean
    contributors?: { heading?: string; contributors?: string }
    guestEditors?: {
      heading?: string
      editors?: { name: string; role?: string | null }[]
    }
  }
}

export default function SeenIssueCreditsClient({
  issues,
}: {
  issues: Issue[]
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {issues.map((issue, i) => {
        const isOpen = openIndex === i
        const { guestEditors, contributors } = issue.seenIssueAcf

        return (
          <div key={i} className={styles.item}>
            <button
              className={styles.toggle}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span>{issue.name}</span>
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
                  <div className={styles.content}>
                    {guestEditors && (
                      <div className={styles.column}>
                        {guestEditors.heading && (
                          <h3 className={styles.colHeading}>
                            {guestEditors.heading}
                          </h3>
                        )}
                        {guestEditors.editors &&
                          guestEditors.editors.length > 0 && (
                            <ul className={styles.editorList}>
                              {guestEditors.editors.map((editor, j) => (
                                <li key={j} className={styles.editorItem}>
                                  <strong>{editor.name}</strong>
                                  {editor.role && <span> {editor.role}</span>}
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>
                    )}
                    {contributors && (
                      <div className={styles.column}>
                        {contributors.heading && (
                          <h3 className={styles.colHeading}>
                            {contributors.heading}
                          </h3>
                        )}
                        {contributors.contributors && (
                          <div
                            className={styles.contributors}
                            dangerouslySetInnerHTML={{
                              __html: cleanHtml(contributors.contributors),
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
