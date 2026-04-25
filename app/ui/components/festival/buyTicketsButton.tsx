'use client'
import { useEffect } from 'react'
import styles from './buyTicketsButton.module.css'

type Props = {
  eventiveId: string
  ticketsAvailable?: boolean
  hideTicketsButton?: boolean
  externalTicketsUrl?: string | null
  allowVote?: boolean
  label?: string
}

export default function BuyTicketsButton({
  eventiveId,
  ticketsAvailable,
  hideTicketsButton,
  externalTicketsUrl,
  allowVote = false,
}: Props) {
  useEffect(() => {
    // Listen for universal ticket button actions once
    if (typeof window === 'undefined' || !(window as any).Eventive) return

    ;(window as any).Eventive.on('universal_ticket_button_action', (event: any) => {
      if (event.action === 'order_placed') {
        // Could trigger a refresh of availability state here
        console.log('Order placed for event:', event.target.event_id)
      }
    })
  }, [])

  if (hideTicketsButton) return null
  if (!ticketsAvailable && !externalTicketsUrl) return null

  if (externalTicketsUrl) {
    return (
      <a
        href={externalTicketsUrl}
        target='_blank'
        rel='noopener noreferrer'
        className={styles.externalButton}
      >
        Buy Tickets
      </a>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div
        className='eventive-button'
        data-event={eventiveId}
        data-universal='true'
      />
      {allowVote && (
        <div
          className='eventive-button'
          data-vote-event={eventiveId}
          data-vote='true'
        />
      )}
    </div>
  )
}