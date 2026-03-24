// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json(
      { error: 'Valid email is required' },
      { status: 400 },
    )
  }

  const apiKey = process.env.MAILCHIMP_API_KEY
  const listId = process.env.MAILCHIMP_LIST_ID

  if (!apiKey || !listId) {
    return NextResponse.json(
      { error: 'Mailchimp not configured' },
      { status: 500 },
    )
  }

  const dataCenter = apiKey.split('-')[1]

  try {
    const response = await fetch(
      `https://${dataCenter}.api.mailchimp.com/3.0/lists/${listId}?skip_merge_validation=true`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          update_existing: true,
          members: [
            {
              email_address: email,
              status: 'subscribed',
              timestamp_signup: new Date().toISOString(),
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      throw new Error('Mailchimp API error')
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
