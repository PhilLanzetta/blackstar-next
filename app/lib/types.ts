//MenuTypes
export type MenuItem = {
  title: string
  url: string
}

export type MenuItemWrapper = {
  menuItem: MenuItem
}

export type MegaNavACF = {
  menuItems: MenuItemWrapper[]
}

export type MegaNav = {
  id: string
  slug: string
  title: string
  megaNavACF: MegaNavACF
}

export type MegaNavQuery = {
  megaNav: {
    nodes: MegaNav[]
  }
}

//FooterTypes
export interface Link {
  title: string
  url: string
}

export interface FooterMenuItem {
  link: Link
}

export interface SocialLinks {
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  youtubeUrl: string
}

export interface SiteSettingsAcf {
  footerMenu: FooterMenuItem[]
  legalMenu: FooterMenuItem[]
  secondaryFooterMenu: FooterMenuItem[]
  socialLinks: SocialLinks
}

export interface SiteSettings {
  siteSettingsAcf: SiteSettingsAcf
}

export interface FooterQuery {
  siteSettings: SiteSettings
}

//Home Page
export type WPLink = {
  title: string
  url: string
  target?: string
}

export type WPImage = {
  node: {
    sourceUrl: string
    altText: string
    mediaDetails?: {
      width: number
      height: number
    }
  }
}

export type SpotlightHeroVideo = {
  file?: {
    node: {
      altText?: string
      mediaItemUrl: string
    }
  }
  type?: string[]
}

// Spotlight Hero
export type SpotlightHeroLayout = {
  __typename: 'FlexibleLayoutsLayoutsSpotlightHeroLayout'
  backgroundColour?: string
  contained?: boolean
  heading1?: string
  links?: {
    link: WPLink
  }[]
  image?: WPImage
  mobileImage?: WPImage
  overlayImage?: WPImage
  mobileOverlayImage?: WPImage
  video?: SpotlightHeroVideo[]
  mobileVideo?: SpotlightHeroVideo[]
}

// Spotlight Hero Text and Image Layout
export type SpotlightTextImageLayout = {
  __typename: 'FlexibleLayoutsLayoutsSpotlightTextImageLayout'
  content?: string
  flip?: boolean
  heading?: string
  link?: WPLink
  image?: WPImage
}

// Posts Carousel Layout
export type ProgramType = {
  name: string
  slug: string
}

export type EventFields = {
  customExcerpt: string
  endTime: string
  startTime: string
  redirect?: { url: string }
  listingDateFormat: string
  location: string
  timezone: string
  programType: {
    nodes: ProgramType[]
  }
}

export type ProgramEvent = {
  __typename: 'ProgramEvent'
  id: string
  slug: string
  title: string
  link: string
  contentTypeName: string
  featuredImage?: WPImage
  event?: EventFields
  parent?: {
    node: {
      __typename: string
      slug: string
      event?: {
        programType: {
          nodes: ProgramType[]
        }
      }
    }
  } | null
  children?: {
    nodes: ProgramEvent[]
  }
}

export type WPPost = {
  __typename: 'Post'
  id: string
  title: string
  link: string
  slug: string
  uri?: string
  date: string
  contentTypeName: string
  featuredImage?: {
    node: {
      sourceUrl: string
      altText: string
    }
  }
  categories?: {
    nodes: {
      name: string
      slug: string
    }[]
  }
  pressRelease?: {
    introduction?: string
    pdf?: {
      node: {
        mediaItemUrl: string
        title: string
      }
    }
  }
}

export type WPPage = {
  __typename: 'Page'
  id: string
  title: string
  link: string
  contentTypeName?: string
  date?: string
  featuredImage?: WPImage
}

export type CustomPost = {
  preTitle?: string
  title?: string
  shortDescription?: string
  buttons?: {
    link: WPLink
  }[]
  image?: WPImage
  programLogo?: WPImage
}

export type GuestBio = {
  content?: string
  link?: { url?: string; title?: string } | null
  image?: {
    node: {
      sourceUrl?: string
      altText?: string
    }
  } | null
}

