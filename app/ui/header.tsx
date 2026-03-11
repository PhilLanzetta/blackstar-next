'use client'
import { useState } from 'react'
import styles from './header.module.css'
import { MegaNav } from '../lib/types'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { SubLink } from './subLink'

export function Header({ megaNavs }: { megaNavs: MegaNav[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header>
      <div className={styles.headerContainer}>
        <div className={styles.mainHeader}>
          <div className={styles.hamburgerContainer}>
            <button
              className={`${styles.navIcon} ${
                menuOpen ? styles.hamburgerOpen : ''
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={`${menuOpen ? 'Close Menu' : 'Open Menu'}`}
              name='Menu'
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <Link href='/' className={styles.logoContainer}>
            <svg
              viewBox='0 0 232 38'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M0 0.607422H13.7866C20.9841 0.607422 24.6842 3.01501 24.6842 9.04667V10.4912C24.6842 14.166 22.4432 18.013 19.3401 18.013V18.6729C22.7195 18.6729 25.3938 21.4901 25.3938 26.0772V27.6485C25.3938 34.3644 21.1361 37.2028 13.5839 37.2028H0V0.607422ZM12.6715 14.7995C14.3442 14.7995 14.9524 14.2673 14.9524 12.0878V11.0741C14.9524 8.9453 14.3442 8.46378 12.6715 8.46378H10.3907V14.7995H12.6715ZM12.3928 29.3465C14.699 29.3465 15.0031 28.8903 15.0031 26.4067V25.5957C15.0031 23.1121 14.699 22.6559 12.3928 22.6559H10.3907V29.3465H12.3928Z'
                fill='black'
              />
              <path
                d='M102.803 0.607422H113.194V15.3571H113.854L118.187 0.607422H128.932L122.875 18.4996L129.287 37.2028H118.187L113.854 21.7942H113.194V37.2028H102.803V0.607422Z'
                fill='black'
              />
              <path
                d='M54.3245 0.607422H70.0626L76.1449 37.2028H65.5008L64.7659 30.9938H59.6466L58.8863 37.2028H48.2422L54.3245 0.607422ZM63.7522 22.6306C63.7522 22.6306 62.5496 15.6267 62.5496 10.0604H61.8897C61.8897 15.6256 60.6603 22.6306 60.6603 22.6306H63.7522Z'
                fill='black'
              />
              <path
                d='M182.573 0.607422H198.311L204.393 37.2028H193.749L193.014 30.9938H187.895L187.135 37.2028H176.491L182.573 0.607422ZM192.001 22.6306C192.001 22.6306 190.798 15.6267 190.798 10.0604H190.138C190.138 15.6256 188.909 22.6306 188.909 22.6306H192.001Z'
                fill='black'
              />
              <path
                d='M205.667 0.634766H219.986C227.183 0.634766 231.06 3.04236 231.06 9.07401V10.5186C231.06 14.1933 228.814 18.1464 225.74 18.1464V18.8062C229.379 18.8062 231.06 21.8179 231.06 26.1046V37.2302H220.67V25.623C220.67 23.1394 220.366 22.6832 218.059 22.6832H216.057V37.2302H205.667V0.634766ZM218.617 14.8269C220.29 14.8269 220.644 14.2947 220.644 12.1152V11.1015C220.644 8.97264 220.29 8.49112 218.617 8.49112H216.057V14.8269H218.617Z'
                fill='black'
              />
              <path
                d='M26.6652 0.607422H37.0558V28.8396H46.965V37.2028H26.6652V0.607422Z'
                fill='black'
              />
              <path
                d='M76.1333 28.1308V9.68106C76.1333 2.58499 79.9854 0 88.8302 0C97.6749 0 101.527 2.58499 101.527 9.68106V14.7497H91.1364V10.8215C91.1364 8.74336 90.3508 8.10979 88.8302 8.10979C87.3096 8.10979 86.524 8.74336 86.524 10.8215V26.9904C86.524 29.0685 87.3096 29.7021 88.8302 29.7021C90.3508 29.7021 91.1364 29.0685 91.1364 26.9904V23.0622H101.527V28.1308C101.527 35.2269 97.6749 37.8119 88.8302 37.8119C79.9854 37.8119 76.1333 35.2269 76.1333 28.1308Z'
                fill='black'
              />
              <path
                d='M128.068 26.3821V23.8985H138.18V27.3959C138.18 28.8911 138.991 29.7021 140.765 29.7021C142.159 29.7021 143.072 28.9418 143.072 27.5479V27.3705C143.072 26.1794 142.641 25.5205 140.639 24.3547L133.289 20.021C129.538 17.8162 128.195 15.0538 128.195 10.2386V9.98517C128.195 3.95352 131.363 0 140.765 0C150.117 0 153.057 3.57337 153.057 11.1003V12.9503H143.198V10.3653C143.198 8.81939 142.337 8.10979 140.867 8.10979C139.574 8.10979 138.56 8.76871 138.56 9.98517V10.1879C138.56 11.0496 138.991 11.6071 141.095 12.7983L147.659 16.4983C152.296 19.1087 153.462 21.9725 153.462 26.2808V26.7623C153.462 33.6556 150.345 37.8119 140.74 37.8119C131.084 37.8119 128.068 34.2132 128.068 26.3821Z'
                fill='black'
              />
              <path
                d='M161.882 8.97064H154V0.607422H180.154V8.97064H172.272V37.2028H161.882V8.97064Z'
                fill='black'
              />
            </svg>
          </Link>
          <button className={styles.searchButton}>
            <svg
              viewBox='0 0 20 21'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle
                cx='7.99564'
                cy='7.99564'
                r='6.96766'
                strokeWidth='2.05595'
              />
              <line
                x1='12.1525'
                y1='12.9782'
                x2='19.0059'
                y2='19.8316'
                strokeWidth='2.05595'
              />
            </svg>
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key='secondary-menu'
              className={styles.secondaryMenu}
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
                {megaNavs.map((megaNav: MegaNav) => (
                  <SubLink key={megaNav.id} title={megaNav.title} slug={megaNav.slug} subNav={megaNav.megaNavACF.menuItems}></SubLink>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
