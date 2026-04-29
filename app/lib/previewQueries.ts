// app/lib/previewQueries.ts
// Mirrors the single-item fetch functions from queries.ts but:
// 1. Uses previewClient (Basic Auth) instead of the public client
// 2. Passes asPreview: true on the node fetch so WPGraphQL returns draft content
//
// Only includes functions that fetch individual content by slug —
// list/collection queries don't need preview versions.

import { gql } from 'graphql-request'
import { previewClient } from '@/app/lib/previewClient'
import type {
  FlexibleLayout,
  DefaultPageData,
  DefaultPageResult,
  SeenArticle,
  LumenEpisode,
  FestivalLayout,
  SeenFlexibleLayout,
  HomePageData
} from './types'
import {
  getAllPressClippings,
  getPressReleasePosts,
  getAllPosts,
  getAllLumenEpisodes,
  getAllProgramEvents,
  GET_HOME_PAGE,
} from './queries'

// ─── Default Page ─────────────────────────────────────────────────────────────

export async function getDefaultPagePreview(
  slug: string,
): Promise<DefaultPageResult> {
  const emptyResult: DefaultPageResult = {
    layouts: [],
    opportunityTypes: [],
    noOpportunitiesMessage: undefined,
    contactDetails: undefined,
    socialLinks: undefined,
  }

  try {
    const data = await previewClient.request<DefaultPageData>(
      gql`
        query getDefaultPagePreview($slug: ID!) {
          page(id: $slug, idType: URI, asPreview: true) {
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
      `,
      { slug },
    )

    const page = data?.page
    if (!page || page?.template?.templateName !== 'Default') return emptyResult

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
    console.error(
      'getDefaultPagePreview error:',
      error?.response?.errors?.[0]?.message,
    )
    return emptyResult
  }
}

// ─── Festival Flexible Page ───────────────────────────────────────────────────

