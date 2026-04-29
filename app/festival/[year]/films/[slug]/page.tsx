import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getFestivalFilm, getAllFestivalFilmSlugs } from '@/app/lib/queries'
import { getFestivalFilmPreview } from '@/app/lib/previewQueries'
import FestivalFilmPage from '@/app/ui/components/festival/festivalFilmPage'

export const revalidate = 3600
export const dynamicParams = true

interface Props {
  params: Promise<{ year: string; slug: string }>
}

export async function generateStaticParams() {
  return getAllFestivalFilmSlugs()
}

export default async function FestivalFilmRoute({ params }: Props) {
  const { year, slug } = await params
  const { isEnabled: isPreview } = await draftMode()
  const film = isPreview ? await getFestivalFilmPreview(slug) : await getFestivalFilm(slug)
  if (!film) return notFound()

  return (
    <main style={{ paddingTop: '200px' }}>
      <FestivalFilmPage film={film} />
    </main>
  )
}
