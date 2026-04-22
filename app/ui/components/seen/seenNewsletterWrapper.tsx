'use client'
import { usePathname } from 'next/navigation'
import SeenNewsletter from './seenNewsletter'

export default function SeenNewsletterWrapper() {
  const pathname = usePathname()
  if (!pathname.startsWith('/seen')) return null
  return <SeenNewsletter />
}