export async function getFestivalPagePreview(
  slug: string,
): Promise<FestivalLayout[]> {
  try {
    const data = await previewClient.request<{
      page: {
        template: {
          festivalFlexibleLayoutsAcf: {
            festival24FlexibleLayouts: { layouts: FestivalLayout[] }[]
          }
        }
      } | null
    }>(
      gql`
        query getFestivalPagePreview($slug: ID!) {
          page(id: $slug, idType: URI, asPreview: true) {
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
                                uri
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
                        type
                        bios {
                          nodes {
                            ... on Biography {
                              title
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
                                  instagram
                                  twitter
                                  facebook
                                  website
                                  youtube
                                  linkedin
                                }
                              }
                            }
                          }
                        }
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
    console.error(
      'getFestivalPagePreview error:',
      error?.response?.errors?.[0]?.message,
    )
    return []
  }
}

// ─── Festival Page Template Check ────────────────────────────────────────────

export async function getFestivalPageTemplatePreview(
  slug: string,
): Promise<string | null> {
  try {
    const data = await previewClient.request<{
      page: { template: { templateName: string } } | null
    }>(
      gql`
        query getFestivalPageTemplatePreview($slug: ID!) {
          page(id: $slug, idType: URI, asPreview: true) {
            template {
              templateName
            }
          }
        }
      `,
      { slug: `/${slug}/` },
    )
    return data.page?.template?.templateName ?? null
  } catch {
    return null
  }
}

// ─── Festival Film ────────────────────────────────────────────────────────────

export async function getFestivalFilmPreview(slug: string) {
  try {
    const data = await previewClient.request<{
      festivalFilm: {
        title: string
        slug: string
        uri: string
        content?: string | null
        excerpt?: string | null
        featuredImage?: { node: { sourceUrl: string; altText: string } } | null
        premiereStatuses?: { nodes: { name: string; slug: string }[] } | null
        festivalAwards?: { nodes: { name: string; slug: string }[] } | null
        eventiveTags?: { nodes: { name: string; slug: string }[] } | null
        accessibilities?: {
          nodes: { name: string; slug: string; description?: string | null }[]
        } | null
        festivalFilmAcf?: {
          runtime?: string | null
          country?: string | null
          language?: string | null
          year?: string | null
          trailerUrl?: string | null
          triggerWarning?: string | null
          directorsSpotlightHeading?: string | null
          coverImage?: { node: { sourceUrl: string; altText: string } } | null
          stillImage?: { node: { sourceUrl: string; altText: string } } | null
          credits?: { type?: string | null; name?: string | null }[] | null
          directorsSpotlight?: {
            nodes: {
              title: string
              content?: string | null
              featuredImage?: {
                node: { sourceUrl: string; altText: string }
              } | null
              biographyAcf?: {
                position?: string | null
                pronouns?: string | null
                socialProfiles?: {
                  instagram?: string | null
                  twitter?: string | null
                  facebook?: string | null
                  website?: string | null
                  youtube?: string | null
                  linkedin?: string | null
                } | null
              } | null
            }[]
          } | null
          events?: {
            nodes: {
              title: string
              slug: string
              uri: string
              festivalEventAcf?: {
                startTime?: string | null
                endTime?: string | null
                timezoneAbv?: string | null
                isVirtual?: boolean | null
                ticketsAvailable?: boolean | null
                hideTicketsButton?: boolean | null
                eventiveId?: string | null
              } | null
              festivalVenues?: {
                nodes: { name: string; slug: string }[]
              } | null
              festivalDates?: { nodes: { name: string; slug: string }[] } | null
            }[]
          } | null
        } | null
      } | null
    }>(
      gql`
        query getFestivalFilmPreview($slug: ID!) {
          festivalFilm(id: $slug, idType: SLUG, asPreview: true) {
            title
            slug
            uri
            content
            excerpt
            featuredImage {
              node {
                sourceUrl
                altText
              }
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
            eventiveTags {
              nodes {
                name
                slug
              }
            }
            accessibilities {
              nodes {
                name
                slug
                description
              }
            }
            festivalFilmAcf {
              runtime
              country
              language
              year
              trailerUrl
              triggerWarning
              directorsSpotlightHeading
              coverImage {
                node {
                  sourceUrl
                  altText
                }
              }
              stillImage {
                node {
                  sourceUrl
                  altText
                }
              }
              credits {
                type
                name
              }
              directorsSpotlight {
                nodes {
                  ... on Biography {
                    title
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
                        instagram
                        twitter
                        facebook
                        website
                        youtube
                        linkedin
                      }
                    }
                  }
                }
              }
              events {
                nodes {
                  ... on FestivalEvent {
                    title
                    slug
                    uri
                    festivalEventAcf {
                      startTime
                      endTime
                      timezoneAbv
                      isVirtual
                      ticketsAvailable
                      hideTicketsButton
                      eventiveId
                    }
                    festivalVenues {
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
                  }
                }
              }
            }
          }
        }
      `,
      { slug },
    )
    return data.festivalFilm
  } catch (error: any) {
    console.error(
      'getFestivalFilmPreview error:',
      error?.response?.errors?.[0]?.message,
    )
    return null
  }
}

// ─── Festival Event ───────────────────────────────────────────────────────────

export async function getFestivalEventPreview(slug: string) {
  try {
    const data = await previewClient.request<{
      festivalEvent: {
        title: string
        slug: string
        uri: string
        content?: string | null
        excerpt?: string | null
        featuredImage?: { node: { sourceUrl: string; altText: string } } | null
        premiereStatuses?: { nodes: { name: string; slug: string }[] } | null
        festivalAwards?: { nodes: { name: string; slug: string }[] } | null
        eventiveTags?: { nodes: { name: string; slug: string }[] } | null
        festivalVenues?: { nodes: { name: string; slug: string }[] } | null
        festivalDates?: { nodes: { name: string; slug: string }[] } | null
        festivalFlexibleLayoutsAcf?: {
          festival24FlexibleLayouts?: { layouts: FestivalLayout[] }[]
        } | null
        festivalEventAcf?: {
          eventiveId?: string | null
          ticketsAvailable?: boolean | null
          hideTicketsButton?: boolean | null
          externalTicketsUrl?: string | null
          startTime?: string | null
          endTime?: string | null
          timezone?: string | null
          timezoneAbv?: string | null
          isVirtual?: boolean | null
          isEvent?: boolean | null
          eventLayout?: string[] | null
          informationHeading?: string | null
          filmsHeading?: string | null
          multipleShowings?: boolean | null
          location?: string | null
          coverImage?: { node: { sourceUrl: string; altText: string } } | null
          films?: {
            nodes: {
              title: string
              slug: string
              uri: string
              excerpt?: string | null
              content?: string | null
              festivalFilmId?: number | null
              featuredImage?: {
                node: { sourceUrl: string; altText: string }
              } | null
              premiereStatuses?: {
                nodes: { name: string; slug: string }[]
              } | null
              festivalAwards?: {
                nodes: { name: string; slug: string }[]
              } | null
              eventiveTags?: { nodes: { name: string; slug: string }[] } | null
            }[]
          } | null
          duplicateEvents?: {
            nodes: {
              title: string
              slug: string
              uri: string
              featuredImage?: {
                node: { sourceUrl: string; altText: string }
              } | null
              festivalEventAcf?: {
                startTime?: string | null
                endTime?: string | null
                timezone?: string | null
                timezoneAbv?: string | null
                isVirtual?: boolean | null
                ticketsAvailable?: boolean | null
                hideTicketsButton?: boolean | null
                eventiveId?: string | null
              } | null
              festivalVenues?: {
                nodes: { name: string; slug: string }[]
              } | null
            }[]
          } | null
          relatedEvents?: {
            nodes: {
              title: string
              slug: string
              uri: string
              featuredImage?: {
                node: { sourceUrl: string; altText: string }
              } | null
              festivalEventAcf?: {
                startTime?: string | null
                timezone?: string | null
                timezoneAbv?: string | null
                eventiveId?: string | null
                ticketsAvailable?: boolean | null
              } | null
              festivalVenues?: {
                nodes: { name: string; slug: string }[]
              } | null
            }[]
          } | null
          additionalCredits?:
            | {
                label?: string | null
                type?: string[] | null
                credit?: string | null
                link?: string | null
                logo?: { node: { sourceUrl: string; altText: string } } | null
                manualCredits?:
                  | {
                      link?: string | null
                      logo?: { node: { sourceUrl: string } } | null
                    }[]
                  | null
                sponsors?: {
                  nodes: {
                    title?: string | null
                    sponsorAcf?: {
                      logo?: {
                        node: { sourceUrl: string; altText: string }
                      } | null
                      logoBlack?: {
                        node: { sourceUrl: string; altText: string }
                      } | null
                      website?: string | null
                    } | null
                  }[]
                } | null
              }[]
            | null
        } | null
      } | null
    }>(
      gql`
        query getFestivalEventPreview($slug: ID!) {
          festivalEvent(id: $slug, idType: SLUG, asPreview: true) {
            title
            slug
            uri
            content
            excerpt
            featuredImage {
              node {
                sourceUrl
                altText
              }
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
            eventiveTags {
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
            festivalDates {
              nodes {
                name
                slug
              }
            }
            festivalFlexibleLayoutsAcf {
              festival24FlexibleLayouts {
                layouts {
                  __typename
                  ... on FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsHeadingLayout {
                    heading
                    links {
                      link {
                        url
                        title
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
                  ... on FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsBiosLayout {
                    itemsPerPage
                    type
                    bios {
                      nodes {
                        ... on Biography {
                          title
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
                              instagram
                              twitter
                              facebook
                              website
                              youtube
                              linkedin
                            }
                          }
                        }
                      }
                    }
                    collection {
                      nodes {
                        ... on BioCollection {
                          name
                          slug
                        }
                      }
                    }
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
                  ... on FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsCardsLayout {
                    gridLayout
                    cards {
                      heading
                      content
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
                  ... on FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsButtonsLayout {
                    buttons {
                      button {
                        url
                        title
                      }
                      backArrow
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
                }
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
              isEvent
              eventLayout
              informationHeading
              filmsHeading
              multipleShowings
              location
              coverImage {
                node {
                  sourceUrl
                  altText
                }
              }
              additionalCredits {
                label
                type
                credit
                link
                logo {
                  node {
                    sourceUrl
                    altText
                  }
                }
                manualCredits {
                  link
                  logo {
                    node {
                      sourceUrl
                    }
                  }
                }
                sponsors {
                  nodes {
                    ... on Sponsor {
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
              }
              films {
                nodes {
                  ... on FestivalFilm {
                    title
                    slug
                    uri
                    excerpt
                    content
                    festivalFilmId
                    featuredImage {
                      node {
                        sourceUrl
                        altText
                      }
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
                    eventiveTags {
                      nodes {
                        name
                        slug
                      }
                    }
                  }
                }
              }
              duplicateEvents {
                nodes {
                  ... on FestivalEvent {
                    title
                    slug
                    uri
                    featuredImage {
                      node {
                        sourceUrl
                        altText
                      }
                    }
                    festivalEventAcf {
                      startTime
                      endTime
                      timezone
                      timezoneAbv
                      isVirtual
                      ticketsAvailable
                      hideTicketsButton
                      eventiveId
                    }
                    festivalVenues {
                      nodes {
                        name
                        slug
                      }
                    }
                  }
                }
              }
              relatedEvents {
                nodes {
                  ... on FestivalEvent {
                    title
                    slug
                    uri
                    featuredImage {
                      node {
                        sourceUrl
                        altText
                      }
                    }
                    festivalEventAcf {
                      startTime
                      timezone
                      timezoneAbv
                      eventiveId
                      ticketsAvailable
                    }
                    festivalVenues {
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
    return data.festivalEvent
  } catch (error: any) {
    console.error(
      'getFestivalEventPreview error:',
      error?.response?.errors?.[0]?.message,
    )
    return null
  }
}

// ─── Seen Article ─────────────────────────────────────────────────────────────

export async function getSeenArticlePreview(
  slug: string,
): Promise<SeenArticle | null> {
  try {
    const data = await previewClient.request<{
      seenArticle: SeenArticle | null
    }>(
      gql`
        query getSeenArticlePreview($slug: ID!) {
          seenArticle(id: $slug, idType: SLUG, asPreview: true) {
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
    console.error(
      'getSeenArticlePreview error:',
      error?.response?.errors?.[0]?.message,
    )
    return error?.response?.data?.seenArticle ?? null
  }
}

// ─── Seen Sub Page ────────────────────────────────────────────────────────────

export async function getSeenSubPagePreview(
  slug: string,
): Promise<SeenFlexibleLayout[]> {
  try {
    const data = await previewClient.request<{
      page: {
        template: {
          seenFlexibleLayouts: { layouts: SeenFlexibleLayout[] }
        }
      } | null
    }>(
      gql`
        query getSeenSubPagePreview($slug: ID!) {
          page(id: $slug, idType: URI, asPreview: true) {
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
    console.error(
      'getSeenSubPagePreview error:',
      error?.response?.errors?.[0]?.message,
    )
    return (
      error?.response?.data?.page?.template?.seenFlexibleLayouts?.layouts ?? []
    )
  }
}

// ─── Lumen Episode ────────────────────────────────────────────────────────────

export async function getLumenEpisodePreview(
  slug: string,
): Promise<LumenEpisode | null> {
  try {
    const data = await previewClient.request<{
      lumenEpisode: LumenEpisode | null
    }>(
      gql`
        query getLumenEpisodePreview($slug: ID!) {
          lumenEpisode(id: $slug, idType: SLUG, asPreview: true) {
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
    console.error(
      'getLumenEpisodePreview error:',
      error?.response?.errors?.[0]?.message,
    )
    return error?.response?.data?.lumenEpisode ?? null
  }
}

// ─── Opportunity ──────────────────────────────────────────────────────────────

export async function getOpportunityPreview(slug: string) {
  try {
    const data = await previewClient.request<{
      opportunity: {
        title: string
        content: string
        slug: string
        opportunityTypes: { nodes: { name: string }[] }
        opportunityAcf?: {
          downloadPdf?: { node: { mediaItemUrl: string } } | null
        }
      } | null
    }>(
      gql`
        query getOpportunityPreview($slug: ID!) {
          opportunity(id: $slug, idType: SLUG, asPreview: true) {
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
    console.error(
      'getOpportunityPreview error:',
      error?.response?.errors?.[0]?.message,
    )
    return error?.response?.data?.opportunity ?? null
  }
}

// ─── Press Release Post ───────────────────────────────────────────────────────

export async function getPressReleasePostPreview(slug: string) {
  try {
    const data = await previewClient.request<{
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
        query getPressReleasePostPreview($slug: ID!) {
          post(id: $slug, idType: SLUG, asPreview: true) {
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
    console.error(
      'getPressReleasePostPreview error:',
      error?.response?.errors?.[0]?.message,
    )
    return error?.response?.data?.post ?? null
  }
}

export async function getProgramEventPreview(databaseId: string) {
  try {
    const data = await previewClient.request(
      gql`
        query getProgramEventPreview($id: ID!) {
          programEvent(id: $id, idType: DATABASE_ID, asPreview: true) {
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
                }
              }
            }
          }
        }
      `,
      { id: databaseId },
    )
    return data.programEvent ?? null
  } catch (error: any) {
    console.error(
      'getProgramEventPreview error:',
      error?.response?.errors?.[0]?.message,
    )
    return error?.response?.data?.programEvent ?? null
  }
}

export async function getSeenPagePreview() {
  try {
    const data = await previewClient.request<{
      page: {
        template: {
          seenFlexibleLayouts: { layouts: SeenFlexibleLayout[] }
        }
      }
    }>(gql`
      query getSeenPagePreview {
        page(id: "/seen/", idType: URI, asPreview: true) {
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

// Add to app/lib/previewQueries.ts
// Replace the existing getHomePagePreview function with this one.

export async function getHomePagePreview(id?: string): Promise<FlexibleLayout[]> {
  try {
    // If we have a database ID, use asPreview: true for reliable draft content
    if (id) {
      const data = await previewClient.request<{
        page: {
          flexibleLayouts: {
            layouts: FlexibleLayout[]
          }
        } | null
      }>(
        gql`
          query getHomePagePreviewById($id: ID!) {
            page(id: $id, idType: DATABASE_ID, asPreview: true) {
              flexibleLayouts {
                layouts {
                  __typename
                  ... on FlexibleLayoutsLayoutsSpotlightHeroLayout {
                    heading1
                    links { link { title url target } }
                    image { node { altText sourceUrl mediaDetails { height width } } }
                    mobileImage { node { altText sourceUrl mediaDetails { height width } } }
                    overlayImage { node { altText sourceUrl mediaDetails { height width } } }
                    mobileOverlayImage { node { altText sourceUrl mediaDetails { height width } } }
                    video { file { node { mediaItemUrl altText } } type }
                    mobileVideo { file { node { mediaItemUrl altText } } type }
                  }
                  ... on FlexibleLayoutsLayoutsFeatureTextLayout {
                    additionalContent
                    content
                    buttons { link { target title url } }
                  }
                  ... on FlexibleLayoutsLayoutsPostsCarouselLayout {
                    title
                    link { title url }
                    posts {
                      nodes {
                        ... on ProgramEvent {
                          __typename id title link contentTypeName
                          featuredImage { node { altText sourceUrl } }
                          event {
                            customExcerpt endTime listingDateFormat location startTime timezone
                            redirect { url }
                            programType { nodes { name } }
                          }
                        }
                        ... on Post {
                          __typename id slug contentTypeName title date link
                          featuredImage { node { altText sourceUrl } }
                          categories { nodes { name } }
                          pressRelease {
                            introduction
                            pdf { node { mediaItemUrl title } }
                          }
                        }
                      }
                    }
                    customPosts {
                      buttons { link { title url } }
                      image { node { altText sourceUrl } }
                      preTitle title shortDescription
                      programLogo { node { altText sourceUrl mediaDetails { height width } } }
                    }
                    type
                    featured
                  }
                  ... on FlexibleLayoutsLayoutsSpotlightTextImageLayout {
                    content flip heading
                    link { title url target }
                    image { node { altText sourceUrl mediaDetails { height width } } }
                  }
                  ... on FlexibleLayoutsLayoutsSponsorsCarouselLayout {
                    __typename title
                    button { title url }
                    sponsorCollection {
                      nodes {
                        ... on SponsorCollection {
                          id
                          sponsors {
                            nodes {
                              ... on Sponsor {
                                __typename
                                sponsorAcf {
                                  logoBlack { node { altText mediaDetails { height width } sourceUrl } }
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
        `,
        { id },
      )
      return (data.page?.flexibleLayouts?.layouts ?? []).filter(Boolean)
    }

    // Fallback to title-based query (no ID available)
    const data = await previewClient.request<HomePageData>(GET_HOME_PAGE)
    if (!data?.pages) return []
    return (data.pages.nodes[0]?.flexibleLayouts?.layouts ?? []).filter(Boolean)

  } catch (error: any) {
    if (error?.response?.data?.page?.flexibleLayouts?.layouts) {
      return (error.response.data.page.flexibleLayouts.layouts ?? []).filter(Boolean)
    }
    if (error?.response?.data?.pages) {
      return (error.response.data.pages.nodes[0]?.flexibleLayouts?.layouts ?? []).filter(Boolean)
    }
    return []
  }
}