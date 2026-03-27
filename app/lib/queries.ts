const baseURL = process.env.WORDPRESS_URL
import { gql, GraphQLClient } from 'graphql-request'
import {
  MegaNav,
  FooterQuery,
  SiteSettingsAcf,
  FlexibleLayout,
  HomePageData,
  DefaultPageData,
  DefaultPageResult,
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
    if (!data?.pages) return []
    const layouts = (
      data.pages.nodes[0]?.flexibleLayouts?.layouts ?? []
    ).filter(Boolean)
    return layouts
  } catch (error: any) {
    // WPGraphQL returns partial data even when there are errors
    if (error?.response?.data?.pages) {
      const layouts = (
        error.response.data.pages.nodes[0]?.flexibleLayouts?.layouts ?? []
      ).filter(Boolean)
      return layouts
    }
    console.error('Error fetching home page:', error)
    return []
  }
}

const GET_DEFAULT_PAGE = gql`
  query getDefaultPage($slug: ID!) {
    page(id: $slug, idType: URI) {
      template {
        templateName
      }
      flexibleLayouts {
        layouts {
          __typename
          ... on FlexibleLayoutsLayoutsSpotlightHeroLayout {
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
          ... on FlexibleLayoutsLayoutsTextListLayout {
            heading
            numberOfColumns
            items {
              detail
              heading
            }
          }
          ... on FlexibleLayoutsLayoutsFaqAccordionLayout {
            __typename
            collection {
              nodes {
                ... on FaqCollection {
                  __typename
                  id
                  name
                  faqs {
                    nodes {
                      title
                      content
                    }
                  }
                }
              }
            }
          }
          ... on FlexibleLayoutsLayoutsAnchorLayout {
            __typename
            anchorName
          }
          ... on FlexibleLayoutsLayoutsSectionHeadingLayout {
            __typename
            heading
            subHeading
          }
          ... on FlexibleLayoutsLayoutsTextListAltLayout {
            collapsable
            heading
            column1
            column2
            column3
          }
          ... on FlexibleLayoutsLayoutsPostsGridLayout {
            __typename
            heading
            gridColumns
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
                  mediaDetails {
                    height
                    width
                  }
                  sourceUrl
                }
              }
              preTitle
              shortDescription
              title
              programLogo {
                node {
                  altText
                  mediaDetails {
                    height
                    width
                  }
                  sourceUrl
                }
              }
            }
          }
          ... on FlexibleLayoutsLayoutsSponsorsRowLayout {
            __typename
            heading
            description
            descriptionPosition
            sponsors {
              manualSponsor {
                link {
                  url
                }
                logo {
                  node {
                    altText
                    mediaDetails {
                      height
                      width
                    }
                    sourceUrl
                  }
                }
              }
              sponsor {
                nodes {
                  ... on Sponsor {
                    id
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
          ... on FlexibleLayoutsLayoutsMediaLayout {
            __typename
            title
            slides {
              bordered
              caption
              image {
                node {
                  altText
                  mediaDetails {
                    height
                    width
                  }
                  sourceUrl
                }
              }
              videoEmbed
              videoFile {
                node {
                  altText
                  sourceUrl
                }
              }
              videoType
            }
          }
          ... on FlexibleLayoutsLayoutsTeamListingsLayout {
            __typename
            title
            collection {
              nodes {
                __typename
                ... on BioCollection {
                  biographies(first: 100) {
                    nodes {
                      title
                      biographyAcf {
                        emailAddress
                        position
                        pronouns
                      }
                      content
                      featuredImage {
                        node {
                          altText
                          mediaDetails {
                            height
                            width
                          }
                          sourceUrl
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
    opportunityTypes {
      nodes {
        name
        opportunities {
          nodes {
            title
            link
            opportunityAcf {
              shortDescription
            }
          }
        }
      }
    }
    siteSettings {
      siteSettingsAcf {
        noOpportunitiesMessage
        contactDetails {
          address
          email
          phone
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

const emptyResult: DefaultPageResult = {
  layouts: [],
  opportunityTypes: [],
  noOpportunitiesMessage: undefined,
  contactDetails: undefined,
  socialLinks: undefined,
}

export async function getDefaultPage(slug: string): Promise<DefaultPageResult> {
  try {
    const data = await client.request<DefaultPageData>(GET_DEFAULT_PAGE, {
      slug,
    })
    const page = data?.page

    if (!page || page?.template?.templateName !== 'Default') {
      return emptyResult
    }

    const siteSettingsAcf = data.siteSettings?.siteSettingsAcf
    const layouts = (page?.flexibleLayouts?.layouts ?? []).filter(Boolean)

    return {
      layouts,
      opportunityTypes: data.opportunityTypes?.nodes ?? [],
      noOpportunitiesMessage: siteSettingsAcf?.noOpportunitiesMessage,
      contactDetails: siteSettingsAcf?.contactDetails,
      socialLinks: siteSettingsAcf?.socialLinks,
    }
  } catch (error: any) {
    // WPGraphQL returns partial data alongside errors for unrecognized layout types
    const data = error?.response?.data as DefaultPageData | undefined
    const page = data?.page

    if (page && page?.template?.templateName === 'Default') {
      const siteSettingsAcf = data?.siteSettings?.siteSettingsAcf
      const layouts = (page?.flexibleLayouts?.layouts ?? []).filter(Boolean)

      return {
        layouts,
        opportunityTypes: data?.opportunityTypes?.nodes ?? [],
        noOpportunitiesMessage: siteSettingsAcf?.noOpportunitiesMessage,
        contactDetails: siteSettingsAcf?.contactDetails,
        socialLinks: siteSettingsAcf?.socialLinks,
      }
    }

    console.error('Error fetching page:', error)
    return emptyResult
  }
}
