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
  PostsGridLayout
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

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

const baseURL = process.env.WORDPRESS_URL
const client = new GraphQLClient(`${baseURL}/graphql`, {
  errorPolicy: 'all',
})

export async function getAllPageSlugs(): Promise<{ slug: string }[]> {
  const data = await client.request<{
    pages: { nodes: { slug: string; template: { templateName: string } }[] }
  }>(gql`
    query getAllPageSlugs {
      pages(first: 100) {
        nodes {
          slug
          template {
            templateName
          }
        }
      }
    }
  `)

  return data.pages.nodes.filter(
    (page) => page.template?.templateName === 'Default',
  )
}

export default async function DefaultPage({ params }: Props) {
  const { slug } = await params

  const {
    layouts,
    opportunityTypes,
    noOpportunitiesMessage,
    contactDetails,
    socialLinks,
  } = await getDefaultPage(slug)

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
          case 'FlexibleLayoutsLayoutsPostsGridLayout':
            return <PostsGrid key={index} data={layout as PostsGridLayout} />
          default:
            return null
        }
      })}
      {slug === 'about' && (
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
