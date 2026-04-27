'use client'
import { useWishlist } from '@/app/ui/components/festival/eventiveWishlistContext'
import type { FestivalEvent } from '@/app/lib/types'
import FestivalScheduleClient from '@/app/ui/components/festival/festivalScheduleClient'
import { useRef, useEffect, useState } from 'react'

type Props = {
  events: FestivalEvent[]
  dates: { name: string; slug: string; count?: number | null }[]
  venues: { name: string; slug: string; count?: number | null }[]
  tags: { name: string; slug: string; count?: number | null }[]
}

export default function MySchedulePage({ events, dates, venues, tags }: Props) {
  const { wishlist, loggedIn } = useWishlist()
  const [myEvents, setMyEvents] = useState<FestivalEvent[]>([])
  const [myDates, setMyDates] = useState<typeof dates>([])
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current && wishlist.length === 0) return
    initialized.current = true

    const filtered = events.filter(
      (e) =>
        e.festivalEventAcf?.eventiveId &&
        wishlist.includes(e.festivalEventAcf.eventiveId),
    )

    const filteredDates = dates.filter((d) =>
      filtered.some((e) =>
        e.festivalDates?.nodes.some((n) => n.slug === d.slug),
      ),
    )

    setMyEvents(filtered)
    setMyDates(filteredDates)
  }, [wishlist, events, dates])

  const emptyMessage = (
    <div
      style={{
        padding: '20px',
        fontFamily: 'var(--gt-mono)',
        textTransform: 'uppercase',
      }}
    >
      <p>
        No events saved yet. Click the ♥ on any event to save it to your
        schedule.
      </p>
      {!loggedIn && (
        <div style={{ marginTop: '12px' }}>
          <p>Log in to sync your schedule across devices.</p>
          <div
            className='eventive-button'
            data-login='true'
            style={{ marginTop: '8px' }}
          />
        </div>
      )}
    </div>
  )

  return (
    <FestivalScheduleClient
      events={myEvents}
      dates={myDates}
      venues={venues}
      tags={tags}
      isMySchedule
      emptyMessage={emptyMessage}
    />
  )
}
