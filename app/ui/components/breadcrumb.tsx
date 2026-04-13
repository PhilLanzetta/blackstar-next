'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './breadCrumb.module.css'

export default function Breadcrumb() {
  const pathname = usePathname()

  if (pathname === '/') {
    return (
      <div className={styles.wrapper}>
        <Link href='/' className={styles.link}>
          Home
        </Link>
      </div>
    )
  }

  const topLevel = pathname.split('/').filter(Boolean)[0]
  const label = topLevel
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return (
    <div className={styles.wrapper}>
      <Link href={`/${topLevel}`} className={styles.link}>
        {label}
      </Link>
    </div>
  )
}
