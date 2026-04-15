import Link from 'next/link'
import { formatLink, isExternalLink } from '@/app/lib/utils/formatLink'
import styles from './linkButton.module.css'

type LinkButtonProps = {
  href: string
  label: string
  target?: '_blank' | '_self'
  variant?: 'primary' | 'secondary'
}

export default function LinkButton({
  href,
  label,
  target = '_self',
  variant = 'primary',
}: LinkButtonProps) {
  const external = isExternalLink(href)
  const resolvedTarget = external ? '_blank' : target
  const resolvedHref = external ? href : formatLink(href)
  return (
    <Link
      href={resolvedHref}
      target={resolvedTarget}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`${styles.btn} ${styles[variant]}`}
    >
      {label}
    </Link>
  )
}
