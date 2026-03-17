import Image from 'next/image'
import type { PostsCarouselLayout } from '@/app/lib/types'
import styles from './postsCarousel.module.css'
import PostCard from './postCard'
import CustomPostCard from './customPostCard'

export default function PostsCarousel({ data }: { data: PostsCarouselLayout }) {
  const { title, link, posts, customPosts } = data

  const hasCustomPosts = customPosts && customPosts.length > 0
  const hasPosts = posts?.nodes && posts.nodes.length > 0

  return (
    <section className={styles.postCarouselContainer}>
      <div className={styles.postCarouselHeader}>
        <h2 className={styles.postCarouselHeading}>{title}</h2>
        <a href={link.url} className='view-all'>
          {link.title}
        </a>
      </div>
      <div className={styles.cardContainer}>
        {hasCustomPosts
          ? customPosts.map((post, i) => <CustomPostCard key={i} post={post} />)
          : hasPosts
            ? posts.nodes.map((post, i) => (
                <PostCard key={post.id ?? i} post={post} />
              ))
            : null}
      </div>
    </section>
  )
}
