'use client'
import { AnimatePresence, motion } from 'motion/react'
import { useState, useRef, useEffect } from 'react'
import styles from './subLink.module.css'
import Link from 'next/link'
import { useWindowSize, useHover } from 'usehooks-ts'
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
  subNav: MenuItems[]
  onClose: () => void
}

export function SubLink({ title, slug, subNav, onClose }: SubLinkProps) {
  const [expanded, setExpanded] = useState(false)
  const { width } = useWindowSize()
  const isMobile: boolean = width < 601
  const hoverRef = useRef<HTMLDivElement | null>(null)
  const isHovered = useHover(hoverRef as React.RefObject<HTMLElement>)

  useEffect(() => {
    if (isHovered && !isMobile) {
      setExpanded(true)
    } else setExpanded(false)
  }, [isHovered])

  return (
    <div ref={hoverRef} className={styles.sublinkContainer}>
      {expanded ? (
        <Link
          href={slug}
          className={`${styles.sublinkMain} ${
            expanded ? styles.activeMain : ''
          }`}
          onClick={onClose}
        >
          {title}
        </Link>
      ) : (
        <button
          className={`${styles.sublinkMain} ${
            expanded ? styles.activeMain : ''
          }`}
          onClick={() => setExpanded(true)}
        >
          {title}
        </button>
      )}
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
              className={styles.underLinks}
              transition={{ ease: 'linear' }}
            >
              {subNav &&
                subNav.map((item, index) => {
                  return (
                    <Link
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
                    </Link>
                  )
                })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
