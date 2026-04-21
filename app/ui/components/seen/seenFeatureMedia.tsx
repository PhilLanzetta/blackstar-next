'use client'
import Image from 'next/image'
import { useRef, useEffect } from 'react'
import type { SeenFeatureMediaLayout } from '@/app/lib/types'
import { formatLink, isExternalLink } from '@/app/lib/utils/formatLink'
import LinkButton from '@/app/ui/components/linkButton'
import styles from './seenFeatureMedia.module.css'

type Props = {
  data: SeenFeatureMediaLayout
}

export default function SeenFeatureMedia({ data }: Props) {
  const { heading, image, mobileImage, video, mobileVideo, link } = data

  const videoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    videoRef.current?.play().catch(() => {})
    mobileVideoRef.current?.play().catch(() => {})
  }, [])

  const hasVideo = !!video?.node?.mediaItemUrl
  const hasMobileVideo = !!mobileVideo?.node?.mediaItemUrl
  const hasMobileImage = !!mobileImage?.node?.sourceUrl
  const mobileUsesDesktop = !hasMobileVideo && !hasMobileImage
  const showInfoBox = heading || link

  return (
    <section
      className={`${styles.section} ${hasVideo || hasMobileVideo ? styles.fullHeight : ''}`}
    >
      {/* Desktop media */}
      {hasVideo ? (
        <video
          ref={videoRef}
          className={`${styles.media} ${!mobileUsesDesktop ? styles.desktopOnly : ''}`}
          src={video!.node.mediaItemUrl}
          poster={image?.node?.sourceUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : image?.node?.sourceUrl ? (
        <Image
          src={image.node.sourceUrl}
          alt={image.node.altText ?? ''}
          width={0}
          height={0}
          sizes='100vw'
          style={{ width: '100%', height: 'auto' }}
          className={`${!mobileUsesDesktop ? styles.desktopOnly : ''}`}
        />
      ) : null}

      {/* Mobile media */}
      {hasMobileVideo ? (
        <video
          ref={mobileVideoRef}
          className={`${styles.media} ${styles.mobileOnly}`}
          src={mobileVideo!.node.mediaItemUrl}
          poster={mobileImage?.node?.sourceUrl ?? image?.node?.sourceUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : hasMobileImage ? (
        <Image
          src={mobileImage!.node!.sourceUrl}
          alt={mobileImage!.node!.altText ?? ''}
          fill
          sizes='100vw'
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          className={`${styles.media} ${styles.mobileOnly}`}
        />
      ) : null}

      {/* Info box */}
      {showInfoBox && (
        <div className={styles.infoBox}>
          {heading && <p className={styles.heading}>{heading}</p>}
          {link?.url && (
            <LinkButton
              href={formatLink(link.url)}
              label={link.title}
              target={isExternalLink(link.url) ? '_blank' : undefined}
              variant='white'
            />
          )}
        </div>
      )}
    </section>
  )
}