export type LumenEpisode = {
  __typename: 'LumenEpisode'
  id: string
  title: string
  link: string
  slug: string
  contentTypeName?: string
  date?: string
  featuredImage?: WPImage
  lumenSeasons?: {
    nodes: { name: string; slug: string }[]
  }
  blogSettings?: {
    coverImage?: { node: { sourceUrl?: string; altText?: string } } | null
    mobileCoverImage?: { node: { sourceUrl?: string; altText?: string } } | null
    coverVideo?: { node: { mediaItemUrl?: string } } | null
    guestAuthor?: string | null
  }
  manyLumensEpisodesAcf?: {
    introduction?: string
    subtitleHost?: string
    episodeName?: string
    credits?: string
    showNotes?: string
    transcript?: string
    colour?: string[]
    buzzSprout?: {
      embedCode?: string
      mp3Url?: string
    } | null
    relatedEpisodes?: {
      nodes: LumenEpisode[]
    } | null
    guestBios?: GuestBio[] | null
  }
}

export type PostsCarouselLayout = {
  __typename: 'FlexibleLayoutsLayoutsPostsCarouselLayout'
  title: string
  link: WPLink
  type: string[]
  featured: boolean
  posts?: {
    nodes: (ProgramEvent | WPPost | WPPage | LumenEpisode)[]
  }
  customPosts?: CustomPost[]
}

export type PostsGridLayout = {
  __typename: 'FlexibleLayoutsLayoutsPostsGridLayout'
  heading?: string
  gridColumns?: number
  showFilters?: boolean
  type?: string[]
  programEventType?: {
    nodes: { name: string; slug: string }[]
  }
  customPosts?: CustomPost[]
  posts?: {
    nodes: (ProgramEvent | WPPost)[]
  }
}

export type SponsorAcf = {
  logoBlack?: {
    node: {
      altText: string
      sourceUrl: string
      mediaDetails?: {
        width: number
        height: number
      }
    }
  }
  website?: string
}

export type Sponsor = {
  __typename: 'Sponsor'
  sponsorAcf?: SponsorAcf
}

export type SponsorCollection = {
  id: string
  sponsors?: {
    nodes: Sponsor[]
  }
}

export type SponsorsCarouselLayout = {
  __typename: 'FlexibleLayoutsLayoutsSponsorsCarouselLayout'
  title?: string
  button?: WPLink
  sponsorCollection?: {
    nodes: SponsorCollection[]
  }
}

export type TextTab = {
  title: string
  content?: string
  link?: WPLink
}

export type TextTabsLayout = {
  __typename: 'FlexibleLayoutsLayoutsTextTabsLayout'
  tabs: TextTab[]
}

export type TextListItem = {
  heading: string
  detail?: string
}

export type TextListLayout = {
  __typename: 'FlexibleLayoutsLayoutsTextListLayout'
  heading?: string
  numberOfColumns?: number
  items: TextListItem[]
}

export type AnchorLayout = {
  __typename: 'FlexibleLayoutsLayoutsAnchorLayout'
  anchorName?: string
}

export type SectionHeadingLayout = {
  __typename: 'FlexibleLayoutsLayoutsSectionHeadingLayout'
  heading?: string
  subHeading?: string
}

// Media Layout
export type MediaSlide = {
  bordered?: boolean
  caption?: string
  image?: WPImage
  videoEmbed?: string
  videoFile?: {
    node: {
      altText: string
      sourceUrl: string
    }
  }
  videoType?: string | string[]
}

export type MediaLayout = {
  __typename: 'FlexibleLayoutsLayoutsMediaLayout'
  title: string
  slides: MediaSlide[]
}

// FAQ Accordion Layout
export type Faq = {
  title: string
  content?: string
}

export type FaqCollection = {
  __typename: 'FaqCollection'
  id: string
  name: string
  faqs: {
    nodes: Faq[]
  }
}

