import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getFestivalEvent, getAllFestivalEventSlugs } from '@/app/lib/queries'
import { getFestivalEventPreview } from '@/app/lib/previewQueries'
import FestivalEventPage from '@/app/ui/components/festival/festivalEventPage'

export const revalidate = 3600
export const dynamicParams = true

interface Props {
  params: Promise<{ year: string; slug: string }>
}

export async function generateStaticParams() {
  return getAllFestivalEventSlugs()
}

export default async function FestivalEventRoute({ params }: Props) {
  const { slug, year } = await params
  const { isEnabled: isPreview } = await draftMode()
  const event = isPreview ? await getFestivalEventPreview(slug) : await getFestivalEvent(slug)
  if (!event) return notFound()

  return (
    <main style={{ paddingTop: '200px' }}>
      <FestivalEventPage event={event} festivalYear={year} />
    </main>
  )
}
