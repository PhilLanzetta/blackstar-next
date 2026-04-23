'use client'

import { useState } from 'react'
import styles from './newsletter.module.css'

interface NewsletterProps {
  isFestival?: boolean
}

export default function Newsletter({ isFestival }: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  async function handleSubmit() {
    if (busy || !email) return
    setBusy(true)
    setError(false)

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) throw new Error()
      setSuccess(true)
    } catch {
      setError(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      {success ? (
        <p className={styles.successMessage}>Thanks for signing up!</p>
      ) : (
        <>
          <div className={styles.field}>
            <input
              className={isFestival ? styles.inputFestival : styles.input}
              type='email'
              placeholder='Email:'
              aria-label='Email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={busy}
            />
            <button
              className={isFestival ? styles.buttonFestival : styles.button}
              onClick={handleSubmit}
              disabled={busy || !email}
            >
              {busy ? 'One moment...' : 'Sign Up'}
            </button>
          </div>
          {error && (
            <p className={styles.errorMessage}>
              Something went wrong. Please try again.
            </p>
          )}
        </>
      )}
    </div>
  )
}
