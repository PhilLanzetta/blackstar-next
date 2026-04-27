'use client'
import { useWishlist } from './eventiveWishlistContext'
import styles from './wishlistButton.module.css'

type Props = {
  eventiveId: string
}

export default function WishlistButton({ eventiveId }: Props) {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const saved = isWishlisted(eventiveId)

  return (
    <button
      className={`${styles.btn} ${saved ? styles.saved : ''}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(eventiveId)
      }}
      aria-label={saved ? 'Remove from My Schedule' : 'Save to My Schedule'}
    >
      <svg
        viewBox='0 0 24 24'
        width='20'
        height='20'
        fill={saved ? 'currentColor' : 'none'}
        stroke='currentColor'
        strokeWidth='2'
      >
        <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
      </svg>
    </button>
  )
}
