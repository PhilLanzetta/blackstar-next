'use client'
import { useState } from 'react'
import styles from './seenNewsletter.module.css'

export default function SeenNewsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter-seen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Sign-up for Seen Updates</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputRow}>
          <label className={styles.label} htmlFor='seen-email'>
            EMAIL:
          </label>
          <input
            id='seen-email'
            className={styles.input}
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=''
            required
          />
          <button
            className={styles.button}
            type='submit'
            disabled={status === 'loading'}
          >
            {status === 'loading' ? '...' : 'SIGN UP'}
          </button>
        </div>
        {status === 'success' && (
          <p className={styles.success}>Thanks for signing up!</p>
        )}
        {status === 'error' && (
          <p className={styles.error}>
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  )
}
