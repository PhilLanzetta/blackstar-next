'use client'
import { AnimatePresence, motion } from 'motion/react'
import { useState, useRef, useEffect } from 'react'
import styles from './subLink.module.css'
import BrandLink from './components/brandLink'
import { useWindowSize } from 'usehooks-ts'
import { formatLink } from '@/app/lib/utils/formatLink'

interface MenuItems {
  menuItem: {
    title: string
    url: string
  }
}

interface SubLinkProps {
  title: string
  slug: string
  isLast: boolean
  subNav: MenuItems[]
  onClose: () => void
}

export function SubLink({ title, isLast, subNav, onClose }: SubLinkProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={styles.sublinkContainer}>
      <button
        className={`${styles.sublinkMain} ${expanded ? styles.activeMain : ''} ${isLast ? styles.sublinkMainLast : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        {title} <span className={styles.navArrow}>{expanded ? <span>&#8593;</span> : <span>&#x2193;</span>}</span>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            className={styles.underLinkContainer}
            key='sublink-open'
            initial={{
              height: 0,
            }}
            animate={{
              height: 'auto',
            }}
            exit={{
              height: 0,
            }}
            transition={{ ease: 'linear' }}
          >
            <motion.div
              initial={{ transform: 'scaleY(0)', transformOrigin: 'top' }}
              animate={{ transform: 'scaleY(100%)', transformOrigin: 'top' }}
              exit={{ transform: 'scaleY(0)', transformOrigin: 'top' }}
              className={`${styles.underLinks} ${isLast ? styles.underLinksLast : ''}`}
              transition={{ ease: 'linear' }}
            >
              {subNav &&
                subNav.map((item, index) => {
                  return (
                    <BrandLink
                      href={formatLink(item.menuItem.url)}
                      className={styles.underLink}
                      key={index}
                      onClick={() => {
                        onClose()
                        const formattedUrl = formatLink(item.menuItem.url)
                        const currentPath = window.location.pathname
                        const targetPath = formattedUrl.split('#')[0]
                        const hasHash = formattedUrl.includes('#')

                        if (
                          !hasHash &&
                          (currentPath === targetPath ||
                            currentPath === targetPath + '/')
                        ) {
                          window.scrollTo({ top: 0 })
                        }
                      }}
                    >
                      {item.menuItem.title}
                    </BrandLink>
                  )
                })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
