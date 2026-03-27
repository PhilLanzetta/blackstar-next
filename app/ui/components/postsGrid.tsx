import type { PostsGridLayout, CustomPost } from '@/app/lib/types'
import CustomPostCard from '@/app/ui/components/customPostCard'
import styles from './postsGrid.module.css'

type Props = {
  data: PostsGridLayout
}

export default function PostsGrid({ data }: Props) {
  const { customPosts, gridColumns, heading } = data

  if (!customPosts?.length) return null

  return (
    <section className={styles.wrapper}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${gridColumns ?? 3}, 1fr)` }}
      >
        {(customPosts as CustomPost[]).map((post, index) => (
          <CustomPostCard key={index} post={post} />
        ))}
      </div>
    </section>
  )
}
