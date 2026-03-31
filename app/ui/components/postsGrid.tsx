import type {
  PostsGridLayout,
  CustomPost,
  ProgramEvent,
  WPPost,
} from '@/app/lib/types'
import CustomPostCard from '@/app/ui/components/customPostCard'
import PostCard from '@/app/ui/components/postCard'
import styles from './postsGrid.module.css'

type Props = {
  data: PostsGridLayout
}

export default function PostsGrid({ data }: Props) {
  const { customPosts, posts, gridColumns, heading } = data

  const hasCustomPosts = customPosts && customPosts.length > 0
  const hasPosts = posts?.nodes && posts.nodes.length > 0

  if (!hasCustomPosts && !hasPosts) return null

  return (
    <section className={styles.wrapper}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${gridColumns ?? 3}, 1fr)` }}
      >
        {hasCustomPosts &&
          (customPosts as CustomPost[]).map((post, index) => (
            <CustomPostCard key={index} post={post} />
          ))}
        {hasPosts &&
          posts!.nodes.map((post, index) => (
            <PostCard key={index} post={post as ProgramEvent | WPPost} />
          ))}
      </div>
    </section>
  )
}
