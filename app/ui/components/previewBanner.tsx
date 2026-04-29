'use client'
// app/ui/components/previewBanner.tsx
// Shown at the top of every page when Draft Mode is active.

import { usePathname } from 'next/navigation'
import styles from './previewBanner.module.css'

export default function PreviewBanner() {
  const pathname = usePathname()

  return (
    <div className={styles.banner}>
      <span className={styles.label}>
        ⚠ Preview Mode — draft content is visible
      </span>
      <a
        href={`/api/preview/exit?redirect=${encodeURIComponent(pathname)}`}
        className={styles.exit}
      >
        Exit Preview
      </a>
    </div>
  )
}
