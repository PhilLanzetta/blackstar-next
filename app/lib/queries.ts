const baseURL = process.env.WORDPRESS_URL
import { gql, GraphQLClient } from 'graphql-request'
import {
  MegaNav,
  FooterQuery,
  SiteSettingsAcf,
  FlexibleLayout,
  HomePageData,
} from './types'

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

export const GET_HOME_PAGE = gql`
  query getHomePage {
    pages(where: { title: "Home" }) {
      nodes {
        flexibleLayouts {
          layouts {
            __typename
            ... on FlexibleLayoutsLayoutsSpotlightHeroLayout {
              contained
              heading1
              image {
                node {
                  sourceUrl
                  altText
                }
              }
              links {
                link {
                  title
                  url
                }
              }
            }
            ... on FlexibleLayoutsLayoutsPostsCarouselLayout {
              title
              link {
                title
                url
              }
              posts {
                nodes {
                  ... on ProgramEvent {
                    id
                    title
                    link
                    contentTypeName
                    featuredImage {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                    event {
                      customExcerpt
                      endTime
                      listingDateFormat
                      location
                      startTime
                      timezone
                      programType {
                        nodes {
                          name
                        }
                      }
                    }
                  }
                }
              }
              customPosts {
                buttons {
                  link {
                    title
                    url
                  }
                }
                image {
                  node {
                    altText
                    sourceUrl
                    mediaDetails {
                      width
                      height
                    }
                  }
                }
                preTitle
                programLogo {
                  node {
                    altText
                    sourceUrl
                  }
                }
                title
                shortDescription
              }
            }
          }
        }
      }
    }
  }
`

export async function getHomePage(): Promise<FlexibleLayout[]> {
  try {
    const data = await client.request<HomePageData>(GET_HOME_PAGE)
    const layouts = data.pages.nodes[0]?.flexibleLayouts?.layouts ?? []
    return layouts
  } catch (error) {
    console.error('Error fetching home page:', error)
    return []
  }
}
