import Link from 'next/link'
import { formatLink } from '@/app/lib/utils/formatLink'
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
  return (
    <Link
      href={formatLink(href)}
      target={target}
      className={`${styles.btn} ${styles[variant]}`}
    >
      {label}
    </Link>
  )
}
