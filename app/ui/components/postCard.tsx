import Image from 'next/image'
import type { ProgramEvent, WPPost, WPPage } from '@/app/lib/types'
import styles from './postCard.module.css'
import LinkButton from './linkButton'
import { formatEventLink } from '@/app/lib/utils/formatLink'

type PostCardProps = {
  post: ProgramEvent | WPPost | WPPage
}

export default function PostCard({ post }: PostCardProps) {
  const isProgramEvent = post.__typename === 'ProgramEvent'
  const isPost = post.__typename === 'Post'

  // Shared fields
  const { title, link, featuredImage } = post

  // ProgramEvent specific
  const event = isProgramEvent ? (post as ProgramEvent).event : null
  const programTypeSlug = event?.programType?.nodes?.[0]?.name

  const isPage = post.__typename === 'Page'

  // WPPost specific
  const date = isPost ? (post as WPPost).date : null
  const categories = isPost ? (post as WPPost).categories : null
  const pressRelease = isPost ? (post as WPPost).pressRelease : null

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
    : date
      ? formatEventDate(date)
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

  if (date) {
    dateInfo = <div className={styles.infoDate}>{datePart}</div>
  }

  return (
    <div className={styles.card}>
      {featuredImage?.node?.sourceUrl && (
        <div className={styles.imageWrapper}>
          <Image
            src={featuredImage.node.sourceUrl}
            alt={featuredImage.node.altText ?? ''}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      )}
      {!isPage && (
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
          {categories?.nodes && (
            <div className={styles.tags}>
              <span className={styles.tag}>({categories?.nodes[0].name})</span>
            </div>
          )}
          {dateInfo}
        </div>
      )}
      <div
        className={styles.textInfo}
        style={{
          borderBottom: link ? 'var(--standard-border)' : 'none',
        }}
      >
        <div
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: title }}
        ></div>
        {event?.customExcerpt && (
          <div
            className={styles.excerpt}
            dangerouslySetInnerHTML={{ __html: event.customExcerpt }}
          ></div>
        )}
        {pressRelease?.introduction && (
          <div
            className={styles.excerpt}
            dangerouslySetInnerHTML={{ __html: pressRelease.introduction }}
          ></div>
        )}
      </div>
      <div className={styles.learnMore}>
        {link && (
          <LinkButton
            href={formatEventLink(link, programTypeSlug)}
            label={pressRelease ? 'Read' : 'Learn More'}
          />
        )}
        {pressRelease?.pdf?.node?.mediaItemUrl && (
          <LinkButton
            href={pressRelease.pdf.node.mediaItemUrl}
            label='Download PDF'
            target='_blank'
          />
        )}
      </div>
    </div>
  )
}