export type FaqAccordionLayout = {
  __typename: 'FlexibleLayoutsLayoutsFaqAccordionLayout'
  collection: {
    nodes: FaqCollection[]
  }
}

export type Biography = {
  title: string
  slug: string
  content?: string | null
  featuredImage?: {
    node: {
      sourceUrl: string
      altText: string
      mediaDetails?: {
        width?: number
        height?: number
      } | null
    }
  } | null
  biographyAcf?: {
    emailAddress?: string
    position?: string | null
    pronouns?: string | null
    socialProfiles?: {
      facebook?: string | null
      instagram?: string | null
      linkedin?: string | null
      twitter?: string | null
      website?: string | null
      youtube?: string | null
    } | null
  } | null
}

export type BioCollection = {
  __typename: 'BioCollection'
  biographies: {
    nodes: Biography[]
  }
}

export type TeamListingsLayout = {
  __typename: 'FlexibleLayoutsLayoutsTeamListingsLayout'
  title: string
  collection: {
    nodes: BioCollection[]
  }
}

export type TextListAltLayout = {
  __typename: 'FlexibleLayoutsLayoutsTextListAltLayout'
  collapsable?: boolean
  heading?: string
  column1?: string
  column2?: string
  column3?: string
}

export type ManualSponsor = {
  link?: {
    url?: string
  }
  logo?: WPImage
}

export type SponsorsRowSponsor = {
  manualSponsor?: ManualSponsor
  sponsor?: {
    nodes: {
      id: string
      sponsorAcf?: {
        logoBlack?: WPImage
        website?: string
      }
    }[]
  }
}

export type SponsorsRowLayout = {
  __typename: 'FlexibleLayoutsLayoutsSponsorsRowLayout'
  heading?: string
  description?: string
  descriptionPosition?: string
  sponsors?: SponsorsRowSponsor[]
}

// Opportunities
export type Opportunity = {
  title: string
  link: string
  opportunityAcf?: {
    shortDescription?: string
  }
}

export type OpportunityType = {
  name: string
  opportunities: {
    nodes: Opportunity[]
  }
}

export type DefaultPageSiteSettings = {
  noOpportunitiesMessage?: string
  contactDetails?: {
    address?: string
    email?: string
    phone?: string
  }
  socialLinks?: {
    facebookUrl?: string
    instagramUrl?: string
    twitterUrl?: string
    youtubeUrl?: string
  }
}

export type FeatureTextLayout = {
  __typename: 'FlexibleLayoutsLayoutsFeatureTextLayout'
  additionalContent?: string
  content?: string
  buttons?: {
    link: WPLink
  }[]
}

export type PressClippingsLayout = {
  __typename: 'FlexibleLayoutsLayoutsPressClippingsLayout'
  heading?: string
}

export type EventDetailsLayout = {
  __typename: 'FlexibleLayoutsLayoutsEventDetailsLayout'
  columnOne?: { title?: string; content?: string }
  columnTwo?: { title?: string; content?: string }
  columnThree?: { title?: string; content?: string }
}

export type ContentLayout = {
  __typename: 'FlexibleLayoutsLayoutsContentLayout'
  content?: string
}

export type ChildProgramEventsLayout = {
  __typename: 'FlexibleLayoutsLayoutsChildProgramEventsLayout'
  title?: string
}

// Union type for all layouts
export type FlexibleLayout =
  | SpotlightHeroLayout
  | PostsCarouselLayout
  | PostsGridLayout
  | SpotlightTextImageLayout
  | SponsorsCarouselLayout
  | TextListLayout
  | TextListAltLayout
  | TextTabsLayout
  | AnchorLayout
  | MediaLayout
  | TeamListingsLayout
  | FaqAccordionLayout
  | SectionHeadingLayout
  | SponsorsRowLayout
  | FeatureTextLayout
  | PressClippingsLayout
  | EventDetailsLayout
  | ContentLayout
  | ChildProgramEventsLayout

