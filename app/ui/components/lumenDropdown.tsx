'use client'
import { useState } from 'react'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import styles from './lumenDropdown.module.css'

type Props = {
  label: string
  content: string
}

export default function LumenDropdown({ label, content }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.dropdown}>
      <button className={styles.toggle} onClick={() => setOpen((o) => !o)}>
        <span>{label}</span>
        <span className={styles.icon}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: cleanHtml(content) }}
        />
      )}
    </div>
  )
}
