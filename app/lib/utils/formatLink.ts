export function formatLink(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.pathname + parsed.hash + parsed.search
  } catch {
    // if it's already a relative URL, ensure it starts with /
    return url.startsWith('/') ? url : `/${url}`
  }
}

export function formatEventLink(link: string, programType?: string): string {
  if (!link) return link
  const slug = programType?.toLowerCase().replace(/\s+/g, '-') ?? 'events'
  return formatLink(link.replace('%program-type%', slug))
}
