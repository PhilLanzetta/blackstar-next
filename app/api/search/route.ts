// app/api/search/route.ts
// Thin wrapper — useful if you ever need search results via fetch
// (e.g. from a client component or external integration).
// The main search page calls searchService directly instead.

import { NextRequest, NextResponse } from 'next/server'
import { runSearch } from '@/app/lib/searchService'

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('q')?.trim() ?? ''

  try {
    const data = await runSearch(search)
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
    })
  } catch (err) {
    console.error('[Search API]', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
