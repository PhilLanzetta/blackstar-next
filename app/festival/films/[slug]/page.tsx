import { notFound } from 'next/navigation'
import { getFestivalFilm, getAllFestivalFilmSlugs } from '@/app/lib/queries'
import FestivalFilmPage from '@/app/ui/components/festival/festivalFilmPage'

export const revalidate = 3600
export const dynamicParams = true

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllFestivalFilmSlugs()
}

export default async function FestivalFilmRoute({ params }: Props) {
  const { slug } = await params
  const film = await getFestivalFilm(slug)
  if (!film) return notFound()

  return (
    <main style={{ paddingTop: '200px' }}>
      <FestivalFilmPage film={film} />
    </main>
  )
}
