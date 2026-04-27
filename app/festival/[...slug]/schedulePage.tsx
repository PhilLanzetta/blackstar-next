import { getFestivalSchedule } from '@/app/lib/queries'
import FestivalScheduleClient from '@/app/ui/components/festival/festivalScheduleClient'

type Props = {
  year?: string
}

export default async function SchedulePage({ year = '2025' }: Props) {
  const { events, dates, venues, tags } = await getFestivalSchedule(year)

  return (
    <FestivalScheduleClient
      events={events}
      dates={dates}
      venues={venues}
      tags={tags}
    />
  )
}
