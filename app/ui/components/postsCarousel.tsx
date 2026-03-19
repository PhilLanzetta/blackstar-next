import Image from 'next/image'
import type { PostsCarouselLayout } from '@/app/lib/types'
import styles from './postsCarousel.module.css'
import PostCard from './postCard'
import CustomPostCard from './customPostCard'

export default function PostsCarousel({ data }: { data: PostsCarouselLayout }) {
  const { title, link, posts, customPosts, type, featured } = data

  const isCustom = type && type[0] === 'custom'

  return (
    <section className={styles.postCarouselContainer}>
      <div className={styles.postCarouselHeader}>
        <h2 className={styles.postCarouselHeading}>{title}</h2>
        <a href={link.url} className='view-all'>
          {link.title}
        </a>
      </div>
      <div className={featured ? styles.featuredCardContainer : styles.cardContainer}>
        {isCustom
          ? customPosts?.map((post, i) => <CustomPostCard key={i} post={post} />)
          : posts?.nodes.map((post, i) => {
              return <PostCard key={post.id ?? i} post={post} />
            })}
      </div>
    </section>
  )
}
