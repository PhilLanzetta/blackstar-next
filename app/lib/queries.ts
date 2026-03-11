const baseURL = process.env.WORDPRESS_URL
import { gql, GraphQLClient } from 'graphql-request'
import { MegaNav, FooterQuery, SiteSettingsAcf } from './types'

const client = new GraphQLClient(`${baseURL}/graphql`)

export async function getMegaNav(): Promise<MegaNav[]> {
  const query = gql`
    query getMegaNav {
      megaNavs(where: { orderby: { field: MENU_ORDER, order: ASC } }) {
        nodes {
          title
          megaNavACF {
            menuItems {
              menuItem {
                title
                url
              }
            }
          }
          id
          slug
        }
      }
    }
  `

  const data: { megaNavs: { nodes: MegaNav[] } } = await client.request(query)
  return data.megaNavs.nodes
}

export async function getFooterNav(): Promise<SiteSettingsAcf> {
  const query = gql`
    query getFooter {
      siteSettings {
        siteSettingsAcf {
          footerMenu {
            link {
              title
              url
            }
          }
          legalMenu {
            link {
              title
              url
            }
          }
          secondaryFooterMenu {
            link {
              title
              url
            }
          }
          socialLinks {
            facebookUrl
            instagramUrl
            twitterUrl
            youtubeUrl
          }
        }
      }
    }
  `

  const data = await client.request<FooterQuery>(query)

  return data.siteSettings.siteSettingsAcf
}
