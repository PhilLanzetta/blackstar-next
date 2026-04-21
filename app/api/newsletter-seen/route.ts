export async function POST(request: Request) {
  const { email } = await request.json()

  const response = await fetch(
    `https://${process.env.MAILCHIMP_API_KEY!.split('-')[1]}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_SEEN_LIST_ID}/members`,
    {
      method: 'POST',
      headers: {
        Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
      }),
    },
  )

  if (!response.ok) {
    return new Response('Error', { status: 500 })
  }

  return new Response('OK', { status: 200 })
}