// Home page
export type HomePageData = {
  pages: {
    nodes: {
      flexibleLayouts: {
        layouts: FlexibleLayout[]
      }
    }[]
  }
}

// About page
export type DefaultPageData = {
  page: {
    template?: {
      templateName: string
    }
    flexibleLayouts: {
      layouts: FlexibleLayout[]
    }
  }
  opportunityTypes: {
    nodes: OpportunityType[]
  }
  siteSettings: {
    siteSettingsAcf: DefaultPageSiteSettings
  }
}

export type DefaultPageResult = {
  layouts: FlexibleLayout[]
  opportunityTypes: OpportunityType[]
  noOpportunitiesMessage?: string
  contactDetails?: DefaultPageSiteSettings['contactDetails']
  socialLinks?: DefaultPageSiteSettings['socialLinks']
  pressClippings?: PressClipping[]
  pressReleasePosts?: WPPost[]
  allPosts?: WPPost[]
  lumenEpisodes?: LumenEpisode[]
  programEvents?: ProgramEvent[]
}

export type PressClipping = {
  title: string
  date: string
  pressClippingsAcf: {
    link: WPLink
    newspaperSource?: string
  }
}

export type SeenArticle = {
  __typename: 'SeenArticle'
  id?: string
  title: string
  slug: string
  uri?: string
  date?: string
  featuredImage?: WPImage
  seenIssues?: { nodes: { name: string; slug: string }[] }
  seenAuthors?: { nodes: { name: string; slug: string; description: string }[] }
  seenCategories?: { nodes: { name: string; slug: string }[] }
  seenArticleLayouts?: {
    introduction?: string
    cover?: {
      image?: { node: { sourceUrl: string; altText: string } } | null
      mobileImage?: { node: { sourceUrl: string; altText: string } } | null
      video?: { node: { mediaItemUrl: string } } | null
      overrideTitle?: string | null
      subtitle?: string | null
      backgroundColour?: string | null
      foregroundColour?: string | null
      style?: string[] | null
    }
    layouts?: SeenArticleLayout[]
    relatedArticles?: { nodes: SeenArticle[] } | null
  }
}

export type SeenArticleContentLayout = {
  __typename: 'SeenArticleLayoutsLayoutsContentLayout'
  content?: string
}

export type SeenArticleContainedMediaLayout = {
  __typename: 'SeenArticleLayoutsLayoutsContainedMediaLayout'
  image?: { node: { sourceUrl: string; altText: string } } | null
  videoEmbed?: string | null
  reducedContainer?: boolean | null
}

export type SeenArticleFullWidthMediaLayout = {
  __typename: 'SeenArticleLayoutsLayoutsFullWidthMediaLayout'
  image?: { node: { sourceUrl: string; altText: string } } | null
  videoEmbed?: string | null
}

export type SeenArticleFootnotesLayout = {
  __typename: 'SeenArticleLayoutsLayoutsFootnotesLayout'
  footnotes?: string
}

export type SeenArticleLayout =
  | SeenArticleContentLayout
  | SeenArticleContainedMediaLayout
  | SeenArticleFullWidthMediaLayout
  | SeenArticleFootnotesLayout

export type SeenArticlesItem = {
  title?: string | null
  preTitle?: string | null
  subTitle?: string | null
  type?: string[]
  image?: { node: { sourceUrl: string; altText: string } } | null
  link?: { url: string; title: string } | null
  article?: { nodes: SeenArticle[] } | null
}

export type SeenArticlesLayout = {
  __typename: 'SeenFlexibleLayoutsLayoutsArticlesLayout'
  articles?: SeenArticlesItem[]
}

export type SeenSpotlightContainedLayout = {
  __typename: 'SeenFlexibleLayoutsLayoutsSpotlightContainedLayout'
  title1?: string
  title2?: string
  title3?: string
  link?: { url: string; title: string } | null
  image?: { node: { sourceUrl: string; altText: string } } | null
}

export type SeenAnchorLayout = {
  __typename: 'SeenFlexibleLayoutsLayoutsAnchorLayout'
  anchorName?: string
}

