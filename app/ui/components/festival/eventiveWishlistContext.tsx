'use client'
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'

const GUEST_WISHLIST_KEY = 'bsff_guest_wishlist'

type WishlistContextType = {
  wishlist: string[]
  toggleWishlist: (eventiveId: string) => Promise<void>
  isWishlisted: (eventiveId: string) => boolean
  loading: boolean
  loggedIn: boolean
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  toggleWishlist: async () => {},
  isWishlisted: () => false,
  loading: true,
  loggedIn: false,
})

export function useWishlist() {
  return useContext(WishlistContext)
}

function getGuestWishlist(): string[] {
  try {
    const stored = localStorage.getItem(GUEST_WISHLIST_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveGuestWishlist(ids: string[]) {
  try {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(ids))
  } catch {
    // silent
  }
}

function clearGuestWishlist() {
  try {
    localStorage.removeItem(GUEST_WISHLIST_KEY)
  } catch {
    // silent
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    return getGuestWishlist()
  })
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const loggedInRef = useRef(false)

  async function syncWishlistFromEventive(
    userToken: string,
  ): Promise<string[]> {
    try {
      const res = await fetch(`/api/eventive/wishlist?token=${userToken}`)
      const data = await res.json()
      if (data.events) {
        return data.events.map((e: any) => e.id ?? e.event_id ?? e)
      }
    } catch {
      // silent
    }
    return []
  }

  async function pushWishlistToEventive(userToken: string, ids: string[]) {
    try {
      await fetch(`/api/eventive/wishlist?token=${userToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: ids }),
      })
    } catch {
      // silent
    }
  }

  async function handleLogin(userToken: string) {
    setToken(userToken)
    setLoggedIn(true)
    loggedInRef.current = true

    const eventiveIds = await syncWishlistFromEventive(userToken)
    const guestIds = getGuestWishlist()
    const merged = Array.from(new Set([...eventiveIds, ...guestIds]))

    if (guestIds.length > 0) {
      await pushWishlistToEventive(userToken, merged)
      clearGuestWishlist()
    }

    setWishlist(merged)
  }

  function handleLogout() {
    setToken(null)
    setLoggedIn(false)
    loggedInRef.current = false
    setWishlist([])
  }

  useEffect(() => {
    setLoading(false)

    const poll = setInterval(() => {
      const Eventive = (window as any).Eventive
      if (!Eventive) return
      clearInterval(poll)

      Eventive.on('ready', async () => {
        const userToken = Eventive.getToken?.() ?? Eventive.token
        if (userToken) {
          await handleLogin(userToken)
        }
      })

      Eventive.on('auth', async () => {
        const userToken = Eventive.getToken?.() ?? Eventive.token
        if (userToken) {
          await handleLogin(userToken)
        } else if (loggedInRef.current) {
          handleLogout()
        }
        // If never logged in, do nothing — preserve guest wishlist
      })
    }, 200)

    return () => clearInterval(poll)
  }, [])

  const toggleWishlist = useCallback(
    async (eventiveId: string) => {
      const isCurrentlyWishlisted = wishlist.includes(eventiveId)
      const newWishlist = isCurrentlyWishlisted
        ? wishlist.filter((id) => id !== eventiveId)
        : [...wishlist, eventiveId]

      setWishlist(newWishlist)

      if (token && loggedInRef.current) {
        try {
          await fetch(`/api/eventive/wishlist?token=${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events: newWishlist }),
          })
        } catch {
          setWishlist(wishlist)
        }
      } else {
        saveGuestWishlist(newWishlist)
      }
    },
    [token, wishlist],
  )

  const isWishlisted = useCallback(
    (eventiveId: string) => wishlist.includes(eventiveId),
    [wishlist],
  )

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isWishlisted, loading, loggedIn }}
    >
      {children}
    </WishlistContext.Provider>
  )
}
