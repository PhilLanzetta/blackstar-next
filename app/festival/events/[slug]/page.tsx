import { notFound } from 'next/navigation'
import {
  getFestivalEvent,
  getAllFestivalEventSlugs,
} from '@/app/lib/queries'
import FestivalEventPage from '@/app/ui/components/festival/festivalEventPage'


export const revalidate = 3600
export const dynamicParams = true

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllFestivalEventSlugs()
}

export default async function FestivalEventRoute({ params }: Props) {
  const { slug } = await params
  const event = await getFestivalEvent(slug)
  if (!event) return notFound()

  return (
    <main style={{ paddingTop: '200px' }}>
      <FestivalEventPage event={event} />
    </main>
  )
}
