// app/api/preview/route.ts
// Enables Next.js Draft Mode and redirects to the correct page for preview.

import { NextRequest, NextResponse } from 'next/server'
import { draftMode } from 'next/headers'

function resolvePreviewUrl(type: string, slug: string, id: string): string {
  switch (type) {
    case 'festival-film':
      return `/festival/2025/films/${slug}`
    case 'festival-event':
      return `/festival/2025/events/${slug}`
    case 'festival-post':
      return `/festival/news/${slug}`
    case 'seen-article':
      return `/seen/read/${slug}`
    case 'lumen-episode':
      return `/manylumens/${slug}`
    case 'opportunity':
      return `/opportunities/${slug}`
    case 'page':
      if (!slug || slug === '/') return `/?previewId=${id}`
      return `/${slug}`
    case 'post':
      return `/news/${slug}`
    case 'program-event':
      // Can't resolve by slug for this CPT — pass database ID as a query param
      // The page reads it and uses DATABASE_ID to fetch the preview
      return `/events/preview?previewId=${id}&slug=${slug}`
    default:
      return '/'
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const type = req.nextUrl.searchParams.get('type') ?? ''
  const slug = req.nextUrl.searchParams.get('slug') ?? ''
  const id = req.nextUrl.searchParams.get('id') ?? ''

  if (secret !== process.env.PREVIEW_SECRET) {
    return NextResponse.json(
      { error: 'Invalid preview token' },
      { status: 401 },
    )
  }

  // Allow empty slug for home page
  if (!slug && type !== 'page') {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }

  const draft = await draftMode()
  draft.enable()

  const destination = resolvePreviewUrl(type, slug, id)
  return NextResponse.redirect(new URL(destination, req.url))
}
