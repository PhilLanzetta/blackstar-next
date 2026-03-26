import type { SectionHeadingLayout } from '@/app/lib/types'
import styles from './sectionHeading.module.css'

export default function SectionHeading({
  data,
}: {
  data: SectionHeadingLayout
}) {
  if (!data.heading) return null
  return (
    <div className={styles.headingContainer}>
      <h2 className={styles.heading}>{data.heading}</h2>
      {data.subHeading && (
        <h3 className={styles.subHeading}>{data.subHeading}</h3>
      )}
    </div>
  )
}
