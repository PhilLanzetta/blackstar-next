'use client'
// app/components/search/SearchInput.tsx

import { useRouter } from 'next/navigation'
import { useState, useRef, useTransition, useEffect, useCallback } from 'react'
import styles from './search.module.css'

interface Props {
  initialValue?: string
}

export default function SearchInput({ initialValue = '' }: Props) {
  const router = useRouter()
  const [value, setValue] = useState(initialValue)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const submit = useCallback(
    (q: string) => {
      const trimmed = q.trim()
      startTransition(() => {
        if (trimmed.length >= 2) {
          router.push(`/search?q=${encodeURIComponent(trimmed)}`, {
            scroll: false,
          })
        } else {
          router.push('/search', { scroll: false })
        }
      })
    },
    [router],
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit(value)
  }

  return (
    <div className={styles.searchBar} role='search'>
      <input
        ref={inputRef}
        type='text'
        className={styles.searchBarInput}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Programs'
        aria-label='Search BlackStar'
        autoComplete='off'
        spellCheck={false}
      />
      <button
        type='button'
        className={styles.searchBarButton}
        onClick={() => submit(value)}
        disabled={isPending}
        aria-label='Submit search'
      >
        {isPending ? '…' : 'GO'}
      </button>
    </div>
  )
}
