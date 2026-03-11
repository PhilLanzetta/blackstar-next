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
