import { revalidateTag, revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{
      _type: string
      slug?: { current: string }
      perfumeSlug?: string
    }>(req, process.env.SANITY_REVALIDATE_SECRET)

    // Fall back to direct JSON if parseBody is empty
    const payload = body || (await req.json().catch(() => null))

    // Enforce signature check only if secret is set
    if (process.env.SANITY_REVALIDATE_SECRET && !isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    if (!payload?._type) {
      return new NextResponse('Bad Request: Missing _type', { status: 400 })
    }

    const type = payload._type

    // Revalidate by document type tag
    revalidateTag(type)

    // Targeted path revalidations
    if (type === 'perfume') {
      revalidateTag('perfume')
      revalidatePath('/collection')
      if (payload.slug?.current) {
        revalidateTag(`perfume:${payload.slug.current}`)
        revalidatePath(`/collection/${payload.slug.current}`)
      }
    } else if (type === 'customerReview') {
      revalidateTag('customerReview')
      if (payload.perfumeSlug) {
        revalidateTag(`review:${payload.perfumeSlug}`)
        revalidatePath(`/collection/${payload.perfumeSlug}`)
      }
    } else if (type === 'homePage') {
      revalidateTag('homePage')
      revalidatePath('/')
    } else if (type === 'siteSettings') {
      revalidateTag('siteSettings')
      revalidatePath('/', 'layout')
    } else if (type === 'houseObject') {
      revalidateTag('houseObject')
      revalidatePath('/collection')
      revalidatePath('/')
    }

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      type,
    })
  } catch (err: any) {
    console.error('[Revalidate Error]:', err)
    return new NextResponse(err.message, { status: 500 })
  }
}
