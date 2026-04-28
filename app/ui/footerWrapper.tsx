'use client'
// app/ui/footerWrapper.tsx

import { usePathname } from 'next/navigation'
import { Footer } from './footer'
import type { SiteSettingsAcf } from '../lib/types'

type Props = {
  footerNav: SiteSettingsAcf
}

export function FooterWrapper({ footerNav }: Props) {
  const pathname = usePathname()

  const pageBrand = pathname.startsWith('/seen')
    ? 'seen'
    : pathname.startsWith('/festival')
      ? 'festival'
      : null

  return <Footer footerNav={footerNav} pageBrand={pageBrand} />
}
