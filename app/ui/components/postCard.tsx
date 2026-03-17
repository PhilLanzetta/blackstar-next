import Image from 'next/image'
import Link from 'next/link'
import type { ProgramEvent } from '@/app/lib/types'
import styles from './postCard.module.css'
import LinkButton from './linkButton'

type PostCardProps = {
  post: ProgramEvent
}

export default function PostCard({ post }: PostCardProps) {
  const { title, link, featuredImage, event } = post

  function getIANATimezone(tz: string): string {
    const map: Record<string, string> = {
      ET: 'America/New_York',
      EST: 'America/New_York',
      EDT: 'America/New_York',
      CT: 'America/Chicago',
      CST: 'America/Chicago',
      CDT: 'America/Chicago',
      MT: 'America/Denver',
      MST: 'America/Denver',
      MDT: 'America/Denver',
      PT: 'America/Los_Angeles',
      PST: 'America/Los_Angeles',
      PDT: 'America/Los_Angeles',
    }
    return map[tz] ?? 'America/New_York' // fallback to ET
  }

  function formatEventDate(dateString: string, timezone?: string) {
    const stripped = dateString.split('+')[0]
    const date = new Date(stripped)
    const iana = getIANATimezone(timezone ?? 'ET')

    const datePart = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: iana,
    }).format(date)

    const timePart = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: iana,
    }).format(date)

    return { datePart, timePart }
  }

  const { datePart, timePart } = event?.startTime
    ? formatEventDate(event.startTime, event.timezone)
    : { datePart: null, timePart: null }

  let dateInfo

  if (event?.listingDateFormat) {
    if (event.listingDateFormat[0] === 'start_date_time') {
      dateInfo = (
        <div className={styles.infoDate}>
          {datePart}, {timePart}
        </div>
      )
    } else if (event.listingDateFormat[0] === 'start_date') {
      dateInfo = <div className={styles.infoDate}>{datePart}</div>
    } else if (event.listingDateFormat[0] === 'start_end_date') {
      const { datePart: endDatePart } = event?.endTime
        ? formatEventDate(event.endTime)
        : { datePart: null }
      dateInfo = (
        <div className={styles.infoDate}>
          {datePart} – {endDatePart}
        </div>
      )
    }
  }

  return (
    <div className={styles.card}>
      {featuredImage?.node?.sourceUrl && (
        <div className={styles.imageWrapper}>
          <Image
            src={featuredImage.node.sourceUrl}
            alt={featuredImage.node.altText ?? ''}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      )}
      <div className={styles.info}>
        {event?.programType?.nodes?.length && (
          <div className={styles.tags}>
            {event.programType.nodes.map((type, i) => (
              <span key={i} className={styles.tag}>
                ({type.name})
              </span>
            ))}
          </div>
        )}
        {dateInfo}
      </div>
      <div className={styles.textInfo}>
        <h3 className={styles.title}>{title}</h3>
        {event?.customExcerpt && (
          <p className={styles.excerpt}>{event.customExcerpt}</p>
        )}
      </div>
      <div className={styles.learnMore}>
        {link && <LinkButton href={link} label='Learn More' />}
      </div>
    </div>
  )
}
