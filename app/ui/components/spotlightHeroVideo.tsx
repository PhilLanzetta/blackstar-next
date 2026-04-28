'use client'
import { useRef, useEffect } from 'react'

type Props = {
  src: string
  poster?: string | null
  className?: string
}

export default function SpotlightHeroVideo({ src, poster, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    videoRef.current?.play().catch(() => {})
  }, [])

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      poster={poster ?? undefined}
      autoPlay
      muted
      loop
      playsInline
    />
  )
}
