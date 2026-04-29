// app/events/preview/page.tsx
// Handles program-event draft previews only.
// WordPress redirects to /events/preview?previewId=<id>&slug=<slug>
// because WPGraphQL can't resolve program-event slugs — only database IDs.

import { notFound, redirect } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getProgramEventPreview } from '@/app/lib/previewQueries'
import { getChildProgramEvents } from '@/app/lib/queries'
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
  ChildProgramEventsLayout,
  EventDetailsLayout,
  ContentLayout as ContentLayoutType,
  FlexibleLayout,
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
import EventDetails from '@/app/ui/components/eventDetails'
import ContentLayout from '@/app/ui/components/contentLayout'
import ChildProgramEvents from '@/app/ui/components/childProgramEvents'

type Props = {
  searchParams: Promise<{ previewId?: string; slug?: string }>
}

export default async function ProgramEventPreviewPage({ searchParams }: Props) {
  const { isEnabled: isPreview } = await draftMode()

  // This page should only be accessible in preview mode
  if (!isPreview) return notFound()

  const { previewId, slug } = await searchParams

  if (!previewId) return notFound()

  const event = await getProgramEventPreview(previewId)

  if (!event) return notFound()

  if (event.event?.redirect?.url) {
    redirect(event.event.redirect.url)
  }

  const layouts = (
    (event.flexibleLayouts?.layouts ?? []) as FlexibleLayout[]
  ).filter(Boolean)

  if (!layouts.length) return notFound()

  // For child events we need programType — get it from the event data
  const programType = event.event?.programType?.nodes?.[0]?.slug ?? ''
  const eventSlug = slug ?? event.slug ?? ''

  const hasChildEvents = layouts.some(
    (l) => l.__typename === 'FlexibleLayoutsLayoutsChildProgramEventsLayout',
  )
  const childEvents =
    hasChildEvents && eventSlug
      ? await getChildProgramEvents(eventSlug, programType)
      : []

  return (
    <main>
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
              <PostsCarousel key={index} data={layout as PostsCarouselLayout} />
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
          case 'FlexibleLayoutsLayoutsFeatureTextLayout':
            return (
              <FeatureText key={index} data={layout as FeatureTextLayout} />
            )
          case 'FlexibleLayoutsLayoutsPostsGridLayout':
            return <PostsGrid key={index} data={layout as PostsGridLayout} />
          case 'FlexibleLayoutsLayoutsEventDetailsLayout':
            return (
              <EventDetails key={index} data={layout as EventDetailsLayout} />
            )
          case 'FlexibleLayoutsLayoutsContentLayout':
            return (
              <ContentLayout key={index} data={layout as ContentLayoutType} />
            )
          case 'FlexibleLayoutsLayoutsChildProgramEventsLayout':
            return (
              <ChildProgramEvents
                key={index}
                data={layout as ChildProgramEventsLayout}
                childEvents={childEvents}
                parentSlug={eventSlug}
                parentProgramType={programType}
              />
            )
          default:
            return null
        }
      })}
    </main>
  )
}
