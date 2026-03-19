const baseURL = process.env.WORDPRESS_URL
import { gql, GraphQLClient } from 'graphql-request'
import {
  MegaNav,
  FooterQuery,
  SiteSettingsAcf,
  FlexibleLayout,
  HomePageData,
  AboutPageData,
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
                    __typename
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
                  ... on Post {
                    __typename
                    id
                    contentTypeName
                    title
                    featuredImage {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                    date
                    categories {
                      nodes {
                        name
                      }
                    }
                    link
                    pressRelease {
                      introduction
                      pdf {
                        node {
                          mediaItemUrl
                          title
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
                  }
                }
                preTitle
                programLogo {
                  node {
                    altText
                    sourceUrl
                    mediaDetails {
                      height
                      width
                    }
                  }
                }
                title
                shortDescription
              }
              type
              featured
            }
            ... on FlexibleLayoutsLayoutsSpotlightTextImageLayout {
              content
              flip
              heading
              link {
                title
                url
                target
              }
              image {
                node {
                  altText
                  sourceUrl
                  mediaDetails {
                    height
                    width
                  }
                }
              }
            }
            ... on FlexibleLayoutsLayoutsSponsorsCarouselLayout {
              __typename
              title
              button {
                title
                url
              }
              sponsorCollection {
                nodes {
                  ... on SponsorCollection {
                    id
                    sponsors {
                      nodes {
                        ... on Sponsor {
                          __typename
                          sponsorAcf {
                            logoBlack {
                              node {
                                altText
                                mediaDetails {
                                  height
                                  width
                                }
                                sourceUrl
                              }
                            }
                            website
                          }
                        }
                      }
                    }
                  }
                }
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

export const GET_ABOUT_PAGE = gql`
  query getAboutPage {
    pages(where: { id: 1482 }) {
      nodes {
        flexibleLayouts {
          layouts {
            __typename
            ... on FlexibleLayoutsLayoutsSpotlightHeroLayout {
              backgroundColour
              contained
              heading1
              links {
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
                    height
                    width
                  }
                }
              }
            }
            ... on FlexibleLayoutsLayoutsTextTabsLayout {
              tabs {
                title
                content
                link {
                  title
                  url
                }
              }
            }
            ... on FlexibleLayoutsLayoutsTextListLayout {
              heading
              numberOfColumns
              items {
                detail
                heading
              }
            }
            ... on FlexibleLayoutsLayoutsAnchorLayout {
              __typename
              anchorName
            }
          }
        }
      }
    }
  }
`

export async function getAboutPage(): Promise<FlexibleLayout[]> {
  try {
    const data = await client.request<AboutPageData>(GET_ABOUT_PAGE)
    return data.pages.nodes[0]?.flexibleLayouts?.layouts ?? []
  } catch (error) {
    console.error('Error fetching about page:', error)
    return []
  }
}
