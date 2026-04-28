import FestivalEventGuideClient from '@/app/ui/components/festival/festivalEventGuideClient'
import type { FestivalEvent } from '@/app/lib/types'

type Props = {
  events: FestivalEvent[]
  tags: { name: string; slug: string; count?: number | null }[]
}

export default function EventGuidePage({ events, tags }: Props) {
  return <FestivalEventGuideClient events={events} tags={tags} />
}
