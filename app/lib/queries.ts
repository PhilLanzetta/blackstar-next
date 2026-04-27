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
  PressClipping,
  WPPost,
  LumenEpisode,
  ProgramEvent,
  SeenFlexibleLayout,
  SeenArticle,
  FestivalLayout,
  FestivalEvent,
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
              links {
                link {
                  title
                  url
                  target
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
              mobileImage {
                node {
                  altText
                  sourceUrl
                  mediaDetails {
                    height
                    width
                  }
                }
              }
              overlayImage {
                node {
                  altText
                  sourceUrl
                  mediaDetails {
                    height
                    width
                  }
                }
              }
              mobileOverlayImage {
                node {
                  altText
                  sourceUrl
                  mediaDetails {
                    height
                    width
                  }
                }
              }
              video {
                file {
                  node {
                    mediaItemUrl
                    altText
                  }
                }
                type
              }
              mobileVideo {
                file {
                  node {
                    mediaItemUrl
                    altText
                  }
                }
                type
              }
            }
            ... on FlexibleLayoutsLayoutsFeatureTextLayout {
              additionalContent
              content
              buttons {
                link {
                  target
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
                      redirect {
                        url
                      }
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
                    slug
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
                target
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
            mobileImage {
              node {
                altText
                sourceUrl
                mediaDetails {
                  height
                  width
                }
              }
            }
            overlayImage {
              node {
                altText
                sourceUrl
                mediaDetails {
                  height
                  width
                }
              }
            }
            mobileOverlayImage {
              node {
                altText
                sourceUrl
                mediaDetails {
                  height
                  width
                }
              }
            }
            video {
              file {
                node {
                  mediaItemUrl
                  altText
                }
              }
              type
            }
            mobileVideo {
              file {
                node {
                  mediaItemUrl
                  altText
                }
              }
              type
            }
          }
          ... on FlexibleLayoutsLayoutsFeatureTextLayout {
            additionalContent
            content
            buttons {
              link {
                target
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
                    redirect {
                      url
                    }
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
                  slug
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
                ... on Page {
                  __typename
                  id
                  title
                  link
                  featuredImage {
                    node {
                      altText
                      sourceUrl
                    }
                  }
                }
                ... on LumenEpisode {
                  __typename
                  id
                  title
                  link
                  slug
                  contentTypeName
                  featuredImage {
                    node {
                      altText
                      sourceUrl
                    }
                  }
                  lumenSeasons {
                    nodes {
                      name
                      slug
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
          ... on FlexibleLayoutsLayoutsPressClippingsLayout {
            heading
          }
          ... on FlexibleLayoutsLayoutsContentLayout {
            content
          }
          ... on FlexibleLayoutsLayoutsEventDetailsLayout {
            columnOne {
              title
              content
            }
            columnTwo {
              title
              content
            }
            columnThree {
              title
              content
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
            showFilters
            type
            programEventType {
              nodes {
                name
                slug
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
                    redirect {
                      url
                    }
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
                  slug
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

    const hasPressClippings = layouts.some(
      (l: any) =>
        l?.__typename === 'FlexibleLayoutsLayoutsPressClippingsLayout',
    )
    const pressClippings = hasPressClippings ? await getAllPressClippings() : []

    const hasPressGrid = layouts.some(
      (l: any) =>
        l?.__typename === 'FlexibleLayoutsLayoutsPostsGridLayout' &&
        l?.type?.includes('press'),
    )
    const pressReleasePosts = hasPressGrid ? await getPressReleasePosts() : []

    const hasPostsGrid = layouts.some(
      (l: any) =>
        l?.__typename === 'FlexibleLayoutsLayoutsPostsGridLayout' &&
        l?.type?.includes('posts'),
    )
    const allPosts = hasPostsGrid ? await getAllPosts() : []

    const hasLumenCarousel = layouts.some(
      (l: any) =>
        l?.__typename === 'FlexibleLayoutsLayoutsPostsCarouselLayout' &&
        l?.type?.includes('lumen-episode'),
    )

    const lumenEpisodes = hasLumenCarousel ? await getAllLumenEpisodes() : []

    const hasProgramEventsGrid = layouts.some(
      (l: any) =>
        l?.__typename === 'FlexibleLayoutsLayoutsPostsGridLayout' &&
        l?.type?.includes('program-event'),
    )

    const programEvents = hasProgramEventsGrid
      ? await getAllProgramEvents()
      : []

    return {
      layouts,
      pressClippings,
      pressReleasePosts,
      allPosts,
      opportunityTypes: data.opportunityTypes?.nodes ?? [],
      noOpportunitiesMessage: siteSettingsAcf?.noOpportunitiesMessage,
      contactDetails: siteSettingsAcf?.contactDetails,
      socialLinks: siteSettingsAcf?.socialLinks,
      lumenEpisodes,
      programEvents,
    }
  } catch (error: any) {
    const data = error?.response?.data as DefaultPageData | undefined
    const page = data?.page

    if (page && page?.template?.templateName === 'Default') {
      const siteSettingsAcf = data?.siteSettings?.siteSettingsAcf
      const layouts = (page?.flexibleLayouts?.layouts ?? []).filter(Boolean)

      const hasPressClippings = layouts.some(
        (l: any) =>
          l?.__typename === 'FlexibleLayoutsLayoutsPressClippingsLayout',
      )
      const pressClippings = hasPressClippings
        ? await getAllPressClippings()
        : []

      const hasPressGrid = layouts.some(
        (l: any) =>
          l?.__typename === 'FlexibleLayoutsLayoutsPostsGridLayout' &&
          l?.type?.includes('press'),
      )
      const pressReleasePosts = hasPressGrid ? await getPressReleasePosts() : []

      const hasPostsGrid = layouts.some(
        (l: any) =>
          l?.__typename === 'FlexibleLayoutsLayoutsPostsGridLayout' &&
          l?.type?.includes('posts'),
      )
      const allPosts = hasPostsGrid ? await getAllPosts() : []

      const hasLumenCarousel = layouts.some(
        (l: any) =>
          l?.__typename === 'FlexibleLayoutsLayoutsPostsCarouselLayout' &&
          l?.type?.includes('lumen-episode'),
      )
      const lumenEpisodes = hasLumenCarousel ? await getAllLumenEpisodes() : []

      const hasProgramEventsGrid = layouts.some(
        (l: any) =>
          l?.__typename === 'FlexibleLayoutsLayoutsPostsGridLayout' &&
          l?.type?.includes('program-event'),
      )

      const programEvents = hasProgramEventsGrid
        ? await getAllProgramEvents()
        : []

      return {
        layouts,
        pressClippings,
        pressReleasePosts,
        allPosts,
        opportunityTypes: data?.opportunityTypes?.nodes ?? [],
        noOpportunitiesMessage: siteSettingsAcf?.noOpportunitiesMessage,
        contactDetails: siteSettingsAcf?.contactDetails,
        socialLinks: siteSettingsAcf?.socialLinks,
        lumenEpisodes,
        programEvents,
      }
    }
    return emptyResult
  }
}

export async function getPageBrand(slug: string): Promise<string | null> {
  try {
    const data = await client.request<{
      page: { pageBrands: { nodes: { slug: string }[] } } | null
    }>(
      gql`
        query getPageBrand($slug: ID!) {
          page(id: $slug, idType: URI) {
            pageBrands {
              nodes {
                slug
              }
            }
          }
        }
      `,
      { slug },
    )

    return data.page?.pageBrands?.nodes?.[0]?.slug ?? null
  } catch (error: any) {
    // handle partial responses
    const data = error?.response?.data
    return data?.page?.pageBrands?.nodes?.[0]?.slug ?? null
  }
}

export async function getAllPressClippings(): Promise<PressClipping[]> {
  const all: PressClipping[] = []
  let hasNextPage = true
  let after: string | null = null

  while (hasNextPage) {
    try {
      const variables: { after: string | null } = { after }
      const data = await client.request<{
        pressClippings: {
          nodes: PressClipping[]
          pageInfo: { hasNextPage: boolean; endCursor: string }
        }
      }>(
        gql`
          query getAllPressClippings($after: String) {
            pressClippings(
              first: 100
              after: $after
              where: { orderby: { field: DATE, order: DESC } }
            ) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                title
                date
                pressClippingsAcf {
                  link {
                    target
                    title
                    url
                  }
                  newspaperSource
                }
              }
            }
          }
        `,
        variables,
      )
      all.push(...data.pressClippings.nodes)
      hasNextPage = data.pressClippings.pageInfo.hasNextPage
      after = data.pressClippings.pageInfo.endCursor
    } catch (error: any) {
      const data = error?.response?.data
      if (data?.pressClippings?.nodes) {
        all.push(...data.pressClippings.nodes)
      }
      break
    }
  }
  return all
}

export async function getPressReleasePosts(): Promise<WPPost[]> {
  const all: WPPost[] = []
  let hasNextPage = true
  let after: string | null = null

  while (hasNextPage) {
    try {
      const variables: { after: string | null } = { after }
      const data = await client.request<{
        posts: {
          nodes: WPPost[]
          pageInfo: { hasNextPage: boolean; endCursor: string }
        }
      }>(
        gql`
          query getPressReleasePosts($after: String) {
            posts(
              first: 100
              after: $after
              where: {
                orderby: { field: DATE, order: DESC }
                categoryName: "press"
              }
            ) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                __typename
                id
                contentTypeName
                slug
                title
                date
                link
                featuredImage {
                  node {
                    altText
                    sourceUrl
                  }
                }
                categories {
                  nodes {
                    name
                  }
                }
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
        `,
        variables,
      )
      all.push(...data.posts.nodes)
      hasNextPage = data.posts.pageInfo.hasNextPage
      after = data.posts.pageInfo.endCursor
    } catch (error: any) {
      const data = error?.response?.data
      if (data?.posts?.nodes) {
        all.push(...data.posts.nodes)
      }
      break
    }
  }
  return all
}

export async function getPressReleasePost(slug: string) {
  try {
    const data = await client.request<{
      post: {
        title: string
        date: string
        content: string
        featuredImage?: { node: { sourceUrl: string; altText: string } }
        pressRelease?: {
          introduction?: string
          location?: string
          pdf?: { node: { mediaItemUrl: string } } | null
        }
        blogSettings?: {
          coverImage?: { node: { sourceUrl: string; altText: string } } | null
          mobileCoverImage?: {
            node: { sourceUrl: string; altText: string }
          } | null
          coverVideo?: { node: { mediaItemUrl: string } } | null
          guestAuthor?: string | null
        }
        blogRelated?: {
          relatedPosts?: {
            nodes: {
              __typename: string
              title: string
              slug: string
              date: string
              featuredImage?: { node: { sourceUrl: string; altText: string } }
              pressRelease?: {
                introduction?: string
                pdf?: { node: { mediaItemUrl: string } } | null
              }
              categories?: { nodes: { name: string; slug: string }[] }
              tags?: { nodes: { name: string; slug: string }[] }
            }[]
          } | null
        }
        categories?: { nodes: { name: string; slug: string }[] }
        tags?: { nodes: { name: string; slug: string }[] }
      } | null
    }>(
      gql`
        query getPressReleasePost($slug: ID!) {
          post(id: $slug, idType: SLUG) {
            title
            date
            content
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            pressRelease {
              introduction
              location
              pdf {
                node {
                  mediaItemUrl
                }
              }
            }
            blogSettings {
              coverImage {
                node {
                  sourceUrl
                  altText
                }
              }
              mobileCoverImage {
                node {
                  sourceUrl
                  altText
                }
              }
              coverVideo {
                node {
                  mediaItemUrl
                }
              }
              guestAuthor
            }
            blogRelated {
              relatedPosts {
                nodes {
                  ... on Post {
                    __typename
                    id
                    slug
                    contentTypeName
                    title
                    date
                    link
                    featuredImage {
                      node {
                        sourceUrl
                        altText
                      }
                    }
                    categories {
                      nodes {
                        name
                      }
                    }
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
            }
            categories {
              nodes {
                name
                slug
              }
            }
            tags {
              nodes {
                name
                slug
              }
            }
          }
        }
      `,
      { slug },
    )
    return data.post
  } catch (error: any) {
    return error?.response?.data?.post ?? null
  }
}

export async function getAllPressReleaseSlugs(): Promise<string[]> {
  const all: string[] = []
  let hasNextPage = true
  let after: string | null = null

  while (hasNextPage) {
    try {
      const variables: { after: string | null } = { after }
      const data = await client.request<{
        posts: {
          nodes: { slug: string }[]
          pageInfo: { hasNextPage: boolean; endCursor: string }
        }
      }>(
        gql`
          query getAllPressReleaseSlugs($after: String) {
            posts(first: 100, after: $after, where: { categoryName: "press" }) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                slug
              }
            }
          }
        `,
        variables,
      )
      all.push(...data.posts.nodes.map((p) => p.slug))
      hasNextPage = data.posts.pageInfo.hasNextPage
      after = data.posts.pageInfo.endCursor
    } catch {
      break
    }
  }
  return all
}

export async function getRelatedPosts(
  categorySlug: string,
  excludeSlug: string,
  postDate: string,
) {
  try {
    const data = await client.request<{
      posts: {
        nodes: WPPost[]
      }
    }>(
      gql`
        query getRelatedPosts($categorySlug: String) {
          posts(
            first: 100
            where: {
              categoryName: $categorySlug
              orderby: { field: DATE, order: DESC }
            }
          ) {
            nodes {
              __typename
              id
              slug
              contentTypeName
              title
              date
              link
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
              categories {
                nodes {
                  name
                }
              }
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
      `,
      { categorySlug },
    )

    const targetDate = new Date(postDate).getTime()

    return data.posts.nodes
      .filter((p) => p.slug !== excludeSlug)
      .sort((a, b) => {
        const diffA = Math.abs(new Date(a.date).getTime() - targetDate)
        const diffB = Math.abs(new Date(b.date).getTime() - targetDate)
        return diffA - diffB
      })
      .slice(0, 4)
  } catch (error: any) {
    return (
      error?.response?.data?.posts?.nodes
        ?.filter((p: any) => p.slug !== excludeSlug)
        ?.sort((a: any, b: any) => {
          const targetDate = new Date(postDate).getTime()
          return (
            Math.abs(new Date(a.date).getTime() - targetDate) -
            Math.abs(new Date(b.date).getTime() - targetDate)
          )
        })
        ?.slice(0, 4) ?? []
    )
  }
}

export async function getAllPosts(): Promise<WPPost[]> {
  const all: WPPost[] = []
  let hasNextPage = true
  let after: string | null = null

  while (hasNextPage) {
    try {
      const variables: { after: string | null } = { after }
      const data = await client.request<{
        posts: {
          nodes: WPPost[]
          pageInfo: { hasNextPage: boolean; endCursor: string }
        }
      }>(
        gql`
          query getAllPosts($after: String) {
            posts(
              first: 100
              after: $after
              where: { orderby: { field: DATE, order: DESC } }
            ) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                __typename
                id
                slug
                contentTypeName
                title
                date
                link
                featuredImage {
                  node {
                    altText
                    sourceUrl
                  }
                }
                categories {
                  nodes {
                    name
                  }
                }
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
        `,
        variables,
      )
      all.push(...data.posts.nodes)
      hasNextPage = data.posts.pageInfo.hasNextPage
      after = data.posts.pageInfo.endCursor
    } catch (error: any) {
      const data = error?.response?.data
      if (data?.posts?.nodes) {
        all.push(...data.posts.nodes)
      }
      break
    }
  }
  return all
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const all: string[] = []
  let hasNextPage = true
  let after: string | null = null

  while (hasNextPage) {
    try {
      const variables: { after: string | null } = { after }
      const data = await client.request<{
        posts: {
          nodes: { slug: string }[]
          pageInfo: { hasNextPage: boolean; endCursor: string }
        }
      }>(
        gql`
          query getAllBlogSlugs($after: String) {
            posts(first: 100, after: $after, where: { categoryName: "blog" }) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                slug
              }
            }
          }
        `,
        variables,
      )
      all.push(...data.posts.nodes.map((p) => p.slug))
      hasNextPage = data.posts.pageInfo.hasNextPage
      after = data.posts.pageInfo.endCursor
    } catch {
      break
    }
  }
  return all
}

export async function getOpportunity(slug: string) {
  try {
    const data = await client.request<{
      opportunity: {
        title: string
        content: string
        slug: string
        opportunityTypes: {
          nodes: { name: string }[]
        }
        opportunityAcf?: {
          downloadPdf?: { node: { mediaItemUrl: string } } | null
        }
      } | null
    }>(
      gql`
        query getOpportunity($slug: ID!) {
          opportunity(id: $slug, idType: SLUG) {
            title
            content
            slug
            opportunityTypes {
              nodes {
                name
              }
            }
            opportunityAcf {
              downloadPdf {
                node {
                  mediaItemUrl
                }
              }
            }
          }
        }
      `,
      { slug },
    )
    return data.opportunity
  } catch (error: any) {
    return error?.response?.data?.opportunity ?? null
  }
}

export async function getAllOpportunitySlugs(): Promise<string[]> {
  try {
    const data = await client.request<{
      opportunities: { nodes: { slug: string }[] }
    }>(gql`
      query getAllOpportunitySlugs {
        opportunities(first: 100) {
          nodes {
            slug
          }
        }
      }
    `)
    return data.opportunities.nodes.map((o) => o.slug)
  } catch {
    return []
  }
}

export async function getProgramEvent(slug: string) {
  try {
    const data = await client.request<{
      programEvents: {
        nodes: {
          title: string
          slug: string
          event: {
            redirect?: { url: string } | null
            startTime?: string
            endTime?: string
            timezone?: string
            location?: string
          }
          programType: {
            nodes: { name: string; slug: string }[]
          }
          flexibleLayouts: {
            layouts: FlexibleLayout[]
          }
        }[]
      }
    }>(
      gql`
        query getProgramEvent($slug: String) {
          programEvents(first: 1, where: { nameIn: [$slug] }) {
            nodes {
              title
              slug
              event {
                redirect {
                  url
                }
                startTime
                endTime
                timezone
                location
                programType {
                  nodes {
                    name
                    slug
                  }
                }
              }
              flexibleLayouts {
                layouts {
                  __typename
                  ... on FlexibleLayoutsLayoutsChildProgramEventsLayout {
                    title
                  }
                  ... on FlexibleLayoutsLayoutsSpotlightHeroLayout {
                    heading1
                    links {
                      link {
                        title
                        url
                        target
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
                    mobileImage {
                      node {
                        altText
                        sourceUrl
                        mediaDetails {
                          height
                          width
                        }
                      }
                    }
                    overlayImage {
                      node {
                        altText
                        sourceUrl
                        mediaDetails {
                          height
                          width
                        }
                      }
                    }
                    mobileOverlayImage {
                      node {
                        altText
                        sourceUrl
                        mediaDetails {
                          height
                          width
                        }
                      }
                    }
                    video {
                      file {
                        node {
                          mediaItemUrl
                          altText
                        }
                      }
                      type
                    }
                    mobileVideo {
                      file {
                        node {
                          mediaItemUrl
                          altText
                        }
                      }
                      type
                    }
                  }
                  ... on FlexibleLayoutsLayoutsFeatureTextLayout {
                    additionalContent
                    content
                    buttons {
                      link {
                        target
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
                            redirect {
                              url
                            }
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
                          slug
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
                        ... on Page {
                          __typename
                          id
                          title
                          link
                          featuredImage {
                            node {
                              altText
                              sourceUrl
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
                  ... on FlexibleLayoutsLayoutsPressClippingsLayout {
                    heading
                  }
                  ... on FlexibleLayoutsLayoutsContentLayout {
                    content
                  }
                  ... on FlexibleLayoutsLayoutsEventDetailsLayout {
                    columnOne {
                      title
                      content
                    }
                    columnTwo {
                      title
                      content
                    }
                    columnThree {
                      title
                      content
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
                    showFilters
                    type
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
                            redirect {
                              url
                            }
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
                          slug
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
          }
        }
      `,
      { slug },
    )
    return data.programEvents.nodes[0] ?? null
  } catch (error: any) {
    return error?.response?.data?.programEvents?.nodes?.[0] ?? null
  }
}

export async function getAllProgramEventSlugs(): Promise<
  { programType: string; slug: string }[]
> {
  const all: { programType: string; slug: string }[] = []
  let hasNextPage = true
  let after: string | null = null

  while (hasNextPage) {
    try {
      const variables: { after: string | null } = { after }
      const data = await client.request<{
        programEvents: {
          nodes: {
            slug: string
            parent: {
              node: {
                id: string
              }
            }
            event: {
              redirect?: { url: string } | null
              programType: { nodes: { slug: string }[] }
            }
          }[]
          pageInfo: { hasNextPage: boolean; endCursor: string }
        }
      }>(
        gql`
          query getAllProgramEventSlugs($after: String) {
            programEvents(first: 100, after: $after) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                slug
                parent {
                  node {
                    id
                  }
                }
                event {
                  redirect {
                    url
                  }
                  programType {
                    nodes {
                      slug
                    }
                  }
                }
              }
            }
          }
        `,
        variables,
      )

      const validEvents = data.programEvents.nodes
        .filter(
          (e) =>
            !e.parent?.node?.id &&
            !e.event?.redirect?.url &&
            e.event?.programType?.nodes?.[0]?.slug,
        )
        .map((e) => ({
          programType: e.event.programType.nodes[0].slug,
          slug: e.slug,
        }))

      all.push(...validEvents)
      hasNextPage = data.programEvents.pageInfo.hasNextPage
      after = data.programEvents.pageInfo.endCursor
    } catch (error: any) {
      console.log(
        'getAllProgramEventSlugs error:',
        error?.response?.errors?.[0]?.message,
      )
      break
    }
  }
  return all
}

export async function getAllLumenEpisodes(): Promise<LumenEpisode[]> {
  const all: LumenEpisode[] = []
  let hasNextPage = true
  let after: string | null = null

  while (hasNextPage) {
    try {
      const variables: { after: string | null } = { after }
      const data = await client.request<{
        lumenEpisodes: {
          nodes: LumenEpisode[]
          pageInfo: { hasNextPage: boolean; endCursor: string }
        }
      }>(
        gql`
          query getAllLumenEpisodes($after: String) {
            lumenEpisodes(
              first: 100
              after: $after
              where: { orderby: { field: DATE, order: DESC } }
            ) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                __typename
                id
                title
                link
                slug
                contentTypeName
                date
                featuredImage {
                  node {
                    altText
                    sourceUrl
                  }
                }
                lumenSeasons {
                  nodes {
                    name
                    slug
                  }
                }
                manyLumensEpisodesAcf {
                  introduction
                }
              }
            }
          }
        `,
        variables,
      )
      all.push(...data.lumenEpisodes.nodes)
      hasNextPage = data.lumenEpisodes.pageInfo.hasNextPage
      after = data.lumenEpisodes.pageInfo.endCursor
    } catch (error: any) {
      const data = error?.response?.data
      if (data?.lumenEpisodes?.nodes) {
        all.push(...data.lumenEpisodes.nodes)
      }
      break
    }
  }
  return all
}

export async function getLumenEpisode(
  slug: string,
): Promise<LumenEpisode | null> {
  try {
    const data = await client.request<{
      lumenEpisode: LumenEpisode | null
    }>(
      gql`
        query getLumenEpisode($slug: ID!) {
          lumenEpisode(id: $slug, idType: SLUG) {
            title
            slug
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            lumenSeasons {
              nodes {
                name
                slug
              }
            }
            blogSettings {
              coverImage {
                node {
                  sourceUrl
                  altText
                }
              }
              mobileCoverImage {
                node {
                  sourceUrl
                  altText
                }
              }
              coverVideo {
                node {
                  mediaItemUrl
                }
              }
            }
            manyLumensEpisodesAcf {
              introduction
              subtitleHost
              episodeName
              credits
              showNotes
              transcript
              colour
              buzzSprout {
                embedCode
                mp3Url
              }
              relatedEpisodes {
                nodes {
                  ... on LumenEpisode {
                    __typename
                    id
                    title
                    slug
                    date
                    link
                    featuredImage {
                      node {
                        sourceUrl
                        altText
                      }
                    }
                    lumenSeasons {
                      nodes {
                        name
                        slug
                      }
                    }
                    manyLumensEpisodesAcf {
                      introduction
                    }
                  }
                }
              }
              guestBios {
                content
                link {
                  url
                  title
                }
                image {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
            }
          }
        }
      `,
      { slug },
    )
    return data.lumenEpisode
  } catch (error: any) {
    return error?.response?.data?.lumenEpisode ?? null
  }
}

export async function getAllLumenEpisodeSlugs(): Promise<
  { season: string; slug: string }[]
> {
  const all: { season: string; slug: string }[] = []
  let hasNextPage = true
  let after: string | null = null

  while (hasNextPage) {
    try {
      const variables: { after: string | null } = { after }
      const data = await client.request<{
        lumenEpisodes: {
          nodes: {
            slug: string
            lumenSeasons: { nodes: { slug: string }[] }
          }[]
          pageInfo: { hasNextPage: boolean; endCursor: string }
        }
      }>(
        gql`
          query getAllLumenEpisodeSlugs($after: String) {
            lumenEpisodes(first: 100, after: $after) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                slug
                lumenSeasons {
                  nodes {
                    slug
                  }
                }
              }
            }
          }
        `,
        variables,
      )

      const valid = data.lumenEpisodes.nodes
        .filter((e) => e.lumenSeasons?.nodes?.[0]?.slug)
        .map((e) => ({
          season: e.lumenSeasons.nodes[0].slug,
          slug: e.slug,
        }))

      all.push(...valid)
      hasNextPage = data.lumenEpisodes.pageInfo.hasNextPage
      after = data.lumenEpisodes.pageInfo.endCursor
    } catch {
      break
    }
  }
  return all
}

export async function getRelatedLumenEpisodes(
  excludeSlug: string,
  episodeDate: string,
): Promise<LumenEpisode[]> {
  const all = await getAllLumenEpisodes()
  const targetDate = new Date(episodeDate).getTime()
  return all
    .filter((ep) => ep.slug !== excludeSlug)
    .sort((a, b) => {
      const diffA = Math.abs(new Date(a.date ?? '').getTime() - targetDate)
      const diffB = Math.abs(new Date(b.date ?? '').getTime() - targetDate)
      return diffA - diffB
    })
    .slice(0, 4)
}

export async function getAllProgramEvents(): Promise<ProgramEvent[]> {
  const all: ProgramEvent[] = []
  let hasNextPage = true
  let after: string | null = null

  while (hasNextPage) {
    try {
      const variables: { after: string | null } = { after }
      const data = await client.request<{
        programEvents: {
          nodes: ProgramEvent[]
          pageInfo: { hasNextPage: boolean; endCursor: string }
        }
      }>(
        gql`
          query getAllProgramEvents($after: String) {
            programEvents(
              first: 100
              after: $after
              where: { orderby: { field: DATE, order: DESC } }
            ) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                __typename
                id
                title
                link
                contentTypeName
                parent {
                  node {
                    id
                  }
                }
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
                  redirect {
                    url
                  }
                  programType {
                    nodes {
                      name
                      slug
                    }
                  }
                }
              }
            }
          }
        `,
        variables,
      )
      all.push(
        ...data.programEvents.nodes.filter((e: any) => !e.parent?.node?.id),
      )
      hasNextPage = data.programEvents.pageInfo.hasNextPage
      after = data.programEvents.pageInfo.endCursor
    } catch (error: any) {
      const data = error?.response?.data
      if (data?.programEvents?.nodes) {
        all.push(
          ...data.programEvents.nodes.filter((e: any) => !e.parent?.node?.id),
        )
      }
      break
    }
  }
  return all
}

export async function getChildProgramEvents(
  parentSlug: string,
  parentProgramType: string,
): Promise<ProgramEvent[]> {
  try {
    const data = await client.request<{
      programEvents: {
        nodes: ProgramEvent[]
      }
    }>(
      gql`
        query getChildProgramEvents($parentSlug: String) {
          programEvents(first: 100, where: { nameIn: [$parentSlug] }) {
            nodes {
              children {
                nodes {
                  ... on ProgramEvent {
                    __typename
                    id
                    title
                    slug
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
                      startTime
                      endTime
                      timezone
                      location
                      listingDateFormat
                      redirect {
                        url
                      }
                      programType {
                        nodes {
                          name
                          slug
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      { parentSlug },
    )
    const children = (data.programEvents.nodes[0] as any)?.children?.nodes ?? []

    return children.map((child: ProgramEvent) => ({
      ...child,
      link: `/events/${parentProgramType}/${parentSlug}/${child.slug}/`,
    }))
  } catch (error: any) {
    return (
      (error?.response?.data?.programEvents?.nodes?.[0] as any)?.children
        ?.nodes ?? []
    )
  }
}

export async function getAllChildProgramEventSlugs(): Promise<
  {
    programType: string
    slug: string
    childSlug: string
  }[]
> {
  const all: { programType: string; slug: string; childSlug: string }[] = []
  let hasNextPage = true
  let after: string | null = null

  while (hasNextPage) {
    try {
      const variables: { after: string | null } = { after }
      const data = await client.request<{
        programEvents: {
          nodes: {
            slug: string
            event: {
              programType: { nodes: { slug: string }[] }
            }
            children: {
              nodes: {
                __typename: string
                slug: string
                event: { redirect?: { url: string } | null }
              }[]
            }
          }[]
          pageInfo: { hasNextPage: boolean; endCursor: string }
        }
      }>(
        gql`
          query getAllChildProgramEventSlugs($after: String) {
            programEvents(first: 100, after: $after, where: { parent: 0 }) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                slug
                event {
                  programType {
                    nodes {
                      slug
                    }
                  }
                }
                children {
                  nodes {
                    ... on ProgramEvent {
                      __typename
                      slug
                      event {
                        redirect {
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables,
      )

      for (const parent of data.programEvents.nodes) {
        const programType = parent.event?.programType?.nodes?.[0]?.slug
        if (!programType) continue
        for (const child of parent.children?.nodes ?? []) {
          if (!child.slug) continue
          if (child.event?.redirect?.url) continue
          all.push({
            programType,
            slug: parent.slug,
            childSlug: child.slug,
          })
        }
      }

      hasNextPage = data.programEvents.pageInfo.hasNextPage
      after = data.programEvents.pageInfo.endCursor
    } catch (error: any) {
      console.log(
        'getAllChildProgramEventSlugs error:',
        error?.response?.errors?.[0]?.message,
      )
      break
    }
  }
  return all
}

export async function getSeenPage() {
  try {
    const data = await client.request<{
      page: {
        template: {
          seenFlexibleLayouts: {
            layouts: SeenFlexibleLayout[]
          }
        }
      }
    }>(gql`
      query getSeenPage {
        page(id: "/seen/", idType: URI) {
          template {
            ... on Template_SeenFlexibleLayouts {
              seenFlexibleLayouts {
                layouts {
                  __typename
                  ... on SeenFlexibleLayoutsLayoutsArticlesLayout {
                    articles {
                      title
                      preTitle
                      subTitle
                      type
                      image {
                        node {
                          sourceUrl
                          altText
                        }
                      }
                      link {
                        url
                        title
                      }
                      article {
                        nodes {
                          ... on SeenArticle {
                            __typename
                            title
                            slug
                            uri
                            featuredImage {
                              node {
                                sourceUrl
                                altText
                              }
                            }
                            seenIssues {
                              nodes {
                                name
                                slug
                              }
                            }
                            seenAuthors {
                              nodes {
                                name
                                slug
                              }
                            }
                            seenCategories {
                              nodes {
                                name
                                slug
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  ... on SeenFlexibleLayoutsLayoutsSpotlightContainedLayout {
                    title1
                    title2
                    title3
                    link {
                      url
                      title
                    }
                    image {
                      node {
                        sourceUrl
                        altText
                      }
                    }
                  }
                  ... on SeenFlexibleLayoutsLayoutsAnchorLayout {
                    anchorName
                  }
                  ... on SeenFlexibleLayoutsLayoutsSpaceLayout {
                    size
                  }
                  ... on SeenFlexibleLayoutsLayoutsFeatureMediaLayout {
                    heading
                    image {
                      node {
                        sourceUrl
                        altText
                      }
                    }
                    mobileImage {
                      node {
                        sourceUrl
                        altText
                      }
                    }
                    video {
                      node {
                        mediaItemUrl
                      }
                    }
                    mobileVideo {
                      node {
                        mediaItemUrl
                      }
                    }
                    link {
                      url
                      title
                    }
                  }
                }
              }
            }
          }
        }
      }
    `)
    return data.page?.template?.seenFlexibleLayouts?.layouts ?? []
  } catch (error: any) {
    return (
      error?.response?.data?.page?.template?.seenFlexibleLayouts?.layouts ?? []
    )
  }
}

export async function getSeenArticle(
  slug: string,
): Promise<SeenArticle | null> {
  try {
    const data = await client.request<{ seenArticle: SeenArticle | null }>(
      gql`
        query getSeenArticle($slug: ID!) {
          seenArticle(id: $slug, idType: SLUG) {
            title
            slug
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            seenIssues {
              nodes {
                name
                slug
              }
            }
            seenAuthors {
              nodes {
                name
                description
                slug
              }
            }
            seenCategories {
              nodes {
                name
                slug
              }
            }
            seenArticleLayouts {
              introduction
              cover {
                image {
                  node {
                    sourceUrl
                    altText
                  }
                }
                mobileImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
                video {
                  node {
                    mediaItemUrl
                  }
                }
                overrideTitle
                subtitle
                backgroundColour
                foregroundColour
                style
              }
              layouts {
                __typename
                ... on SeenArticleLayoutsLayoutsContentLayout {
                  content
                }
                ... on SeenArticleLayoutsLayoutsContainedMediaLayout {
                  image {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                  videoEmbed
                  reducedContainer
                }
                ... on SeenArticleLayoutsLayoutsFullWidthMediaLayout {
                  image {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                  videoEmbed
                }
                ... on SeenArticleLayoutsLayoutsFootnotesLayout {
                  footnotes
                }
              }
              relatedArticles {
                nodes {
                  ... on SeenArticle {
                    __typename
                    title
                    slug
                    uri
                    featuredImage {
                      node {
                        sourceUrl
                        altText
                      }
                    }
                    seenIssues {
                      nodes {
                        name
                        slug
                      }
                    }
                    seenAuthors {
                      nodes {
                        name
                        slug
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      { slug },
    )
    return data.seenArticle
  } catch (error: any) {
    return error?.response?.data?.seenArticle ?? null
  }
}

export async function getAllSeenArticleSlugs(): Promise<
  { issue: string; slug: string }[]
> {
  const all: { issue: string; slug: string }[] = []
  let hasNextPage = true
  let after: string | null = null

  while (hasNextPage) {
    try {
      const variables: { after: string | null } = { after }
      const data = await client.request<{
        seenArticles: {
          nodes: {
            slug: string
            seenIssues: { nodes: { slug: string }[] }
          }[]
          pageInfo: { hasNextPage: boolean; endCursor: string }
        }
      }>(
        gql`
          query getAllSeenArticleSlugs($after: String) {
            seenArticles(first: 100, after: $after) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                slug
                seenIssues {
                  nodes {
                    slug
                  }
                }
              }
            }
          }
        `,
        variables,
      )

      const valid = data.seenArticles.nodes
        .filter((a) => a.seenIssues?.nodes?.[0]?.slug)
        .map((a) => ({
          issue: a.seenIssues.nodes[0].slug,
          slug: a.slug,
        }))

      all.push(...valid)
      hasNextPage = data.seenArticles.pageInfo.hasNextPage
      after = data.seenArticles.pageInfo.endCursor
    } catch {
      break
    }
  }
  return all
}

export async function getAllSeenArticles(): Promise<SeenArticle[]> {
  const all: SeenArticle[] = []
  let hasNextPage = true
  let after: string | null = null

  while (hasNextPage) {
    try {
      const variables: { after: string | null } = { after }
      const data = await client.request<{
        seenArticles: {
          nodes: SeenArticle[]
          pageInfo: { hasNextPage: boolean; endCursor: string }
        }
      }>(
        gql`
          query getAllSeenArticles($after: String) {
            seenArticles(
              first: 100
              after: $after
              where: { orderby: { field: DATE, order: DESC } }
            ) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                title
                slug
                date
                featuredImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
                seenIssues {
                  nodes {
                    name
                    slug
                  }
                }
                seenAuthors {
                  nodes {
                    name
                    slug
                  }
                }
                seenCategories {
                  nodes {
                    name
                    slug
                  }
                }
                seenArticleLayouts {
                  introduction
                }
              }
            }
          }
        `,
        variables,
      )
      all.push(...data.seenArticles.nodes)
      hasNextPage = data.seenArticles.pageInfo.hasNextPage
      after = data.seenArticles.pageInfo.endCursor
    } catch (error: any) {
      const data = error?.response?.data
      if (data?.seenArticles?.nodes) {
        all.push(...data.seenArticles.nodes)
      }
      break
    }
  }
  return all
}

export async function getRelatedSeenArticles(
  slug: string,
  categorySlug: string,
  issueSlug: string,
  authorSlug: string,
  articleDate: string,
): Promise<SeenArticle[]> {
  try {
    const data = await client.request<{
      seenArticles: { nodes: SeenArticle[] }
    }>(gql`
      query getRelatedSeenArticles {
        seenArticles(
          first: 100
          where: { orderby: { field: DATE, order: DESC } }
        ) {
          nodes {
            title
            slug
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            seenIssues {
              nodes {
                name
                slug
              }
            }
            seenAuthors {
              nodes {
                name
                slug
              }
            }
            seenCategories {
              nodes {
                name
                slug
              }
            }
          }
        }
      }
    `)

    const targetDate = new Date(articleDate).getTime()
    const candidates = data.seenArticles.nodes.filter((a) => a.slug !== slug)

    // Score by relevance
    const scored = candidates.map((a) => {
      let score = 0
      if (a.seenCategories?.nodes?.some((c) => c.slug === categorySlug))
        score += 3
      if (a.seenIssues?.nodes?.some((i) => i.slug === issueSlug)) score += 2
      if (a.seenAuthors?.nodes?.some((au) => au.slug === authorSlug)) score += 2
      const dateDiff = Math.abs(new Date(a.date ?? '').getTime() - targetDate)
      score -= dateDiff / (1000 * 60 * 60 * 24 * 365) // penalize by years apart
      return { article: a, score }
    })

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => s.article)
  } catch (error: any) {
    return []
  }
}
export async function getAllSeenSubPageSlugs(): Promise<string[]> {
  const all: { uri: string; template: { templateName: string } }[] = []
  let hasNextPage = true
  let after: string | null = null

  while (hasNextPage) {
    try {
      const variables: { after: string | null } = { after }
      const data = await client.request<{
        pages: {
          nodes: { uri: string; template: { templateName: string } }[]
          pageInfo: { hasNextPage: boolean; endCursor: string }
        }
      }>(
        gql`
          query getAllSeenSubPageSlugs($after: String) {
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
      all.push(...data.pages.nodes)
      hasNextPage = data.pages.pageInfo.hasNextPage
      after = data.pages.pageInfo.endCursor
    } catch {
      break
    }
  }

  const slugs = all
    .filter(
      (p) =>
        p.template?.templateName === 'Seen Flexible Layouts' &&
        p.uri !== '/seen/',
    )
    .map((p) => p.uri.replace('/seen/', '').replace(/\/$/, ''))

  return slugs
}

export async function getSeenSubPage(
  slug: string,
): Promise<SeenFlexibleLayout[]> {
  try {
    const data = await client.request<{
      page: {
        template: {
          seenFlexibleLayouts: {
            layouts: SeenFlexibleLayout[]
          }
        }
      } | null
    }>(
      gql`
        query getSeenSubPage($slug: ID!) {
          page(id: $slug, idType: URI) {
            template {
              ... on Template_SeenFlexibleLayouts {
                seenFlexibleLayouts {
                  layouts {
                    __typename
                    ... on SeenFlexibleLayoutsLayoutsFeatureTextLayout {
                      text
                    }
                    ... on SeenFlexibleLayoutsLayoutsSpotlightLayout {
                      text
                      backgroundColour
                      foregroundColour
                      link {
                        url
                        title
                      }
                      image {
                        node {
                          sourceUrl
                          altText
                        }
                      }
                    }
                    ... on SeenFlexibleLayoutsLayoutsAccordionLayout {
                      heading
                      accordionSections {
                        heading
                        columns {
                          heading
                          content
                        }
                      }
                    }
                    ... on SeenFlexibleLayoutsLayoutsStockistsLayout {
                      heading
                      locations {
                        locationName
                        stockists {
                          name
                          link {
                            url
                            title
                          }
                        }
                      }
                    }
                    ... on SeenFlexibleLayoutsLayoutsContactDetailsLayout {
                      heading
                    }
                    ... on SeenFlexibleLayoutsLayoutsListLayout {
                      heading
                      listItems {
                        line1
                        line2
                      }
                    }
                    ... on SeenFlexibleLayoutsLayoutsIssueCreditsLayout {
                      heading
                    }
                    ... on SeenFlexibleLayoutsLayoutsArticlesLayout {
                      articles {
                        title
                        preTitle
                        subTitle
                        type
                        image {
                          node {
                            sourceUrl
                            altText
                          }
                        }
                        link {
                          url
                          title
                        }
                        article {
                          nodes {
                            ... on SeenArticle {
                              __typename
                              title
                              slug
                              uri
                              featuredImage {
                                node {
                                  sourceUrl
                                  altText
                                }
                              }
                              seenIssues {
                                nodes {
                                  name
                                  slug
                                }
                              }
                              seenAuthors {
                                nodes {
                                  name
                                  slug
                                }
                              }
                              seenCategories {
                                nodes {
                                  name
                                  slug
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    ... on SeenFlexibleLayoutsLayoutsSpaceLayout {
                      size
                    }
                    ... on SeenFlexibleLayoutsLayoutsAnchorLayout {
                      anchorName
                    }
                  }
                }
              }
            }
          }
        }
      `,
      { slug: `/seen/${slug}/` },
    )

    return data.page?.template?.seenFlexibleLayouts?.layouts ?? []
  } catch (error: any) {
    return (
      error?.response?.data?.page?.template?.seenFlexibleLayouts?.layouts ?? []
    )
  }
}

export async function getSeenIssueCredits(): Promise<
  {
    name: string
    slug: string
    seenIssueAcf: {
      showInAbout?: boolean
      contributors?: { heading?: string; contributors?: string }
      guestEditors?: {
        heading?: string
        editors?: { name: string; role?: string | null }[]
      }
    }
  }[]
> {
  try {
    const data = await client.request<{
      seenIssues: {
        nodes: {
          name: string
          slug: string
          seenIssueAcf: {
            showInAbout?: boolean
            contributors?: { heading?: string; contributors?: string }
            guestEditors?: {
              heading?: string
              editors?: { name: string; role?: string | null }[]
            }
          }
        }[]
      }
    }>(gql`
      query getSeenIssueCredits {
        seenIssues(first: 100) {
          nodes {
            name
            slug
            seenIssueAcf {
              showInAbout
              contributors {
                heading
                contributors
              }
              guestEditors {
                heading
                editors {
                  name
                  role
                }
              }
            }
          }
        }
      }
    `)
    return data.seenIssues.nodes.filter((i) => i.seenIssueAcf?.showInAbout)
  } catch (error: any) {
    return (
      error?.response?.data?.seenIssues?.nodes?.filter(
        (i: any) => i.seenIssueAcf?.showInAbout,
      ) ?? []
    )
  }
}

export async function getSeenContactDetails() {
  try {
    const data = await client.request<{
      siteSettings: {
        siteSettingsAcf: {
          seenEmail?: string | null
          seenSocialLinks?: {
            facebookUrl?: string | null
            instagramUrl?: string | null
            twitterUrl?: string | null
            youtubeUrl?: string | null
          }
        }
      }
    }>(gql`
      query getSeenContactDetails {
        siteSettings {
          siteSettingsAcf {
            seenEmail
            seenSocialLinks {
              facebookUrl
              instagramUrl
              twitterUrl
              youtubeUrl
            }
          }
        }
      }
    `)
    const acf = data.siteSettings?.siteSettingsAcf
    return {
      email: acf?.seenEmail ?? null,
      facebookUrl: acf?.seenSocialLinks?.facebookUrl ?? null,
      instagramUrl: acf?.seenSocialLinks?.instagramUrl ?? null,
      twitterUrl: acf?.seenSocialLinks?.twitterUrl ?? null,
      youtubeUrl: acf?.seenSocialLinks?.youtubeUrl ?? null,
    }
  } catch {
    return null
  }
}

export async function getAllFestivalPageSlugs(): Promise<{ slug: string[] }[]> {
  const all: { uri: string }[] = []
  let hasNextPage = true
  let after: string | null = null

  while (hasNextPage) {
    try {
      const variables: { after: string | null } = { after }
      const data = await client.request<{
        pages: {
          nodes: { uri: string }[]
          pageInfo: { hasNextPage: boolean; endCursor: string }
        }
      }>(
        gql`
          query getAllFestivalPageSlugs($after: String) {
            pages(first: 100, after: $after, where: { pageBrand: "festival" }) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                uri
              }
            }
          }
        `,
        variables,
      )

      all.push(...data.pages.nodes)
      hasNextPage = data.pages.pageInfo.hasNextPage
      after = data.pages.pageInfo.endCursor
    } catch {
      break
    }
  }

  return all
    .filter((p) => p.uri)
    .map((p) => ({
      slug: p.uri.split('/').filter(Boolean),
    }))
}

export async function getFestivalPage(slug: string): Promise<FestivalLayout[]> {
  try {
    const data = await client.request<{
      page: {
        template: {
          festivalFlexibleLayoutsAcf: {
            festival24FlexibleLayouts: {
              layouts: FestivalLayout[]
            }[]
          }
        }
      } | null
    }>(
      gql`
        query getFestivalPage($slug: ID!) {
          page(id: $slug, idType: URI) {
            template {
              ... on Template_FestivalFlexiblePage {
                festivalFlexibleLayoutsAcf {
                  festival24FlexibleLayouts {
                    layouts {
                      __typename
                      ... on FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsSpotlightCarouselLayout {
                        type
                        background
                        inversed
                        cards {
                          type
                          inverse
                          custom {
                            heading
                            preHeading
                            description
                            image {
                              node {
                                sourceUrl
                                altText
                              }
                            }
                            video {
                              node {
                                mediaItemUrl
                              }
                            }
                            buttons {
                              button {
                                url
                                title
                              }
                              backArrow
                            }
                          }
                          event {
                            nodes {
                              ... on FestivalEvent {
                                title
                                slug
                                featuredImage {
                                  node {
                                    sourceUrl
                                    altText
                                  }
                                }
                              }
                            }
                          }
                          film {
                            nodes {
                              ... on FestivalFilm {
                                title
                                slug
                                featuredImage {
                                  node {
                                    sourceUrl
                                    altText
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                      ... on FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsLatestNewsLayout {
                        heading
                        items
                        viewAllButtonLabel
                      }
                      ... on FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsCardsLayout {
                        gridLayout
                        cards {
                          heading
                          content
                          extraHeading
                          extraContent
                          image {
                            node {
                              sourceUrl
                              altText
                            }
                          }
                          callToAction {
                            url
                            title
                          }
                        }
                      }
                      ... on FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsHeadingLayout {
                        heading
                        links {
                          link {
                            url
                            title
                          }
                        }
                      }
                      ... on FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsVideoCoverLayout {
                        videoEmbed
                        videoType
                        coverImage {
                          node {
                            sourceUrl
                            altText
                          }
                        }
                      }
                      ... on FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsButtonsLayout {
                        buttons {
                          button {
                            url
                            title
                          }
                          backArrow
                        }
                      }
                      ... on FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsBiosLayout {
                        itemsPerPage
                        collection {
                          nodes {
                            ... on BioCollection {
                              name
                              slug
                            }
                          }
                        }
                      }
                      ... on FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsSponsorsCarouselLayout {
                        heading
                        collection {
                          nodes {
                            ... on SponsorCollection {
                              name
                              slug
                            }
                          }
                        }
                      }
                      ... on FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsAnchorLayout {
                        anchorName
                      }
                      ... on FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsSpaceLayout {
                        fieldGroupName
                      }
                      ... on FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsContentLayout {
                        columns {
                          content
                          buttons {
                            button {
                              url
                              title
                            }
                            backArrow
                          }
                        }
                      }
                      ... on FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsExplainersLayout {
                        explainer {
                          heading
                          description
                          icon {
                            node {
                              sourceUrl
                              altText
                            }
                          }
                          buttons {
                            button {
                              url
                              title
                            }
                            backArrow
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
      `,
      { slug: `/${slug}/` },
    )
    const sections =
      data.page?.template?.festivalFlexibleLayoutsAcf
        ?.festival24FlexibleLayouts ?? []
    return sections.flatMap((section) => section.layouts ?? []).filter(Boolean)
  } catch (error: any) {
    const sections =
      error?.response?.data?.page?.template?.festivalFlexibleLayoutsAcf
        ?.festival24FlexibleLayouts ?? []
    return sections
      .flatMap((section: any) => section.layouts ?? [])
      .filter(Boolean)
  }
}

export async function getBiographiesByCollection(
  collectionSlug: string,
  first: number = 4,
  after: string | null = null,
): Promise<{
  bios: {
    title: string
    slug: string
    featuredImage?: { node: { sourceUrl: string; altText: string } } | null
    biography?: { role?: string }
  }[]
  hasNextPage: boolean
  endCursor: string | null
}> {
  console.log('getBiographiesByCollection called with:', collectionSlug)
  try {
    const data = await client.request<{
      biographies: {
        nodes: {
          title: string
          slug: string
          featuredImage?: {
            node: { sourceUrl: string; altText: string }
          } | null
        }[]
        pageInfo: { hasNextPage: boolean; endCursor: string }
      }
    }>(
      gql`
        query getBiographiesByCollection(
          $collectionSlug: String!
          $first: Int!
          $after: String
        ) {
          biographies(
            first: $first
            after: $after
            where: { bioCollection: $collectionSlug }
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              title
              slug
              content
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
              biographyAcf {
                position
                pronouns
                socialProfiles {
                  facebook
                  instagram
                  linkedin
                  twitter
                  website
                  youtube
                }
              }
            }
          }
        }
      `,
      { collectionSlug, first, after },
    )
    return {
      bios: data.biographies.nodes,
      hasNextPage: data.biographies.pageInfo.hasNextPage,
      endCursor: data.biographies.pageInfo.endCursor,
    }
  } catch (error: any) {
    console.log(
      'getBiographiesByCollection error:',
      error?.response?.errors?.[0]?.message,
      error?.message,
    )
    return { bios: [], hasNextPage: false, endCursor: null }
  }
}

export async function getSponsorsByCollection(collectionSlug: string): Promise<
  {
    title: string
    sponsorAcf?: {
      logo?: { node: { sourceUrl: string; altText: string } } | null
      logoBlack?: { node: { sourceUrl: string; altText: string } } | null
      website?: string | null
    } | null
  }[]
> {
  try {
    const data = await client.request<{
      sponsors: {
        nodes: {
          title: string
          sponsorAcf?: {
            logo?: { node: { sourceUrl: string; altText: string } } | null
            logoBlack?: { node: { sourceUrl: string; altText: string } } | null
            website?: string | null
          } | null
        }[]
      }
    }>(
      gql`
        query getSponsorsByCollection($collectionSlug: String!) {
          sponsors(first: 100, where: { sponsorCollection: $collectionSlug }) {
            nodes {
              title
              sponsorAcf {
                logo {
                  node {
                    sourceUrl
                    altText
                  }
                }
                logoBlack {
                  node {
                    sourceUrl
                    altText
                  }
                }
                website
              }
            }
          }
        }
      `,
      { collectionSlug },
    )
    return data.sponsors.nodes
  } catch (error: any) {
    console.log(
      'getSponsorsByCollection error:',
      error?.response?.errors?.[0]?.message,
    )
    return []
  }
}

export async function getFestivalPosts(first: number = 3): Promise<
  {
    title: string
    link: string
    featuredImage?: { node: { sourceUrl: string; altText: string } } | null
    festivalPostAcf?: {
      redirectTo?: { title?: string; url?: string } | null
    } | null
  }[]
> {
  try {
    const data = await client.request<{
      festivalPosts: {
        nodes: {
          title: string
          link: string
          featuredImage?: {
            node: { sourceUrl: string; altText: string }
          } | null
          festivalPostAcf?: {
            redirectTo?: { title?: string; url?: string } | null
          } | null
        }[]
      }
    }>(
      gql`
        query getFestivalPosts($first: Int!) {
          festivalPosts(first: $first) {
            nodes {
              title
              link
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
              festivalPostAcf {
                redirectTo {
                  title
                  url
                }
              }
            }
          }
        }
      `,
      { first },
    )
    return data.festivalPosts.nodes
  } catch {
    return []
  }
}

export async function getFestivalMenus() {
  try {
    const data = await client.request<{
      siteSettings: {
        siteSettingsAcf: {
          festivalMenus: {
            year: { nodes: { slug: string }[] }
            menuItems: {
              link: { url: string; title: string }
              submenuItems?: { link: { url: string; title: string } }[] | null
            }[]
            topMenuItems?: { link: { url: string; title: string } }[] | null
          }[]
        }
      }
    }>(gql`
      query getFestivalMenus {
        siteSettings {
          siteSettingsAcf {
            festivalMenus {
              year {
                nodes {
                  slug
                }
              }
              menuItems {
                link {
                  url
                  title
                }
                submenuItems {
                  link {
                    url
                    title
                  }
                }
              }
              topMenuItems {
                link {
                  url
                  title
                }
              }
            }
          }
        }
      }
    `)
    return data.siteSettings?.siteSettingsAcf?.festivalMenus ?? []
  } catch {
    return []
  }
}

export async function getFestivalSchedule(year: string = '2025'): Promise<{
  events: FestivalEvent[]
  dates: { name: string; slug: string; count?: number | null }[]
  venues: { name: string; slug: string; count?: number | null }[]
  tags: { name: string; slug: string; count?: number | null }[]
}> {
  try {
    const data = await client.request<{
      festivalEvents: { nodes: FestivalEvent[] }
      festivalDates: {
        nodes: { name: string; slug: string; count?: number | null }[]
      }
      festivalVenues: {
        nodes: { name: string; slug: string; count?: number | null }[]
      }
      eventiveTags: {
        nodes: { name: string; slug: string; count?: number | null }[]
      }
    }>(
      gql`
        query getFestivalSchedule($year: String!) {
          festivalEvents(first: 500, where: { festivalYear: $year }) {
            nodes {
              title
              slug
              excerpt
              content
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
              festivalEventAcf {
                eventiveId
                ticketsAvailable
                hideTicketsButton
                externalTicketsUrl
                startTime
                endTime
                timezone
                timezoneAbv
                isVirtual
                timezoneAbv
                isEvent
                isVirtual
              }
              premiereStatuses {
                nodes {
                  name
                  slug
                }
              }
              festivalAwards {
                nodes {
                  name
                  slug
                }
              }
              accessibilities {
                nodes {
                  name
                  slug
                }
              }
              eventiveTags {
                nodes {
                  name
                  slug
                }
              }
              festivalDates {
                nodes {
                  name
                  slug
                }
              }
              festivalVenues {
                nodes {
                  name
                  slug
                }
              }
            }
          }
          festivalDates(first: 100) {
            nodes {
              name
              slug
              count
            }
          }
          festivalVenues(first: 100) {
            nodes {
              name
              slug
              count
            }
          }
          eventiveTags(first: 100) {
            nodes {
              name
              slug
              count
            }
          }
        }
      `,
      { year },
    )
    return {
      events: data.festivalEvents.nodes,
      dates: data.festivalDates.nodes.filter(
        (d) => d.slug.endsWith(year) && (d.count ?? 0) > 0,
      ),
      venues: data.festivalVenues.nodes.filter((v) => (v.count ?? 0) > 0),
      tags: data.eventiveTags.nodes.filter((t) => (t.count ?? 0) > 0),
    }
  } catch (error: any) {
    console.log(
      'getFestivalSchedule error:',
      error?.response?.errors?.[0]?.message,
    )
    return { events: [], dates: [], venues: [], tags: [] }
  }
}

// Add this query to queries.ts first
export async function getFestivalPageTemplate(slug: string): Promise<string | null> {
  try {
    const data = await client.request<{
      page: { template: { templateName: string } } | null
    }>(gql`
      query getFestivalPageTemplate($slug: ID!) {
        page(id: $slug, idType: URI) {
          template {
            templateName
          }
        }
      }
    `, { slug: `/${slug}/` })
    return data.page?.template?.templateName ?? null
  } catch {
    return null
  }
}