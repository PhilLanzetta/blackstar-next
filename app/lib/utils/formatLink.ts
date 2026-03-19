export function formatLink(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.pathname + parsed.hash + parsed.search
  } catch {
    return url // already a relative URL
  }
}
