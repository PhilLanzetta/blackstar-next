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
  megaNavs: {
    nodes: MegaNav[]
  }
}
