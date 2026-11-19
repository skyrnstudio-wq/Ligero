import { revalidateTag, revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET
    const { isValidSignature, body } = await parseBody<{
      _type: string
      slug?: string | { current?: string }
      perfumeSlug?: string
    }>(req, secret)

    // Enforce signature check strictly when secret is configured
    if (secret && isValidSignature !== true) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    // Fall back to direct JSON only when no secret is configured and parseBody returned nothing
    const payload = !secret && !body ? await req.json().catch(() => null) : body

    if (!payload?._type) {
      return new NextResponse('Bad Request: Missing _type', { status: 400 })
    }

    const type = payload._type
    const slugValue =
      typeof payload.slug === 'string' ? payload.slug : payload.slug?.current

    // Revalidate by document type tag
    revalidateTag(type)

    // Targeted path revalidations
    if (type === 'perfume') {
      revalidateTag('perfume')
      revalidatePath('/')
      revalidatePath('/collection')
      revalidatePath('/collection/[slug]', 'page')
      revalidatePath('/discovery-set')
      revalidatePath('/sitemap.xml')
      revalidatePath('/llms.txt')
      revalidatePath('/llms-full.txt')
      revalidatePath('/pricing.md')
      revalidatePath('/', 'layout')
      if (slugValue) {
        revalidateTag(`perfume:${slugValue}`)
        revalidatePath(`/collection/${slugValue}`)
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
    } else if (type === 'legalPage') {
      revalidateTag('legalPage')
      revalidatePath('/legal', 'layout')
    } else if (type === 'houseObject') {
      revalidateTag('houseObject')
      revalidatePath('/')
      revalidatePath('/collection')
      revalidatePath('/objects')
      revalidatePath('/objects/en-route')
      revalidatePath('/discovery-set')
      revalidatePath('/sitemap.xml')
      revalidatePath('/llms.txt')
      revalidatePath('/llms-full.txt')
      revalidatePath('/pricing.md')
      revalidatePath('/', 'layout')
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
