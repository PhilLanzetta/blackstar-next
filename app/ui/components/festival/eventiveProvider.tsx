'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { WishlistProvider } from './eventiveWishlistContext'
import type { ReactNode } from 'react'

export default function EventiveProvider({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const isFestival = pathname.startsWith('/festival')

  useEffect(() => {
    if (!isFestival) return
    if (document.querySelector('script[data-eventive]')) return

    // Defer until after page load
    const load = () => {
      const stripe = document.createElement('script')
      stripe.src = 'https://js.stripe.com/v3/'
      stripe.async = true
      stripe.defer = true
      document.head.appendChild(stripe)

      const eventive = document.createElement('script')
      eventive.src = 'https://festival.blackstarfest.org/loader.js'
      eventive.async = true
      eventive.defer = true
      eventive.setAttribute('data-eventive', 'true')
      document.head.appendChild(eventive)
    }

    if (document.readyState === 'complete') {
      load()
    } else {
      window.addEventListener('load', load, { once: true })
    }
  }, [isFestival])

  if (!isFestival) return <>{children}</>

  return <WishlistProvider>{children}</WishlistProvider>
}
