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
  title: string;
  url: string;
  target?: string;
};

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
  __typename: 'FlexibleLayoutsLayoutsSpotlightHeroLayout';
  contained: boolean;
  heading1: string;
  image: WPImage;
  links: {
    link: WPLink;
  }[];
};

// Posts Carousel Layout
export type ProgramType = {
  name: string;
};

export type EventFields = {
  customExcerpt: string;
  endTime: string;
  startTime: string;
  listingDateFormat: string;
  location: string;
  timezone: string;
  programType: {
    nodes: ProgramType[];
  };
};

export type ProgramEvent = {
  __typename: 'ProgramEvent';
  id: string;
  title: string;
  link: string;
  contentTypeName: string;
  featuredImage?: WPImage;
  event?: EventFields;
};

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
  posts: {
    nodes: ProgramEvent[]
  }
  customPosts?: CustomPost[]
}

// Union type for all layouts
export type FlexibleLayout = SpotlightHeroLayout | PostsCarouselLayout;

// Home page
export type HomePageData = {
  pages: {
    nodes: {
      flexibleLayouts: {
        layouts: FlexibleLayout[];
      };
    }[];
  };
};
