'use client'
import { useState, useEffect } from 'react'
import styles from './seenShare.module.css'

export default function SeenShare() {
  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(false)

  const url = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    const trigger = document.querySelector(
      '[data-share-trigger]',
    ) as HTMLElement
    const end = document.querySelector('[data-share-end]') as HTMLElement
    if (!trigger) return

    function handleScroll() {
      const triggerRect = trigger.getBoundingClientRect()
      const triggerPoint = window.innerHeight * 0.5
      const pastTrigger = triggerRect.bottom < triggerPoint

      let beforeEnd = true
      if (end) {
        const endRect = end.getBoundingClientRect()
        beforeEnd = endRect.top > triggerPoint
      }

      setVisible(pastTrigger && beforeEnd)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function shareTwitter() {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
      '_blank',
    )
  }

  function shareFacebook() {
    const fullUrl = window.location.href
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}&amp;src=sdkpreparse`,
      '_blank',
      'width=600,height=400',
    )
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={`${styles.share} ${visible ? styles.visible : ''}`}>
      <p className={styles.label}>Share</p>
      <button className={styles.button} onClick={shareTwitter}>
        X
      </button>
      <button className={styles.button} onClick={shareFacebook}>
        Facebook
      </button>
      <button className={styles.button} onClick={copyLink}>
        {copied ? <span className={styles.check}>✓</span> : 'Page Link'}
      </button>
    </div>
  )
}