export type SeenSpaceLayout = {
  __typename: 'SeenFlexibleLayoutsLayoutsSpaceLayout'
  size?: string[]
}

export type SeenFeatureMediaLayout = {
  __typename: 'SeenFlexibleLayoutsLayoutsFeatureMediaLayout'
  heading?: string
  image?: { node: { sourceUrl: string; altText: string } } | null
  mobileImage?: { node: { sourceUrl: string; altText: string } } | null
  video?: { node: { mediaItemUrl: string } } | null
  mobileVideo?: { node: { mediaItemUrl: string } } | null
  link?: { url: string; title: string } | null
}

export type SeenFeatureTextLayout = {
  __typename: 'SeenFlexibleLayoutsLayoutsFeatureTextLayout'
  text?: string
}

export type SeenSpotlightLayout = {
  __typename: 'SeenFlexibleLayoutsLayoutsSpotlightLayout'
  text?: string
  backgroundColour?: string
  foregroundColour?: string
  link?: { url: string; title: string } | null
  image?: { node: { sourceUrl: string; altText: string } } | null
}

export type SeenAccordionLayout = {
  __typename: 'SeenFlexibleLayoutsLayoutsAccordionLayout'
  heading?: string
  accordionSections?: {
    heading?: string
    columns?: {
      heading?: string
      content?: string
    }[]
  }[]
}

export type SeenStockistsLayout = {
  __typename: 'SeenFlexibleLayoutsLayoutsStockistsLayout'
  heading?: string
  locations?: {
    locationName?: string
    stockists?: {
      name?: string
      link?: { url: string; title: string } | null
    }[]
  }[]
}

export type SeenContactDetailsLayout = {
  __typename: 'SeenFlexibleLayoutsLayoutsContactDetailsLayout'
  heading?: string
}

export type SeenListLayout = {
  __typename: 'SeenFlexibleLayoutsLayoutsListLayout'
  heading?: string
  listItems?: {
    line1?: string
    line2?: string | null
  }[]
}

export type SeenIssueCreditsLayout = {
  __typename: 'SeenFlexibleLayoutsLayoutsIssueCreditsLayout'
  heading?: string
}

export type SeenFlexibleLayout =
  | SeenFeatureMediaLayout
  | SeenArticlesLayout
  | SeenSpotlightContainedLayout
  | SeenAnchorLayout
  | SeenSpaceLayout
  | SeenFeatureTextLayout
  | SeenSpotlightLayout
  | SeenAccordionLayout
  | SeenStockistsLayout
  | SeenContactDetailsLayout
  | SeenListLayout
  | SeenIssueCreditsLayout

export type RichCardCustomButtons = {
  button: { url: string; title: string }
  backArrow?: boolean
}

export type RichCardCustom = {
  heading?: string | null
  preHeading?: string | null
  description?: string | null
  image?: { node: { sourceUrl: string; altText: string } } | null
  video?: { node: { mediaItemUrl: string } } | null
  icon?: { node: { sourceUrl: string; altText: string } } | null
  buttons?: RichCardCustomButtons[]
}

export type RichCard = {
  type?: string[]
  inverse?: boolean
  custom?: RichCardCustom | null
  event?: { nodes: any[] } | null
  film?: { nodes: any[] } | null
  newsPost?: { nodes: any[] } | null
}

export type FestivalCardItem = {
  heading?: string | null
  content?: string | null
  extraHeading?: string | null
  extraContent?: string | null
  image?: { node: { sourceUrl: string; altText: string } } | null
  callToAction?: { url: string; title: string } | null
}

export type FestivalSpotlightCarouselLayout = {
  __typename: 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsSpotlightCarouselLayout'
  type?: string[]
  background?: string[]
  inversed?: boolean
  cards?: RichCard[]
}

export type FestivalLatestNewsLayout = {
  __typename: 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsLatestNewsLayout'
  heading?: string
  items?: number
  viewAllButtonLabel?: string
}

