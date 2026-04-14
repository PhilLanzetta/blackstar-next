'use client'
import { useState, useMemo } from 'react'
import type {
  PostsGridLayout,
  CustomPost,
  ProgramEvent,
  WPPost,
} from '@/app/lib/types'
import CustomPostCard from '@/app/ui/components/customPostCard'
import PostCard from '@/app/ui/components/postCard'
import styles from './postsGrid.module.css'

const PAGE_SIZE = 6

type Props = {
  data: PostsGridLayout
  pressReleasePosts?: WPPost[]
  allPosts?: WPPost[]
}

export default function PostsGrid({
  data,
  pressReleasePosts,
  allPosts,
}: Props) {
  const { customPosts, posts, gridColumns, heading, type, showFilters } = data

  const isPress = type?.includes('press')
  const isPosts = type?.includes('posts')

  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Press type — year filter
  const pressYears = useMemo(() => {
    if (!isPress || !pressReleasePosts) return []
    const set = new Set(
      pressReleasePosts.map((p) => new Date(p.date).getFullYear().toString()),
    )
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [isPress, pressReleasePosts])

  const filteredPress = useMemo(() => {
    if (!isPress || !pressReleasePosts) return []
    if (!selectedYear) return pressReleasePosts
    return pressReleasePosts.filter(
      (p) => new Date(p.date).getFullYear().toString() === selectedYear,
    )
  }, [isPress, pressReleasePosts, selectedYear])

  const visiblePress = filteredPress.slice(0, page * PAGE_SIZE)
  const hasMorePress = visiblePress.length < filteredPress.length

  // Posts type — category filter
  const filteredPosts = useMemo(() => {
    if (!isPosts || !allPosts) return []
    if (selectedCategory === 'all') return allPosts
    if (selectedCategory === 'press') {
      return allPosts.filter((p) =>
        p.categories?.nodes?.some((c) =>
          c.name.toLowerCase().includes('press'),
        ),
      )
    }
    if (selectedCategory === 'blog') {
      return allPosts.filter((p) =>
        p.categories?.nodes?.some((c) => c.name.toLowerCase().includes('blog')),
      )
    }
    return allPosts
  }, [isPosts, allPosts, selectedCategory])

  const visiblePosts = filteredPosts.slice(0, page * PAGE_SIZE)
  const hasMorePosts = visiblePosts.length < filteredPosts.length

  const hasCustomPosts = customPosts && customPosts.length > 0
  const hasPosts = posts?.nodes && posts.nodes.length > 0

  if (isPosts) {
    return (
      <section className={styles.wrapper}>
        {heading && <h2 className={styles.heading}>{heading}</h2>}
        {showFilters && (
          <div className={styles.categoryFilters}>
            <button
              className={`${styles.categoryFilter} ${selectedCategory === 'all' ? styles.active : ''}`}
              onClick={() => {
                setSelectedCategory('all')
                setPage(1)
              }}
            >
              ALL NEWS
            </button>
            <button
              className={`${styles.categoryFilter} ${selectedCategory === 'blog' ? styles.active : ''}`}
              onClick={() => {
                setSelectedCategory('blog')
                setPage(1)
              }}
            >
              BLOG
            </button>
            <button
              className={`${styles.categoryFilter} ${selectedCategory === 'press' ? styles.active : ''}`}
              onClick={() => {
                setSelectedCategory('press')
                setPage(1)
              }}
            >
              PRESS RELEASE
            </button>
          </div>
        )}
        <div
          className={styles.grid}
          style={{ gridTemplateColumns: `repeat(${gridColumns ?? 3}, 1fr)` }}
        >
          {visiblePosts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))}
        </div>
        {hasMorePosts && (
          <div className={styles.loadMoreContainer}>
            <button
              className={styles.loadMore}
              onClick={() => setPage((p) => p + 1)}
            >
              LOAD MORE
            </button>
          </div>
        )}
      </section>
    )
  }

  if (isPress) {
    return (
      <section className={styles.wrapper}>
        {heading && <h2 className={styles.heading}>{heading}</h2>}
        {showFilters && (
          <div className={styles.filters}>
            <div className={styles.dropdown}>
              <button
                className={styles.dropdownToggle}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>{selectedYear || 'YEAR'}</span>
                <span className={styles.dropdownIcon}>+</span>
              </button>
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => {
                      setSelectedYear('')
                      setPage(1)
                      setDropdownOpen(false)
                    }}
                  >
                    All Years
                  </button>
                  {pressYears.map((year) => (
                    <button
                      key={year}
                      className={`${styles.dropdownItem} ${selectedYear === year ? styles.active : ''}`}
                      onClick={() => {
                        setSelectedYear(year)
                        setPage(1)
                        setDropdownOpen(false)
                      }}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div
          className={styles.grid}
          style={{ gridTemplateColumns: `repeat(${gridColumns ?? 3}, 1fr)` }}
        >
          {visiblePress.map((post, index) => (
            <PostCard key={index} post={post} />
          ))}
        </div>
        {hasMorePress && (
          <div className={styles.loadMoreContainer}>
            <button
              className={styles.loadMore}
              onClick={() => setPage((p) => p + 1)}
            >
              LOAD MORE
            </button>
          </div>
        )}
      </section>
    )
  }

  if (!hasCustomPosts && !hasPosts) return null

  return (
    <section className={styles.wrapper}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${gridColumns ?? 3}, 1fr)` }}
      >
        {hasCustomPosts &&
          (customPosts as CustomPost[]).map((post, index) => (
            <CustomPostCard key={index} post={post} />
          ))}
        {hasPosts &&
          posts!.nodes.map((post, index) => (
            <PostCard key={index} post={post as ProgramEvent | WPPost} />
          ))}
      </div>
    </section>
  )
}
