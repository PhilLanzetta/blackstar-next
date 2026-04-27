import type { Metadata } from 'next'
import { gtFlexaExpanded, gtFlexaMono, swissTime } from './ui/fonts'
import { Geist, Geist_Mono } from 'next/font/google'
import './ui/globals.css'
import { getMegaNav, getFooterNav, getPageBrand, getFestivalMenus } from './lib/queries'
import { HeaderWrapper } from './ui/headerWrapper'
import { FooterWrapper } from './ui/footerWrapper'
import { headers } from 'next/headers'
import Breadcrumb from './ui/components/breadcrumb'
import NextTopLoader from 'nextjs-toploader'
import { SpeedInsights } from '@vercel/speed-insights/next'
import SeenNewsletterWrapper from './ui/components/seen/seenNewsletterWrapper'
import EventiveProvider from './ui/components/festival/eventiveProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

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
  const megaNavs = await getMegaNav()
  const footerNav = await getFooterNav()
  const festivalMenus = await getFestivalMenus()

  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const slug = pathname.split('/').filter(Boolean).join('/')
  const isSeen = pathname.startsWith('/seen/')
  const isFestival = pathname.startsWith('/festival/')
  const pageBrand = isSeen
    ? 'seen'
    : isFestival
      ? 'festival'
      : slug
        ? await getPageBrand(slug)
        : null

  return (
    <html
      lang='en'
      className={`${gtFlexaExpanded.variable} ${gtFlexaMono.variable} ${swissTime.variable} antialiased`}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader color='#000' height={3} showSpinner={false} />
        <Breadcrumb></Breadcrumb>
        <HeaderWrapper
          megaNavs={megaNavs}
          initialPageBrand={pageBrand}
          festivalMenus={festivalMenus}
        />
        <EventiveProvider>{children}</EventiveProvider>
        <SpeedInsights />
        <SeenNewsletterWrapper />
        <FooterWrapper initialPageBrand={pageBrand} footerNav={footerNav} />
      </body>
    </html>
  )
}
