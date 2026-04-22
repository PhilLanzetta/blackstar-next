import { getSeenIssueCredits } from '@/app/lib/queries'
import type { SeenIssueCreditsLayout } from '@/app/lib/types'
import { cleanHtml } from '@/app/lib/utils/cleanHtml'
import SeenIssueCreditsClient from './seenIssueCreditsClient'
import styles from './seenIssueCredits.module.css'

type Props = {
  data: SeenIssueCreditsLayout
}

export default async function SeenIssueCredits({ data }: Props) {
  const issues = await getSeenIssueCredits()
  if (!issues.length) return null

  return (
    <section className={styles.section}>
      {data.heading && <h2 className={styles.heading}>{data.heading}</h2>}
      <SeenIssueCreditsClient issues={issues} />
    </section>
  )
}
