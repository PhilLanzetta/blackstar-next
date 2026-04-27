'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function EventiveLogin() {
  const pathname = usePathname()
  if (!pathname.startsWith('/festival')) return null

  useEffect(() => {
    const poll = setInterval(() => {
      if ((window as any).Eventive) {
        clearInterval(poll)
      }
    }, 200)
    return () => clearInterval(poll)
  }, [])

  return <div className='eventive-button' data-login='true' />
}
