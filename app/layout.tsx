import type { Metadata } from 'next'
import { gtFlexaExpanded, gtFlexaMono } from './ui/fonts'
import { Geist, Geist_Mono } from 'next/font/google'
import './ui/globals.css'
import { getMegaNav, getFooterNav, getPageBrand } from './lib/queries'
import { HeaderWrapper } from './ui/headerWrapper'
import { Footer } from './ui/footer'
import { headers } from 'next/headers'
import Breadcrumb from './ui/components/breadcrumb'
import NextTopLoader from 'nextjs-toploader'

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

  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const slug = pathname.split('/').filter(Boolean).join('/')
  const pageBrand = slug ? await getPageBrand(slug) : null

  return (
    <html
      lang='en'
      className={`${gtFlexaExpanded.variable} ${gtFlexaMono.variable} antialiased`}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader color='#000' height={3} showSpinner={false} />
        <Breadcrumb></Breadcrumb>
        <HeaderWrapper megaNavs={megaNavs} initialPageBrand={pageBrand} />
        <main>{children}</main>
        <Footer footerNav={footerNav} />
      </body>
    </html>
  )
}
