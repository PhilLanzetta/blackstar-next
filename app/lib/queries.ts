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

    return {
      layouts,
      pressClippings,
      pressReleasePosts,
      allPosts,
      opportunityTypes: data.opportunityTypes?.nodes ?? [],
      noOpportunitiesMessage: siteSettingsAcf?.noOpportunitiesMessage,
      contactDetails: siteSettingsAcf?.contactDetails,
      socialLinks: siteSettingsAcf?.socialLinks,
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

      return {
        layouts,
        pressClippings,
        pressReleasePosts,
        allPosts,
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
      console.log('getAllPosts catch error:', error?.response?.errors)
      if (data?.posts?.nodes) {
        console.log('first node in catch:', JSON.stringify(data.posts.nodes[0]))
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
