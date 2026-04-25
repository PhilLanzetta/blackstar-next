'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function EventiveProvider() {
  const pathname = usePathname()
  const isFestival = pathname.startsWith('/festival')

  useEffect(() => {
    if (!isFestival) return
    if (document.querySelector('script[data-eventive]')) return

    // Load Stripe first (required by Eventive)
    const stripe = document.createElement('script')
    stripe.src = 'https://js.stripe.com/v3/'
    stripe.async = true
    document.head.appendChild(stripe)

    // Load Eventive Everywhere
    const eventive = document.createElement('script')
    eventive.src = 'https://festival.blackstarfest.org/loader.js'
    eventive.async = true
    eventive.setAttribute('data-eventive', 'true')
    document.head.appendChild(eventive)

    return () => {
      // Don't remove on unmount — Eventive needs to persist
    }
  }, [isFestival])

  return null
}
