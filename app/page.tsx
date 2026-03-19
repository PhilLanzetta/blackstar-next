import { getHomePage } from '@/app/lib/queries'
import type {
  SpotlightHeroLayout,
  PostsCarouselLayout,
  SpotlightTextImageLayout,
  SponsorsCarouselLayout,
} from '@/app/lib/types'

// Components
import SpotlightHero from '@/app/ui/components/spotlightHero'
import PostsCarousel from '@/app/ui/components/postsCarousel'
import SpotlightTextImage from './ui/components/spotlightTextImage'
import SponsorsCarousel from './ui/components/sponsorsCarousel'

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

          case 'FlexibleLayoutsLayoutsSpotlightTextImageLayout':
            return (
              <SpotlightTextImage
                key={index}
                data={layout as SpotlightTextImageLayout}
              />
            )

          case 'FlexibleLayoutsLayoutsSponsorsCarouselLayout':
            return (
              <SponsorsCarousel
                key={index}
                data={layout as SponsorsCarouselLayout}
              />
            )

          default:
            return null
        }
      })}
    </main>
  )
}
