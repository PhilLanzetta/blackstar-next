import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'violet-chimpanzee-234778.hostingersite.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'wp.blackstarfest.org',
        pathname: '/app/uploads/**',
      },
    ],
  },
  async redirects() {
    try {
      const credentials = Buffer.from(
        `${process.env.REDIRECTION_API_USER}:${process.env.REDIRECTION_API_PASSWORD}`,
      ).toString('base64')

      const res = await fetch(
        `${process.env.REDIRECTION_API_URL}?per_page=100`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        },
      )

      const text = await res.text()

      if (!res.ok || text.startsWith('<')) {
        console.error('Redirects API returned non-JSON:', text.slice(0, 200))
        return []
      }

      const data = JSON.parse(text)
      return data.items
        .filter((r: any) => r.enabled && r.action_type === 'url')
        .map((r: any) => ({
          source: r.url,
          destination: r.action_data.url,
          permanent: r.action_code === 301,
        }))
    } catch (e) {
      console.error('Failed to fetch redirects:', e)
      return []
    }
  },
}

export default nextConfig
