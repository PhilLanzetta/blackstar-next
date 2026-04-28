'use client'
// app/ui/headerWrapper.tsx

import { usePathname } from 'next/navigation'
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
  festivalMenus?: FestivalMenu[]
}

export function HeaderWrapper({ megaNavs, festivalMenus }: Props) {
  const pathname = usePathname()

  const pageBrand = pathname.startsWith('/seen')
    ? 'seen'
    : pathname.startsWith('/festival')
      ? 'festival'
      : null

  return (
    <Header
      megaNavs={megaNavs}
      pageBrand={pageBrand}
      festivalMenus={festivalMenus}
    />
  )
}
