'use client'
import { AnimatePresence, motion } from 'motion/react'
import { useState, useRef, useEffect } from 'react'
import styles from './subLink.module.css'
import Link from 'next/link'
import { useWindowSize, useHover } from 'usehooks-ts'

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
}

export function SubLink({ title, slug, subNav }: SubLinkProps) {
  const [expanded, setExpanded] = useState(false)
  const { width } = useWindowSize()
  const isMobile: boolean = width < 601
  const hoverRef = useRef<HTMLDivElement>(null)
  const isHovered = useHover(hoverRef)

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
                  console.log(item.menuItem)
                  return (
                    <Link
                      href={item.menuItem.url}
                      className={styles.underLink}
                      key={index}
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
