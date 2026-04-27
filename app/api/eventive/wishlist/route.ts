import { NextRequest } from 'next/server'

const EVENTIVE_API_KEY = process.env.NEXT_PUBLIC_EVENTIVE_API_KEY
const EVENTIVE_BUCKET_ID = process.env.NEXT_PUBLIC_EVENTIVE_BUCKET_ID
const BASE_URL = 'https://api.eventive.org'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) return Response.json({ error: 'No token' }, { status: 401 })

  const res = await fetch(
    `${BASE_URL}/event_buckets/${EVENTIVE_BUCKET_ID}/wishlist?token=${token}`,
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
  if (!token) return Response.json({ error: 'No token' }, { status: 401 })

  const body = await request.json()

  const res = await fetch(
    `${BASE_URL}/event_buckets/${EVENTIVE_BUCKET_ID}/wishlist?token=${token}`,
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
