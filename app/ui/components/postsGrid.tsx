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
}

export default function PostsGrid({ data, pressReleasePosts }: Props) {
  const { customPosts, posts, gridColumns, heading, type, showFilters } = data

  const isPress = type?.includes('press')

  const [selectedYear, setSelectedYear] = useState<string>('')
  const [page, setPage] = useState(1)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const years = useMemo(() => {
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
  const hasMore = visiblePress.length < filteredPress.length

  const hasCustomPosts = customPosts && customPosts.length > 0
  const hasPosts = posts?.nodes && posts.nodes.length > 0

  if (isPress) {
    console.log(
      'pressReleasePosts in component:',
      pressReleasePosts?.length,
      isPress,
    )
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
                  {years.map((year) => (
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
        {hasMore && (
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
