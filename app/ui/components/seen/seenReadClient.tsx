'use client'
import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { SeenArticle } from '@/app/lib/types'
import styles from './seenReadClient.module.css'

const CATEGORIES = [
  { name: 'Features', slug: 'features' },
  { name: 'Essays', slug: 'essays' },
  { name: 'Reviews', slug: 'reviews' },
  { name: 'Interviews', slug: 'interviews' },
  { name: 'Profiles', slug: 'profiles' },
  { name: 'In Focus', slug: 'in-focus' },
  { name: 'Studio Visit', slug: 'studio-visit' },
  { name: 'From the Editor', slug: 'editor' },
]

const PAGE_SIZE = 9

type Props = {
  articles: SeenArticle[]
}

export default function SeenReadClient({ articles }: Props) {
  const searchParams = useSearchParams()

  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') ?? 'all',
  )
  const [selectedIssue, setSelectedIssue] = useState<string>(
    searchParams.get('issue') ?? 'all',
  )
  const [selectedAuthor, setSelectedAuthor] = useState<string>(
    searchParams.get('author') ?? 'all',
  )
  const [submittedSearch, setSubmittedSearch] = useState<string>(
    searchParams.get('search') ?? '',
  )
  const [search, setSearch] = useState<string>(searchParams.get('search') ?? '')
  const [page, setPage] = useState(1)

  const issues = useMemo(() => {
    const set = new Map<string, string>()
    articles.forEach((a) => {
      a.seenIssues?.nodes?.forEach((i) => set.set(i.slug, i.name))
    })
    return Array.from(set.entries()).map(([slug, name]) => ({ slug, name }))
  }, [articles])

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        a.seenCategories?.nodes?.some((c) => c.slug === selectedCategory)
      const matchesIssue =
        selectedIssue === 'all' ||
        a.seenIssues?.nodes?.some((i) => i.slug === selectedIssue)
      const matchesAuthor =
        selectedAuthor === 'all' ||
        a.seenAuthors?.nodes?.some((au) => au.slug === selectedAuthor)
      const matchesSearch =
        !submittedSearch ||
        a.title?.toLowerCase().includes(submittedSearch.toLowerCase()) ||
        a.seenAuthors?.nodes?.some((au) =>
          au.name.toLowerCase().includes(submittedSearch.toLowerCase()),
        ) ||
        a.seenCategories?.nodes?.some((c) =>
          c.name.toLowerCase().includes(submittedSearch.toLowerCase()),
        ) ||
        a.seenIssues?.nodes?.some((i) =>
          i.name.toLowerCase().includes(submittedSearch.toLowerCase()),
        ) ||
        a.seenArticleLayouts?.introduction
          ?.toLowerCase()
          .includes(submittedSearch.toLowerCase())
      return matchesCategory && matchesIssue && matchesAuthor && matchesSearch
    })
  }, [
    articles,
    selectedCategory,
    selectedIssue,
    selectedAuthor,
    submittedSearch,
  ])

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  function handleCategoryClick(slug: string) {
    setSelectedCategory(slug)
    setPage(1)
  }

  function handleSearch() {
    setSubmittedSearch(search)
    setPage(1)
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <button
          className={`${styles.navItem} ${selectedCategory === 'all' ? styles.active : ''}`}
          onClick={() => handleCategoryClick('all')}
        >
          (All)
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            className={`${styles.navItem} ${selectedCategory === cat.slug ? styles.active : ''}`}
            onClick={() => handleCategoryClick(cat.slug)}
          >
            {cat.name}
          </button>
        ))}

        <div className={styles.filterSection}>
          <div className={styles.filterDropdown}>
            <select
              className={styles.select}
              value={selectedIssue}
              onChange={(e) => {
                setSelectedIssue(e.target.value)
                setPage(1)
              }}
            >
              <option value='all'>FILTER BY</option>
              {issues.map((i) => (
                <option key={i.slug} value={i.slug}>
                  {i.name}
                </option>
              ))}
            </select>
            <span className={styles.selectIcon}>+</span>
          </div>
          <div className={styles.searchRow}>
            <input
              className={styles.searchInput}
              type='text'
              placeholder='SEARCH'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
              VIEW
            </button>
          </div>
        </div>
      </aside>

      {/* Grid */}
      <div className={styles.gridWrapper}>
        {/* Active filters */}
        {selectedAuthor !== 'all' && (
          <div className={styles.activeFilter}>
            <span>
              Filtering by author:{' '}
              {articles
                .flatMap((a) => a.seenAuthors?.nodes ?? [])
                .find((au) => au.slug === selectedAuthor)?.name ??
                selectedAuthor}
            </span>
            <button
              className={styles.clearFilter}
              onClick={() => {
                setSelectedAuthor('all')
                setPage(1)
              }}
            >
              ✕ Clear
            </button>
          </div>
        )}
        {submittedSearch && (
          <div className={styles.activeFilter}>
            <span>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for
              &ldquo;{submittedSearch}&rdquo;
            </span>
            <button
              className={styles.clearFilter}
              onClick={() => {
                setSearch('')
                setSubmittedSearch('')
                setPage(1)
              }}
            >
              ✕ Clear
            </button>
          </div>
        )}

        <div className={styles.grid}>
          {visible.map((article, i) => {
            const issueSlug = article.seenIssues?.nodes?.[0]?.slug ?? 'issue'
            const href = `/seen/read/${issueSlug}/${article.slug}`
            const categories = article.seenCategories?.nodes ?? []
            const authors = article.seenAuthors?.nodes ?? []

            return (
              <div key={i} className={styles.card}>
                {article.featuredImage?.node?.sourceUrl && (
                  <div className={styles.imageWrapper}>
                    <Image
                      src={article.featuredImage.node.sourceUrl}
                      alt={article.featuredImage.node.altText ?? ''}
                      fill
                      sizes='(max-width: 768px) 100vw, 33vw'
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className={styles.cardInfo}>
                  {categories.length > 0 && (
                    <p className={styles.cardCategory}>
                      ({categories.map((c) => c.name).join(') (')})
                    </p>
                  )}
                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  {authors.length > 0 && (
                    <p className={styles.cardAuthor}>
                      BY{' '}
                      {authors
                        .map((a) => a.name)
                        .join(', ')
                        .toUpperCase()}
                    </p>
                  )}
                </div>
                <div className={styles.cardActions}>
                  <Link href={href} className={styles.readButton}>
                    READ
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
        {hasMore && (
          <div className={styles.loadMore}>
            <button
              className={styles.loadMoreButton}
              onClick={() => setPage((p) => p + 1)}
            >
              LOAD MORE
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
