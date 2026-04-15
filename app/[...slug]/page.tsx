import { getDefaultPage } from '@/app/lib/queries'
import { gql, GraphQLClient } from 'graphql-request'
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
  EventDetailsLayout,
  ContentLayout as ContentLayoutType,
} from '@/app/lib/types'
import SpotlightHero from '@/app/ui/components/spotlightHero'
import TextTabs from '@/app/ui/components/textTabs'
import TextList from '@/app/ui/components/textList'
import AnchorBlock from '@/app/ui/components/anchorBlock'
import MediaBlock from '@/app/ui/components/mediaBlock'
import TeamListings from '@/app/ui/components/teamListings'
import Opportunities from '@/app/ui/components/opportunites'
import GetInTouch from '@/app/ui/components/getInTouch'
import PostsCarousel from '../ui/components/postsCarousel'
import SpotlightTextImage from '../ui/components/spotlightTextImage'
import FaqAccordion from '@/app/ui/components/faqAccordion'
import SponsorsCarousel from '../ui/components/sponsorsCarousel'
import SectionHeading from '../ui/components/sectionHeading'
import TextListAlt from '@/app/ui/components/textListAlt'
import { notFound } from 'next/navigation'
import SponsorsRow from '../ui/components/sponsorsRow'
import PostsGrid from '../ui/components/postsGrid'
import FeatureText from '../ui/components/featureText'
import PressClippings from '../ui/components/pressClippings'
import EventDetails from '../ui/components/eventDetails'
import ContentLayout from '../ui/components/contentLayout'

export const revalidate = 60
export const dynamicParams = false

type Props = {
  params: Promise<{ slug: string[] }>
}

const baseURL = process.env.WORDPRESS_URL
const client = new GraphQLClient(`${baseURL}/graphql`, {
  errorPolicy: 'all',
})

type PageSlugNode = {
  uri: string
  template: { templateName: string }
}

type PageSlugResponse = {
  pages: {
    pageInfo: { hasNextPage: boolean; endCursor: string }
    nodes: PageSlugNode[]
  }
}

export async function getAllPageSlugs(): Promise<{ slug: string[] }[]> {
  const allPages: PageSlugNode[] = []
  let hasNextPage = true
  let after: string | null = null

  while (hasNextPage) {
    const variables: { after: string | null } = { after }
    const data = await client.request<PageSlugResponse>(
      gql`
        query getAllPageSlugs($after: String) {
          pages(first: 100, after: $after) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              uri
              template {
                templateName
              }
            }
          }
        }
      `,
      variables,
    )

    allPages.push(...data.pages.nodes)
    hasNextPage = data.pages.pageInfo.hasNextPage
    after = data.pages.pageInfo.endCursor
  }

  return allPages
    .filter((page) => page.template?.templateName === 'Default' && page.uri)
    .map((page) => ({
      slug: page.uri.split('/').filter(Boolean),
    }))
}

export async function generateStaticParams() {
  return getAllPageSlugs()
}

export default async function DefaultPage({ params }: Props) {
  const { slug } = await params
  const path = slug.join('/')

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

  if (!layouts || !layouts.length) return notFound()

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
          case 'FlexibleLayoutsLayoutsPostsGridLayout':
            console.log('postsGrid layout data:', JSON.stringify(layout))
            return (
              <PostsGrid
                key={index}
                data={layout as PostsGridLayout}
                pressReleasePosts={pressReleasePosts ?? []}
                allPosts={allPosts ?? []}
                programEvents={programEvents ?? []}
              />
            )
          case 'FlexibleLayoutsLayoutsEventDetailsLayout':
            return (
              <EventDetails key={index} data={layout as EventDetailsLayout} />
            )
          case 'FlexibleLayoutsLayoutsContentLayout':
            return (
              <ContentLayout key={index} data={layout as ContentLayoutType} />
            )
          default:
            return null
        }
      })}
      {path === 'about' && (
        <>
          <Opportunities
            opportunityTypes={opportunityTypes}
            noOpportunitiesMessage={noOpportunitiesMessage}
          />
          <GetInTouch
            contactDetails={contactDetails}
            socialLinks={socialLinks}
          />
        </>
      )}
    </main>
  )
}
