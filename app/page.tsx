import { getHomePage } from '@/app/lib/queries'
import type {
  SpotlightHeroLayout,
  PostsCarouselLayout,
} from '@/app/lib/types'

// Components
import SpotlightHero from '@/app/ui/components/spotlightHero'
import PostsCarousel from '@/app/ui/components/postsCarousel'

export const revalidate = 60

export default async function HomePage() {
  const layouts = await getHomePage()

  if (!layouts.length) return null

  return (
    <main>
      {layouts.map((layout, index) => {
        switch (layout.__typename) {
          case 'FlexibleLayoutsLayoutsSpotlightHeroLayout':
            return (
              <SpotlightHero key={index} data={layout as SpotlightHeroLayout} />
            )

          case 'FlexibleLayoutsLayoutsPostsCarouselLayout':
            return (
              <PostsCarousel key={index} data={layout as PostsCarouselLayout} />
            )

          default:
            return null
        }
      })}
    </main>
  )
}
