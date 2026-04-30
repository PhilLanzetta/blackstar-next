import Image from 'next/image'
import Link from 'next/link'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import {
  FestivalLayout,
  FestivalHeadingLayout,
  FestivalExplainersLayout,
  FestivalBiosLayout,
  FestivalContentLayout,
  FestivalCardsLayout,
  FestivalButtonsLayout,
  FestivalSponsorsCarouselLayout,
} from '@/app/lib/types'
import WishlistButton from './wishlistButton'
import styles from './festivalEventPage.module.css'
import FestivalHeading from '@/app/ui/components/festival/festivalHeading'
import FestivalExplainers from '@/app/ui/components/festival/festivalExplainers'
import FestivalBios from '@/app/ui/components/festival/festivalBios'
import FestivalContent from '@/app/ui/components/festival/festivalContent'
import FestivalCards from '@/app/ui/components/festival/festivalCards'
import FestivalButtons from '@/app/ui/components/festival/festivalButtons'
import FestivalSponsors from '@/app/ui/components/festival/festivalSponsors'

type Film = {
  title: string
  slug: string
  uri: string
  excerpt?: string | null
  featuredImage?: { node: { sourceUrl: string; altText: string } } | null
  premiereStatuses?: { nodes: { name: string; slug: string }[] } | null
  festivalAwards?: { nodes: { name: string; slug: string }[] } | null
  eventiveTags?: { nodes: { name: string; slug: string }[] } | null
}

type EventInstance = {
  title: string
  slug: string
  uri: string
  featuredImage?: { node: { sourceUrl: string; altText: string } } | null
  festivalEventAcf?: {
    startTime?: string | null
    endTime?: string | null
    timezoneAbv?: string | null
    isVirtual?: boolean | null
    ticketsAvailable?: boolean | null
    hideTicketsButton?: boolean | null
    eventiveId?: string | null
  } | null
  festivalVenues?: { nodes: { name: string; slug: string }[] } | null
}

type Props = {
  festivalYear?: string
  event: {
    title: string
    slug: string
    uri: string
    content?: string | null
    featuredImage?: { node: { sourceUrl: string; altText: string } } | null
    premiereStatuses?: { nodes: { name: string; slug: string }[] } | null
    festivalAwards?: { nodes: { name: string; slug: string }[] } | null
    eventiveTags?: { nodes: { name: string; slug: string }[] } | null
    festivalVenues?: { nodes: { name: string; slug: string }[] } | null
    festivalDates?: { nodes: { name: string; slug: string }[] } | null
    festivalEventAcf?: {
      eventiveId?: string | null
      ticketsAvailable?: boolean | null
      hideTicketsButton?: boolean | null
      externalTicketsUrl?: string | null
      startTime?: string | null
      endTime?: string | null
      timezoneAbv?: string | null
      isVirtual?: boolean | null
      isEvent?: boolean | null
      eventLayout?: string[] | null
      informationHeading?: string | null
      filmsHeading?: string | null
      multipleShowings?: boolean | null
      location?: string | null
      coverImage?: { node: { sourceUrl: string; altText: string } } | null
      films?: { nodes: Film[] } | null
      duplicateEvents?: { nodes: EventInstance[] } | null
      relatedEvents?: { nodes: EventInstance[] } | null
      additionalCredits?:
        | {
            label?: string | null
            type?: string[] | null
            credit?: string | null
            link?: string | null
            logo?: { node: { sourceUrl: string; altText: string } } | null
            manualCredits?:
              | {
                  link?: string | null
                  logo?: { node: { sourceUrl: string } } | null
                }[]
              | null
            sponsors?: {
              nodes: {
                title?: string | null
                sponsorAcf?: {
                  logo?: { node: { sourceUrl: string; altText: string } } | null
                  logoBlack?: {
                    node: { sourceUrl: string; altText: string }
                  } | null
                  website?: string | null
                } | null
              }[]
            } | null
          }[]
        | null
    } | null
    festivalFlexibleLayoutsAcf?: {
      festival24FlexibleLayouts?: {
        layouts: FestivalLayout[]
      }[]
    } | null
  }
}

function formatTime(isoString: string, timezoneAbv?: string | null): string {
  try {
    const date = new Date(isoString)
    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `${displayHours}:${displayMinutes}${period}${timezoneAbv ? ` ${timezoneAbv}` : ''}`
  } catch {
    return ''
  }
}

