'use client'
import { useState, useMemo } from 'react'
import type { PressClipping, PressClippingsLayout } from '@/app/lib/types'
import styles from './pressClippings.module.css'

const PAGE_SIZE = 12

type Props = {
  data: PressClippingsLayout
  clippings: PressClipping[]
}

export default function PressClippings({ data, clippings }: Props) {
  const { heading } = data
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [page, setPage] = useState(1)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const years = useMemo(() => {
    const set = new Set(
      clippings.map((c) => new Date(c.date).getFullYear().toString()),
    )
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [clippings])

  const filtered = useMemo(() => {
    if (!selectedYear) return clippings
    return clippings.filter(
      (c) => new Date(c.date).getFullYear().toString() === selectedYear,
    )
  }, [clippings, selectedYear])

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  function formatDate(dateString: string) {
    return new Date(dateString)
      .toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      .toUpperCase()
  }

  return (
    <section className={styles.section}>
      <div className={styles.sidebar}>
        {heading && <h2 className={styles.heading}>{heading}</h2>}
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
      <div className={styles.grid}>
        {visible.map((clipping, i) => (
          <a
            key={i}
            href={clipping.pressClippingsAcf.link.url}
            target={clipping.pressClippingsAcf.link.target || '_blank'}
            rel='noopener noreferrer'
            className={styles.card}
          >
            <p className={styles.title}>{clipping.title}</p>
            <p className={styles.meta}>
              {clipping.pressClippingsAcf.newspaperSource && (
                <span>{clipping.pressClippingsAcf.newspaperSource}</span>
              )}
            </p>
          </a>
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
