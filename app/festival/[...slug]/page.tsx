import { getDefaultPage } from '@/app/lib/queries'
import { getAllFestivalPageSlugs } from '@/app/lib/queries'
import { notFound } from 'next/navigation'
import type {
  SpotlightHeroLayout,
  TextTabsLayout,
  TextListLayout,
  AnchorLayout,
  MediaLayout,
  TeamListingsLayout,
  PostsCarouselLayout,
  SpotlightTextImageLayout,
  FaqAccordionLayout,
  SponsorsCarouselLayout,
  SectionHeadingLayout,
  TextListAltLayout,
  SponsorsRowLayout,
  PostsGridLayout,
  FeatureTextLayout,
  PressClippingsLayout,
  ContentLayout as ContentLayoutType,
  EventDetailsLayout,
  ChildProgramEventsLayout,
} from '@/app/lib/types'
import SpotlightHero from '@/app/ui/components/spotlightHero'
import TextTabs from '@/app/ui/components/textTabs'
import TextList from '@/app/ui/components/textList'
import AnchorBlock from '@/app/ui/components/anchorBlock'
import MediaBlock from '@/app/ui/components/mediaBlock'
import TeamListings from '@/app/ui/components/teamListings'
import PostsCarousel from '@/app/ui/components/postsCarousel'
import SpotlightTextImage from '@/app/ui/components/spotlightTextImage'
import FaqAccordion from '@/app/ui/components/faqAccordion'
import SponsorsCarousel from '@/app/ui/components/sponsorsCarousel'
import SectionHeading from '@/app/ui/components/sectionHeading'
import TextListAlt from '@/app/ui/components/textListAlt'
import SponsorsRow from '@/app/ui/components/sponsorsRow'
import PostsGrid from '@/app/ui/components/postsGrid'
import FeatureText from '@/app/ui/components/featureText'
import PressClippings from '@/app/ui/components/pressClippings'
import ContentLayout from '@/app/ui/components/contentLayout'
import EventDetails from '@/app/ui/components/eventDetails'
import ChildProgramEvents from '@/app/ui/components/childProgramEvents'

export const revalidate = 3600
export const dynamicParams = false

type Props = {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  console.log(
    'festival slugs:',
    JSON.stringify(await getAllFestivalPageSlugs()),
  )
  return getAllFestivalPageSlugs()
}

export default async function FestivalPage({ params }: Props) {
  const { slug } = await params
  const path = slug.join('/')

  const {
    layouts,
    pressClippings,
    pressReleasePosts,
    allPosts,
    lumenEpisodes,
    programEvents,
  } = await getDefaultPage(path)

  if (!layouts || !layouts.length) return notFound()

  const firstLayout = layouts[0]
  const startsWithHero =
    firstLayout?.__typename === 'FlexibleLayoutsLayoutsSpotlightHeroLayout'

  return (
    <main style={startsWithHero ? undefined : { paddingTop: '200px' }}>
      {layouts.map((layout, index) => {
        switch (layout.__typename) {
          case 'FlexibleLayoutsLayoutsSpotlightHeroLayout':
            return (
              <SpotlightHero key={index} data={layout as SpotlightHeroLayout} />
            )
          case 'FlexibleLayoutsLayoutsTextTabsLayout':
            return <TextTabs key={index} data={layout as TextTabsLayout} />
          case 'FlexibleLayoutsLayoutsTextListLayout':
            return <TextList key={index} data={layout as TextListLayout} />
          case 'FlexibleLayoutsLayoutsAnchorLayout':
            return <AnchorBlock key={index} data={layout as AnchorLayout} />
          case 'FlexibleLayoutsLayoutsMediaLayout':
            return <MediaBlock key={index} data={layout as MediaLayout} />
          case 'FlexibleLayoutsLayoutsTeamListingsLayout':
            return (
              <TeamListings key={index} data={layout as TeamListingsLayout} />
            )
          case 'FlexibleLayoutsLayoutsPostsCarouselLayout':
            return (
              <PostsCarousel
                key={index}
                data={layout as PostsCarouselLayout}
                lumenEpisodes={lumenEpisodes ?? []}
              />
            )
          case 'FlexibleLayoutsLayoutsSpotlightTextImageLayout':
            return (
              <SpotlightTextImage
                key={index}
                data={layout as SpotlightTextImageLayout}
              />
            )
          case 'FlexibleLayoutsLayoutsFaqAccordionLayout':
            return (
              <FaqAccordion key={index} data={layout as FaqAccordionLayout} />
            )
          case 'FlexibleLayoutsLayoutsSponsorsCarouselLayout':
            return (
              <SponsorsCarousel
                key={index}
                data={layout as SponsorsCarouselLayout}
              />
            )
          case 'FlexibleLayoutsLayoutsSectionHeadingLayout':
            return (
              <SectionHeading
                key={index}
                data={layout as SectionHeadingLayout}
              />
            )
          case 'FlexibleLayoutsLayoutsTextListAltLayout':
            return (
              <TextListAlt key={index} data={layout as TextListAltLayout} />
            )
          case 'FlexibleLayoutsLayoutsSponsorsRowLayout':
            return (
              <SponsorsRow key={index} data={layout as SponsorsRowLayout} />
            )
          case 'FlexibleLayoutsLayoutsPostsGridLayout':
            return (
              <PostsGrid
                key={index}
                data={layout as PostsGridLayout}
                pressReleasePosts={pressReleasePosts ?? []}
                allPosts={allPosts ?? []}
                programEvents={programEvents ?? []}
              />
            )
          case 'FlexibleLayoutsLayoutsFeatureTextLayout':
            return (
              <FeatureText key={index} data={layout as FeatureTextLayout} />
            )
          case 'FlexibleLayoutsLayoutsPressClippingsLayout':
            return (
              <PressClippings
                key={index}
                data={layout as PressClippingsLayout}
                clippings={pressClippings ?? []}
              />
            )
          case 'FlexibleLayoutsLayoutsContentLayout':
            return (
              <ContentLayout key={index} data={layout as ContentLayoutType} />
            )
          case 'FlexibleLayoutsLayoutsEventDetailsLayout':
            return (
              <EventDetails key={index} data={layout as EventDetailsLayout} />
            )
          case 'FlexibleLayoutsLayoutsChildProgramEventsLayout':
            return (
              <ChildProgramEvents
                key={index}
                data={layout as ChildProgramEventsLayout}
                childEvents={[]}
                parentSlug={path}
                parentProgramType='festival'
              />
            )
          default:
            return null
        }
      })}
    </main>
  )
}