export default function FestivalEventPage({
  event,
  festivalYear = '2025',
}: Props) {
  const acf = event.festivalEventAcf
  const isCollection = acf?.eventLayout?.[0] === 'collection'
  const films = acf?.films?.nodes ?? []
  const coverImage = acf?.coverImage?.node ?? event.featuredImage?.node
  const allInstances = acf?.duplicateEvents?.nodes ?? []
  const inPersonInstances = allInstances.filter(
    (e) => !e.festivalEventAcf?.isVirtual,
  )
  const virtualInstances = allInstances.filter(
    (e) => e.festivalEventAcf?.isVirtual,
  )

  const thisInstance: EventInstance = {
    title: event.title,
    slug: event.slug,
    uri: event.uri,
    festivalEventAcf: acf,
    festivalVenues: event.festivalVenues,
  }

  const isThisVirtual = acf?.isVirtual
  const allInPersonInstances = isThisVirtual
    ? inPersonInstances
    : [thisInstance, ...inPersonInstances]
  const allVirtualInstances = isThisVirtual
    ? [thisInstance, ...virtualInstances]
    : virtualInstances

  return (
    <div className={styles.wrapper}>
      {/* Top nav tabs */}
      <div className={styles.topNav}>
        <Link
          href={`/festival/festival-${festivalYear}/schedule`}
          className={styles.topNavItem}
        >
          Schedule
        </Link>
        <Link
          href={`/festival/festival-${festivalYear}/film-guide`}
          className={styles.topNavItem}
        >
          Films A–Z
        </Link>
        <Link
          href={`/festival/festival-${festivalYear}/event-guide`}
          className={`${styles.topNavItem} ${styles.topNavItemActive}`}
        >
          Talks & Events
        </Link>
        <Link
          href={`/festival/festival-${festivalYear}/my-schedule`}
          className={styles.topNavItem}
        >
          My Schedule
        </Link>
      </div>

      {/* Back link */}
      <div className={styles.backBar}>
        <Link
          href={`/festival/festival-${festivalYear}/schedule`}
          className={styles.backLink}
        >
          ← Back to Schedule
        </Link>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.tags}>
            {event.premiereStatuses?.nodes.map((s, i) => (
              <span key={i} className={styles.tag}>
                ({s.name} Premiere)
              </span>
            ))}
            {event.festivalAwards?.nodes.map((a, i) => (
              <span key={i} className={styles.tag}>
                ({a.name})
              </span>
            ))}
            {event.eventiveTags?.nodes.map((t, i) => (
              <span key={i} className={styles.tag}>
                {t.name}
              </span>
            ))}
          </div>
          <h1 className={styles.title}>{event.title}</h1>
        </div>
        <div className={styles.headerRight}>
          {acf?.eventiveId && <WishlistButton eventiveId={acf.eventiveId} />}
        </div>
      </div>

      {/* Cover image */}
      {coverImage?.sourceUrl && (
        <div className={styles.coverImage}>
          <Image
            src={coverImage.sourceUrl}
            alt={coverImage.altText ?? event.title ?? ''}
            fill
            sizes='100vw'
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      )}

      {/* Main content */}
      <div className={styles.mainContent}>
        {/* Left: content */}
        <div className={styles.contentCol}>
          {acf?.informationHeading && (
            <h2 className={styles.infoHeading}>{acf.informationHeading}</h2>
          )}
          {event.content && (
            <div
              className={styles.prose}
              dangerouslySetInnerHTML={{ __html: cleanHtml(event.content) }}
            />
          )}

          {/* Collection: films list */}
          {isCollection && films.length > 0 && (
            <div className={styles.filmsSection}>
              <h2 className={styles.filmsHeading}>
                {acf?.filmsHeading ?? 'Films in this Program'}
              </h2>
              <div className={styles.filmsGrid}>
                {films.map((film, i) => (
                  <Link key={i} href={film.uri} className={styles.filmCard}>
                    {film.featuredImage?.node?.sourceUrl && (
                      <div className={styles.filmCardImage}>
                        <Image
                          src={film.featuredImage.node.sourceUrl}
                          alt={film.featuredImage.node.altText ?? film.title}
                          fill
                          sizes='(max-width: 768px) 100vw, 33vw'
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div className={styles.filmCardContent}>
                      <div className={styles.filmCardTags}>
                        {film.premiereStatuses?.nodes.map((s, j) => (
                          <span key={j} className={styles.tag}>
                            {s.name} Premiere
                          </span>
                        ))}
                        {film.eventiveTags?.nodes.map((t, j) => (
                          <span key={j} className={styles.tag}>
                            {t.name}
                          </span>
                        ))}
                      </div>
                      <h3 className={styles.filmCardTitle}>{film.title}</h3>
                      {film.excerpt && (
                        <p className={styles.filmCardExcerpt}>
                          {film.excerpt.replace(/<[^>]*>/g, '').slice(0, 120)}
                          ...
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: tickets box */}
        <div className={styles.ticketsCol}>
          <div className={styles.ticketsBox}>
            <h2 className={styles.ticketsHeading}>Tickets</h2>

            {allInPersonInstances.length > 0 && (
              <div className={styles.instanceGroup}>
                <h3 className={styles.instanceGroupLabel}>In Person</h3>
                {allInPersonInstances.map((instance, i) => {
                  const iacf = instance.festivalEventAcf
                  return (
                    <div key={i} className={styles.instance}>
                      <div className={styles.instanceMeta}>
                        {iacf?.startTime && (
                          <span className={styles.instanceTime}>
                            {formatTime(iacf.startTime, iacf.timezoneAbv)}
                          </span>
                        )}
                        {instance.festivalVenues?.nodes[0] && (
                          <span className={styles.instanceVenue}>
                            {instance.festivalVenues.nodes[0].name}
                          </span>
                        )}
                      </div>
                      {iacf?.eventiveId &&
                        iacf.ticketsAvailable &&
                        !iacf.hideTicketsButton && (
                          <div
                            className='eventive-button'
                            data-event={iacf.eventiveId}
                            data-universal='true'
                          />
                        )}
                      {iacf?.eventiveId && (
                        <WishlistButton eventiveId={iacf.eventiveId} />
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {allVirtualInstances.length > 0 && (
              <div className={styles.instanceGroup}>
                <h3 className={styles.instanceGroupLabel}>Virtual</h3>
                {allVirtualInstances.map((instance, i) => {
                  const iacf = instance.festivalEventAcf
                  return (
                    <div key={i} className={styles.instance}>
                      <div className={styles.instanceMeta}>
                        {iacf?.startTime && (
                          <span className={styles.instanceTime}>
                            {formatTime(iacf.startTime, iacf.timezoneAbv)}
                          </span>
                        )}
                      </div>
                      {iacf?.eventiveId &&
                        iacf.ticketsAvailable &&
                        !iacf.hideTicketsButton && (
                          <div
                            className='eventive-button'
                            data-event={iacf.eventiveId}
                            data-universal='true'
                          />
                        )}
                      {iacf?.eventiveId && (
                        <WishlistButton eventiveId={iacf.eventiveId} />
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {allInPersonInstances.length === 0 &&
              allVirtualInstances.length === 0 && (
                <div className={styles.instance}>
                  <div className={styles.instanceMeta}>
                    {acf?.startTime && (
                      <span className={styles.instanceTime}>
                        {event.festivalDates?.nodes[0]?.name}{' '}
                        {formatTime(acf.startTime, acf.timezoneAbv)}
                      </span>
                    )}
                    {event.festivalVenues?.nodes[0] && (
                      <span className={styles.instanceVenue}>
                        {event.festivalVenues.nodes[0].name}
                      </span>
                    )}
                  </div>
                  {acf?.eventiveId &&
                    acf.ticketsAvailable &&
                    !acf.hideTicketsButton && (
                      <div
                        className='eventive-button'
                        data-event={acf.eventiveId}
                        data-universal='true'
                      />
                    )}
                  {acf?.externalTicketsUrl && (
                    <a
                      href={acf.externalTicketsUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={styles.externalTicketsBtn}
                    >
                      Buy Tickets
                    </a>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Additional credits */}
      {acf?.additionalCredits && acf.additionalCredits.length > 0 && (
        <div className={styles.additionalCredits}>
          {acf.additionalCredits.map((credit, i) => {
            const type = credit.type?.[0]
            return (
              <div key={i} className={styles.creditGroup}>
                {credit.label && (
                  <h3 className={styles.creditLabel}>{credit.label}</h3>
                )}
                {type === 'sponsor' && credit.sponsors?.nodes && (
                  <div className={styles.creditSponsors}>
                    {credit.sponsors.nodes.map((sponsor, j) => {
                      const logo =
                        sponsor.sponsorAcf?.logoBlack?.node ??
                        sponsor.sponsorAcf?.logo?.node
                      if (!logo?.sourceUrl) return null
                      const img = (
                        <Image
                          key={j}
                          src={logo.sourceUrl}
                          alt={sponsor.title ?? ''}
                          width={200}
                          height={80}
                          style={{
                            width: 'auto',
                            height: '60px',
                            objectFit: 'contain',
                          }}
                        />
                      )
                      return sponsor.sponsorAcf?.website ? (
                        <a
                          key={j}
                          href={sponsor.sponsorAcf.website}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {img}
                        </a>
                      ) : (
                        img
                      )
                    })}
                  </div>
                )}
                {type === 'logo' && credit.logo?.node?.sourceUrl && (
                  <div className={styles.creditSponsors}>
                    {credit.link ? (
                      <a
                        href={credit.link}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <Image
                          src={credit.logo.node.sourceUrl}
                          alt={credit.logo.node.altText ?? ''}
                          width={200}
                          height={80}
                          style={{
                            width: 'auto',
                            height: '60px',
                            objectFit: 'contain',
                          }}
                        />
                      </a>
                    ) : (
                      <Image
                        src={credit.logo.node.sourceUrl}
                        alt={credit.logo.node.altText ?? ''}
                        width={200}
                        height={80}
                        style={{
                          width: 'auto',
                          height: '60px',
                          objectFit: 'contain',
                        }}
                      />
                    )}
                  </div>
                )}
                {type === 'text' && credit.credit && (
                  <p className={styles.creditText}>
                    {credit.link ? (
                      <a
                        href={credit.link}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {credit.credit}
                      </a>
                    ) : (
                      credit.credit
                    )}
                  </p>
                )}
                {credit.manualCredits && credit.manualCredits.length > 0 && (
                  <div className={styles.creditSponsors}>
                    {credit.manualCredits.map((mc, j) => {
                      if (!mc.logo?.node?.sourceUrl) return null
                      return mc.link ? (
                        <a
                          key={j}
                          href={mc.link}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <Image
                            src={mc.logo.node.sourceUrl}
                            alt=''
                            width={200}
                            height={80}
                            style={{
                              width: 'auto',
                              height: '60px',
                              objectFit: 'contain',
                            }}
                          />
                        </a>
                      ) : (
                        <Image
                          key={j}
                          src={mc.logo.node.sourceUrl}
                          alt=''
                          width={200}
                          height={80}
                          style={{
                            width: 'auto',
                            height: '60px',
                            objectFit: 'contain',
                          }}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Flexible layouts */}
      {event.festivalFlexibleLayoutsAcf?.festival24FlexibleLayouts && (
        <div className={styles.flexibleLayouts}>
          {event.festivalFlexibleLayoutsAcf.festival24FlexibleLayouts
            .flatMap((section) => section.layouts ?? [])
            .filter(Boolean)
            .map((layout: FestivalLayout, index: number) => {
              switch (layout.__typename) {
                case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsHeadingLayout':
                  return (
                    <FestivalHeading
                      key={index}
                      data={layout as FestivalHeadingLayout}
                    />
                  )
                case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsExplainersLayout':
                  return (
                    <FestivalExplainers
                      key={index}
                      data={layout as FestivalExplainersLayout}
                    />
                  )
                case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsBiosLayout':
                  return (
                    <FestivalBios
                      key={index}
                      data={layout as FestivalBiosLayout}
                    />
                  )
                case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsContentLayout':
                  return (
                    <FestivalContent
                      key={index}
                      data={layout as FestivalContentLayout}
                    />
                  )
                case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsCardsLayout':
                  return (
                    <FestivalCards
                      key={index}
                      data={layout as FestivalCardsLayout}
                    />
                  )
                case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsButtonsLayout':
                  return (
                    <FestivalButtons
                      key={index}
                      data={layout as FestivalButtonsLayout}
                    />
                  )
                case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsSponsorsCarouselLayout':
                  return (
                    <FestivalSponsors
                      key={index}
                      data={layout as FestivalSponsorsCarouselLayout}
                    />
                  )
                default:
                  return null
              }
            })}
        </div>
      )}

      {/* Related events */}
      {acf?.relatedEvents?.nodes && acf.relatedEvents.nodes.length > 0 && (
        <div className={styles.relatedEvents}>
          <h2 className={styles.relatedHeading}>Related Events</h2>
          <div className={styles.relatedGrid}>
            {acf.relatedEvents.nodes.map((rel, i) => (
              <Link key={i} href={rel.uri} className={styles.relatedCard}>
                {rel.featuredImage?.node?.sourceUrl && (
                  <div className={styles.relatedCardImage}>
                    <Image
                      src={rel.featuredImage.node.sourceUrl}
                      alt={rel.featuredImage.node.altText ?? rel.title}
                      fill
                      sizes='(max-width: 768px) 100vw, 33vw'
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <h3 className={styles.relatedCardTitle}>{rel.title}</h3>
                {rel.festivalEventAcf?.startTime && (
                  <p className={styles.relatedCardMeta}>
                    {formatTime(
                      rel.festivalEventAcf.startTime,
                      rel.festivalEventAcf.timezoneAbv,
                    )}
                    {rel.festivalVenues?.nodes[0] &&
                      ` · ${rel.festivalVenues.nodes[0].name}`}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
