'use client'
import Image from 'next/image'
import { useRef, useEffect } from 'react'
import type { SpotlightHeroLayout } from '@/app/lib/types'
import styles from './spotlightHero.module.css'
import LinkButton from '@/app/ui/components/linkButton'

export default function SpotlightHero({ data }: { data: SpotlightHeroLayout }) {
  const {
    heading1,
    image,
    mobileImage,
    overlayImage,
    mobileOverlayImage,
    video,
    mobileVideo,
    links,
  } = data

  const videoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
    if (mobileVideoRef.current) {
      mobileVideoRef.current.play().catch(() => {})
    }
  }, [])

  const hasVideo =
    video && video.length > 0 && video[0]?.file?.node?.mediaItemUrl
  const hasMobileVideo =
    mobileVideo &&
    mobileVideo.length > 0 &&
    mobileVideo[0]?.file?.node?.mediaItemUrl
  const hasMobileImage = mobileImage?.node?.sourceUrl
  const mobileUsesDesktop = !hasMobileVideo && !hasMobileImage
  const showInfoBox = heading1 && !overlayImage

  return (
    <section
      style={{
        width: '100%',
        height: '100dvh',
        position: 'relative',
        marginBottom: '80px',
      }}
    >
      {/* Desktop media — always shown on desktop, also shown on mobile if no mobile media */}
      {hasVideo ? (
        <video
          ref={videoRef}
          className={`${styles.heroMedia} ${!mobileUsesDesktop ? styles.desktopOnly : ''}`}
          src={video[0].file!.node.mediaItemUrl}
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
          fill
          sizes='100vw'
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          className={`${styles.heroMedia} ${!mobileUsesDesktop ? styles.desktopOnly : ''}`}
        />
      ) : null}

      {/* Mobile media — only rendered if mobile-specific media exists */}
      {hasMobileVideo ? (
        <video
          ref={mobileVideoRef}
          className={`${styles.heroMedia} ${styles.mobileOnly}`}
          src={mobileVideo[0].file!.node.mediaItemUrl}
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
          className={`${styles.heroMedia} ${styles.mobileOnly}`}
        />
      ) : null}

      {/* Desktop overlay — shown on all sizes if no mobile overlay */}
      {overlayImage?.node?.sourceUrl && (
        <div
          className={`${styles.overlayImageContainer} ${mobileOverlayImage?.node?.sourceUrl ? styles.desktopOnly : ''}`}
        >
          <Image
            src={overlayImage.node.sourceUrl}
            alt={overlayImage.node.altText ?? ''}
            width={overlayImage.node.mediaDetails?.width ?? 1920}
            height={overlayImage.node.mediaDetails?.height ?? 200}
            className={styles.overlayImage}
          />
        </div>
      )}

      {/* Mobile overlay — only rendered if mobile-specific overlay exists */}
      {mobileOverlayImage?.node?.sourceUrl && (
        <div className={`${styles.overlayImageContainer} ${styles.mobileOnly}`}>
          <Image
            src={mobileOverlayImage.node.sourceUrl}
            alt={mobileOverlayImage.node.altText ?? ''}
            width={mobileOverlayImage.node.mediaDetails?.width ?? 1920}
            height={mobileOverlayImage.node.mediaDetails?.height ?? 200}
            className={styles.overlayImage}
          />
        </div>
      )}

      {/* Info box - only show if heading1 exists and no overlay image */}
      {showInfoBox && (
        <div className={styles.heroInfoBox}>
          <p className={styles.heroBoxHeading}>{heading1}</p>
          {links && links.length > 0 && (
            <div className={styles.heroBoxLinkContainer}>
              {links.map((item, i) => (
                <LinkButton
                  key={i}
                  href={item.link.url}
                  label={item.link.title}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
