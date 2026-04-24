import Link from 'next/link'
import type { FestivalButtonsLayout } from '@/app/lib/types'
import { formatLink, isExternalLink } from '@/app/lib/utils/formatLink'
import styles from './festivalButtons.module.css'

export default function FestivalButtons({
  data,
}: {
  data: FestivalButtonsLayout
}) {
  const { buttons } = data
  if (!buttons?.length) return null

  return (
    <div className={styles.container}>
      {buttons.map((item, i) => (
        <Link
          key={i}
          href={formatLink(item.button.url)}
          target={isExternalLink(item.button.url) ? '_blank' : undefined}
          rel={
            isExternalLink(item.button.url) ? 'noopener noreferrer' : undefined
          }
          className={styles.button}
        >
          {item.backArrow && <span>←</span>}
          {item.button.title}
        </Link>
      ))}
    </div>
  )
}
