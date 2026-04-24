import { getBiographiesByCollection } from '@/app/lib/queries'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const collection = searchParams.get('collection') ?? ''
  const first = parseInt(searchParams.get('first') ?? '4')
  const after = searchParams.get('after') ?? null

  const result = await getBiographiesByCollection(collection, first, after)
  return Response.json(result)
}
