import { getFestivalFilmGuide } from '@/app/lib/queries'
import FestivalFilmGuideClient from '@/app/ui/components/festival/festivalFilmGuideClient'
import type { FestivalFilm } from '@/app/lib/types'

type Props = {
  year?: string
}

export default async function FilmGuidePage({ year = '2025' }: Props) {
  const { films, tags } = await getFestivalFilmGuide(year)
  return <FestivalFilmGuideClient films={films} tags={tags} />
}
