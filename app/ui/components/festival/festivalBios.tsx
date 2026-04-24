import type { FestivalBiosLayout } from '@/app/lib/types'
import { getBiographiesByCollection } from '@/app/lib/queries'
import FestivalBiosClient from './festivalBiosClient'

export default async function FestivalBios({
  data,
}: {
  data: FestivalBiosLayout
}) {
  const { itemsPerPage, collection } = data
  const collectionSlug = collection?.nodes?.[0]?.slug
  if (!collectionSlug) return null

  const { bios, hasNextPage, endCursor } = await getBiographiesByCollection(
    collectionSlug,
    itemsPerPage ?? 4,
  )
  if (!bios.length) return null

  return (
    <FestivalBiosClient
      initialBios={bios}
      initialHasNextPage={hasNextPage}
      initialEndCursor={endCursor}
      collectionSlug={collectionSlug}
      itemsPerPage={itemsPerPage ?? 4}
    />
  )
}
