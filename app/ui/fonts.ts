import localFont from 'next/font/local'

export const gtFlexaExpanded = localFont({
  src: [
    {
      path: './fonts/GT-Flexa-Expanded-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: './fonts/GT-Flexa-Expanded-Black-Italic.woff2',
      weight: '900',
      style: 'italic',
    },
    {
      path: './fonts/GT-Flexa-Expanded-Bold-Italic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: './fonts/GT-Flexa-Expanded-Bold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  display: 'swap', // 'swap' prevents render-blocking
  variable: '--gt-expanded', // Define a CSS variable name
})

export const gtFlexaMono = localFont({
  src: [
    {
      path: './fonts/GT-Flexa-Mono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/GT-Flexa-Mono-Regular-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  display: 'swap', // 'swap' prevents render-blocking
  variable: '--gt-mono', // Define a CSS variable name
})

export const swissTime = localFont({
  src: [
    { path: './fonts/SwissTime-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/SwissTime-Italic.woff2', weight: '400', style: 'italic' },
    { path: './fonts/SwissTime-Medium.woff2', weight: '500', style: 'normal' },
    {
      path: './fonts/SwissTime-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: './fonts/SwissTime-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/SwissTime-SemiBoldItalic.woff2',
      weight: '600',
      style: 'italic',
    },
    { path: './fonts/SwissTime-Bold.woff2', weight: '700', style: 'normal' },
    {
      path: './fonts/SwissTime-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: './fonts/SwissTime-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/SwissTime-ExtraBoldItalic.woff2',
      weight: '800',
      style: 'italic',
    },
    { path: './fonts/SwissTime-Black.woff2', weight: '900', style: 'normal' },
    {
      path: './fonts/SwissTime-BlackItalic.woff2',
      weight: '900',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--swiss-time',
})
