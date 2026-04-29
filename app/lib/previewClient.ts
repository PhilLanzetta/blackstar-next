// app/lib/previewClient.ts
// A separate GraphQLClient instance that sends Basic Auth credentials,
// allowing WPGraphQL to return draft/unpublished content.

import { GraphQLClient } from 'graphql-request'

const baseURL = process.env.WORDPRESS_URL

function getPreviewClient(): GraphQLClient {
  const username = process.env.WP_APP_USERNAME
  const password = process.env.WP_APP_PASSWORD

  if (!username || !password) {
    throw new Error(
      'WP_APP_USERNAME and WP_APP_PASSWORD must be set for preview mode',
    )
  }

  // Application Passwords use HTTP Basic Auth
  const credentials = Buffer.from(`${username}:${password}`).toString('base64')

  return new GraphQLClient(`${baseURL}/graphql`, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  })
}

export const previewClient = getPreviewClient()
