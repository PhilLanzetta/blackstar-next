import { getAllSeenArticles } from '@/app/lib/queries'
import SeenReadClient from '@/app/ui/components/seen/seenReadClient'

export const revalidate = 3600

export default async function SeenReadPage() {
  const articles = await getAllSeenArticles()
  return <SeenReadClient articles={articles} />
}
