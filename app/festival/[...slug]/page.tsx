import { notFound } from 'next/navigation'
import {
  getFestivalPage,
  getFestivalPageTemplate,
  getDefaultPage,
  getAllFestivalPageSlugs,
} from '@/app/lib/queries'
import type {
  FestivalLayout,
  FestivalSpotlightCarouselLayout,
  FestivalLatestNewsLayout,
  FestivalCardsLayout,
  FestivalHeadingLayout,
  FestivalVideoCoverLayout,
  FestivalButtonsLayout,
  FestivalBiosLayout,
  FestivalSponsorsCarouselLayout,
  FestivalAnchorLayout,
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
  FestivalContentLayout,
  FestivalExplainersLayout,
} from '@/app/lib/types'
import FestivalSpotlightCarousel from '@/app/ui/components/festival/festivalSpotlightCarousel'
import FestivalLatestNews from '@/app/ui/components/festival/festivalLatestNews'
import FestivalCards from '@/app/ui/components/festival/festivalCards'
import FestivalHeading from '@/app/ui/components/festival/festivalHeading'
import FestivalVideoCover from '@/app/ui/components/festival/festivalVideoCover'
import FestivalButtons from '@/app/ui/components/festival/festivalButtons'
import FestivalBios from '@/app/ui/components/festival/festivalBios'
import FestivalSponsors from '@/app/ui/components/festival/festivalSponsors'
import SpotlightHero from '@/app/ui/components/spotlightHero'
import TextTabs from '@/app/ui/components/textTabs'
import TextList from '@/app/ui/components/textList'
import AnchorBlock from '@/app/ui/components/anchorBlock'
import MediaBlock from '@/app/ui/components/mediaBlock'
import TeamListings from '@/app/ui/components/teamListings'
import PostsCarousel from '@/app/ui/components/postsCarousel'
import SpotlightTextImage from '@/app/ui/components/spotlightTextImage'
import FaqAccordion from '@/app/ui/components/faqAccordion'
import SponsorsCarouselComponent from '@/app/ui/components/sponsorsCarousel'
import SectionHeading from '@/app/ui/components/sectionHeading'
import TextListAlt from '@/app/ui/components/textListAlt'
import SponsorsRow from '@/app/ui/components/sponsorsRow'
import PostsGrid from '@/app/ui/components/postsGrid'
import FeatureText from '@/app/ui/components/featureText'
import PressClippings from '@/app/ui/components/pressClippings'
import ContentLayout from '@/app/ui/components/contentLayout'
import EventDetails from '@/app/ui/components/eventDetails'
import ChildProgramEvents from '@/app/ui/components/childProgramEvents'
import FestivalExplainers from '@/app/ui/components/festival/festivalExplainers'
import FestivalContent from '@/app/ui/components/festival/festivalContent'
import SchedulePage from './schedulePage'

export const revalidate = 3600
export const dynamicParams = false

type Props = {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  return getAllFestivalPageSlugs()
}

export default async function FestivalPage({ params }: Props) {
  const { slug } = await params
  const slugArray = Array.isArray(slug) ? slug : [slug]
  const path = slugArray.join('/')

  // Check template first
  const templateName = await getFestivalPageTemplate(path)

  if (templateName === 'Festival Schedule') {
    const year = path.match(/(\d{4})/)?.[1] ?? '2025'
    return (
      <main style={{ paddingTop: '200px' }}>
        <SchedulePage year={year} />
      </main>
    )
  }

  const festivalLayouts = await getFestivalPage(path)

  if (festivalLayouts.length > 0) {
    const firstLayout = festivalLayouts[0]
    const startsWithHero =
      firstLayout?.__typename ===
      'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsSpotlightCarouselLayout'

    return (
      <main style={startsWithHero ? undefined : { paddingTop: '200px' }}>
        {festivalLayouts.map((layout: FestivalLayout, index: number) => {
          switch (layout.__typename) {
            case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsSpotlightCarouselLayout':
              return (
                <FestivalSpotlightCarousel
                  key={index}
                  data={layout as FestivalSpotlightCarouselLayout}
                />
              )
            case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsLatestNewsLayout':
              return (
                <FestivalLatestNews
                  key={index}
                  data={layout as FestivalLatestNewsLayout}
                />
              )
            case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsCardsLayout':
              return (
                <FestivalCards
                  key={index}
                  data={layout as FestivalCardsLayout}
                />
              )
            case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsHeadingLayout':
              return (
                <FestivalHeading
                  key={index}
                  data={layout as FestivalHeadingLayout}
                />
              )
            case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsVideoCoverLayout':
              return (
                <FestivalVideoCover
                  key={index}
                  data={layout as FestivalVideoCoverLayout}
                />
              )
            case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsButtonsLayout':
              return (
                <FestivalButtons
                  key={index}
                  data={layout as FestivalButtonsLayout}
                />
              )
            case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsBiosLayout':
              return (
                <FestivalBios key={index} data={layout as FestivalBiosLayout} />
              )
            case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsSponsorsCarouselLayout':
              return (
                <FestivalSponsors
                  key={index}
                  data={layout as FestivalSponsorsCarouselLayout}
                />
              )
            case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsAnchorLayout':
              return (
                <div
                  key={index}
                  id={(layout as FestivalAnchorLayout).anchorName ?? undefined}
                />
              )
            case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsSpaceLayout':
              return <div key={index} />
            case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsContentLayout':
              return (
                <FestivalContent
                  key={index}
                  data={layout as FestivalContentLayout}
                />
              )
            case 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsExplainersLayout':
              return (
                <FestivalExplainers
                  key={index}
                  data={layout as FestivalExplainersLayout}
                />
              )
            default:
              return null
          }
        })}
      </main>
    )
  }

  // Fall back to default template
  const {
    layouts,
    opportunityTypes,
    noOpportunitiesMessage,
    contactDetails,
    socialLinks,
    pressClippings,
    pressReleasePosts,
    allPosts,
    lumenEpisodes,
    programEvents,
  } = await getDefaultPage(path)

  if (!layouts?.length) return notFound()

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
              <SponsorsCarouselComponent
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
