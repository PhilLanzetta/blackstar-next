'use client'
import { useState } from 'react'
import Image from 'next/image'
import type { FestivalVideoCoverLayout } from '@/app/lib/types'
import styles from './festivalVideoCover.module.css'

export default function FestivalVideoCover({
  data,
}: {
  data: FestivalVideoCoverLayout
}) {
  const { videoEmbed, coverImage, videoType } = data
  const [playing, setPlaying] = useState(false)
  const isEmbed = videoType?.[0] === 'embed'

  return (
    <div className={styles.container}>
      {!playing && coverImage?.node?.sourceUrl && (
        <div className={styles.cover} onClick={() => setPlaying(true)}>
          <Image
            src={coverImage.node.sourceUrl}
            alt={coverImage.node.altText ?? ''}
            fill
            sizes='100vw'
            style={{ objectFit: 'cover' }}
          />
          <button className={styles.playButton} aria-label='Play video'>
            <svg viewBox='0 0 24 24' fill='currentColor' width='48' height='48'>
              <path d='M8 5v14l11-7z' />
            </svg>
          </button>
        </div>
      )}
      {(playing || !coverImage?.node?.sourceUrl) && isEmbed && videoEmbed && (
        <div
          className={styles.embed}
          dangerouslySetInnerHTML={{ __html: videoEmbed }}
        />
      )}
    </div>
  )
}
