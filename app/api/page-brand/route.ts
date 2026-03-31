// app/api/page-brand/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPageBrand } from '@/app/lib/queries'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') ?? ''

  const pageBrand = slug ? await getPageBrand(slug) : null

  return NextResponse.json({ pageBrand })
}
