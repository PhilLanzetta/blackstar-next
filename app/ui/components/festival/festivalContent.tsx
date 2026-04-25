import Link from 'next/link'
import type { FestivalContentLayout } from '@/app/lib/types'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import { formatLink, isExternalLink } from '@/app/lib/utils/formatLink'
import styles from './festivalContent.module.css'

export default function FestivalContent({
  data,
}: {
  data: FestivalContentLayout
}) {
  const { columns } = data
  if (!columns?.length) return null

  return (
    <div
      className={`${styles.grid} ${columns.length === 1 ? styles.single : ''}`}
    >
      {columns.map((col, i) => (
        <div key={i} className={styles.column}>
          {col.content && (
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: cleanHtml(col.content) }}
            />
          )}
          {col.buttons && col.buttons.length > 0 && (
            <div className={styles.buttons}>
              {col.buttons.map((btn, j) => (
                <Link
                  key={j}
                  href={formatLink(btn.button.url)}
                  target={isExternalLink(btn.button.url) ? '_blank' : undefined}
                  rel={
                    isExternalLink(btn.button.url)
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className={styles.button}
                >
                  {btn.backArrow && <span>←</span>}
                  {btn.button.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
