// app/ui/headerWrapper.tsx
'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Header } from './header'
import type { MegaNav } from '../lib/types'

type FestivalMenu = {
  year: { nodes: { slug: string }[] }
  menuItems: {
    link: { url: string; title: string }
    submenuItems?: { link: { url: string; title: string } }[] | null
  }[]
  topMenuItems?: { link: { url: string; title: string } }[] | null
}

type Props = {
  megaNavs: MegaNav[]
  initialPageBrand?: string | null
  festivalMenus?: FestivalMenu[]
}

export const brandCache = new Map<string, string | null>()

export function HeaderWrapper({ megaNavs, initialPageBrand, festivalMenus }: Props) {
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

  console.log('festivalMenus received:', festivalMenus?.length)

  return <Header megaNavs={megaNavs} pageBrand={pageBrand} festivalMenus={festivalMenus}/>
}
