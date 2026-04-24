'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Footer } from './footer'
import type { SiteSettingsAcf } from '../lib/types'

type Props = {
  footerNav: SiteSettingsAcf
  initialPageBrand?: string | null
}

export function FooterWrapper({ footerNav, initialPageBrand }: Props) {
  const pathname = usePathname()
  const [pageBrand, setPageBrand] = useState<string | null>(
    initialPageBrand ?? null,
  )

  useEffect(() => {
    const slug = pathname.split('/').filter(Boolean).join('/')

    if (pathname.startsWith('/seen/') || pathname === '/seen') {
      setPageBrand('seen')
      return
    }

    if (pathname.startsWith('/festival/')) {
      setPageBrand('festival')
      return
    }

    if (!slug) {
      setPageBrand(null)
      return
    }

    fetch(`/api/page-brand?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => setPageBrand(data.pageBrand ?? null))
      .catch(() => setPageBrand(null))
  }, [pathname])

  return <Footer footerNav={footerNav} pageBrand={pageBrand} />
}
