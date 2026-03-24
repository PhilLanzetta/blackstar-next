import { getDefaultPage } from '@/app/lib/queries'
import { gql, GraphQLClient } from 'graphql-request'
import type {
  SpotlightHeroLayout,
  TextTabsLayout,
  TextListLayout,
  AnchorLayout,
  MediaLayout,
  TeamListingsLayout,
} from '@/app/lib/types'
import SpotlightHero from '@/app/ui/components/spotlightHero'
import TextTabs from '@/app/ui/components/textTabs'
import TextList from '@/app/ui/components/textList'
import AnchorBlock from '@/app/ui/components/anchorBlock'
import MediaBlock from '@/app/ui/components/mediaBlock'
import TeamListings from '@/app/ui/components/teamListings'
import Opportunities from '@/app/ui/components/opportunites'
import GetInTouch from '@/app/ui/components/getInTouch'
import { notFound } from 'next/navigation'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

const baseURL = process.env.WORDPRESS_URL
const client = new GraphQLClient(`${baseURL}/graphql`, {
  errorPolicy: 'all',
})

export async function generateStaticParams() {
  const data = await client.request<{ pages: { nodes: { slug: string }[] } }>(
    gql`
      query getAllPageSlugs {
        pages(first: 100) {
          nodes {
            slug
          }
        }
      }
    `,
  )

  return data.pages.nodes.map((page) => ({
    slug: page.slug,
  }))
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

  if (!layouts.length) return notFound()

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
