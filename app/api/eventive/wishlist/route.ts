import { NextRequest } from 'next/server'

const EVENTIVE_API_KEY = process.env.NEXT_PUBLIC_EVENTIVE_API_KEY
const BASE_URL = 'https://api.eventive.org'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const bucketId = request.nextUrl.searchParams.get('bucketId')
  if (!token || !bucketId)
    return Response.json({ error: 'Missing params' }, { status: 401 })

  const res = await fetch(
    `${BASE_URL}/event_buckets/${bucketId}/wishlist?token=${token}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${EVENTIVE_API_KEY}:`).toString('base64')}`,
        'Accept-Version': '~1',
      },
    },
  )

  const data = await res.json()
  return Response.json(data)
}

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const bucketId = request.nextUrl.searchParams.get('bucketId')
  if (!token || !bucketId)
    return Response.json({ error: 'Missing params' }, { status: 401 })

  const body = await request.json()

  const res = await fetch(
    `${BASE_URL}/event_buckets/${bucketId}/wishlist?token=${token}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${EVENTIVE_API_KEY}:`).toString('base64')}`,
        'Accept-Version': '~1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  )

  const data = await res.json()
  return Response.json(data)
}
