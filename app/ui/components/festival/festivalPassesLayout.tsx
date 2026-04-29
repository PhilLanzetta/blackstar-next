import { gql, GraphQLClient } from 'graphql-request'
import FestivalPasses from './festivalPasses'

const client = new GraphQLClient(`${process.env.WORDPRESS_URL}/graphql`)

async function getPassesData(): Promise<{
  title: string
  passes: {
    name: string
    price: string
    description: string
    eventiveId: string
    discountPrice?: string | null
    buttonLabelOverride?: string | null
  }[]
} | null> {
  try {
    const data = await client.request<{
      siteSettings: {
        siteSettingsAcf: {
          ticketsPassesTitle?: string | null
          showTicketsPasses?: boolean | null
          passesNew?:
            | {
                name: string
                price: string
                description: string
                eventiveId: string
                discountPrice?: string | null
                buttonLabelOverride?: string | null
              }[]
            | null
        }
      }
    }>(gql`
      query getFestivalPasses {
        siteSettings {
          siteSettingsAcf {
            ticketsPassesTitle
            showTicketsPasses
            passesNew {
              name
              price
              description
              eventiveId
              discountPrice
              buttonLabelOverride
            }
          }
        }
      }
    `)

    const acf = data.siteSettings?.siteSettingsAcf
    if (!acf?.showTicketsPasses || !acf?.passesNew?.length) return null

    return {
      title: acf.ticketsPassesTitle ?? 'Passes',
      passes: acf.passesNew,
    }
  } catch (err) {
    console.error('[FestivalPassesLayout] fetch error:', err)
    return null
  }
}

export default async function FestivalPassesLayout() {
  const data = await getPassesData()
  if (!data) return null

  return <FestivalPasses title={data.title} passes={data.passes} />
}
