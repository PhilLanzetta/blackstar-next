// app/lib/searchService.ts

import { GraphQLClient } from 'graphql-request'
import { SEARCH_QUERY } from '@/app/lib/queries'
import type { SearchResult, SearchData } from '@/app/lib/types'

const client = new GraphQLClient(`${process.env.WORDPRESS_URL}/graphql`)

function stripHtml(html: string | null | undefined, maxLen = 160): string {
  if (!html) return ''
  const stripped = html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, '')
    .trim()
  return stripped.length > maxLen
    ? stripped.slice(0, maxLen).trimEnd() + '…'
    : stripped
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export async function runSearch(search: string): Promise<SearchData> {
  if (search.length < 2) return { results: [], total: 0 }

  const data = await client.request(SEARCH_QUERY, { search })
  const results: SearchResult[] = []

  // ── Festival Films ──────────────────────────────────────────────────────────
  for (const n of data.festivalFilms?.nodes ?? []) {
    const director = n.festivalFilmAcf?.credits?.find(
      (c: any) => c.type === 'Director',
    )?.name
    const year = n.festivalFilmAcf?.festivalYear ?? ''
    results.push({
      id: n.id,
      title: n.title,
      uri: n.uri,
      type: 'film',
      filterKey: 'festival',
      image: n.featuredImage?.node ?? null,
      typeLabel: 'FILM',
      meta: [director ? `Dir. ${director}` : null, year]
        .filter(Boolean)
        .join(' · '),
    })
  }

  // ── Festival Events ─────────────────────────────────────────────────────────
  for (const n of data.festivalEvents?.nodes ?? []) {
    const eventType = n.eventiveTags?.nodes?.[0]?.name ?? 'EVENT'
    const location = n.festivalEventAcf?.location ?? ''
    const credits = n.festivalEventAcf?.additionalCredits
      ?.map((c: any) => c.credit)
      .filter(Boolean)
      .join(', ')
    results.push({
      id: n.id,
      title: n.title,
      uri: n.uri,
      type: 'event',
      filterKey: 'events',
      image: n.featuredImage?.node ?? null,
      typeLabel: eventType.toUpperCase(),
      meta: [location, credits].filter(Boolean).join(' · '),
    })
  }

  // ── Posts (News) ────────────────────────────────────────────────────────────
  for (const n of data.posts?.nodes ?? []) {
    results.push({
      id: n.id,
      title: n.title,
      uri: n.uri,
      type: 'post',
      filterKey: 'news',
      image: n.featuredImage?.node ?? null,
      typeLabel: 'NEWS',
      meta: n.date ? formatDate(n.date) : '',
      excerpt: stripHtml(n.excerpt),
    })
  }

  // ── Pages ───────────────────────────────────────────────────────────────────
  for (const n of data.pages?.nodes ?? []) {
    results.push({
      id: n.id,
      title: n.title,
      uri: n.uri,
      type: 'page',
      filterKey: 'pages',
      image: n.featuredImage?.node ?? null,
      typeLabel: 'PAGE',
    })
  }

  // ── Seen Articles ───────────────────────────────────────────────────────────
  for (const n of data.seenArticles?.nodes ?? []) {
    const issue = n.seenIssues?.nodes?.[0]?.name
    const authors = n.seenAuthors?.nodes?.map((a: any) => a.name).join(', ')
    const category = n.seenCategories?.nodes?.[0]?.name
    results.push({
      id: n.id,
      title: n.title,
      uri: n.uri,
      type: 'seen-article',
      filterKey: 'seen',
      image: n.featuredImage?.node ?? null,
      typeLabel: category?.toUpperCase() ?? 'SEEN',
      meta: [issue, authors].filter(Boolean).join(' · '),
      excerpt: stripHtml(n.seenArticleLayouts?.introduction),
    })
  }

  // ── Lumen Episodes ──────────────────────────────────────────────────────────
  for (const n of data.lumenEpisodes?.nodes ?? []) {
    const season = n.lumenSeasons?.nodes?.[0]?.name
    results.push({
      id: n.id,
      title: n.title,
      uri: n.uri,
      type: 'lumen-episode',
      filterKey: 'many-lumens',
      image: n.featuredImage?.node ?? null,
      typeLabel: 'MANY LUMENS',
      meta: season ?? '',
      excerpt: stripHtml(n.manyLumensEpisodesAcf?.introduction),
    })
  }

  // ── Deduplicate by URI ──────────────────────────────────────────────────────
  const seen = new Map<string, SearchResult>()
  for (const r of results) {
    const existing = seen.get(r.uri)
    if (!existing) {
      seen.set(r.uri, r)
    } else {
      const existingLen =
        (existing.meta?.length ?? 0) + (existing.excerpt?.length ?? 0)
      const newLen = (r.meta?.length ?? 0) + (r.excerpt?.length ?? 0)
      if (newLen > existingLen) seen.set(r.uri, r)
    }
  }

  const deduped = Array.from(seen.values())
  return { results: deduped, total: deduped.length }
}
