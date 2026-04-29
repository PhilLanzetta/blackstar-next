import type { Metadata } from 'next'
import { gtFlexaExpanded, gtFlexaMono, swissTime } from './ui/fonts'
import { Geist, Geist_Mono } from 'next/font/google'
import './ui/globals.css'
import { getMegaNav, getFooterNav, getFestivalMenus } from './lib/queries'
import { unstable_cache } from 'next/cache'
import { HeaderWrapper } from './ui/headerWrapper'
import { FooterWrapper } from './ui/footerWrapper'
import { headers } from 'next/headers'
import { draftMode } from 'next/headers'
import Breadcrumb from './ui/components/breadcrumb'
import NextTopLoader from 'nextjs-toploader'
import { SpeedInsights } from '@vercel/speed-insights/next'
import SeenNewsletterWrapper from './ui/components/seen/seenNewsletterWrapper'
import EventiveProvider from './ui/components/festival/eventiveProvider'
import PreviewBanner from './ui/components/previewBanner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// ── Cache layout data for 1 hour ─────────────────────────────────────────────
// These queries run on every page load. Caching them means WordPress is only
// called once per hour regardless of traffic, cutting layout latency to ~0.
const getCachedMegaNav = unstable_cache(getMegaNav, ['mega-nav'], {
  revalidate: 3600,
})

const getCachedFooterNav = unstable_cache(getFooterNav, ['footer-nav'], {
  revalidate: 3600,
})

const getCachedFestivalMenus = unstable_cache(
  getFestivalMenus,
  ['festival-menus'],
  { revalidate: 3600 },
)
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'BlackStar',
  description:
    'Celebrating and providing platforms for visionary Black, Brown, and Indigenous artists.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [megaNavs, footerNav, festivalMenus] = await Promise.all([
    getCachedMegaNav(),
    getCachedFooterNav(),
    getCachedFestivalMenus(),
  ])

  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const isFestival = pathname.startsWith('/festival')

  const { isEnabled: isPreview } = await draftMode()

  return (
    <html
      lang='en'
      className={`${gtFlexaExpanded.variable} ${gtFlexaMono.variable} ${swissTime.variable} antialiased`}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader color='#000' height={3} showSpinner={false} />
        <Breadcrumb />
        <HeaderWrapper megaNavs={megaNavs} festivalMenus={festivalMenus} />
        {isFestival ? (
          <EventiveProvider>{children}</EventiveProvider>
        ) : (
          <>{children}</>
        )}
        <SpeedInsights />
        <SeenNewsletterWrapper />
        <FooterWrapper footerNav={footerNav} />
        {isPreview && <PreviewBanner />}
      </body>
    </html>
  )
}
