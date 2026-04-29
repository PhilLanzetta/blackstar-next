import { draftMode } from 'next/headers'
import { getHomePage } from '@/app/lib/queries'
import { getHomePagePreview } from './lib/previewQueries'
import type {
  SpotlightHeroLayout,
  PostsCarouselLayout,
  SpotlightTextImageLayout,
  SponsorsCarouselLayout,
} from '@/app/lib/types'
import SpotlightHero from '@/app/ui/components/spotlightHero'
import PostsCarousel from '@/app/ui/components/postsCarousel'
import SpotlightTextImage from './ui/components/spotlightTextImage'
import SponsorsCarousel from './ui/components/sponsorsCarousel'

export const dynamic = 'force-static'
export const revalidate = 3600

type Props = {
  searchParams: Promise<{ previewId?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { isEnabled: isPreview } = await draftMode()
  const { previewId } = await searchParams
  const layouts = isPreview
    ? await getHomePagePreview(previewId)
    : await getHomePage()

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
