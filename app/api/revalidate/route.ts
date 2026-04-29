// app/api/revalidate/route.ts
// Called by WordPress via save_post hook when content is published or updated.
// Immediately invalidates the Next.js cache for the affected page(s).

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  let body: { postType?: string; slug?: string; uri?: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { postType, slug, uri } = body

  if (!postType || !slug) {
    return NextResponse.json(
      { error: 'Missing postType or slug' },
      { status: 400 },
    )
  }

  try {
    switch (postType) {
      // ── Festival Films ──────────────────────────────────────────────────────
      case 'festival-film':
        // Individual film page — uri includes year e.g. /festival/2025/films/slug
        if (uri) revalidatePath(uri)
        // Also revalidate the film guide for all years (we don't know which year)
        revalidatePath('/festival/[...slug]', 'page')
        break

      // ── Festival Events ─────────────────────────────────────────────────────
      case 'festival-event':
        if (uri) revalidatePath(uri)
        // Revalidate schedule and event guide
        revalidatePath('/festival/[...slug]', 'page')
        break

      // ── Festival Posts ──────────────────────────────────────────────────────
      case 'festival-post':
        revalidatePath('/festival/[...slug]', 'page')
        break

      // ── Standard Posts ──────────────────────────────────────────────────────
      case 'post':
        revalidatePath(`/news/${slug}`)
        revalidatePath('/news')
        revalidatePath('/') // home page may show latest posts
        break

      // ── Pages ───────────────────────────────────────────────────────────────
      case 'page':
        if (uri) {
          revalidatePath(uri)
        } else {
          revalidatePath('/[...slug]', 'page')
        }
        revalidatePath('/')
        break

      // ── Seen Articles ───────────────────────────────────────────────────────
      case 'seen-article':
        if (uri) revalidatePath(uri)
        revalidatePath('/seen')
        revalidatePath('/seen/read')
        break

      // ── Lumen Episodes ──────────────────────────────────────────────────────
      case 'lumen-episode':
        if (uri) revalidatePath(uri)
        revalidatePath('/manylumens')
        break

      // ── Opportunities ────────────────────────────────────────────────────────
      case 'opportunity':
        revalidatePath(`/opportunities/${slug}`)
        revalidatePath('/opportunities')
        revalidatePath('/about') // opportunities show on about page
        break

      // ── Program Events ───────────────────────────────────────────────────────
      case 'program-event':
        if (uri) revalidatePath(uri)
        revalidatePath('/events/[programType]/[slug]', 'page')
        break

      default:
        // Unknown post type — revalidate the whole site as a fallback
        revalidatePath('/', 'layout')
        break
    }

    console.log(`[Revalidate] ${postType} / ${slug} — success`)
    return NextResponse.json({ revalidated: true, postType, slug })
  } catch (err) {
    console.error('[Revalidate] Error:', err)
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
