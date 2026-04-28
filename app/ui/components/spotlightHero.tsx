import Image from 'next/image'
import type { SpotlightHeroLayout } from '@/app/lib/types'
import styles from './spotlightHero.module.css'
import LinkButton from '@/app/ui/components/linkButton'
import SpotlightHeroVideo from './spotlightHeroVideo'

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

  const hasVideo =
    (video?.length ?? 0) > 0 && video?.[0]?.file?.node?.mediaItemUrl
  const hasMobileVideo =
    (mobileVideo?.length ?? 0) > 0 && mobileVideo?.[0]?.file?.node?.mediaItemUrl
  const hasMobileImage = mobileImage?.node?.sourceUrl
  const mobileUsesDesktop = !hasMobileVideo && !hasMobileImage
  const showInfoBox = heading1 || (links && !overlayImage)

  return (
    <section
      style={{
        width: '100%',
        height: '100dvh',
        position: 'relative',
        marginBottom: '80px',
      }}
    >
      {/* Desktop media */}
      {hasVideo ? (
        <SpotlightHeroVideo
          src={video[0].file!.node.mediaItemUrl}
          poster={image?.node?.sourceUrl}
          className={`${styles.heroMedia} ${!mobileUsesDesktop ? styles.desktopOnly : ''}`}
        />
      ) : image?.node?.sourceUrl ? (
        <Image
          src={image.node.sourceUrl}
          alt={image.node.altText ?? ''}
          fill
          sizes='100vw'
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          className={`${styles.heroMedia} ${!mobileUsesDesktop ? styles.desktopOnly : ''}`}
        />
      ) : null}

      {/* Mobile media */}
      {hasMobileVideo ? (
        <SpotlightHeroVideo
          src={mobileVideo[0].file!.node.mediaItemUrl}
          poster={mobileImage?.node?.sourceUrl ?? image?.node?.sourceUrl}
          className={`${styles.heroMedia} ${styles.mobileOnly}`}
        />
      ) : hasMobileImage ? (
        <Image
          src={mobileImage!.node!.sourceUrl}
          alt={mobileImage!.node!.altText ?? ''}
          fill
          sizes='100vw'
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          className={`${styles.heroMedia} ${styles.mobileOnly}`}
        />
      ) : null}

      {/* Overlay images */}
      {overlayImage?.node?.sourceUrl && (
        <div
          className={`${styles.overlayImageContainer} ${mobileOverlayImage?.node?.sourceUrl ? styles.desktopOnly : ''}`}
        >
          <Image
            src={overlayImage.node.sourceUrl}
            alt={overlayImage.node.altText ?? ''}
            width={overlayImage.node.mediaDetails?.width ?? 1920}
            height={overlayImage.node.mediaDetails?.height ?? 200}
            priority
            className={styles.overlayImage}
          />
        </div>
      )}

      {mobileOverlayImage?.node?.sourceUrl && (
        <div className={`${styles.overlayImageContainer} ${styles.mobileOnly}`}>
          <Image
            src={mobileOverlayImage.node.sourceUrl}
            alt={mobileOverlayImage.node.altText ?? ''}
            width={mobileOverlayImage.node.mediaDetails?.width ?? 1920}
            height={mobileOverlayImage.node.mediaDetails?.height ?? 200}
            priority
            className={styles.overlayImage}
          />
        </div>
      )}

      {/* Info box */}
      {showInfoBox && (
        <div className={styles.heroInfoBox}>
          {heading1 && <p className={styles.heroBoxHeading}>{heading1}</p>}
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
