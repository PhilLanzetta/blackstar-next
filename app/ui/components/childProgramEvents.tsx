import type { ChildProgramEventsLayout, ProgramEvent } from '@/app/lib/types'
import PostCard from './postCard'
import styles from './childProgramEvents.module.css'

type Props = {
  data: ChildProgramEventsLayout
  childEvents: ProgramEvent[]
  parentSlug: string
  parentProgramType: string
}

export default function ChildProgramEvents({ data, childEvents }: Props) {
  if (!childEvents.length) return null

  return (
    <section className={styles.section}>
      {data.title && <h2 className={styles.heading}>{data.title}</h2>}
      <div className={styles.grid}>
        {childEvents.map((event, i) => (
          <PostCard key={i} post={event} />
        ))}
      </div>
    </section>
  )
}
