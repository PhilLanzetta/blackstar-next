import FestivalBiosClient from './festivalBiosClient'
import { getBiographiesByCollection } from '@/app/lib/queries'
import type { FestivalBiosLayout, Biography } from '@/app/lib/types'

type Props = {
  data: FestivalBiosLayout
}

export default async function FestivalBios({ data }: Props) {
  const isCurated = data.type?.[0] === 'curated'
  const curatedBios = (data.bios?.nodes as Biography[]) ?? []

  if (isCurated && curatedBios.length > 0) {
    return (
      <FestivalBiosClient
        initialBios={[]}
        initialHasNextPage={false}
        initialEndCursor={null}
        collectionSlug=''
        itemsPerPage={0}
        directBios={curatedBios}
      />
    )
  }

  const collectionSlug = data.collection?.nodes?.[0]?.slug
  if (!collectionSlug) return null

  const itemsPerPage = data.itemsPerPage ?? 12
  const { bios, hasNextPage, endCursor } = await getBiographiesByCollection(
    collectionSlug,
    itemsPerPage,
  )

  return (
    <FestivalBiosClient
      initialBios={bios}
      initialHasNextPage={hasNextPage}
      initialEndCursor={endCursor}
      collectionSlug={collectionSlug}
      itemsPerPage={itemsPerPage}
    />
  )
}
