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

// Spotlight Hero Layout
export type SpotlightHeroLayout = {
  __typename: 'FlexibleLayoutsLayoutsSpotlightHeroLayout'
  contained: boolean
  heading1: string
  image: WPImage
  links: {
    link: WPLink
  }[]
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
}

export type EventFields = {
  customExcerpt: string
  endTime: string
  startTime: string
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
  title: string
  link: string
  contentTypeName: string
  featuredImage?: WPImage
  event?: EventFields
}

export type WPPost = {
  __typename: 'Post'
  id: string
  title: string
  link: string
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

export type PostsCarouselLayout = {
  __typename: 'FlexibleLayoutsLayoutsPostsCarouselLayout'
  title: string
  link: WPLink
  type: string
  featured: boolean
  posts: {
    nodes: (ProgramEvent | WPPost)[]
  }
  customPosts?: CustomPost[]
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

// Team Listings Layout
export type BiographyAcf = {
  emailAddress?: string
  position?: string
  pronouns?: string
}

export type Biography = {
  title: string
  biographyAcf?: BiographyAcf
  content?: string
  featuredImage?: WPImage
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

// Union type for all layouts
export type FlexibleLayout =
  | SpotlightHeroLayout
  | PostsCarouselLayout
  | SpotlightTextImageLayout
  | SponsorsCarouselLayout
  | TextListLayout
  | TextTabsLayout
  | AnchorLayout
  | MediaLayout
  | TeamListingsLayout

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
}