export type FestivalCardsLayout = {
  __typename: 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsCardsLayout'
  gridLayout?: string[]
  cards?: FestivalCardItem[]
}

export type FestivalHeadingLayout = {
  __typename: 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsHeadingLayout'
  heading?: string
  links?: { link: { url: string; title: string } }[]
}

export type FestivalVideoCoverLayout = {
  __typename: 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsVideoCoverLayout'
  videoEmbed?: string
  videoType?: string[]
  coverImage?: { node: { sourceUrl: string; altText: string } } | null
}

export type FestivalButtonsLayout = {
  __typename: 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsButtonsLayout'
  buttons?: { button: { url: string; title: string }; backArrow?: boolean }[]
}

export type FestivalBiosLayout = {
  __typename: 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsBiosLayout'
  itemsPerPage?: number
  collection?: { nodes: { name: string; slug: string }[] }
}

export type FestivalSponsorsCarouselLayout = {
  __typename: 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsSponsorsCarouselLayout'
  heading?: string
  collection?: { nodes: { name: string; slug: string }[] }
}

export type FestivalAnchorLayout = {
  __typename: 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsAnchorLayout'
  anchorName?: string
}

export type FestivalSpaceLayout = {
  __typename: 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsSpaceLayout'
}

export type FestivalContentLayout = {
  __typename: 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsContentLayout'
  columns?: {
    content?: string | null
    buttons?:
      | { button: { url: string; title: string }; backArrow?: boolean }[]
      | null
  }[]
}

export type FestivalExplainersLayout = {
  __typename: 'FestivalFlexibleLayoutsAcfFestival24FlexibleLayoutsLayoutsExplainersLayout'
  explainer?: {
    heading?: string | null
    description?: string | null
    icon?: { node: { sourceUrl: string; altText: string } } | null
    buttons?:
      | { button: { url: string; title: string }; backArrow?: boolean }[]
      | null
  }[]
}

export type FestivalEvent = {
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  featuredImage?: {
    node: { sourceUrl: string; altText: string }
  } | null
  festivalEventAcf?: {
    eventiveId?: string | null
    ticketsAvailable?: boolean | null
    hideTicketsButton?: boolean | null
    externalTicketsUrl?: string | null
    startTime?: string | null
    endTime?: string | null
    timezone?: string | null
    isVirtual?: boolean | null
    timezoneAbv?: string | null
    isEvent?: boolean | null
  } | null
  premiereStatuses?: { nodes: { name: string; slug: string }[] } | null
  festivalAwards?: { nodes: { name: string; slug: string }[] } | null
  accessibilities?: { nodes: { name: string; slug: string }[] } | null
  eventiveTags?: { nodes: { name: string; slug: string }[] } | null
  festivalDates?: { nodes: { name: string; slug: string }[] } | null
  festivalVenues?: { nodes: { name: string; slug: string }[] } | null
}

export type FestivalLayout =
  | FestivalSpotlightCarouselLayout
  | FestivalLatestNewsLayout
  | FestivalCardsLayout
  | FestivalHeadingLayout
  | FestivalVideoCoverLayout
  | FestivalButtonsLayout
  | FestivalBiosLayout
  | FestivalSponsorsCarouselLayout
  | FestivalAnchorLayout
  | FestivalSpaceLayout
  | FestivalContentLayout
  | FestivalExplainersLayout

export type FestivalFilm = {
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: { node: { sourceUrl: string; altText: string } } | null
  premiereStatuses?: { nodes: { name: string; slug: string }[] } | null
  festivalAwards?: { nodes: { name: string; slug: string }[] } | null
  eventiveTags?: { nodes: { name: string; slug: string }[] } | null
  festivalFilmAcf?: {
    runtime?: string | null
    country?: string | null
    language?: string | null
    year?: string | null
    trailerUrl?: string | null
    hideFromFilmGuide?: boolean | null
    triggerWarning?: string | null
    credits?: { type?: string | null; name?: string | null }[] | null
  } | null
}