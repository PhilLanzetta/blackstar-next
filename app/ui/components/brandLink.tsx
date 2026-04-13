// app/ui/components/brandLink.tsx
'use client'

import NextLink from 'next/link'
import { ComponentProps, useCallback } from 'react'
import { brandCache } from '@/app/ui/headerWrapper'

type Props = ComponentProps<typeof NextLink>

export default function BrandLink({ href, ...props }: Props) {
  const prefetchBrand = useCallback(() => {
    if (typeof href !== 'string') return
    const slug = href.split('/').filter(Boolean).join('/')
    if (!slug || brandCache.has(slug)) return

    fetch(`/api/page-brand?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => brandCache.set(slug, data.pageBrand ?? null))
      .catch(() => {})
  }, [href])

  return (
    <NextLink
      href={href}
      onMouseEnter={prefetchBrand}
      onFocus={prefetchBrand}
      {...props}
    />
  )
}
