'use client'
import { usePathname } from 'next/navigation'

export default function EventiveLogin() {
  const pathname = usePathname()
  if (!pathname.startsWith('/festival')) return null

  return <div className='eventive-button' data-login='true' />
}
