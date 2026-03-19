'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LinkButton from '@/app/ui/components/linkButton'
import type { TextTabsLayout } from '@/app/lib/types'
import styles from './textTabs.module.css'

export default function TextTabs({ data }: { data: TextTabsLayout }) {
  const { tabs } = data
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className={styles.container}>
      {tabs.map((tab, i) => {
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
              <span>{tab.title}</span>
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
                    {tab.content && (
                      <div className={styles.contentText} dangerouslySetInnerHTML={{ __html: tab.content }} />
                    )}
                    {tab.link?.url && (
                      <LinkButton href={tab.link.url} label={tab.link.title} />
                    )}
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