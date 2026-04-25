// app/ui/headerWrapper.tsx
'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Header } from './header'
import type { MegaNav } from '../lib/types'

type Props = {
  megaNavs: MegaNav[]
  initialPageBrand?: string | null
}

export const brandCache = new Map<string, string | null>()

export function HeaderWrapper({ megaNavs, initialPageBrand }: Props) {
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

    if (pathname.startsWith('/festival/') || pathname === '/festival') {
      setPageBrand('festival')
      return
    }

    if (!slug) {
      setPageBrand(null)
      return
    }

    if (brandCache.has(slug)) {
      setPageBrand(brandCache.get(slug) ?? null)
      return
    }

    fetch(`/api/page-brand?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        const brand = data.pageBrand ?? null
        brandCache.set(slug, brand)
        setPageBrand(brand)
      })
      .catch(() => setPageBrand(null))
  }, [pathname])

  console.log('pathname:', pathname, 'pageBrand:', pageBrand)

  return <Header megaNavs={megaNavs} pageBrand={pageBrand} />
}
