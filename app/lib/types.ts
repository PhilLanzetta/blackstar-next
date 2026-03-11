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
