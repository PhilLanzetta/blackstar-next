export function formatLink(url: string): string {
  try {
    const parsed = new URL(url)
    const isInternal = [
      'violet-chimpanzee-234778.hostingersite.com',
      'blackstarfest.org',
      'www.blackstarfest.org',
      'blackstar-next.vercel.app',
    ].includes(parsed.hostname)

    if (isInternal) {
      return parsed.pathname + parsed.hash + parsed.search
    }
    return url
  } catch {
    return url.startsWith('/') ? url : `/${url}`
  }
}

export function formatEventLink(link: string, termSlug?: string): string {
  if (!link) return link
  const slug = termSlug?.toLowerCase().replace(/\s+/g, '-') ?? 'events'
  return formatLink(
    link.replace('%program-type%', slug).replace('%lumen-season%', slug),
  )
}

export function isExternalLink(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ![
      'violet-chimpanzee-234778.hostingersite.com',
      'blackstarfest.org',
      'www.blackstarfest.org',
      'blackstar-next.vercel.app',
    ].includes(parsed.hostname)
  } catch {
    return false
  }
}
